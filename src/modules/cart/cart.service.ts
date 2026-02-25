import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { AddToCartDto, UpdateCartQuantityDto, UpdateCartSelectedDto } from './dtos/cart.dto';

/**
 * 购物车服务
 */
@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  /**
   * 获取购物车列表
   */
  async getCartList(userId: string) {
    const items = await this.cartRepository.find({
      where: { user_id: userId },
      relations: ['product', 'sku'],
      order: { created_at: 'DESC' },
    });

    // 计算统计信息
    const selectedItems = items.filter((item) => item.is_selected);
    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = selectedItems.reduce(
      (sum, item) => sum + Number(item.sku.price) * item.quantity,
      0,
    );

    return {
      items,
      totalQuantity,
      totalPrice,
      selectedCount: selectedItems.length,
    };
  }

  /**
   * 添加到购物车
   */
  async addToCart(userId: string, addDto: AddToCartDto) {
    // 检查是否已存在
    let cart = await this.cartRepository.findOne({
      where: { user_id: userId, sku_id: addDto.sku_id },
    });

    if (cart) {
      // 更新数量
      cart.quantity += addDto.quantity;
      await this.cartRepository.save(cart);
    } else {
      // 创建新记录
      cart = this.cartRepository.create({
        user_id: userId,
        product_id: addDto.product_id,
        sku_id: addDto.sku_id,
        quantity: addDto.quantity,
        is_selected: true,
      });
      await this.cartRepository.save(cart);
    }

    return this.getCartDetail(userId, cart.id);
  }

  /**
   * 获取购物车详情
   */
  async getCartDetail(userId: string, cartId: string) {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId, user_id: userId },
      relations: ['product', 'sku'],
    });

    if (!cart) {
      throw new NotFoundException('购物车商品不存在');
    }

    return cart;
  }

  /**
   * 更新购物车数量
   */
  async updateQuantity(userId: string, cartId: string, updateDto: UpdateCartQuantityDto) {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId, user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('购物车商品不存在');
    }

    // 检查库存
    const sku = await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.sku', 'sku')
      .where('cart.id = :cartId', { cartId })
      .getOne();

    if (sku && sku.sku.stock < updateDto.quantity) {
      throw new BadRequestException('库存不足');
    }

    await this.cartRepository.update(cartId, { quantity: updateDto.quantity });

    return this.getCartDetail(userId, cartId);
  }

  /**
   * 更新选中状态
   */
  async updateSelected(userId: string, updateDto: UpdateCartSelectedDto) {
    await this.cartRepository.update(
      { id: In(updateDto.cart_ids), user_id: userId },
      { is_selected: updateDto.is_selected },
    );

    return this.getCartList(userId);
  }

  /**
   * 全选/取消全选
   */
  async selectAll(userId: string, is_selected: boolean) {
    await this.cartRepository.update({ user_id: userId }, { is_selected });

    return this.getCartList(userId);
  }

  /**
   * 删除购物车商品
   */
  async removeFromCart(userId: string, cartId: string) {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId, user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('购物车商品不存在');
    }

    await this.cartRepository.remove(cart);

    return { message: '删除成功' };
  }

  /**
   * 批量删除购物车商品
   */
  async batchRemove(userId: string, cartIds: string[]) {
    await this.cartRepository.delete({
      id: In(cartIds),
      user_id: userId,
    });

    return { message: '删除成功' };
  }

  /**
   * 清空购物车
   */
  async clearCart(userId: string) {
    await this.cartRepository.delete({ user_id: userId });

    return { message: '清空成功' };
  }

  /**
   * 获取购物车商品数量
   */
  async getCartCount(userId: string) {
    const count = await this.cartRepository.count({
      where: { user_id: userId },
    });

    return { count };
  }

  /**
   * 获取选中的购物车商品（下单用）
   */
  async getSelectedItems(userId: string) {
    const items = await this.cartRepository.find({
      where: { user_id: userId, is_selected: true },
      relations: ['product', 'sku'],
    });

    if (items.length === 0) {
      throw new BadRequestException('请选择要结算的商品');
    }

    // 检查库存
    for (const item of items) {
      if (item.sku.stock < item.quantity) {
        throw new BadRequestException(`商品 ${item.product.name} 库存不足`);
      }
    }

    // 计算总价
    const totalPrice = items.reduce(
      (sum, item) => sum + Number(item.sku.price) * item.quantity,
      0,
    );

    return {
      items,
      totalPrice,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }
}
