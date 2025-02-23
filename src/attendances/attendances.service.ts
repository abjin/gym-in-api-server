import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import {
  CheckInRequestDto,
  CheckInResponseDto,
  CreateAttendanceRequestDto,
  CreateAttendanceResponseDto,
} from './dtos';
import { S3Service } from '@libs/s3';
import { OpenrouterService } from '@libs/openrouter';

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

  async checkIn(body: CheckInRequestDto): Promise<CheckInResponseDto> {
    return this.openrouterService.validateGymImage(body.imageUrl);
  }

  async createAttendance(
    owner: string,
    body: CreateAttendanceRequestDto,
  ): Promise<CreateAttendanceResponseDto> {
    return await this.prismaService.attendances.create({
      select: this.prismaService.attendanceSelect,
      data: {
        owner,
        date: body.date,
        exercises: { create: body.exercises.map((type) => ({ type })) },
      },
    });
  }
}
