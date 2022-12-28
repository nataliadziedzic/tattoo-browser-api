import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { userType } from '../../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    typeOfUser: userType;
  }) {
    const user =
      payload.typeOfUser === 'studio'
        ? await this.prisma.studio.findUnique({
            where: { id: payload.sub },
          })
        : await this.prisma.client.findUnique({ where: { id: payload.sub } });

    delete user.hash;
    console.log('user', user);
    return user;
  }
}
