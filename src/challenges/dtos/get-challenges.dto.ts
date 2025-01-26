import { ApiProperty } from '@nestjs/swagger';
import { $Enums, ChallengeParticipants } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class ChallengeReward {
  @ApiProperty({ description: '챌린지 ID', type: Number })
  challengeId: number;

  @ApiProperty({ description: '챌린지 보상 일수', type: Number })
  days: number;

  @ApiProperty({
    description: '챌린지 보상 타입',
    enum: $Enums.ChallengeRewardType,
  })
  type: $Enums.ChallengeRewardType;

  @ApiProperty({ description: '챌린지 보상 금액', type: Number })
  amount: number;

  constructor(partial: Partial<ChallengeReward>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class AvailableChallenge {
  @Expose()
  @ApiProperty({ description: '챌린지 ID', type: Number })
  id: number;

  @Expose()
  @ApiProperty({ description: '챌린지 이름', type: String })
  name: string;

  @Expose()
  @ApiProperty({ description: '챌린지 설명', type: String })
  description: string;

  @Expose()
  @ApiProperty({ description: '챌린지 타입', enum: $Enums.ChallengeType })
  type: $Enums.ChallengeType;

  @Expose()
  @Transform(({ value }) => value.toISOString().split('T')[0])
  @ApiProperty({ description: '챌린지 시작일', type: String })
  startDate: Date;

  @Expose()
  @Transform(({ value }) => value.toISOString().split('T')[0])
  @ApiProperty({ description: '챌린지 종료일', type: String })
  endDate: Date;

  @Expose()
  @Type(() => ChallengeReward)
  @ApiProperty({ description: '챌린지 보상 목록', type: [ChallengeReward] })
  rewards: ChallengeReward[];

  constructor(partial: Partial<AvailableChallenge>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class OngoingChallenge extends AvailableChallenge {
  @Expose()
  @ApiProperty({ description: '참여자 목표 일수', type: Number })
  goalDays: number;

  @Expose()
  @ApiProperty({ description: '참여자 성공 일수', type: Number })
  successDays: number;
  @Expose()
  @ApiProperty({ description: '챌린지 상태', type: Boolean })
  status: boolean;

  @Expose()
  @ApiProperty({ description: '참여일', type: Date })
  participatedAt: Date;

  @Expose()
  @ApiProperty({ description: '최근 업데이트 일시', type: Date })
  updatedAt: Date;

  constructor(
    availableChallengePartial: Partial<AvailableChallenge>,
    participantsPartial: Partial<ChallengeParticipants>,
  ) {
    super(availableChallengePartial);
    Object.assign(this, participantsPartial);
  }
}
