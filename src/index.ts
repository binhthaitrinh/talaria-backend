import redis, { Redis } from 'ioredis';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'dotenv-safe/config';
import app from './app';
dotenv.config();

process.on('uncaughtException', (err: Error) => {
  console.error(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION. SHUTTING DOWN...');
  process.exit(1);
});

const DB: string = <string>(
  process.env.MONGO_URI?.replace(
    '<PASSWORD>',
    process.env.MONGO_PASSWORD as string
  )
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((_) => console.log('DB connection successful...'))
  .catch((err) => console.log(err));

const PORT = parseInt(process.env.PORT) || 4444;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error(err.name, err.message);
  console.log('UNHANDLER REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

global.redisClient = new redis(process.env.REDIS_URL || undefined);

declare global {
  namespace NodeJS {
    interface Global {
      redisClient: Redis;
    }
  }

  namespace globalThis {
    const redisClient: Redis;
  }
}
