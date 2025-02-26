import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { DbModule } from 'db/db.module';
import { S3Module } from '@libs/s3';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FeedsModule } from './feeds/feeds.module';
import { ChallengesModule } from './challenges/challenges.module';
import { AttendancesModule } from './attendances/attendances.module';
import { LevelsModule } from './levels/levels.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    { ...HttpModule.register({}), global: true },
    DbModule,
    S3Module,
    AuthModule,
    UsersModule,
    FeedsModule,
    ChallengesModule,
    AttendancesModule,
    LevelsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
