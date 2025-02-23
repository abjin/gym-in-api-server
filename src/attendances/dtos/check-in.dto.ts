import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';
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

  @ApiProperty({
    description: '이미지 URL',
    type: String,
    required: true,
    default:
      'https://gym-in-images.s3.ap-northeast-2.amazonaws.com/check-in/b290e29e-89da-4960-b0d5-2f3a0bc22881/1740290276117_0',
  })
  @IsString()
  @IsUrl()
  imageUrl: string;
}

export class CheckInResponseDto {
  @ApiProperty({
    description: '출석 상태',
    type: Boolean,
  })
  result: boolean;
}
