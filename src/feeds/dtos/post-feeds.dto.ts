import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { GetFeedResponseDto } from './get-feed.dto';

export class PostFeedsRequestBodyDto {
  @ApiProperty({ description: '내용', type: String })
  @IsString()
  content: string;

  @ApiProperty({ description: '내용', type: Array })
  @IsArray()
  @IsOptional()
  imageUrls?: string[] = [];
}

export class PostFeedsResponseDto extends GetFeedResponseDto {}
