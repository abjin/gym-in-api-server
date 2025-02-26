import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import {
  CheckInRequestDto,
  CheckInResponseDto,
  CreateAttendanceRequestDto,
  AttendanceResponseDto,
  CreateAttendanceGoalRequestDto,
  AttendanceGoalResponseDto,
} from './dtos';
import { S3Service } from '@libs/s3';
import { OpenrouterService } from '@libs/openrouter';
import { DateService } from '@libs/date';
import { $Enums } from '@prisma/client';
import { RankingsService } from 'src/rankings/rankings.service';
import { ExperiencePointValue, RankingScoreWeight } from 'src/constants';
import { IncreaseAttendanceRankingScoreParams } from '@types';
import { LevelsService } from 'src/levels/levels.service';

@Injectable()
export class AttendancesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly openrouterService: OpenrouterService,
    private readonly rankingsService: RankingsService,
    private readonly levelsService: LevelsService,
  ) {}

  getPreSignedUrls(userId: string, count = 1) {
    const ts = Date.now();

    const result = [];
    for (let i = 0; i < count; i += 1) {
      const key = `check-in/${userId}/${ts}_${i}`;
      const url = this.s3Service.makePutImagePreSignedUrl(key);
      result.push({ url, key });
    }

    return result;
  }

  async checkIn(
    body: CheckInRequestDto,
    owner: string,
  ): Promise<CheckInResponseDto> {
    const attendance = await this.prismaService.attendances.findUnique({
      where: { owner_date: { owner, date: new Date(body.date) } },
    });

    if (attendance) {
      throw new ConflictException('이미 출석체크를 했습니다.');
    }

    return this.openrouterService.validateGymImage(body.imageUrl);
  }

  async createAttendance(
    owner: string,
    body: CreateAttendanceRequestDto,
  ): Promise<AttendanceResponseDto> {
    const result = await this.prismaService.attendances.create({
      select: this.prismaService.attendanceSelect,
      data: {
        owner,
        date: new Date(body.date),
        exercises: { create: body.exercises.map((type) => ({ type })) },
      },
    });

    const attendanceGoal = await this.getAttendanceGoals({ owner });
    const successCount = await this.getAttendanceGoalSuccessCount(owner);
    const isGoalAchieved = attendanceGoal.goal === successCount;

    Promise.all([
      this.increaseAttendaceExperiencePoint(owner, isGoalAchieved),
      this.increaseAttendanceRankingScore({
        owner,
        isGoalAchieved,
        successCount,
      }),
    ]).catch(console.log);

    return result;
  }

  private async increaseAttendanceRankingScore({
    owner,
    isGoalAchieved,
    successCount,
  }: IncreaseAttendanceRankingScoreParams) {
    let score = RankingScoreWeight.ATTENDANCE * 1;
    if (isGoalAchieved) {
      score += RankingScoreWeight.ATTENDANCE_GOAL * successCount;
    }
    await this.rankingsService.increaseRankingScore(owner, score);
  }

  private async increaseAttendaceExperiencePoint(
    owner: string,
    isGoalAchieved: boolean,
  ) {
    const promises = [
      this.levelsService.increaseExperiencePoint({
        userId: owner,
        amount: ExperiencePointValue.ATTENDANCE,
        type: $Enums.LevelLogType.attendance,
      }),
    ];

    if (isGoalAchieved) {
      promises.push(
        this.levelsService.increaseExperiencePoint({
          userId: owner,
          amount: ExperiencePointValue.ATTENDANCE_GOAL,
          type: $Enums.LevelLogType.attendanceGoal,
        }),
      );
    }

    await Promise.all(promises);
  }

  async getAttendanceGoalSuccessCount(
    owner: string,
    type = $Enums.AttendanceGoalType.weekly,
  ) {
    const range = await this.getAttendanceGoalRange(type);

    return this.prismaService.attendances.count({
      where: { owner, date: { gte: range.startDate, lte: range.endDate } },
    });
  }

  async getAttendances(
    owner: string,
    date: string,
  ): Promise<AttendanceResponseDto[]> {
    const startOfMonth = new Date(DateService.getStartOfMonthString(date));
    const endOfMonth = new Date(DateService.getEndOfMonthString(date));

    return this.prismaService.attendances.findMany({
      select: this.prismaService.attendanceSelect,
      where: { owner, date: { gte: startOfMonth, lte: endOfMonth } },
    });
  }

  async getLatestAttendance(owner: string): Promise<AttendanceResponseDto> {
    return this.prismaService.attendances.findFirst({
      select: this.prismaService.attendanceSelect,
      where: { owner },
      orderBy: { date: 'desc' },
    });
  }

  private async getAttendanceGoalRange(
    type: $Enums.AttendanceGoalType,
    date = DateService.getDateString({ format: 'YYYY-MM-DD' }),
  ): Promise<{ startDate: Date; endDate: Date }> {
    let startDate: Date;
    let endDate: Date;

    if (type === $Enums.AttendanceGoalType.monthly) {
      startDate = new Date(DateService.getStartOfMonthString(date));
      endDate = new Date(DateService.getEndOfMonthString(date));
    } else {
      startDate = new Date(DateService.getStartOfWeekString(date));
      endDate = new Date(DateService.getEndOfWeekString(date));
    }

    return { startDate, endDate };
  }

  async createAttendanceGoal({
    body: { date, goal },
    type,
    owner,
  }: {
    body: CreateAttendanceGoalRequestDto;
    type: $Enums.AttendanceGoalType;
    owner: string;
  }): Promise<AttendanceGoalResponseDto> {
    const range = await this.getAttendanceGoalRange(type, date);

    return this.prismaService.attendanceGoals.create({
      data: {
        owner,
        type,
        goal,
        startDate: range.startDate,
        endDate: range.endDate,
      },
    });
  }

  async getAttendanceGoals({
    owner,
    type = $Enums.AttendanceGoalType.weekly,
    date = DateService.getDateString({ format: 'YYYY-MM-DD' }),
  }: {
    owner: string;
    type?: $Enums.AttendanceGoalType;
    date?: string;
  }): Promise<AttendanceGoalResponseDto> {
    const range = await this.getAttendanceGoalRange(type, date);
    return this.prismaService.attendanceGoals.findUnique({
      where: {
        owner_type_startDate_endDate: {
          owner,
          type,
          startDate: range.startDate,
          endDate: range.endDate,
        },
      },
    });
  }

  async getUserTotalAttendance(userId: string): Promise<number> {
    const totalAttendance = await this.prismaService.attendances.count({
      where: { owner: userId },
    });
    return totalAttendance;
  }
}
