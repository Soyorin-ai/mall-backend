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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToCartDto, UpdateCartQuantityDto, UpdateCartSelectedDto } from './dtos/cart.dto';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: '获取购物车列表' })
  async getCartList(@Request() req) {
    return this.cartService.getCartList(req.user.id);
  }

  @Get('count')
  @ApiOperation({ summary: '获取购物车商品数量' })
  async getCartCount(@Request() req) {
    return this.cartService.getCartCount(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: '添加到购物车' })
  async addToCart(@Request() req, @Body() addDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addDto);
  }

  @Put(':id/quantity')
  @ApiOperation({ summary: '更新购物车数量' })
  async updateQuantity(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateCartQuantityDto,
  ) {
    return this.cartService.updateQuantity(req.user.id, id, updateDto);
  }

  @Put('selected')
  @ApiOperation({ summary: '更新选中状态' })
  async updateSelected(@Request() req, @Body() updateDto: UpdateCartSelectedDto) {
    return this.cartService.updateSelected(req.user.id, updateDto);
  }

  @Put('select-all')
  @ApiOperation({ summary: '全选/取消全选' })
  @ApiQuery({ name: 'selected', type: Boolean })
  async selectAll(@Request() req, @Query('selected') selected: boolean) {
    return this.cartService.selectAll(req.user.id, selected);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除购物车商品' })
  async removeFromCart(@Request() req, @Param('id') id: string) {
    return this.cartService.removeFromCart(req.user.id, id);
  }

  @Delete('batch')
  @ApiOperation({ summary: '批量删除购物车商品' })
  async batchRemove(@Request() req, @Body('cartIds') cartIds: string[]) {
    return this.cartService.batchRemove(req.user.id, cartIds);
  }

  @Delete()
  @ApiOperation({ summary: '清空购物车' })
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
