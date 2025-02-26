import { DateService } from '@libs/date';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Users } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: { db: { url: configService.getOrThrow('DATABASE_URL') } },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  public readonly feedSelect = {
    id: true,
    owner: true,
    content: true,
    imageUrls: true,
    createdAt: true,
    commentCounts: true,
    likeCounts: true,
    author: true,
  };

  public readonly commentSelect = {
    id: true,
    feedId: true,
    owner: true,
    content: true,
    likeCounts: true,
    createdAt: true,
    author: true,
  };

  public readonly challengeSelect = {
    id: true,
    name: true,
    description: true,
    type: true,
    startDate: true,
    endDate: true,
    rewards: true,
  };

  public readonly attendanceSelect = {
    id: true,
    owner: true,
    date: true,
    createdAt: true,
    exercises: true,
  };

  get currentChallengeCondition() {
    const today = new Date(DateService.getDateString());
    return { startDate: { lte: today }, endDate: { gte: today } };
  }

  async addUserToArray<T extends { userId?: string; owner?: string }>(
    data: T[],
  ): Promise<(T & { user: Users | null })[]> {
    const userIds = data.map((item) => item.userId || item.owner);

    if (userIds.length === 0)
      return data.map((item) => ({ ...item, user: null }));

    const users = await this.users.findMany({ where: { id: { in: userIds } } });

    const userMap = new Map(users.map((user) => [user.id, user]));

    const updatedData = data.map((item) => ({
      ...item,
      user: userMap.get(item.userId || item.owner),
    }));

    return updatedData;
  }
}
