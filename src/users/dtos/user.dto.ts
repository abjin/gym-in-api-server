import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: '유저 고유 아이디',
    type: String,
    required: false,
  })
  id: string;

  @ApiProperty({ description: '닉네임', type: String })
  nickname: string;
}
