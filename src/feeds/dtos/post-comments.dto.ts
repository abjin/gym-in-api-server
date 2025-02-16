import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { IsString } from 'class-validator';
import { UserDto } from 'src/users/dtos/user.dto';

export class PostCommentsRequestBodyDto {
  @ApiProperty({ description: '내용', type: String })
  @IsString()
  content: string;
}

export class PostCommentsResponseDto {
  @ApiProperty({ description: '댓글 고유아이디', type: Number })
  id: number;

  @ApiProperty({ description: '피드 고유아이디', type: Number })
  feedId: number;

  @ApiProperty({ description: '작성자 고유아이디', type: String })
  owner: string;

  @ApiProperty({ description: '내용', type: String })
  content: string;

  @ApiProperty({ description: '좋아요 수', type: Number })
  likeCounts: number;

  @ApiProperty({ description: '작성일', type: Date })
  createdAt: Date;

  @ApiProperty({ description: '작성자 정보', type: UserDto })
  author: Users;
}
