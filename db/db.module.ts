import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter } from './prisma-exception.filter';
import { RedisConfig } from './redis.service';
import { RedisModule } from '@nestjs-modules/ioredis';

@Global()
@Module({
  imports: [RedisModule.forRootAsync(RedisConfig)],
  providers: [
    PrismaService,
    { provide: APP_FILTER, useClass: PrismaClientExceptionFilter },
  ],
  exports: [PrismaService],
})
export class DbModule {}
