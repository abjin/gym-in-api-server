import { ApiProperty } from '@nestjs/swagger';

export class GetCountsResponseDto {
  @ApiProperty({ description: '개수', type: Number })
  count: number;
}
