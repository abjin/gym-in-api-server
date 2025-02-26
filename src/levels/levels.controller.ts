import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestUser } from 'src/user.decorator';
import { UserDto } from 'src/users/dtos/user.dto';
import { GetLevelResponseDto } from './dtos/get-level.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('levels')
export class LevelsController {
  @Get()
  @ApiOperation({ summary: 'get user level' })
  @ApiResponse({ type: GetLevelResponseDto })
  getLevel(@RequestUser() user: UserDto) {
    return new GetLevelResponseDto(user);
  }
}
