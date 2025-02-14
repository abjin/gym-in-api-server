import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ChallengeCertifications {
  @ApiProperty({ description: 'The id of the participant', type: Number })
  participantId: number;

  @ApiProperty({ description: 'The id of the user', type: String })
  userId: string;

  @Transform(({ value }) => value.toISOString().split('T')[0])
  @ApiProperty({
    description: 'The date of the certification',
    format: 'YYYY-MM-DD',
    type: String,
  })
  date: Date;

  constructor(partial: Partial<ChallengeCertifications>) {
    Object.assign(this, partial);
  }
}
