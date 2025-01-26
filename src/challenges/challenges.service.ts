import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import { AvailableChallenge, ChallengeReward } from './dtos/get-challenges.dto';
import { ChallengeParticipants } from '@prisma/client';

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

  async joinChallenge({
    challengeId,
    userId,
    goalDays,
  }: {
    challengeId: number;
    userId: string;
    goalDays: number;
  }): Promise<{
    challenge: AvailableChallenge;
    participant: ChallengeParticipants;
  }> {
    const challenge = await this.prisma.challenges.findFirstOrThrow({
      where: { id: challengeId, ...this.prisma.currentChallengeCondition },
      select: this.prisma.challengeSelect,
    });

    const participant = await this.prisma.challengeParticipants.create({
      data: {
        userId,
        challengeId: challenge.id,
        challengeType: challenge.type,
        goalDays,
      },
    });

    return { challenge, participant };
  }
}
