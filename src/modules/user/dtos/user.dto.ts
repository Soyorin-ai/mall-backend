import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

/**
 * 更新用户信息 DTO
 */
export class UpdateProfileDto {
  @ApiProperty({ description: '昵称', required: false, example: '小明' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @ApiProperty({ description: '头像', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @ApiProperty({ description: '性别 0-未知 1-男 2-女', required: false })
  @IsOptional()
  gender?: number;
}
