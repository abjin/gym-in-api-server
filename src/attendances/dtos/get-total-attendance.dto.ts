import { ApiProperty } from '@nestjs/swagger';

export class GetTotalAttendanceResponseDto {
  @ApiProperty({
    description: '총 출석 수',
    type: Number,
    example: 1250,
  })
  totalAttendance: number;
}
