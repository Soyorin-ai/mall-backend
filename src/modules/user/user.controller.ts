import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dtos/user.dto';
import { CreateAddressDto, UpdateAddressDto } from './dtos/address.dto';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  // ==================== 用户信息 ====================

  @Get('profile')
  @ApiOperation({ summary: '获取用户信息' })
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: '更新用户信息' })
  async updateProfile(@Request() req, @Body() updateDto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.id, updateDto);
  }

  // ==================== 地址管理 ====================

  @Get('addresses')
  @ApiOperation({ summary: '获取用户地址列表' })
  async getAddresses(@Request() req) {
    return this.userService.getAddresses(req.user.id);
  }

  @Get('addresses/:id')
  @ApiOperation({ summary: '获取单个地址' })
  async getAddress(@Request() req, @Param('id') id: string) {
    return this.userService.getAddress(req.user.id, id);
  }

  @Post('addresses')
  @ApiOperation({ summary: '创建地址' })
  async createAddress(@Request() req, @Body() createDto: CreateAddressDto) {
    return this.userService.createAddress(req.user.id, createDto);
  }

  @Put('addresses/:id')
  @ApiOperation({ summary: '更新地址' })
  async updateAddress(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateAddressDto,
  ) {
    return this.userService.updateAddress(req.user.id, id, updateDto);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: '删除地址' })
  async deleteAddress(@Request() req, @Param('id') id: string) {
    return this.userService.deleteAddress(req.user.id, id);
  }

  @Put('addresses/:id/default')
  @ApiOperation({ summary: '设置默认地址' })
  async setDefaultAddress(@Request() req, @Param('id') id: string) {
    return this.userService.setDefaultAddress(req.user.id, id);
  }

  // ==================== 收藏管理 ====================

  @Get('favorites')
  @ApiOperation({ summary: '获取收藏列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getFavorites(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.userService.getFavorites(req.user.id, page || 1, limit || 20);
  }

  @Post('favorites')
  @ApiOperation({ summary: '添加收藏' })
  async addFavorite(
    @Request() req,
    @Body() body: { productId: string; productName: string; productImage: string; productPrice: number },
  ) {
    return this.userService.addFavorite(
      req.user.id,
      body.productId,
      body.productName,
      body.productImage,
      body.productPrice,
    );
  }

  @Delete('favorites/:productId')
  @ApiOperation({ summary: '取消收藏' })
  async removeFavorite(@Request() req, @Param('productId') productId: string) {
    return this.userService.removeFavorite(req.user.id, productId);
  }

  @Get('favorites/check/:productId')
  @ApiOperation({ summary: '检查是否已收藏' })
  async isFavorited(@Request() req, @Param('productId') productId: string) {
    return this.userService.isFavorited(req.user.id, productId);
  }

  // ==================== 浏览历史 ====================

  @Get('histories')
  @ApiOperation({ summary: '获取浏览历史' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getHistories(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.userService.getHistories(req.user.id, page || 1, limit || 20);
  }

  @Post('histories')
  @ApiOperation({ summary: '添加浏览历史' })
  async addHistory(
    @Request() req,
    @Body() body: { productId: string; productName: string; productImage: string; productPrice: number },
  ) {
    return this.userService.addHistory(
      req.user.id,
      body.productId,
      body.productName,
      body.productImage,
      body.productPrice,
    );
  }

  @Delete('histories/:productId')
  @ApiOperation({ summary: '删除单条浏览历史' })
  async deleteHistory(@Request() req, @Param('productId') productId: string) {
    return this.userService.deleteHistory(req.user.id, productId);
  }

  @Delete('histories')
  @ApiOperation({ summary: '清空浏览历史' })
  async clearHistories(@Request() req) {
    return this.userService.clearHistories(req.user.id);
  }
}
