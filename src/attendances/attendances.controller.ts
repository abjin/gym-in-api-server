import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CheckInRequestDto,
  CheckInResponseDto,
  CreateAttendanceRequestDto,
  CreateAttendanceResponseDto,
} from './dtos';
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
  @ApiResponse({ type: CheckInResponseDto })
  checkIn(@Body() body: CheckInRequestDto): Promise<CheckInResponseDto> {
    return this.attendancesService.checkIn(body);
  }

  @Post()
  @ApiOperation({ summary: 'create attendance' })
  @ApiResponse({ type: CreateAttendanceResponseDto })
  createAttendance(
    @Body() body: CreateAttendanceRequestDto,
    @RequestUser() { id }: Users,
  ): Promise<CreateAttendanceResponseDto> {
    return this.attendancesService.createAttendance(id, body);
  }
}
