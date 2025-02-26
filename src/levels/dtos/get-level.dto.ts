import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GetLevelResponseDto {
  @ApiProperty({ description: '경험치', type: Number })
  @Expose()
  @Transform(({ obj }) => obj.totalExperiencePoint % 100)
  experiencePoint: number;

  @ApiProperty({ description: '레벨', type: Number })
  @Expose()
  @Transform(({ obj }) => Math.floor(obj.totalExperiencePoint / 100))
  level: number;

  @Exclude()
  totalExperiencePoint: number;

  constructor(partial: Partial<Users>) {
    Object.assign(this, partial);
  }
}
