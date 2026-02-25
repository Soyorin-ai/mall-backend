import { IsString, IsOptional, IsNumber, IsBoolean, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 创建商品 DTO
 */
export class CreateProductDto {
  @ApiProperty({ description: '分类 ID' })
  @IsString()
  category_id: string;

  @ApiProperty({ description: '商品名称', example: 'iPhone 15 Pro' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: '主图' })
  @IsString()
  @MaxLength(500)
  main_image: string;

  @ApiProperty({ description: '商品图片（JSON 数组）', required: false })
  @IsOptional()
  @IsString()
  images?: string;

  @ApiProperty({ description: '商品描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '商品详情（富文本）', required: false })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiProperty({ description: '销售价', example: 7999 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: '原价', required: false, example: 8999 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  original_price?: number;

  @ApiProperty({ description: '库存', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ description: '虚拟销量', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  virtual_sales?: number;

  @ApiProperty({ description: '排序', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiProperty({ description: '是否热销', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  is_hot?: boolean;

  @ApiProperty({ description: '是否新品', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  is_new?: boolean;

  @ApiProperty({ description: '是否推荐', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  is_recommend?: boolean;
}

/**
 * 更新商品 DTO
 */
export class UpdateProductDto {
  @ApiProperty({ description: '分类 ID', required: false })
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiProperty({ description: '商品名称', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiProperty({ description: '主图', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  main_image?: string;

  @ApiProperty({ description: '商品图片（JSON 数组）', required: false })
  @IsOptional()
  @IsString()
  images?: string;

  @ApiProperty({ description: '商品描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '商品详情（富文本）', required: false })
  @IsOptional()
  @IsString()
  detail?: string;

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

  @ApiProperty({ description: '虚拟销量', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  virtual_sales?: number;

  @ApiProperty({ description: '状态 0-下架 1-上架', required: false })
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiProperty({ description: '排序', required: false })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiProperty({ description: '是否热销', required: false })
  @IsOptional()
  @IsBoolean()
  is_hot?: boolean;

  @ApiProperty({ description: '是否新品', required: false })
  @IsOptional()
  @IsBoolean()
  is_new?: boolean;

  @ApiProperty({ description: '是否推荐', required: false })
  @IsOptional()
  @IsBoolean()
  is_recommend?: boolean;
}
