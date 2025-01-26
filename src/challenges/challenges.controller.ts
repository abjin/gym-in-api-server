import { Controller, Get, UseGuards } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AvailableChallenge } from './dtos/get-challenges.dto';

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
}
