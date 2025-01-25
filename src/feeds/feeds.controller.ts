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
  GetCommentsRequestQueryDto,
  GetCommentsResponseDto,
  GetFeedResponseDto,
  GetFeedsRequestQueryDto,
  GetFeedsResponseDto,
  PostCommentsRequestBodyDto,
  PostCommentsResponseDto,
  PostFeedsRequestBodyDto,
  PostFeedsResponseDto,
  PostFeedLikesResponseDto,
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

  @Get('my')
  @Get(':feedId')
  @ApiOperation({ summary: 'get my feed' })
  @ApiResponse({ type: GetFeedsResponseDto })
  getMyFeeds(
    @Query() dto: GetFeedsRequestQueryDto,
    @RequestUser() { id: owner }: Users,
  ): Promise<GetFeedsResponseDto> {
    return this.feedsService.getMyFeeds(owner, dto);
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

  @Post(':feedId/comments')
  @ApiOperation({ summary: 'create comment' })
  @ApiResponse({ type: PostCommentsResponseDto })
  createComment(
    @Param('feedId', ParseIntPipe) feedId: number,
    @Body() { content }: PostCommentsRequestBodyDto,
    @RequestUser() { id: owner }: Users,
  ): Promise<PostCommentsResponseDto> {
    return this.feedsService.createComments({ feedId, content, owner });
  }

  @Get(':feedId/comments')
  @ApiOperation({ summary: 'get comments' })
  @ApiResponse({ type: GetCommentsResponseDto })
  getComments(
    @Param('feedId', ParseIntPipe) feedId: number,
    @Query() dto: GetCommentsRequestQueryDto,
  ): Promise<GetCommentsResponseDto> {
    return this.feedsService.getComments(dto, feedId);
  }

  @Delete(':feedId/comments/:commentId')
  @ApiOperation({ summary: 'delete comment' })
  @ApiResponse({ type: undefined })
  deleteComment(
    @Param('feedId', ParseIntPipe) feedId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @RequestUser() { id: owner }: Users,
  ): Promise<void> {
    return this.feedsService.deleteComment({ commentId, feedId, owner });
  }

  @Post(':feedId/likes')
  @ApiOperation({ summary: 'like feed' })
  @ApiResponse({ type: PostFeedLikesResponseDto })
  likeFeed(
    @Param('feedId', ParseIntPipe) feedId: number,
    @RequestUser() { id: userId }: Users,
  ): Promise<PostFeedLikesResponseDto> {
    return this.feedsService.likeFeed(feedId, userId);
  }

  @Delete(':feedId/likes')
  @ApiOperation({ summary: 'unlike feed' })
  @ApiResponse({ type: undefined })
  unlikeFeed(
    @Param('feedId', ParseIntPipe) feedId: number,
    @RequestUser() { id: userId }: Users,
  ): Promise<void> {
    return this.feedsService.unlikeFeed(feedId, userId);
  }
}
