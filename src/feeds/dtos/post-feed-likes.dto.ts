import { ApiProperty } from '@nestjs/swagger';

export class PostFeedLikesResponseDto {
  @ApiProperty({ description: '좋아요 수', type: Number })
  likeCounts: number;
}
