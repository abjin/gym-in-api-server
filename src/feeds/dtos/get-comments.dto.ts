import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { IsNumber, IsOptional } from 'class-validator';
import { UserDto } from 'src/users/dtos/user.dto';

export class GetCommentsRequestQueryDto {
  @ApiProperty({
    description: '마지막으로 조회한 피드 아이디',
    type: String,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  lastId?: number;

  @ApiProperty({ description: '개수', type: Number, required: false })
  @IsNumber()
  @IsOptional()
  limit?: number = 30;
}

export class GetCommentResponseDto {
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

export class GetCommentsResponseDto extends Array<GetCommentResponseDto> {}
