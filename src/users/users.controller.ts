import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { PostUserDto, PostUserResponseDto } from './dtos/post-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RequestUser } from 'src/user.decorator';
import { UserDto } from './dtos/user.dto';
import { Users } from '@prisma/client';
import { PutUserDto } from './dtos/put-user.dto';

@Controller('users')
@ApiBearerAuth()
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

  @ApiOperation({ summary: '유저 조회' })
  @ApiResponse({ type: UserDto })
  @Get()
  @UseGuards(JwtGuard)
  async getUser(@RequestUser() user: UserDto) {
    return user;
  }

  @ApiOperation({ summary: '유저 수정' })
  @ApiResponse({ type: PostUserResponseDto })
  @ApiBody({ type: PutUserDto, required: false })
  @Put()
  @UseGuards(JwtGuard)
  updateUser(@RequestUser() user: Users, @Body() body: PutUserDto) {
    return this.usersService.updateUser(user.id, body);
  }

  @ApiOperation({ summary: '유저 탈퇴' })
  @Delete()
  @ApiResponse({ type: UserDto })
  @UseGuards(JwtGuard)
  async deleteUser(@RequestUser() user: Users) {
    return this.usersService.deleteUser(user.id);
  }
}
