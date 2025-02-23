import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { ExerciseDto } from './create-attendance.dto';

export class UpdateExercisesRequestDto {
  @ApiProperty({ description: '운동 목록', type: [ExerciseDto] })
  @IsArray()
  exercises: ExerciseDto[];
}

export class UpdateExercisesResponseDto {
  @ApiProperty({ description: '운동 목록', type: [ExerciseDto] })
  exercises: ExerciseDto[];
}
