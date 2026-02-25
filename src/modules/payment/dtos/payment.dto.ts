import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 创建支付 DTO
 */
export class CreatePaymentDto {
  @ApiProperty({ description: '订单 ID' })
  @IsString()
  order_id: string;

  @ApiProperty({ description: '支付方式 1-小程序 2-H5 3-扫码' })
  @IsNumber()
  payment_method: number;

  @ApiProperty({ description: '用户 OpenID（小程序/H5支付必填）', required: false })
  @IsOptional()
  @IsString()
  openid?: string;
}

/**
 * 退款 DTO
 */
export class RefundDto {
  @ApiProperty({ description: '订单 ID' })
  @IsString()
  order_id: string;

  @ApiProperty({ description: '退款原因', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
