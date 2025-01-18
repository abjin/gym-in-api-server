import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter } from './prisma-exception.filter';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    PrismaService,
    RedisService,
    { provide: APP_FILTER, useClass: PrismaClientExceptionFilter },
  ],
  exports: [PrismaService, RedisService],
})
export class DbModule {}
