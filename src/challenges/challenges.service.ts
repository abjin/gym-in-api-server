import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import { AvailableChallenge, ChallengeReward } from './dtos/get-challenges.dto';
import {
  ChallengeCertificationLogs,
  ChallengeParticipants,
  ChallengeRewards,
} from '@prisma/client';
import { DateService } from '@libs/date';

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

  getMyChallenge(userId: string, challengeId: number) {
    return this.prisma.challengeParticipants.findFirstOrThrow({
      where: {
        userId,
        challengeId,
        challenge: this.prisma.currentChallengeCondition,
      },
      include: { challenge: { include: { rewards: true } } },
    });
  }

  async getMyCertifications(
    userId: string,
    challengeId: number,
  ): Promise<ChallengeCertificationLogs[]> {
    const participant =
      await this.prisma.challengeParticipants.findFirstOrThrow({
        where: { userId, challengeId },
      });

    return this.prisma.challengeCertificationLogs.findMany({
      where: { participantId: participant.participantId },
    });
  }

  async certifyAttendanceChallenges(userId: string) {
    const participants =
      await this.getParticipantsForUpdateByCheckInTime(userId);

    const promises = participants.map(async (participant) => {
      const query = this.updateChallengeCertificationQueryBuilder(participant);
      if (!query) return null;

      const result = await this.prisma.challengeParticipants.update(query);
      participant = Object.assign(participant, result);
      if (participant.rewardedAt) return participant;

      const rewards = participant.challenge.rewards;
      const goalDays = participant.goalDays;
      await this.giveChallegeRewards({ userId, rewards, goalDays });
      return participant;
    });

    return Promise.all(promises).then((results) => results.filter((r) => !!r));
  }

  private async getParticipantsForUpdateByCheckInTime(userId: string) {
    const checkInTime = DateService.getDateString({ format: 'HH-mm' });
    const participants = await this.getOngoingChallengesParticipants(userId);
    const conditions = await this.prisma.attendanceChallengeConditions.findMany(
      {
        where: {
          challengeId: { in: participants.map((p) => p.challengeId) },
          startTime: { lte: checkInTime },
          endTime: { gte: checkInTime },
        },
      },
    );

    return conditions.map((condition) =>
      participants.find((p) => p.challengeId === condition.challengeId),
    );
  }

  private updateChallengeCertificationQueryBuilder(
    participant: ChallengeParticipants,
  ) {
    if (participant.updatedAt > DateService.getStartOfDayUTC()) return null;

    const successDays = participant.successDays + 1;
    const updatedAt = new Date();
    const date = new Date(DateService.getDateString());

    const where = { participantId: participant.participantId };
    const data = {
      status: participant.goalDays <= successDays,
      successDays,
      updatedAt,
      certificationLogs: { create: { userId: participant.userId, date } },
    };

    return { where, data };
  }

  async giveChallegeRewards({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId,
    rewards,
    goalDays,
  }: {
    userId: string;
    rewards: ChallengeRewards[];
    goalDays: number;
  }) {
    let maxReward = null;

    rewards.forEach((r) => {
      const canReceiveReward = r.days <= goalDays;
      const isMaxReward = !maxReward || maxReward.days < r.days;
      if (canReceiveReward && isMaxReward) maxReward = r;
    });

    if (!maxReward) return maxReward;

    // TODO: Implement reward giving logic

    await this.prisma.challengeParticipants.update({
      where: {
        userId_challengeId: { userId, challengeId: maxReward.challengeId },
      },
      data: { rewardedAt: new Date() },
    });

    return maxReward;
  }
}
