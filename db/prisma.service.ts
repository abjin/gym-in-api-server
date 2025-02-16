import { DateService } from '@libs/date';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

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

  get currentChallengeCondition() {
    const today = new Date(DateService.getDateString());
    return { startDate: { lte: today }, endDate: { gte: today } };
  }

  public readonly challengeSelect = {
    id: true,
    name: true,
    description: true,
    type: true,
    startDate: true,
    endDate: true,
    rewards: true,
  };
}
