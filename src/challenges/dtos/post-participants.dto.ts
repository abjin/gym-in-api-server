import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class PostParticipantsRequestBodyDto {
  @ApiProperty({
    description: '목표 일수',
    type: Number,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  goalDays: number;
}
