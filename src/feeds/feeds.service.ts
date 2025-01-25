import { S3Service } from '@libs/s3';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import {
  PostFeedsRequestBodyDto,
  PostFeedsResponseDto,
} from './dtos/post-feeds.dto';
import {
  GetCommentsRequestQueryDto,
  GetFeedResponseDto,
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
    return this.prisma.comments.create({
      data: { feedId, owner, content },
      select: this.prisma.commentSelect,
    });
  }

  async getComments(dto: GetCommentsRequestQueryDto, feedId: number) {
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
    await this.prisma.comments.delete({
      where: { id: commentId, feedId, owner },
    });
  }

  async likeFeed(
    feedId: number,
    userId: string,
  ): Promise<PostFeedLikesResponseDto> {
    const likes = await this.prisma.feedLikes.findUnique({
      where: { feedId_userId: { feedId, userId } },
    });

    if (likes) throw new ConflictException('Already liked');

    return this.prisma.feeds.update({
      where: { id: feedId },
      select: { likeCounts: true },
      data: { likeCounts: { increment: 1 } },
    });
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
}
