import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import { AvailableChallenge, ChallengeReward } from './dtos/get-challenges.dto';
import { ChallengeParticipants } from '@prisma/client';

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailableChallenges(userId: string): Promise<AvailableChallenge[]> {
    const challenges = await this.prisma.challenges.findMany({
      where: this.prisma.currentChallengeCondition,
      select: this.prisma.challengeSelect,
    });

    const participants = await this.prisma.challengeParticipants.findMany({
      where: { userId },
    });

    return challenges.filter((challenge) => {
      return !participants.find(
        (participant) => participant.challengeId === challenge.id,
      );
    });
  }

  getOngoingChallengesParticipants(userId: string) {
    return this.prisma.challengeParticipants.findMany({
      where: { userId, challenge: this.prisma.currentChallengeCondition },
      include: { challenge: { include: { rewards: true } } },
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
