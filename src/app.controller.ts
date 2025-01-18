import { Controller, Get } from '@nestjs/common';
import { InjectRedis } from 'db/redis.service';
import Redis from 'ioredis';

@Controller()
export class AppController {
  constructor(@InjectRedis() private readonly client: Redis) {}

  @Get()
  healthCheck() {
    return { uptime: process.uptime(), ...process.memoryUsage() };
  }

  @Get('redis-ping')
  redisPingTest() {
    return this.client.ping();
  }
}
