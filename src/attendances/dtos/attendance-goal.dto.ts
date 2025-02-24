import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';
import { DateService } from '@libs/date';
import { Transform } from 'class-transformer';

export class CreateAttendanceGoalRequestDto {
  @ApiProperty({
    description: '월간 목표 횟수',
    type: Number,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  goal: number;

  @ApiProperty({
    description: '날짜',
    type: String,
    required: false,
    default: DateService.getDateString({ format: 'YYYY-MM-DD' }),
  })
  @IsDateString()
  @IsOptional()
  date?: string = DateService.getDateString({ format: 'YYYY-MM-DD' });
}

export class GetAttendanceGoalRequestDto {
  @ApiProperty({
    description: '날짜',
    type: String,
    required: false,
    default: DateService.getDateString({ format: 'YYYY-MM-DD' }),
  })
  @IsDateString()
  @IsOptional()
  date?: string = DateService.getDateString({ format: 'YYYY-MM-DD' });
}

export class AttendanceGoalResponseDto {
  @ApiProperty({ description: '사용자 ID', type: String })
  owner: string;

  @ApiProperty({ description: '목표 횟수', type: Number })
  goal: number;

  @ApiProperty({ description: '타입', type: String })
  type: string;

  @Transform(({ value }) => value.toISOString().split('T')[0])
  @ApiProperty({ description: '시작일', type: String, format: 'YYYY-MM-DD' })
  startDate: Date;

  @Transform(({ value }) => value.toISOString().split('T')[0])
  @ApiProperty({ description: '종료일', type: String, format: 'YYYY-MM-DD' })
  endDate: Date;

  constructor(partial: Partial<AttendanceGoalResponseDto>) {
    Object.assign(this, partial);
  }
}
