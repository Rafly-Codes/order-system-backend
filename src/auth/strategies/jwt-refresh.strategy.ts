import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const refreshToken = req.headers.authorization?.replace('Bearer ', '');
    const user = await this.usersService.findById(payload.sub);

    if (!user) throw new UnauthorizedException('Token tidak valid');

    // Validasi refresh token yang tersimpan di DB
    const dbUser = await this.usersService.findByEmail((user as any).email);
    if (!dbUser?.refreshToken || dbUser.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token tidak valid atau sudah digunakan');
    }

    return { ...user, refreshToken };
  }
}
