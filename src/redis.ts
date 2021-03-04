import redis, { Redis } from "ioredis";

global.redisClient = new redis();

declare global {
  namespace NodeJS {
    interface Global {
      redisClient: Redis;
    }
  }
}
