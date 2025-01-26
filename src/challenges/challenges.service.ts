import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import { AvailableChallenge } from './dtos/get-challenges.dto';

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  getAvailableChallenges(): Promise<AvailableChallenge[]> {
    return this.prisma.challenges.findMany({
      where: this.prisma.currentChallengeCondition,
    });
  }
}
