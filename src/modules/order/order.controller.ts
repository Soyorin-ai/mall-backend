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
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto, CancelOrderDto, ShipOrderDto } from './dtos/order.dto';
import { OrderStatus } from './entities/order.entity';

@ApiTags('order')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: '获取订单列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  async getOrders(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.orderService.getOrders(req.user.id, page || 1, limit || 20, status);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情' })
  async getOrderDetail(@Request() req, @Param('id') id: string) {
    return this.orderService.getOrderDetail(req.user.id, id);
  }

  @Post()
  @ApiOperation({ summary: '创建订单' })
  async createOrder(@Request() req, @Body() createDto: CreateOrderDto) {
    return this.orderService.createOrder(req.user.id, createDto);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: '取消订单' })
  async cancelOrder(
    @Request() req,
    @Param('id') id: string,
    @Body() cancelDto: CancelOrderDto,
  ) {
    return this.orderService.cancelOrder(req.user.id, id, cancelDto);
  }

  @Put(':id/confirm')
  @ApiOperation({ summary: '确认收货' })
  async confirmOrder(@Request() req, @Param('id') id: string) {
    return this.orderService.confirmOrder(req.user.id, id);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: '申请退款' })
  async applyRefund(
    @Request() req,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.orderService.applyRefund(req.user.id, id, reason);
  }
}

// ==================== 后台管理接口 ====================

@ApiTags('admin/order')
@ApiBearerAuth()
@Controller('admin/orders')
@UseGuards(JwtAuthGuard)
export class AdminOrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: '获取所有订单（后台）' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  async getAllOrders(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: OrderStatus,
    @Query('keyword') keyword?: string,
  ) {
    return this.orderService.getAllOrders(page || 1, limit || 20, status, keyword);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取订单统计' })
  async getOrderStatistics() {
    return this.orderService.getOrderStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情（后台）' })
  async getOrderDetail(@Param('id') id: string) {
    return this.orderService.getOrderDetail('', id);
  }

  @Put(':id/ship')
  @ApiOperation({ summary: '发货（后台）' })
  async shipOrder(@Param('id') id: string, @Body() shipDto: ShipOrderDto) {
    return this.orderService.shipOrder(id, shipDto);
  }

  @Put(':id/refund')
  @ApiOperation({ summary: '退款成功（后台）' })
  async refundSuccess(@Param('id') id: string) {
    return this.orderService.refundSuccess(id);
  }
}
