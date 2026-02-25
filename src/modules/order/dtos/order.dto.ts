import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 订单商品项
 */
class OrderItemDto {
  @ApiProperty({ description: '商品 ID' })
  @IsString()
  product_id: string;

  @ApiProperty({ description: 'SKU ID' })
  @IsString()
  sku_id: string;

  @ApiProperty({ description: '数量' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

/**
 * 创建订单 DTO
 */
export class CreateOrderDto {
  @ApiProperty({ description: '订单商品项', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ description: '收货人' })
  @IsString()
  @MaxLength(50)
  receiver_name: string;

  @ApiProperty({ description: '收货人手机' })
  @IsString()
  @MaxLength(20)
  receiver_phone: string;

  @ApiProperty({ description: '省' })
  @IsString()
  @MaxLength(50)
  receiver_province: string;

  @ApiProperty({ description: '市' })
  @IsString()
  @MaxLength(50)
  receiver_city: string;

  @ApiProperty({ description: '区' })
  @IsString()
  @MaxLength(50)
  receiver_district: string;

  @ApiProperty({ description: '详细地址' })
  @IsString()
  @MaxLength(200)
  receiver_address: string;

  @ApiProperty({ description: '订单备注', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;

  @ApiProperty({ description: '优惠券 ID', required: false })
  @IsOptional()
  @IsString()
  coupon_id?: string;

  @ApiProperty({ description: '是否从购物车下单', required: false, default: false })
  @IsOptional()
  from_cart?: boolean;
}

/**
 * 取消订单 DTO
 */
export class CancelOrderDto {
  @ApiProperty({ description: '取消原因', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cancel_reason?: string;
}

/**
 * 发货 DTO
 */
export class ShipOrderDto {
  @ApiProperty({ description: '快递公司' })
  @IsString()
  @MaxLength(100)
  express_company: string;

  @ApiProperty({ description: '快递单号' })
  @IsString()
  @MaxLength(100)
  express_no: string;
}
