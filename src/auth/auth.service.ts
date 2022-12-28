import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client, Studio } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { ClientDto, StudioDto } from '../dto';
import { AuthDto } from './dto/auth.dto';
import { userType } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signupAsStudio(dto: StudioDto) {
    const hash = await argon.hash(dto.password);
    delete Object.assign(dto, { hash })['password'];

    try {
      const user = await this.prisma.studio.create({
        data: {
          ...(dto as unknown as Studio),
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials taken.');
      } else {
        throw error;
      }
    }
  }

  async signupAsClient(dto: ClientDto) {
    const hash = await argon.hash(dto.password);
    delete Object.assign(dto, { hash })['password'];

    try {
      const user = await this.prisma.client.create({
        data: {
          ...(dto as unknown as Client),
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials taken.');
      } else {
        throw error;
      }
    }
  }

  async signin(dto: AuthDto, typeOfUser: userType) {
    const user =
      typeOfUser === 'studio'
        ? await this.prisma.studio.findUnique({
            where: { email: dto.email },
          })
        : await this.prisma.client.findUnique({ where: { email: dto.email } });

    if (!user) throw new ForbiddenException('Incorrect email or password');

    const isPaswordCorrect = await argon.verify(user.hash, dto.password);

    if (!isPaswordCorrect)
      throw new ForbiddenException('Incorrect email or password.');

    return this.signToken(user.id, user.email, typeOfUser);
  }

  async signToken(
    userId: number,
    email: string,
    typeOfUser: userType,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      typeOfUser,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token };
  }
}
