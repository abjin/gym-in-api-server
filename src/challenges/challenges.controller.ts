import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RequestUser } from 'src/user.decorator';
import { Users } from '@prisma/client';
import {
  AvailableChallenge,
  ChallengeReward,
  OngoingChallenge,
  PostParticipantsRequestBodyDto,
  ChallengeCertifications,
} from './dtos';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get('available')
  @ApiOperation({ summary: 'get available challenges' })
  @ApiResponse({ type: AvailableChallenge, isArray: true })
  async getAvailableChallenges(
    @RequestUser() user: Users,
  ): Promise<AvailableChallenge[]> {
    const challenges = await this.challengesService.getAvailableChallenges(
      user.id,
    );
    return challenges.map((challenge) => new AvailableChallenge(challenge));
  }

  @Get('ongoing')
  @ApiOperation({ summary: 'get ongoing challenges' })
  @ApiResponse({ type: OngoingChallenge, isArray: true })
  async getOngoingChallenges(
    @RequestUser() user: Users,
  ): Promise<OngoingChallenge[]> {
    const participants =
      await this.challengesService.getOngoingChallengesParticipants(user.id);
    return participants.map(
      (participant) => new OngoingChallenge(participant.challenge, participant),
    );
  }

  @Get(':challengeId/rewards')
  @ApiOperation({ summary: 'get rewards for a challenge' })
  @ApiResponse({ type: ChallengeReward, isArray: true })
  async getRewards(
    @Param('challengeId', ParseIntPipe) challengeId: number,
  ): Promise<ChallengeReward[]> {
    const rewards =
      await this.challengesService.getChallengeRewards(challengeId);
    return rewards.map((reward) => new ChallengeReward(reward));
  }

  @Post(':challengeId/participants')
  @ApiOperation({ summary: 'join a challenge' })
  @ApiResponse({ type: OngoingChallenge })
  async joinChallenge(
    @Param('challengeId', ParseIntPipe) challengeId: number,
    @Body() { goalDays }: PostParticipantsRequestBodyDto,
    @RequestUser() user: Users,
  ): Promise<OngoingChallenge> {
    const { challenge, participant } =
      await this.challengesService.joinChallenge({
        challengeId,
        userId: user.id,
        goalDays,
      });

    return new OngoingChallenge(challenge, participant);
  }

  @Get(':challengeId/participants/my')
  @ApiOperation({ summary: 'get my challenge' })
  @ApiResponse({ type: OngoingChallenge })
  async getMyChallenge(
    @Param('challengeId', ParseIntPipe) challengeId: number,
    @RequestUser() user: Users,
  ): Promise<OngoingChallenge> {
    const participant = await this.challengesService.getMyChallenge(
      user.id,
      challengeId,
    );
    return new OngoingChallenge(participant.challenge, participant);
  }

  @Get(':challengeId/participants/my/certifications')
  @ApiOperation({ summary: 'get my certifications' })
  @ApiResponse({ type: ChallengeCertifications, isArray: true })
  async getMyCertifications(
    @Param('challengeId', ParseIntPipe) challengeId: number,
    @RequestUser() user: Users,
  ): Promise<ChallengeCertifications[]> {
    const certifications = await this.challengesService.getMyCertifications(
      user.id,
      challengeId,
    );

    return certifications.map(
      (certification) => new ChallengeCertifications(certification),
    );
  }

  @Post('attendances/certifications')
  @ApiOperation({ summary: 'certify attendance challenges' })
  @ApiResponse({ type: OngoingChallenge, isArray: true })
  async certifyAttendanceChallenges(@RequestUser() user: Users) {
    const participants =
      await this.challengesService.certifyAttendanceChallenges(user.id);
    return participants.map(
      (participant) => new OngoingChallenge(participant.challenge, participant),
    );
  }
}
