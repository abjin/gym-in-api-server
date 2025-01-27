import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { GetFeedResponseDto } from './get-feed.dto';

export class GetFeedsRequestQueryDto {
  @ApiProperty({
    description: '마지막으로 조회한 피드 아이디',
    type: String,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  lastId?: number;

  @ApiProperty({ description: '개수', type: Number, required: false })
  @IsNumber()
  @IsOptional()
  limit?: number = 30;
}

export class GetFeedsResponseDto extends Array<GetFeedResponseDto> {}
