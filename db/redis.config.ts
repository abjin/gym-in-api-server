import { RedisModuleAsyncOptions } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

export const RedisConfig: RedisModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'single',
    url: config.get('REDIS_URL'),
  }),
};
