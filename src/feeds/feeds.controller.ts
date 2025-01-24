import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RequestUser } from 'src/user.decorator';
import { Users } from '@prisma/client';
import {
  GetPresignedUrlRequestDto,
  GetPresignedUrlResponseDto,
} from '@libs/s3';
import {
  PostFeedsRequestBodyDto,
  PostFeedsResponseDto,
} from './dtos/post-feeds.dto';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get('presigned-urls')
  @ApiOperation({ summary: 'get presigned url' })
  @ApiResponse({ type: GetPresignedUrlResponseDto })
  getChallengePreSignedUrls(
    @Query() { count }: GetPresignedUrlRequestDto,
    @RequestUser() { id }: Users,
  ) {
    return this.feedsService.getPreSignedUrls(id, count);
  }

  @Post()
  @ApiOperation({ summary: 'create feed' })
  @ApiBody({ type: PostFeedsRequestBodyDto })
  @ApiResponse({ type: PostFeedsRequestBodyDto })
  createFeed(
    @Body() dto: PostFeedsRequestBodyDto,
    @RequestUser() { id }: Users,
  ): Promise<PostFeedsResponseDto> {
    return this.feedsService.createFeeds(id, dto);
  }
}
