import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import { CheckInRequestDto } from './dtos';
import { S3Service } from '@libs/s3';
@Injectable()
export class AttendancesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
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

  async checkIn(body: CheckInRequestDto, userId: string) {
    return { body, userId };
  }
}
