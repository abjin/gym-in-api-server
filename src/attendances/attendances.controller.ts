import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CheckInRequestDto,
  CheckInResponseDto,
  CreateAttendanceRequestDto,
  AttendanceResponseDto,
  GetAttendancesRequestDto,
  AttendanceGoalResponseDto,
  CreateAttendanceGoalRequestDto,
  GetAttendanceGoalRequestDto,
} from './dtos';
import {
  GetPresignedUrlRequestDto,
  GetPresignedUrlResponseDto,
} from '@libs/s3';
import { $Enums, Users } from '@prisma/client';
import { RequestUser } from 'src/user.decorator';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly service: AttendancesService) {}

  @Get('presigned-urls')
  @ApiResponse({ type: GetPresignedUrlResponseDto })
  @ApiOperation({ summary: 'get presigned url' })
  getAttendancesPreSignedUrls(
    @Query() { count }: GetPresignedUrlRequestDto,
    @RequestUser() { id }: Users,
  ) {
    return this.service.getPreSignedUrls(id, count);
  }

  @Get('latest')
  @ApiOperation({ summary: 'get latest attendance' })
  @ApiResponse({ type: AttendanceResponseDto })
  getLatestAttendance(@RequestUser() { id }: Users) {
    return this.service.getLatestAttendance(id);
  }

  @Post('check-in')
  @ApiOperation({ summary: 'check in' })
  @ApiResponse({ type: CheckInResponseDto })
  checkIn(
    @Body() body: CheckInRequestDto,
    @RequestUser() user: Users,
  ): Promise<CheckInResponseDto> {
    return this.service.checkIn(body, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'create attendance' })
  @ApiResponse({ type: AttendanceResponseDto })
  createAttendance(
    @Body() body: CreateAttendanceRequestDto,
    @RequestUser() { id }: Users,
  ): Promise<AttendanceResponseDto> {
    return this.service.createAttendance(id, body);
  }

  @Get()
  @ApiOperation({ summary: 'get attendances' })
  @ApiResponse({ type: [AttendanceResponseDto] })
  getAttendances(
    @Query() { date }: GetAttendancesRequestDto,
    @RequestUser() { id }: Users,
  ) {
    return this.service.getAttendances(id, date);
  }

  @Post('monthly-goals')
  @ApiOperation({ summary: 'create monthly goal' })
  @ApiResponse({ type: AttendanceGoalResponseDto })
  async createMonthlyGoal(
    @Body() body: CreateAttendanceGoalRequestDto,
    @RequestUser() { id: owner }: Users,
  ) {
    const result = await this.service.createAttendanceGoal({
      type: $Enums.AttendanceGoalType.monthly,
      body,
      owner,
    });
    return new AttendanceGoalResponseDto(result);
  }

  @Post('weekly-goals')
  @ApiOperation({ summary: 'create weekly goal' })
  @ApiResponse({ type: AttendanceGoalResponseDto })
  async createWeeklyGoal(
    @Body() body: CreateAttendanceGoalRequestDto,
    @RequestUser() { id: owner }: Users,
  ) {
    const result = await this.service.createAttendanceGoal({
      type: $Enums.AttendanceGoalType.weekly,
      body,
      owner,
    });
    return new AttendanceGoalResponseDto(result);
  }

  @Get('monthly-goals')
  @ApiOperation({ summary: 'get monthly goals' })
  @ApiResponse({ type: AttendanceGoalResponseDto })
  async getMonthlyGoals(
    @RequestUser() { id: owner }: Users,
    @Query() { date }: GetAttendanceGoalRequestDto,
  ) {
    const result = await this.service.getAttendanceGoals({
      type: $Enums.AttendanceGoalType.monthly,
      owner,
      date,
    });
    return result ? new AttendanceGoalResponseDto(result) : null;
  }

  @Get('weekly-goals')
  @ApiOperation({ summary: 'get weekly goals' })
  @ApiResponse({ type: AttendanceGoalResponseDto })
  async getWeeklyGoals(
    @RequestUser() { id: owner }: Users,
    @Query() { date }: GetAttendanceGoalRequestDto,
  ) {
    const result = await this.service.getAttendanceGoals({
      type: $Enums.AttendanceGoalType.weekly,
      owner,
      date,
    });
    return result ? new AttendanceGoalResponseDto(result) : null;
  }
}
