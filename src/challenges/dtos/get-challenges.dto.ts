import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Transform } from 'class-transformer';

export class AvailableChallenge {
  @ApiProperty({ description: '챌린지 ID', type: Number })
  id: number;

  @ApiProperty({ description: '챌린지 이름', type: String })
  name: string;

  @ApiProperty({ description: '챌린지 설명', type: String })
  description: string;

  @ApiProperty({ description: '챌린지 타입', enum: $Enums.ChallengeType })
  type: $Enums.ChallengeType;

  @Transform(({ value }) => value.toISOString().split('T')[0])
  @ApiProperty({ description: '챌린지 시작일', type: String })
  startDate: Date;

  @Transform(({ value }) => value.toISOString().split('T')[0])
  @ApiProperty({ description: '챌린지 종료일', type: String })
  endDate: Date;

  constructor(partial: Partial<AvailableChallenge>) {
    Object.assign(this, partial);
  }
}
