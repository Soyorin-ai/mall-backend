import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ErrorCode, ERROR_MESSAGES } from '../../../common/constants/error-code.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: authService.getJwtSecret(),
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES[ErrorCode.AUTH_INVALID_TOKEN]);
    }
    return user;
  }
}
