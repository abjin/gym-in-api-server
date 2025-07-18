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

  @ApiProperty({ description: '프로필 이미지 URL', type: String })
  profileImageUrl: string;

  @ApiProperty({ description: '경험치', type: Number })
  totalExperiencePoint: number;
}
