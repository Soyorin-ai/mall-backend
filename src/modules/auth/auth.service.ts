import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { ErrorCode, ERROR_MESSAGES } from '../../common/constants/error-code.constants';

/**
 * 认证服务
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 获取 JWT 密钥
   */
  getJwtSecret(): string {
    return process.env.JWT_SECRET || 'default-secret-key';
  }

  getJwtRefreshSecret(): string {
    return process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-key';
  }

  /**
   * 验证用户（JWT 策略调用）
   */
  async validateUser(payload: any) {
    const { sub } = payload;
    const user = await this.userRepository.findOne({
      where: { id: sub, status: 1 },
      select: ['id', 'username', 'nickname', 'avatar', 'phone', 'level', 'points'],
    });
    return user;
  }

  /**
   * 账号密码登录
   */
  async loginByPassword(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'nickname', 'avatar', 'phone', 'level', 'points'],
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES[ErrorCode.AUTH_INVALID_CREDENTIALS]);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES[ErrorCode.AUTH_INVALID_CREDENTIALS]);
    }

    if (user.status !== 1) {
      throw new UnauthorizedException(ERROR_MESSAGES[ErrorCode.USER_DISABLED]);
    }

    // 更新最后登录时间
    await this.userRepository.update(user.id, { last_login_at: new Date() });

    // 生成 Token
    return this.generateTokens(user);
  }

  /**
   * 手机验证码登录（固定验证码 8808）
   */
  async loginByPhone(phone: string, code: string) {
    // 固定验证码：8808
    const FIXED_CODE = '8808';

    if (code !== FIXED_CODE) {
      throw new UnauthorizedException('验证码错误');
    }

    // 查找用户
    let user = await this.userRepository.findOne({
      where: { phone },
      select: ['id', 'username', 'nickname', 'avatar', 'phone', 'level', 'points'],
    });

    // 如果用户不存在，创建新用户
    if (!user) {
      user = this.userRepository.create({
        phone,
        username: `user_${phone}`, // 生成用户名
        nickname: `用户${phone.slice(-4)}`,
        loginType: 3, // 手机验证码登录
        status: 1,
      });
      await this.userRepository.save(user);
    } else {
      // 更新最后登录时间
      await this.userRepository.update(user.id, { last_login_at: new Date() });
    }

    // 生成 Token
    return this.generateTokens(user);
  }

  /**
   * 微信登录
   */
  async loginByWechat(openid: string, unionid?: string, userInfo?: any) {
    let user = await this.userRepository.findOne({
      where: { openid },
      select: ['id', 'username', 'nickname', 'avatar', 'phone', 'level', 'points'],
    });

    // 如果用户不存在，创建新用户
    if (!user) {
      user = this.userRepository.create({
        openid,
        unionid,
        nickname: userInfo?.nickName || '微信用户',
        avatar: userInfo?.avatarUrl || '',
        loginType: 1, // 微信登录
        status: 1,
      });
      await this.userRepository.save(user);
    } else {
      // 更新用户信息
      await this.userRepository.update(user.id, {
        nickname: userInfo?.nickName || user.nickname,
        avatar: userInfo?.avatarUrl || user.avatar,
        last_login_at: new Date(),
      });
    }

    // 生成 Token
    return this.generateTokens(user);
  }

  /**
   * 生成访问令牌和刷新令牌
   */
  private generateTokens(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
      secret: this.getJwtSecret(),
    } as any);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      secret: this.getJwtRefreshSecret(),
    } as any);

    // 返回用户信息和 Token
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        level: user.level,
        points: user.points,
      },
    };
  }

  /**
   * 刷新 Token
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.getJwtRefreshSecret(),
      });

      const user = await this.validateUser(payload);
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(ERROR_MESSAGES[ErrorCode.AUTH_TOKEN_EXPIRED]);
    }
  }
}
