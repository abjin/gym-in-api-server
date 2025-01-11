import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { JwtPayload } from '@types';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  public async signJwtToken(user: Users) {
    const payload: JwtPayload = { id: user.id };
    return this.jwtService.signAsync(payload);
  }

  public getUserByJwtPayload(payload: JwtPayload) {
    return this.prismaService.users.findUnique({
      where: { id: payload.id },
    });
  }
}
