import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

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
  userId: string;

  @ApiProperty({ description: '점수', type: Number })
  score: number;

  @ApiProperty({ description: '랭킹', type: Number })
  rank: number;

  @Type(() => RankingUserDto)
  @ApiProperty({ description: '사용자 정보', type: RankingUserDto })
  user: Partial<RankingUserDto>;

  constructor(partial: Partial<RankingDto>) {
    Object.assign(this, partial);
  }
}
