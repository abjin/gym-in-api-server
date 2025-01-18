import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const RedisService = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => new Redis(config.get('REDIS_URL')),
};

export const InjectRedis = (): ParameterDecorator => Inject(REDIS_CLIENT);
