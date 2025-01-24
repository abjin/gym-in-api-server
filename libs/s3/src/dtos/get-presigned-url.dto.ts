import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetPresignedUrlRequestDto {
  @ApiProperty({ description: '개수', type: Number, required: false })
  @IsNumber()
  @IsOptional()
  count?: number = 1;
}

export class GetPresignedUrlResponseDto {
  @ApiProperty({ description: 'presigned-url key', type: String })
  url: string;

  @ApiProperty({ description: 'presigned-url key', type: String })
  key: string;
}
