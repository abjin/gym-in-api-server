import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { DateService } from '@libs/date';

export class CheckInRequestDto {
  @ApiProperty({
    description: '날짜',
    type: String,
    required: false,
    format: 'YYYY-MM-DD',
    default: DateService.getDateString({ format: 'YYYY-MM-DD' }),
  })
  @IsDateString()
  @IsOptional()
  date?: string = DateService.getDateString({ format: 'YYYY-MM-DD' });
}

export class CheckInResponseDto {
  @ApiProperty({
    description: '출석 상태',
    enum: ['fail', 'success', 'pending'],
  })
  status: 'fail' | 'success' | 'pending';
}
