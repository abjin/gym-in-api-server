import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { Users } from '@prisma/client';
import { RequestUser } from 'src/user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  GetRankingsRequestDto,
  GetRankingsResponseDto,
  GetUserRankingResponseDto,
} from './dtos';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  @ApiOperation({ summary: 'get rankings' })
  @ApiResponse({ type: GetRankingsResponseDto })
  async getRankings(
    @Query() { start, end }: GetRankingsRequestDto,
  ): Promise<GetRankingsResponseDto> {
    const data = await this.rankingsService.getRankings(start, end);
    return { data };
  }

  @Get('my')
  @ApiOperation({ summary: 'get my ranking' })
  @ApiResponse({ type: GetUserRankingResponseDto })
  getUserRanking(
    @RequestUser() user: Users,
  ): Promise<GetUserRankingResponseDto | null> {
    return this.rankingsService.getUserRanking(user.id);
  }
}
