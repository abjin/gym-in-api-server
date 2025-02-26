import { DateService } from '@libs/date';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import { Redis } from 'ioredis';
import { RedisKey } from 'src/constants';

@Injectable()
export class RankingsService {
  get rankingKey() {
    return `${RedisKey.RANKING}:${DateService.getDateString({ format: 'YYYYMM' })}`;
  }

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly prisma: PrismaService,
  ) {}

  async getRankings(start = 0, end = 9) {
    const rankings = await this.redis.zrevrange(
      this.rankingKey,
      start,
      end,
      'WITHSCORES',
    );

    const result = [];
    for (let i = 0; i < rankings.length; i += 2) {
      const userId = rankings[i];
      const score = parseInt(rankings[i + 1]);
      const rank = (await this.redis.zrevrank(this.rankingKey, userId)) + 1;
      result.push({ userId, score, rank });
    }

    return this.prisma.addUserToArray(result);
  }

  async getUserRanking(userId: string) {
    const score = await this.redis.zscore(this.rankingKey, userId);

    if (score === null) return null;

    const rank = (await this.redis.zrevrank(this.rankingKey, userId)) + 1;
    const user = await this.prisma.users.findUnique({ where: { id: userId } });

    return { userId, score: parseInt(score), rank, user };
  }

  async increaseRankingScore(userId: string, amount = 1) {
    const newScore = await this.redis.zincrby(this.rankingKey, amount, userId);
    return parseInt(newScore);
  }

  async removeUserFromRanking(userId: string) {
    return await this.redis.zrem(this.rankingKey, userId);
  }
}
