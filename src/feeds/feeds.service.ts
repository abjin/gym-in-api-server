import { S3Service } from '@libs/s3';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import {
  PostFeedsRequestBodyDto,
  PostFeedsResponseDto,
} from './dtos/post-feeds.dto';
import {
  GetCommentsRequestQueryDto,
  GetCommentsResponseDto,
  GetFeedResponseDto,
  GetCountsResponseDto,
  GetFeedsRequestQueryDto,
  GetFeedsResponseDto,
  PostCommentsResponseDto,
} from './dtos';
import { PostFeedLikesResponseDto } from './dtos/post-feed-likes.dto';

@Injectable()
export class FeedsService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly prisma: PrismaService,
  ) {}

  getPreSignedUrls(userId: string, count = 1) {
    const ts = Date.now();

    const result = [];
    for (let i = 0; i < count; i += 1) {
      const key = `feeds/${userId}/${ts}_${i}`;
      const url = this.s3Service.makePutImagePreSignedUrl(key);
      result.push({ url, key });
    }

    return result;
  }

  async createFeeds(
    id: string,
    dto: PostFeedsRequestBodyDto,
  ): Promise<PostFeedsResponseDto> {
    return this.prisma.feeds.create({
      data: { owner: id, content: dto.content, imageUrls: dto.imageUrls },
      select: this.prisma.feedSelect,
    });
  }

  async getFeeds({
    lastId,
    limit,
  }: GetFeedsRequestQueryDto): Promise<GetFeedsResponseDto> {
    return this.prisma.feeds.findMany({
      select: this.prisma.feedSelect,
      take: limit,
      skip: lastId ? 1 : 0,
      orderBy: { id: 'desc' },
      ...(lastId && { cursor: { id: lastId } }),
    });
  }

  async getFeed(id: number): Promise<GetFeedResponseDto> {
    return this.prisma.feeds.findFirst({
      where: { id },
      select: this.prisma.feedSelect,
    });
  }

  async deleteFeed(id: number, owner: string): Promise<void> {
    await this.prisma.feeds.delete({ where: { id, owner } });
  }

  async createComments({
    feedId,
    owner,
    content,
  }: {
    feedId: number;
    owner: string;
    content: string;
  }): Promise<PostCommentsResponseDto> {
    const result = await this.prisma.$transaction([
      this.prisma.feeds.update({
        where: { id: feedId },
        data: { commentCounts: { increment: 1 } },
      }),
      this.prisma.comments.create({
        data: { feedId, owner, content },
        select: this.prisma.commentSelect,
      }),
    ]);

    return result[1];
  }

  async getComments(
    dto: GetCommentsRequestQueryDto,
    feedId: number,
  ): Promise<GetCommentsResponseDto> {
    return this.prisma.comments.findMany({
      where: { feedId },
      select: this.prisma.commentSelect,
      take: dto.limit,
      skip: dto.lastId ? 1 : 0,
      orderBy: { id: 'desc' },
      ...(dto.lastId && { cursor: { id: dto.lastId } }),
    });
  }

  async deleteComment({
    commentId,
    feedId,
    owner,
  }: {
    commentId: number;
    feedId: number;
    owner: string;
  }): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.comments.delete({
        where: { id: commentId, feedId, owner },
      }),
      this.prisma.feeds.update({
        where: { id: feedId },
        data: { commentCounts: { decrement: 1 } },
      }),
    ]);
  }

  async likeFeed(
    feedId: number,
    userId: string,
  ): Promise<PostFeedLikesResponseDto> {
    const likes = await this.prisma.feedLikes.findUnique({
      where: { feedId_userId: { feedId, userId } },
    });

    if (likes) throw new ConflictException('Already liked');

    const result = await Promise.all([
      this.prisma.feeds.update({
        where: { id: feedId },
        select: { likeCounts: true },
        data: { likeCounts: { increment: 1 } },
      }),
      this.prisma.feedLikes.create({
        data: { feedId, userId },
      }),
    ]);

    return result[0];
  }

  async unlikeFeed(feedId: number, userId: string): Promise<void> {
    await this.prisma.feedLikes.delete({
      where: { feedId_userId: { feedId, userId } },
    });

    await this.prisma.feeds.update({
      where: { id: feedId },
      select: { likeCounts: true },
      data: { likeCounts: { decrement: 1 } },
    });
  }

  async getMyFeeds(
    userId: string,
    dto: GetFeedsRequestQueryDto,
  ): Promise<GetFeedsResponseDto> {
    return this.prisma.feeds.findMany({
      where: { owner: userId },
      select: this.prisma.feedSelect,
      take: dto.limit,
      skip: dto.lastId ? 1 : 0,
      orderBy: { id: 'desc' },
      ...(dto.lastId && { cursor: { id: dto.lastId } }),
    });
  }

  async getMyFeedsCounts(userId: string): Promise<GetCountsResponseDto> {
    const count = await this.prisma.feeds.count({
      where: { owner: userId },
    });
    return { count };
  }

  async getMyComments(
    dto: GetCommentsRequestQueryDto,
    owner: string,
  ): Promise<GetCommentsResponseDto> {
    return this.prisma.comments.findMany({
      where: { owner },
      select: this.prisma.commentSelect,
      take: dto.limit,
      skip: dto.lastId ? 1 : 0,
      orderBy: { id: 'desc' },
      ...(dto.lastId && { cursor: { id: dto.lastId } }),
    });
  }

  async getMyCommentsCounts(owner: string): Promise<GetCountsResponseDto> {
    const count = await this.prisma.comments.count({ where: { owner } });
    return { count };
  }
}
