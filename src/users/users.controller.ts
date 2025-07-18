import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
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
import {
  GetPresignedUrlRequestDto,
  GetPresignedUrlResponseDto,
} from '@libs/s3';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Kakao Login' })
  @ApiBody({ type: PostUserDto })
  @ApiResponse({ type: PostUserResponseDto })
  @Post('kakao-login')
  async kakaoLogin(@Body() body: PostUserDto) {
    const snsUser = await this.usersService.getKakaoUser(body.snsToken);
    return this.usersService.signInOrUp(body, snsUser);
  }

  @ApiOperation({ summary: 'Get User Info' })
  @ApiResponse({ type: UserDto })
  @Get()
  @UseGuards(JwtGuard)
  async getUser(@RequestUser() user: UserDto) {
    return user;
  }

  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({ type: PostUserResponseDto })
  @ApiBody({ type: PutUserDto, required: false })
  @Put()
  @UseGuards(JwtGuard)
  updateUser(@RequestUser() user: Users, @Body() body: PutUserDto) {
    return this.usersService.updateUser(user.id, body);
  }

  @ApiOperation({ summary: 'Delete User' })
  @Delete()
  @ApiResponse({ type: UserDto })
  @UseGuards(JwtGuard)
  async deleteUser(@RequestUser() user: Users) {
    return this.usersService.deleteUser(user.id);
  }

  @Get('presigned-urls')
  @ApiOperation({ summary: 'Get Presigned URL' })
  @ApiResponse({ type: GetPresignedUrlResponseDto })
  @UseGuards(JwtGuard)
  getUsersPreSignedUrls(
    @Query() { count }: GetPresignedUrlRequestDto,
    @RequestUser() { id }: Users,
  ) {
    return this.usersService.getPreSignedUrls(id, count);
  }
}
