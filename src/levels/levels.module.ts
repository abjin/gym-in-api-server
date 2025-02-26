import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { RankingsModule } from 'src/rankings/rankings.module';

@Module({
  imports: [RankingsModule],
  providers: [LevelsService],
  controllers: [LevelsController],
  exports: [LevelsService],
})
export class LevelsModule {}
