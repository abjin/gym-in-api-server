import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PostUserDto {
  @ApiProperty({ description: 'sns 토큰', type: String })
  @IsString()
  snsToken: string;

  @ApiProperty({
    description: '닉네임',
    type: String,
    default: '프로틴 쉐이크',
    required: false,
  })
  @IsString()
  @IsOptional()
  nickname: string = '프로틴 쉐이크';
}

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

export class PostUserResponseDto {
  @ApiProperty({ description: '유저', type: UserDto })
  user: UserDto;

  @ApiProperty({ description: '토큰', type: String })
  token: string;
}
