import { IsString, IsOptional, IsBoolean, MaxLength, IsMobilePhone } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 创建地址 DTO
 */
export class CreateAddressDto {
  @ApiProperty({ description: '收货人', example: '张三' })
  @IsString()
  @MaxLength(50)
  receiver: string;

  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsMobilePhone('zh-CN')
  phone: string;

  @ApiProperty({ description: '省', example: '北京市' })
  @IsString()
  @MaxLength(50)
  province: string;

  @ApiProperty({ description: '市', example: '北京市' })
  @IsString()
  @MaxLength(50)
  city: string;

  @ApiProperty({ description: '区', example: '朝阳区' })
  @IsString()
  @MaxLength(50)
  district: string;

  @ApiProperty({ description: '详细地址', example: '某某街道某某小区1号楼' })
  @IsString()
  @MaxLength(200)
  detail: string;

  @ApiProperty({ description: '是否设为默认地址', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

/**
 * 更新地址 DTO
 */
export class UpdateAddressDto {
  @ApiProperty({ description: '收货人', required: false, example: '张三' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  receiver?: string;

  @ApiProperty({ description: '手机号', required: false, example: '13800138000' })
  @IsOptional()
  @IsMobilePhone('zh-CN')
  phone?: string;

  @ApiProperty({ description: '省', required: false, example: '北京市' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  province?: string;

  @ApiProperty({ description: '市', required: false, example: '北京市' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @ApiProperty({ description: '区', required: false, example: '朝阳区' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  district?: string;

  @ApiProperty({ description: '详细地址', required: false, example: '某某街道某某小区1号楼' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  detail?: string;

  @ApiProperty({ description: '是否设为默认地址', required: false })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
