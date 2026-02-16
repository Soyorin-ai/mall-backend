import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginByPasswordDto,
  LoginByPhoneDto,
  LoginByWechatDto,
  LoginResponseDto,
  RefreshTokenDto,
} from './dtos/auth.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login/password')
  @ApiOperation({ summary: '账号密码登录' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async loginByPassword(@Body() loginDto: LoginByPasswordDto) {
    return await this.authService.loginByPassword(loginDto.username, loginDto.password);
  }

  @Public()
  @Post('login/phone')
  @ApiOperation({ summary: '手机验证码登录' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async loginByPhone(@Body() loginDto: LoginByPhoneDto) {
    return await this.authService.loginByPhone(loginDto.phone, loginDto.code);
  }

  @Public()
  @Post('login/wechat')
  @ApiOperation({ summary: '微信登录' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async loginByWechat(@Body() loginDto: LoginByWechatDto) {
    return await this.authService.loginByWechat(loginDto.code);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: '刷新 Token' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async refreshToken(@Body() refreshDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshDto.refreshToken);
  }
}
