import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import { AvailableChallenge, ChallengeReward } from './dtos/get-challenges.dto';

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  getAvailableChallenges(): Promise<AvailableChallenge[]> {
    return this.prisma.challenges.findMany({
      where: this.prisma.currentChallengeCondition,
      select: this.prisma.challengeSelect,
    });
  }

  getChallengeRewards(challengeId: number): Promise<ChallengeReward[]> {
    return this.prisma.challengeRewards.findMany({ where: { challengeId } });
  }
}
