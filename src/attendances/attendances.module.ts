import { Module } from '@nestjs/common';
import { AttendancesController } from './attendances.controller';
import { AttendancesService } from './attendances.service';
import { OpenrouterModule } from '@libs/openrouter';
import { RankingsModule } from 'src/rankings/rankings.module';
import { LevelsModule } from 'src/levels/levels.module';

@Module({
  imports: [OpenrouterModule, RankingsModule, LevelsModule],
  controllers: [AttendancesController],
  providers: [AttendancesService],
})
export class AttendancesModule {}
