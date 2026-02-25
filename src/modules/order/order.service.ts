import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto, CancelOrderDto, ShipOrderDto } from './dtos/order.dto';
import { CartService } from '../cart/cart.service';

/**
 * 订单服务
 */
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private cartService: CartService,
    private dataSource: DataSource,
  ) {}

  /**
   * 生成订单号
   */
  private generateOrderNo(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${year}${month}${day}${random}`;
  }

  /**
   * 创建订单
   */
  async createOrder(userId: string, createDto: CreateOrderDto) {
    // 使用事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let orderItems: any[] = [];
      let totalAmount = 0;

      if (createDto.from_cart) {
        // 从购物车创建订单
        const cartItems = await this.cartService.getSelectedItems(userId);
        orderItems = cartItems.items.map((item) => ({
          product_id: item.product_id,
          sku_id: item.sku_id,
          product_name: item.product.name,
          product_image: item.product.main_image,
          sku_name: item.sku.sku_name,
          sku_specs: item.sku.specs,
          price: item.sku.price,
          quantity: item.quantity,
          total_amount: Number(item.sku.price) * item.quantity,
        }));
        totalAmount = cartItems.totalPrice;
      } else {
        // 直接下单 - 需要查询商品信息
        // TODO: 查询商品和 SKU 信息
        for (const item of createDto.items) {
          // 这里简化处理，实际需要查询数据库
          orderItems.push({
            product_id: item.product_id,
            sku_id: item.sku_id,
            product_name: '商品',
            product_image: '',
            sku_name: '规格',
            sku_specs: '',
            price: 0,
            quantity: item.quantity,
            total_amount: 0,
          });
        }
      }

      // 计算运费（满99包邮）
      const freightAmount = totalAmount >= 99 ? 0 : 10;

      // 计算优惠金额
      let discountAmount = 0;
      // TODO: 计算优惠券优惠

      // 计算实付金额
      const payAmount = totalAmount + freightAmount - discountAmount;

      // 创建订单
      const order = queryRunner.manager.create(Order, {
        order_no: this.generateOrderNo(),
        user_id: userId,
        status: OrderStatus.PENDING,
        total_amount: totalAmount,
        freight_amount: freightAmount,
        discount_amount: discountAmount,
        pay_amount: payAmount,
        coupon_id: createDto.coupon_id,
        receiver_name: createDto.receiver_name,
        receiver_phone: createDto.receiver_phone,
        receiver_province: createDto.receiver_province,
        receiver_city: createDto.receiver_city,
        receiver_district: createDto.receiver_district,
        receiver_address: createDto.receiver_address,
        remark: createDto.remark,
      });

      await queryRunner.manager.save(order);

      // 创建订单项
      for (const item of orderItems) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          ...item,
          order_id: order.id,
        });
        await queryRunner.manager.save(orderItem);
      }

      // 扣减库存
      for (const item of orderItems) {
        await queryRunner.query(
          `UPDATE product_skus SET stock = stock - ? WHERE id = ? AND stock >= ?`,
          [item.quantity, item.sku_id, item.quantity],
        );
      }

      // 清空购物车中已下单的商品
      if (createDto.from_cart) {
        await this.cartService.clearCart(userId);
      }

      await queryRunner.commitTransaction();

      return this.getOrderDetail(userId, order.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 获取订单列表
   */
  async getOrders(
    userId: string,
    page: number = 1,
    limit: number = 20,
    status?: OrderStatus,
  ) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where('order.user_id = :userId', { userId });

    if (status !== undefined) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    queryBuilder
      .orderBy('order.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取订单详情
   */
  async getOrderDetail(userId: string, orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user_id: userId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  /**
   * 根据订单号获取订单
   */
  async getOrderByNo(orderNo: string) {
    const order = await this.orderRepository.findOne({
      where: { order_no: orderNo },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  /**
   * 取消订单
   */
  async cancelOrder(userId: string, orderId: string, cancelDto: CancelOrderDto) {
    const order = await this.getOrderDetail(userId, orderId);

    // 只有待支付状态可以取消
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('当前订单状态不可取消');
    }

    // 使用事务恢复库存
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 恢复库存
      for (const item of order.items) {
        await queryRunner.query(
          `UPDATE product_skus SET stock = stock + ? WHERE id = ?`,
          [item.quantity, item.sku_id],
        );
      }

      // 更新订单状态
      await queryRunner.manager.update(Order, orderId, {
        status: OrderStatus.CANCELLED,
        cancelled_at: new Date(),
        cancel_reason: cancelDto.cancel_reason,
      });

      await queryRunner.commitTransaction();

      return { message: '订单已取消' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 确认收货
   */
  async confirmOrder(userId: string, orderId: string) {
    const order = await this.getOrderDetail(userId, orderId);

    // 只有已发货状态可以确认收货
    if (order.status !== OrderStatus.SHIPPED) {
      throw new BadRequestException('当前订单状态不可确认收货');
    }

    await this.orderRepository.update(orderId, {
      status: OrderStatus.COMPLETED,
      completed_at: new Date(),
    });

    return { message: '已确认收货' };
  }

  /**
   * 申请退款
   */
  async applyRefund(userId: string, orderId: string, reason: string) {
    const order = await this.getOrderDetail(userId, orderId);

    // 只有已支付和已发货状态可以申请退款
    if (order.status !== OrderStatus.PAID && order.status !== OrderStatus.SHIPPED) {
      throw new BadRequestException('当前订单状态不可申请退款');
    }

    await this.orderRepository.update(orderId, {
      status: OrderStatus.REFUNDING,
      cancel_reason: reason,
    });

    return { message: '退款申请已提交' };
  }

  /**
   * 支付成功回调
   */
  async paySuccess(orderNo: string) {
    const order = await this.getOrderByNo(orderNo);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('订单状态异常');
    }

    await this.orderRepository.update(order.id, {
      status: OrderStatus.PAID,
      paid_at: new Date(),
    });

    return { message: '支付成功' };
  }

  // ==================== 后台管理接口 ====================

  /**
   * 获取所有订单（后台）
   */
  async getAllOrders(
    page: number = 1,
    limit: number = 20,
    status?: OrderStatus,
    keyword?: string,
  ) {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    if (status !== undefined) {
      queryBuilder.where('order.status = :status', { status });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(order.order_no LIKE :keyword OR order.receiver_name LIKE :keyword OR order.receiver_phone LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    queryBuilder
      .orderBy('order.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 发货（后台）
   */
  async shipOrder(orderId: string, shipDto: ShipOrderDto) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.status !== OrderStatus.PAID) {
      throw new BadRequestException('当前订单状态不可发货');
    }

    await this.orderRepository.update(orderId, {
      status: OrderStatus.SHIPPED,
      express_company: shipDto.express_company,
      express_no: shipDto.express_no,
      shipped_at: new Date(),
    });

    return { message: '发货成功' };
  }

  /**
   * 退款成功（后台）
   */
  async refundSuccess(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    // 使用事务恢复库存
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 恢复库存
      for (const item of order.items) {
        await queryRunner.query(
          `UPDATE product_skus SET stock = stock + ? WHERE id = ?`,
          [item.quantity, item.sku_id],
        );
      }

      // 更新订单状态
      await queryRunner.manager.update(Order, orderId, {
        status: OrderStatus.REFUNDED,
      });

      await queryRunner.commitTransaction();

      return { message: '退款成功' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 获取订单统计
   */
  async getOrderStatistics() {
    const total = await this.orderRepository.count();
    const pending = await this.orderRepository.count({
      where: { status: OrderStatus.PENDING },
    });
    const paid = await this.orderRepository.count({
      where: { status: OrderStatus.PAID },
    });
    const shipped = await this.orderRepository.count({
      where: { status: OrderStatus.SHIPPED },
    });
    const completed = await this.orderRepository.count({
      where: { status: OrderStatus.COMPLETED },
    });
    const cancelled = await this.orderRepository.count({
      where: { status: OrderStatus.CANCELLED },
    });

    return {
      total,
      pending,
      paid,
      shipped,
      completed,
      cancelled,
    };
  }
}
