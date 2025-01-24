import { S3Service } from '@libs/s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedsService {
  constructor(private readonly s3Service: S3Service) {}

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
}
