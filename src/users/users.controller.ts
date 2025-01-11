import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { PostUserDto, PostUserResponseDto } from './dtos/post-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '카카오 로그인' })
  @ApiBody({ type: PostUserDto })
  @ApiResponse({ type: PostUserResponseDto })
  @Post('kakao-login')
  async kakaoLogin(@Body() body: PostUserDto) {
    const snsUser = await this.usersService.getKakaoUser(body.snsToken);
    return this.usersService.signInOrUp(body, snsUser);
  }
}
