import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserAddress } from './entities/address.entity';
import { UserFavorite } from './entities/favorite.entity';
import { UserHistory } from './entities/history.entity';
import { UpdateProfileDto } from './dtos/user.dto';
import { CreateAddressDto, UpdateAddressDto } from './dtos/address.dto';
import { ErrorCode, ERROR_MESSAGES } from '../../common/constants/error-code.constants';

/**
 * 用户服务
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserAddress)
    private addressRepository: Repository<UserAddress>,
    @InjectRepository(UserFavorite)
    private favoriteRepository: Repository<UserFavorite>,
    @InjectRepository(UserHistory)
    private historyRepository: Repository<UserHistory>,
  ) {}

  /**
   * 获取用户信息
   */
  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'nickname', 'avatar', 'phone', 'gender', 'level', 'points', 'created_at'],
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES[ErrorCode.USER_NOT_FOUND]);
    }

    return user;
  }

  /**
   * 更新用户信息
   */
  async updateProfile(userId: string, updateDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES[ErrorCode.USER_NOT_FOUND]);
    }

    // 更新用户信息
    await this.userRepository.update(userId, updateDto);

    // 返回更新后的用户信息
    return this.getProfile(userId);
  }

  /**
   * 获取用户地址列表
   */
  async getAddresses(userId: string) {
    return this.addressRepository.find({
      where: { user_id: userId },
      order: { is_default: 'DESC', created_at: 'DESC' },
    });
  }

  /**
   * 获取单个地址
   */
  async getAddress(userId: string, addressId: string) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user_id: userId },
    });

    if (!address) {
      throw new NotFoundException('地址不存在');
    }

    return address;
  }

  /**
   * 创建地址
   */
  async createAddress(userId: string, createDto: CreateAddressDto) {
    // 如果是默认地址，先取消其他默认地址
    if (createDto.is_default) {
      await this.addressRepository.update(
        { user_id: userId, is_default: true },
        { is_default: false },
      );
    }

    const address = this.addressRepository.create({
      ...createDto,
      user_id: userId,
    });

    return this.addressRepository.save(address);
  }

  /**
   * 更新地址
   */
  async updateAddress(userId: string, addressId: string, updateDto: UpdateAddressDto) {
    const address = await this.getAddress(userId, addressId);

    // 如果设置为默认地址，先取消其他默认地址
    if (updateDto.is_default) {
      await this.addressRepository.update(
        { user_id: userId, is_default: true },
        { is_default: false },
      );
    }

    await this.addressRepository.update(addressId, updateDto);

    return this.getAddress(userId, addressId);
  }

  /**
   * 删除地址
   */
  async deleteAddress(userId: string, addressId: string) {
    const address = await this.getAddress(userId, addressId);
    await this.addressRepository.remove(address);
    return { message: '删除成功' };
  }

  /**
   * 设置默认地址
   */
  async setDefaultAddress(userId: string, addressId: string) {
    const address = await this.getAddress(userId, addressId);

    // 取消其他默认地址
    await this.addressRepository.update(
      { user_id: userId, is_default: true },
      { is_default: false },
    );

    // 设置当前地址为默认
    await this.addressRepository.update(addressId, { is_default: true });

    return this.getAddress(userId, addressId);
  }

  /**
   * 获取收藏列表
   */
  async getFavorites(userId: string, page: number = 1, limit: number = 20) {
    const [items, total] = await this.favoriteRepository.findAndCount({
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
   * 添加收藏
   */
  async addFavorite(
    userId: string,
    productId: string,
    productName: string,
    productImage: string,
    productPrice: number,
  ) {
    // 检查是否已收藏
    const existing = await this.favoriteRepository.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (existing) {
      return { message: '已收藏', favorite: existing };
    }

    const favorite = this.favoriteRepository.create({
      user_id: userId,
      product_id: productId,
      product_name: productName,
      product_image: productImage,
      product_price: productPrice,
    });

    return this.favoriteRepository.save(favorite);
  }

  /**
   * 取消收藏
   */
  async removeFavorite(userId: string, productId: string) {
    const favorite = await this.favoriteRepository.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (!favorite) {
      throw new NotFoundException('收藏不存在');
    }

    await this.favoriteRepository.remove(favorite);
    return { message: '取消收藏成功' };
  }

  /**
   * 检查是否已收藏
   */
  async isFavorited(userId: string, productId: string) {
    const favorite = await this.favoriteRepository.findOne({
      where: { user_id: userId, product_id: productId },
    });

    return { isFavorited: !!favorite };
  }

  /**
   * 添加浏览历史
   */
  async addHistory(
    userId: string,
    productId: string,
    productName: string,
    productImage: string,
    productPrice: number,
  ) {
    // 查找是否已存在
    let history = await this.historyRepository.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (history) {
      // 更新浏览时间
      await this.historyRepository.update(history.id, {
        product_name: productName,
        product_image: productImage,
        product_price: productPrice,
        view_at: new Date(),
      });
    } else {
      // 创建新记录
      history = this.historyRepository.create({
        user_id: userId,
        product_id: productId,
        product_name: productName,
        product_image: productImage,
        product_price: productPrice,
        view_at: new Date(),
      });
      await this.historyRepository.save(history);
    }

    return history;
  }

  /**
   * 获取浏览历史
   */
  async getHistories(userId: string, page: number = 1, limit: number = 20) {
    const [items, total] = await this.historyRepository.findAndCount({
      where: { user_id: userId },
      order: { view_at: 'DESC' },
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
   * 清空浏览历史
   */
  async clearHistories(userId: string) {
    await this.historyRepository.delete({ user_id: userId });
    return { message: '清空成功' };
  }

  /**
   * 删除单条浏览历史
   */
  async deleteHistory(userId: string, productId: string) {
    await this.historyRepository.delete({ user_id: userId, product_id: productId });
    return { message: '删除成功' };
  }
}
