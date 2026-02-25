import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 创建分类 DTO
 */
export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '分类图标', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string;

  @ApiProperty({ description: '排序', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiProperty({ description: '父分类 ID', required: false })
  @IsOptional()
  @IsString()
  parent_id?: string;
}

/**
 * 更新分类 DTO
 */
export class UpdateCategoryDto {
  @ApiProperty({ description: '分类名称', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiProperty({ description: '分类图标', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string;

  @ApiProperty({ description: '排序', required: false })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiProperty({ description: '状态 0-禁用 1-启用', required: false })
  @IsOptional()
  @IsNumber()
  status?: number;
}
