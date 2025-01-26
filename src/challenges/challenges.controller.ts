import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AvailableChallenge, ChallengeReward } from './dtos/get-challenges.dto';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get('available')
  @ApiOperation({ summary: 'get available challenges' })
  @ApiResponse({ type: AvailableChallenge, isArray: true })
  async getAvailableChallenges(): Promise<AvailableChallenge[]> {
    const challenges = await this.challengesService.getAvailableChallenges();
    return challenges.map((challenge) => new AvailableChallenge(challenge));
  }

  @Get(':chellengeId/rewards')
  @ApiOperation({ summary: 'get rewards for a challenge' })
  @ApiResponse({ type: ChallengeReward, isArray: true })
  async getRewards(
    @Param('chellengeId', ParseIntPipe) chellengeId: number,
  ): Promise<ChallengeReward[]> {
    const rewards =
      await this.challengesService.getChallengeRewards(chellengeId);
    return rewards.map((reward) => new ChallengeReward(reward));
  }
}
