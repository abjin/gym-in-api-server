import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateAttendanceResponseDto } from './create-attendance.dto';
import { DateService } from '@libs/date';

export class GetAttendancesRequestDto {
  @ApiProperty({
    description: '날짜',
    type: String,
    format: 'YYYY-MM-DD',
    default: DateService.getDateString({ format: 'YYYY-MM-DD' }),
  })
  @IsString()
  @IsOptional()
  date?: string = DateService.getDateString({ format: 'YYYY-MM-DD' });
}

export class GetAttendancesResponseDto {
  @ApiProperty({
    description: '출석 목록',
    type: [CreateAttendanceResponseDto],
  })
  attendanceList: CreateAttendanceResponseDto[];
}
