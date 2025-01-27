import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { UserDto } from 'src/users/dtos/user.dto';

export class GetFeedResponseDto {
  @ApiProperty({ description: '피드 고유아이디', type: Number })
  id: number;

  @ApiProperty({ description: '작성자 고유아이디', type: String })
  owner: string;

  @ApiProperty({ description: '내용', type: String })
  content: string;

  @ApiProperty({ description: '이미지', type: Array })
  imageUrls: string[] | JsonValue;

  @ApiProperty({ description: '작성일', type: Date })
  createdAt: Date;

  @ApiProperty({ description: '댓글수', type: Number })
  commentCounts: number;

  @ApiProperty({ description: '좋아요수', type: Number })
  likeCounts: number;

  @ApiProperty({ description: '작성자', type: UserDto })
  author: Users;
}
