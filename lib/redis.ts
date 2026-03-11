import { Redis } from '@upstash/redis';

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

// Placeholders for build when env vars are missing. Set REDIS_URL + REDIS_TOKEN in Vercel for production.
const redisUrl = process.env.REDIS_URL || 'https://placeholder.upstash.io';
const redisToken = process.env.REDIS_TOKEN || 'build-placeholder';

export const redis: Redis = globalThis.__redis ?? new Redis({
  url: redisUrl,
  token: redisToken,
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__redis = redis;
}

export default redis;
