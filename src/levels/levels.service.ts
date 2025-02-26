import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class LevelsService {
  constructor(private readonly prisma: PrismaService) {}

  async increaseExperiencePoint({
    userId,
    amount,
    type,
  }: {
    userId: string;
    amount: number;
    type?: $Enums.LevelLogType;
  }) {
    const result = await this.prisma.users.update({
      where: { id: userId },
      data: { totalExperiencePoint: { increment: amount } },
    });

    this.prisma.levelLogs
      .create({ data: { userId, amount, type } })
      .catch(console.log);

    return result;
  }
}
