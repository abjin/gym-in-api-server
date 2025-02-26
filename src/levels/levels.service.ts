import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'db/prisma.service';
import { RankingScoreWeight } from 'src/constants';
import { RankingsService } from 'src/rankings/rankings.service';

@Injectable()
export class LevelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rankingsService: RankingsService,
  ) {}

  async increaseExperiencePoint({
    userId,
    amount,
    type,
    description,
  }: {
    userId: string;
    amount: number;
    type?: $Enums.LevelLogType;
    description?: string;
  }) {
    const result = await this.prisma.users.update({
      where: { id: userId },
      data: { totalExperiencePoint: { increment: amount } },
    });

    this.prisma.levelLogs
      .create({ data: { userId, amount, type, description } })
      .catch(console.log);

    this.rankingsService
      .increaseRankingScore(
        userId,
        RankingScoreWeight.EXPERIENCE_POINT * amount,
      )
      .catch(console.log);

    return result;
  }
}
