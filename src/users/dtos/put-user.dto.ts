import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class PutUserDto {
  @ApiProperty({
    description: '닉네임',
    type: String,
    default: '프로틴 쉐이크',
    required: false,
  })
  @IsString()
  @IsOptional()
  nickname: string = '프로틴 쉐이크';

  @ApiProperty({
    description: '프로필 이미지 URL',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  profileImageUrl?: string;
}

export class PutUserResponseDto extends UserDto {}
