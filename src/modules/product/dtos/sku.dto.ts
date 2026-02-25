import { IsString, IsOptional, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 创建 SKU DTO
 */
export class CreateSkuDto {
  @ApiProperty({ description: 'SKU 名称' })
  @IsString()
  @MaxLength(100)
  sku_name: string;

  @ApiProperty({ description: 'SKU 图片' })
  @IsString()
  @MaxLength(500)
  sku_image: string;

  @ApiProperty({ description: '规格值（JSON）', required: false })
  @IsOptional()
  @IsString()
  specs?: string;

  @ApiProperty({ description: '销售价' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: '原价', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  original_price?: number;

  @ApiProperty({ description: '库存', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ description: 'SKU 编码' })
  @IsString()
  @MaxLength(100)
  sku_code: string;
}

/**
 * 更新 SKU DTO
 */
export class UpdateSkuDto {
  @ApiProperty({ description: 'SKU 名称', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku_name?: string;

  @ApiProperty({ description: 'SKU 图片', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  sku_image?: string;

  @ApiProperty({ description: '规格值（JSON）', required: false })
  @IsOptional()
  @IsString()
  specs?: string;

  @ApiProperty({ description: '销售价', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ description: '原价', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  original_price?: number;

  @ApiProperty({ description: '库存', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ description: '状态 0-禁用 1-启用', required: false })
  @IsOptional()
  @IsNumber()
  status?: number;
}
