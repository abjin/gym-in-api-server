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

@Injectable()
export class AttendancesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly openrouterService: OpenrouterService,
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
    return await this.prismaService.attendances.create({
      select: this.prismaService.attendanceSelect,
      data: {
        owner,
        date: new Date(body.date),
        exercises: { create: body.exercises.map((type) => ({ type })) },
      },
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
    date: string,
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
    type,
    date,
  }: {
    owner: string;
    type: $Enums.AttendanceGoalType;
    date: string;
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
}
