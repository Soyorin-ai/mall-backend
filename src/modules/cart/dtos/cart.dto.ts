import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 添加购物车 DTO
 */
export class AddToCartDto {
  @ApiProperty({ description: '商品 ID' })
  @IsString()
  product_id: string;

  @ApiProperty({ description: 'SKU ID' })
  @IsString()
  sku_id: string;

  @ApiProperty({ description: '数量', default: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

/**
 * 更新购物车数量 DTO
 */
export class UpdateCartQuantityDto {
  @ApiProperty({ description: '数量' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

/**
 * 更新选中状态 DTO
 */
export class UpdateCartSelectedDto {
  @ApiProperty({ description: '购物车 ID 列表' })
  @IsString({ each: true })
  cart_ids: string[];

  @ApiProperty({ description: '是否选中' })
  @IsBoolean()
  is_selected: boolean;
}
