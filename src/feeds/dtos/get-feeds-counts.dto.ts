import { ApiProperty } from '@nestjs/swagger';

export class GetFeedsCountsResponseDto {
  @ApiProperty({ description: '개수', type: Number })
  count: number;
}
