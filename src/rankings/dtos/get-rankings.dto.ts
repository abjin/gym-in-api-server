import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

export class RankingUserDto {
  @ApiProperty({ description: '사용자 ID', type: String })
  id: string;

  @ApiProperty({ description: '사용자 이름', type: String })
  name: string;

  @ApiProperty({
    description: '사용자 프로필 이미지',
    type: String,
    nullable: true,
  })
  profileImage: string | null;

  // 필요한 다른 사용자 속성들을 추가할 수 있습니다
}

export class RankingItemDto {
  @ApiProperty({ description: '사용자 ID', type: String })
  userId: string;

  @ApiProperty({ description: '점수', type: Number })
  score: number;

  @ApiProperty({ description: '랭킹', type: Number })
  rank: number;

  @ApiProperty({ description: '사용자 정보', type: RankingUserDto })
  user: RankingUserDto;
}

export class GetRankingsResponseDto {
  @ApiProperty({
    description: '랭킹 목록',
    type: [RankingItemDto],
  })
  data: RankingItemDto[];
}
