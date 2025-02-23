import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { DateService } from '@libs/date';
export class MonthlyGoalRequestDto {
  @ApiProperty({ description: '월간 목표 횟수', type: Number })
  @IsNumber()
  goal: number;
}

export class GetMonthlyGoalRequestDto {
  @ApiProperty({
    description: '날짜',
    type: String,
    required: false,
    default: DateService.getDateString({ format: 'YYYY-MM' }),
  })
  @IsDateString()
  @IsOptional()
  month?: string = DateService.getDateString({ format: 'YYYY-MM' });
}

export class MonthlyGoalResponseDto {
  @ApiProperty({ description: '목표 ID', type: Number })
  id: number;

  @ApiProperty({ description: '사용자 ID', type: String })
  owner: string;

  @ApiProperty({ description: '목표 횟수', type: Number })
  goal: number;

  @ApiProperty({ description: '시작일', type: String })
  startDate: string;

  @ApiProperty({ description: '종료일', type: String })
  endDate: string;
}
