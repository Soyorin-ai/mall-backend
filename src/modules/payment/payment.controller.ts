import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CreatePaymentDto, RefundDto } from './dtos/payment.dto';

@ApiTags('payment')
@ApiBearerAuth()
@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create')
  @ApiOperation({ summary: '创建支付' })
  async createPayment(@Request() req, @Body() createDto: CreatePaymentDto) {
    return this.paymentService.createPayment(req.user.id, createDto);
  }

  @Get('query/:paymentNo')
  @ApiOperation({ summary: '查询支付状态' })
  async queryPayment(@Request() req, @Param('paymentNo') paymentNo: string) {
    return this.paymentService.queryPayment(req.user.id, paymentNo);
  }

  @Get('list')
  @ApiOperation({ summary: '获取支付记录列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getPayments(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.paymentService.getPayments(req.user.id, page || 1, limit || 20);
  }

  @Post('refund')
  @ApiOperation({ summary: '申请退款' })
  async refund(@Request() req, @Body() refundDto: RefundDto) {
    return this.paymentService.refund(req.user.id, refundDto);
  }

  // 微信支付回调（无需认证）
  @Public()
  @Post('notify')
  @ApiOperation({ summary: '支付回调' })
  async handleNotify(@Body() notifyData: any) {
    return this.paymentService.handleNotify(notifyData);
  }

  // 微信退款回调（无需认证）
  @Public()
  @Post('refund/notify')
  @ApiOperation({ summary: '退款回调' })
  async handleRefundNotify(@Body() notifyData: any) {
    return this.paymentService.handleRefundNotify(notifyData);
  }
}
