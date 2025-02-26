import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/dtos/user.dto';

export class GetUserRankingResponseDto {
  @ApiProperty({ description: '사용자 ID', type: String })
  userId: string;

  @ApiProperty({ description: '점수', type: Number })
  score: number;

  @ApiProperty({ description: '랭킹', type: Number })
  rank: number;

  @ApiProperty({ description: '사용자 정보', type: UserDto })
  user: UserDto;
}
