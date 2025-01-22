import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class PuUserDto {
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

export class PutUserResponseDto extends UserDto {}
