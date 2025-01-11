import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { KakaoGetUserProfileApiResponse, SnsUser } from '@types';
import { PrismaService } from 'db/prisma.service';
import { PostUserDto } from './dtos/post-user.dto';
import { $Enums } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  public async getKakaoUser(snsToken: string) {
    const response =
      await this.httpService.axiosRef.get<KakaoGetUserProfileApiResponse>(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: { Authorization: `Bearer ${snsToken}` },
          validateStatus: (status) => status < 500,
        },
      );

    if (response.status !== 200 || !response?.data?.id) {
      throw new ForbiddenException();
    }

    return {
      type: $Enums.AccountType.kakao,
      id: `${response.data.id}`,
      nickname: response.data.kakao_account?.profile?.nickname,
    };
  }

  public async signInOrUp(dto: PostUserDto, snsUser: SnsUser) {
    const existAccount = await this.prismaService.accounts.findUnique({
      where: { id_type: { id: snsUser.id, type: snsUser.type } },
    });

    if (existAccount) return this.signIn(existAccount.userId);
    return this.signUp(dto, snsUser);
  }

  private async signIn(id: string) {
    const user = await this.prismaService.users.findUnique({ where: { id } });
    const token = await this.authService.signJwtToken(user);
    return { user, token, isNew: false };
  }

  private async signUp(dto: PostUserDto, snsUser: SnsUser) {
    return this.prismaService.$transaction(async (prisma) => {
      const id = uuidv4();
      const nickname = dto.nickname || snsUser.nickname;
      const user = await prisma.users.create({ data: { id, nickname } });
      await prisma.accounts.create({
        data: {
          id: snsUser.id,
          type: snsUser.type,
          userId: user.id,
        },
      });

      const token = await this.authService.signJwtToken(user);
      return { user, token, isNew: true };
    });
  }

  public deleteUser(userId: string) {
    return this.prismaService.users.delete({ where: { id: userId } });
  }
}
