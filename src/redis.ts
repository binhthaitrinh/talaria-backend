import redis, { Redis } from 'ioredis';

global.redisClient = new redis(process.env.REDIS_URL || undefined);

declare global {
  namespace NodeJS {
    interface Global {
      redisClient: Redis;
    }
  }
}
