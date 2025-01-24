import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  constructor(private readonly config: ConfigService) {}

  private readonly s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: this.config.get('AWS_DEFAULT_REGION') || 'ap-northeast-2',
    secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
    accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
  });

  private readonly s3DefaultBucket = 'gym-in-images';
  private readonly signedUrlDefaultExpires = 1000 * 60 * 3;

  makePutImagePreSignedUrl(
    key: string,
    bucket = this.s3DefaultBucket,
    expires = this.signedUrlDefaultExpires,
  ): string {
    return this.s3.getSignedUrl('putObject', {
      Bucket: bucket,
      Key: key,
      Expires: expires,
    });
  }
}
