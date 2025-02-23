import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CheckInRequestDto } from './dtos';
import {
  GetPresignedUrlRequestDto,
  GetPresignedUrlResponseDto,
} from '@libs/s3';
import { Users } from '@prisma/client';
import { RequestUser } from 'src/user.decorator';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Get('presigned-urls')
  @ApiResponse({ type: GetPresignedUrlResponseDto })
  @ApiOperation({ summary: 'get presigned url' })
  getAttendancesPreSignedUrls(
    @Query() { count }: GetPresignedUrlRequestDto,
    @RequestUser() { id }: Users,
  ) {
    return this.attendancesService.getPreSignedUrls(id, count);
  }

  @Post('check-in')
  @ApiOperation({ summary: 'check in' })
  checkIn(@Body() body: CheckInRequestDto, @RequestUser() { id }: Users) {
    return this.attendancesService.checkIn(body, id);
  }
}
