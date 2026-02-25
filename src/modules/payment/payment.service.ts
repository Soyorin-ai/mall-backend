import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from './entities/payment.entity';
import { CreatePaymentDto, RefundDto } from './dtos/payment.dto';
import { OrderService } from '../order/order.service';
import { OrderStatus } from '../order/entities/order.entity';

/**
 * 支付服务
 */
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private orderService: OrderService,
  ) {}

  /**
   * 生成支付单号
   */
  private generatePaymentNo(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `P${year}${month}${day}${random}`;
  }

  /**
   * 创建支付（统一下单）
   */
  async createPayment(userId: string, createDto: CreatePaymentDto) {
    // 获取订单
    const order = await this.orderService.getOrderDetail(userId, createDto.order_id);

    // 检查订单状态
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('订单状态异常，无法支付');
    }

    // 检查是否已创建支付
    const existingPayment = await this.paymentRepository.findOne({
      where: { order_id: createDto.order_id, status: PaymentStatus.PENDING },
    });

    if (existingPayment) {
      // 返回已存在的支付信息
      return this.getPaymentResult(existingPayment, createDto.payment_method, createDto.openid);
    }

    // 创建支付记录
    const payment = this.paymentRepository.create({
      payment_no: this.generatePaymentNo(),
      order_id: order.id,
      order_no: order.order_no,
      user_id: userId,
      payment_method: createDto.payment_method,
      amount: order.pay_amount,
      status: PaymentStatus.PENDING,
      expired_at: new Date(Date.now() + 30 * 60 * 1000), // 30分钟后过期
    });

    await this.paymentRepository.save(payment);

    // 调用微信支付统一下单
    return this.callWechatPay(payment, createDto.openid);
  }

  /**
   * 调用微信支付统一下单
   */
  private async callWechatPay(payment: Payment, openid?: string) {
    // TODO: 实际调用微信支付 API
    // 这里返回模拟数据，实际需要配置微信支付商户信息

    const result: any = {
      payment_no: payment.payment_no,
      amount: payment.amount,
      expired_at: payment.expired_at,
    };

    switch (payment.payment_method) {
      case PaymentMethod.WECHAT_MINI:
        // 小程序支付
        result.pay_info = {
          timeStamp: String(Math.floor(Date.now() / 1000)),
          nonceStr: Math.random().toString(36).substring(2, 15),
          package: `prepay_id=wx${Date.now()}`,
          signType: 'RSA',
          paySign: 'mock_sign',
        };
        break;

      case PaymentMethod.WECHAT_H5:
        // H5支付
        result.h5_url = `https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb?prepay_id=wx${Date.now()}`;
        break;

      case PaymentMethod.WECHAT_NATIVE:
        // 扫码支付
        result.qr_code = `weixin://wxpay/bizpayurl?pr=wx${Date.now()}`;
        break;
    }

    return result;
  }

  /**
   * 获取支付结果
   */
  private getPaymentResult(payment: Payment, method: number, openid?: string) {
    return this.callWechatPay(payment, openid);
  }

  /**
   * 查询支付状态
   */
  async queryPayment(userId: string, paymentNo: string) {
    const payment = await this.paymentRepository.findOne({
      where: { payment_no: paymentNo, user_id: userId },
    });

    if (!payment) {
      throw new NotFoundException('支付记录不存在');
    }

    // TODO: 实际调用微信支付查询接口

    return {
      payment_no: payment.payment_no,
      order_no: payment.order_no,
      amount: payment.amount,
      status: payment.status,
      paid_at: payment.paid_at,
    };
  }

  /**
   * 支付回调处理
   */
  async handleNotify(notifyData: any) {
    // TODO: 验证签名

    const { out_trade_no, transaction_id, result_code } = notifyData;

    const payment = await this.paymentRepository.findOne({
      where: { payment_no: out_trade_no },
    });

    if (!payment) {
      throw new NotFoundException('支付记录不存在');
    }

    if (result_code === 'SUCCESS') {
      // 更新支付状态
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.SUCCESS,
        transaction_id,
        paid_at: new Date(),
        notify_data: JSON.stringify(notifyData),
      });

      // 更新订单状态
      await this.orderService.paySuccess(payment.order_no);
    } else {
      // 支付失败
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
        notify_data: JSON.stringify(notifyData),
      });
    }

    return { code: 'SUCCESS', message: '成功' };
  }

  /**
   * 申请退款
   */
  async refund(userId: string, refundDto: RefundDto) {
    const order = await this.orderService.getOrderDetail(userId, refundDto.order_id);

    // 检查订单状态
    if (order.status !== OrderStatus.PAID && order.status !== OrderStatus.SHIPPED) {
      throw new BadRequestException('当前订单状态不可退款');
    }

    // 查找支付记录
    const payment = await this.paymentRepository.findOne({
      where: { order_id: refundDto.order_id, status: PaymentStatus.SUCCESS },
    });

    if (!payment) {
      throw new NotFoundException('支付记录不存在');
    }

    // TODO: 调用微信支付退款 API

    // 更新支付状态
    await this.paymentRepository.update(payment.id, {
      status: PaymentStatus.REFUNDED,
    });

    return { message: '退款申请已提交' };
  }

  /**
   * 退款回调处理
   */
  async handleRefundNotify(notifyData: any) {
    // TODO: 验证签名

    const { out_trade_no, refund_status } = notifyData;

    const payment = await this.paymentRepository.findOne({
      where: { payment_no: out_trade_no },
    });

    if (!payment) {
      throw new NotFoundException('支付记录不存在');
    }

    if (refund_status === 'SUCCESS') {
      // 更新支付状态
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.REFUNDED,
      });

      // 更新订单状态
      await this.orderService.refundSuccess(payment.order_id);
    }

    return { code: 'SUCCESS', message: '成功' };
  }

  /**
   * 获取支付记录列表
   */
  async getPayments(userId: string, page: number = 1, limit: number = 20) {
    const [items, total] = await this.paymentRepository.findAndCount({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 关闭支付（超时未支付）
   */
  async closePayment(paymentNo: string) {
    const payment = await this.paymentRepository.findOne({
      where: { payment_no: paymentNo, status: PaymentStatus.PENDING },
    });

    if (!payment) {
      return;
    }

    // TODO: 调用微信支付关闭订单 API

    await this.paymentRepository.update(payment.id, {
      status: PaymentStatus.FAILED,
    });
  }
}
