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

  public readonly postSelect = {
    id: true,
    owner: true,
    content: true,
    imageUrls: true,
    createdAt: true,
    commentCounts: true,
    likesCounts: true,
    author: true,
  };
}
