import { Redis } from '@upstash/redis';

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

export const redis: Redis = globalThis.__redis ?? new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__redis = redis;
}

export default redis;
