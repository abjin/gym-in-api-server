import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { Users } from '@prisma/client';
import { RequestUser } from 'src/user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetRankingsRequestDto, RankingDto } from './dtos';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  @ApiOperation({ summary: 'get rankings' })
  @ApiResponse({ type: RankingDto, isArray: true })
  async getRankings(
    @Query() { start, end }: GetRankingsRequestDto,
  ): Promise<RankingDto[]> {
    const result = await this.rankingsService.getRankings(start, end);
    return result.map((item) => new RankingDto(item));
  }

  @Get('my')
  @ApiOperation({ summary: 'get my ranking' })
  @ApiResponse({ type: RankingDto })
  async getUserRanking(@RequestUser() user: Users): Promise<RankingDto> {
    const result = await this.rankingsService.getUserRanking(user.id);
    return new RankingDto(result);
  }
}
