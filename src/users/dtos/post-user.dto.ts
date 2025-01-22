import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserDto } from './user.dto';

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

export class PostUserResponseDto {
  @ApiProperty({ description: '유저', type: UserDto })
  user: UserDto;

  @ApiProperty({ description: '토큰', type: String })
  token: string;
}
