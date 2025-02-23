import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateAttendanceResponseDto } from './create-attendance.dto';
import { DateService } from '@libs/date';

export class GetAttendancesRequestDto {
  @ApiProperty({
    description: '월',
    type: Number,
    format: 'YYYY-MM',
    default: DateService.getDateString({ format: 'YYYY-MM' }),
  })
  @IsString()
  @IsOptional()
  month?: string = DateService.getDateString({ format: 'YYYY-MM' });
}

export class GetAttendancesResponseDto {
  @ApiProperty({
    description: '출석 목록',
    type: [CreateAttendanceResponseDto],
  })
  attendanceList: CreateAttendanceResponseDto[];
}
