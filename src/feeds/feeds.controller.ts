import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestUser } from 'src/user.decorator';
import { Users } from '@prisma/client';
import {
  GetPresignedUrlRequestDto,
  GetPresignedUrlResponseDto,
} from '@libs/s3';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get('presigned-urls')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'get presigned url' })
  @ApiResponse({ type: GetPresignedUrlResponseDto })
  getChallengePreSignedUrls(
    @Query() { count }: GetPresignedUrlRequestDto,
    @RequestUser() { id }: Users,
  ) {
    return this.feedsService.getPreSignedUrls(id, count);
  }
}
