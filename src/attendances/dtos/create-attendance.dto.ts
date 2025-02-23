import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { DateService } from '@libs/date';
import { Transform } from 'class-transformer';

export class CreateAttendanceRequestDto {
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

export class ExerciseDto {
  @ApiProperty({ description: '출석 ID', type: Number })
  attendanceId: number;

  @ApiProperty({ description: '운동 종류', type: String })
  type: string;
}

export class CreateAttendanceResponseDto {
  @ApiProperty({ description: '출석 ID', type: Number })
  id: number;

  @ApiProperty({ description: '사용자 ID', type: String })
  owner: string;

  @Transform(({ value }) => value.toISOString().split('T')[0])
  @ApiProperty({ description: '날짜', format: 'YYYY-MM-DD', type: String })
  date: Date;

  @ApiProperty({ description: '생성일', type: Date })
  createdAt: Date;

  @ApiProperty({ description: '운동 목록', type: [ExerciseDto] })
  exercises: ExerciseDto[];
}
