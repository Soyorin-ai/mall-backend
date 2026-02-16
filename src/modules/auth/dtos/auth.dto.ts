import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * 账号密码登录 DTO
 */
export class LoginByPasswordDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

/**
 * 手机验证码登录 DTO
 */
export class LoginByPhoneDto {
  @ApiProperty({ description: '手机号' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: '验证码（固定 8808）' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

/**
 * 微信登录 DTO
 */
export class LoginByWechatDto {
  @ApiProperty({ description: '微信授权码' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

/**
 * 登录响应 DTO
 */
export class LoginResponseDto {
  @ApiProperty({ description: '访问令牌' })
  accessToken: string;

  @ApiProperty({ description: '刷新令牌' })
  refreshToken: string;

  @ApiProperty({ description: '用户信息' })
  user: UserInfoDto;
}

/**
 * 用户信息 DTO
 */
export class UserInfoDto {
  @ApiProperty({ description: '用户ID' })
  id: string;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '昵称' })
  nickname: string;

  @ApiProperty({ description: '头像' })
  avatar: string;

  @ApiProperty({ description: '手机号' })
  phone: string;

  @ApiProperty({ description: '会员等级' })
  level: number;

  @ApiProperty({ description: '积分' })
  points: number;
}

/**
 * 刷新 Token DTO
 */
export class RefreshTokenDto {
  @ApiProperty({ description: '刷新令牌' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
