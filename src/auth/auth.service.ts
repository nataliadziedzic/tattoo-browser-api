import { ForbiddenException, Injectable } from '@nestjs/common';
import { Client, Studio } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { ClientDto } from '../dto/client.dto';
import { StudioDto } from '../dto/studio.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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

  async signin(dto: AuthDto, isStudio: boolean) {
    const user = isStudio
      ? await this.prisma.studio.findUnique({
          where: { email: dto.email },
        })
      : await this.prisma.client.findUnique({ where: { email: dto.email } });

    if (!user) throw new ForbiddenException('Incorrect email or password');

    const isPaswordCorrect = await argon.verify(user.hash, dto.password);

    if (!isPaswordCorrect)
      throw new ForbiddenException('Incorrect email or password.');

    delete user.hash;

    return user;
  }
}
