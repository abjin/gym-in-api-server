import { S3Service } from '@libs/s3';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import {
  PostFeedsRequestBodyDto,
  PostFeedsResponseDto,
} from './dtos/post-feeds.dto';
import {
  GetFeedResponseDto,
  GetFeedsRequestQueryDto,
  GetFeedsResponseDto,
} from './dtos';

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
    return this.prisma.posts.create({
      data: { owner: id, content: dto.content, imageUrls: dto.imageUrls },
      select: this.prisma.postSelect,
    });
  }

  async getFeeds({
    lastId,
    limit,
  }: GetFeedsRequestQueryDto): Promise<GetFeedsResponseDto> {
    return this.prisma.posts.findMany({
      select: this.prisma.postSelect,
      take: limit,
      skip: lastId ? 1 : 0,
      orderBy: { id: 'desc' },
      ...(lastId && { cursor: { id: lastId } }),
    });
  }

  async getFeed(id: number): Promise<GetFeedResponseDto> {
    return this.prisma.posts.findFirst({
      where: { id },
      select: this.prisma.postSelect,
    });
  }

  async deleteFeed(id: number, owner: string): Promise<void> {
    await this.prisma.posts.delete({ where: { id, owner } });
  }
}
