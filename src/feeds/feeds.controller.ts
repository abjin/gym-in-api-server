import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  GetFeedResponseDto,
  GetFeedsRequestQueryDto,
  GetFeedsResponseDto,
  PostFeedsRequestBodyDto,
  PostFeedsResponseDto,
} from './dtos';

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

  @Get()
  @ApiOperation({ summary: 'get feeds' })
  @ApiResponse({ type: GetFeedsResponseDto })
  getFeeds(
    @Query() dto: GetFeedsRequestQueryDto,
  ): Promise<GetFeedsResponseDto> {
    return this.feedsService.getFeeds(dto);
  }

  @Get(':feedId')
  @ApiOperation({ summary: 'get feed' })
  @ApiResponse({ type: GetFeedResponseDto })
  getFeed(
    @Param('feedId', ParseIntPipe) feedId: number,
  ): Promise<GetFeedResponseDto> {
    return this.feedsService.getFeed(feedId);
  }

  @Delete(':feedId')
  @ApiOperation({ summary: 'delete feed' })
  @ApiResponse({ type: undefined })
  deleteFeed(
    @Param('feedId', ParseIntPipe) feedId: number,
    @RequestUser() { id: owner }: Users,
  ): Promise<void> {
    return this.feedsService.deleteFeed(feedId, owner);
  }
}
