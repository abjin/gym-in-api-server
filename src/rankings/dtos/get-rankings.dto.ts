import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Users } from '@prisma/client';

export class GetRankingsRequestDto {
  @ApiProperty({
    description: '랭킹 시작 인덱스',
    type: Number,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  start?: number = 0;

  @ApiProperty({
    description: '랭킹 종료 인덱스',
    type: Number,
    required: false,
    default: 9,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  end?: number = 9;
}

@Exclude()
class RankingUserDto {
  @Expose()
  @ApiProperty({ description: '유저 아이디', type: String })
  id: string;

  @Expose()
  @ApiProperty({ description: '닉네임', type: String })
  nickname: string;

  @Expose()
  @ApiProperty({ description: '프로필 이미지 URL', type: String })
  profileImageUrl: string;

  @ApiProperty({ description: '경험치', type: Number })
  @Expose()
  @Transform(({ obj }) => obj.totalExperiencePoint % 100)
  experiencePoint: number;

  @ApiProperty({ description: '레벨', type: Number })
  @Expose()
  @Transform(({ obj }) => Math.floor(obj.totalExperiencePoint / 100))
  level: number;

  @Exclude()
  @ApiProperty({ description: '경험치', type: Number })
  totalExperiencePoint: number;

  constructor(partial: Partial<RankingUserDto>) {
    Object.assign(this, partial);
  }
}

export class RankingDto {
  @ApiProperty({ description: '사용자 ID', type: String })
  @Expose()
  userId: string;

  @ApiProperty({ description: '총 점수', type: Number })
  @Expose()
  score: number;

  @ApiProperty({ description: '랭킹', type: Number })
  @Expose()
  rank: number;

  @ApiProperty({ description: '사용자 정보', type: Object })
  @Expose()
  user: Users;

  @ApiProperty({ description: '목표 달성일 수', type: Number })
  @Expose()
  @Transform(({ obj }) => Math.floor(obj.score / 1000000))
  achievedGoalDays: number;

  @ApiProperty({ description: '출석일 수', type: Number })
  @Expose()
  @Transform(({ obj }) => Math.floor((obj.score % 1000000) / 10000))
  attendanceDays: number;

  @ApiProperty({ description: '획득 경험치', type: Number })
  @Expose()
  @Transform(({ obj }) => obj.score % 10000)
  experiencePoint: number;

  constructor(partial: Partial<RankingDto>) {
    Object.assign(this, partial);
  }
}
