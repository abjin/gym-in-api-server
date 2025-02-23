import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { DateService } from '@libs/date';
import { Transform } from 'class-transformer';

export class WeeklyGoalRequestDto {
  @ApiProperty({ description: '주간 목표 횟수', type: Number })
  @IsNumber()
  goal: number;
}

export class GetWeeklyGoalRequestDto {
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

export class WeeklyGoalResponseDto {
  @ApiProperty({ description: '목표 ID', type: Number })
  id: number;

  @ApiProperty({ description: '사용자 ID', type: String })
  owner: string;

  @ApiProperty({ description: '목표 횟수', type: Number })
  goal: number;

  @Transform(({ value }) => value.toISOString().split('T')[0])
  @ApiProperty({ description: '시작일', format: 'YYYY-MM-DD', type: String })
  startDate: Date;

  @Transform(({ value }) => value.toISOString().split('T')[0])
  @ApiProperty({ description: '종료일', format: 'YYYY-MM-DD', type: String })
  endDate: Date;
}
