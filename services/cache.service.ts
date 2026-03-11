// All Redis operations go through this service.
// No component or service imports Redis directly.

import redis from '@/lib/redis';

// ─── TTL CONSTANTS (seconds) ──────────────────────────────────────────────────
const TTL = {
  LISTING:          5 * 60,
  LISTINGS_CITY:    2 * 60,
  SEARCH:           1 * 60,
  USER_PROFILE:    10 * 60,
  ANALYTICS_HOST:  60 * 60,
  AI_PRICE:        24 * 60 * 60,
  AI_IMPROVEMENT:  24 * 60 * 60,
  SESSION:          7 * 24 * 60 * 60,
  RATE_LIMIT:       1 * 60,
  RECOMMENDATIONS: 60 * 60,
} as const;

// ─── KEY BUILDERS ─────────────────────────────────────────────────────────────
const keys = {
  listing:          (id: string) => `listing:${id}`,
  listingsCity:     (city: string, page: number) => `listings:city:${city}:page:${page}`,
  search:           (hash: string) => `search:${hash}`,
  userProfile:      (id: string) => `user:${id}:profile`,
  analyticsHost:    (id: string) => `analytics:host:${id}:daily`,
  aiPrice:          (listingId: string) => `ai:price:${listingId}`,
  aiImprovement:    (hash: string) => `ai:improve:${hash}`,
  session:          (token: string) => `session:${token}`,
  rateLimit:        (ip: string, route: string) => `rate-limit:${ip}:${route}`,
  recommendations:  (userId: string) => `recs:${userId}`,
};

// ─── GENERIC HELPERS ──────────────────────────────────────────────────────────

async function get<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get<T>(key);
    return value;
  } catch (err) {
    console.error(`Redis GET error [${key}]:`, err);
    return null;
  }
}

async function set<T>(key: string, value: T, ttl: number): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttl });
  } catch (err) {
    console.error(`Redis SET error [${key}]:`, err);
  }
}

async function del(...cacheKeys: string[]): Promise<void> {
  try {
    if (cacheKeys.length > 0) {
      await redis.del(...cacheKeys);
    }
  } catch (err) {
    console.error(`Redis DEL error:`, err);
  }
}

// ─── LISTING CACHE ────────────────────────────────────────────────────────────

export const listingCache = {
  get:         (id: string) => get<unknown>(keys.listing(id)),
  set:         (id: string, data: unknown) => set(keys.listing(id), data, TTL.LISTING),
  invalidate:  (id: string) => del(keys.listing(id)),
};

export const listingsCityCache = {
  get:        (city: string, page: number) => get<unknown>(keys.listingsCity(city, page)),
  set:        (city: string, page: number, data: unknown) => set(keys.listingsCity(city, page), data, TTL.LISTINGS_CITY),
  invalidate: (city: string) => {
    // Invalidate all pages for this city (pages 1-10 covers most cases)
    return del(...Array.from({ length: 10 }, (_, i) => keys.listingsCity(city, i + 1)));
  },
};

// ─── SEARCH CACHE ─────────────────────────────────────────────────────────────

export const searchCache = {
  get: (hash: string) => get<unknown>(keys.search(hash)),
  set: (hash: string, data: unknown) => set(keys.search(hash), data, TTL.SEARCH),
};

export function hashSearchParams(params: Record<string, unknown>): string {
  const sorted = Object.keys(params).sort().reduce((acc, key) => {
    if (params[key] !== undefined) acc[key] = params[key];
    return acc;
  }, {} as Record<string, unknown>);
  return Buffer.from(JSON.stringify(sorted)).toString('base64url');
}

// ─── USER CACHE ───────────────────────────────────────────────────────────────

export const userProfileCache = {
  get:        (id: string) => get<unknown>(keys.userProfile(id)),
  set:        (id: string, data: unknown) => set(keys.userProfile(id), data, TTL.USER_PROFILE),
  invalidate: (id: string) => del(keys.userProfile(id)),
};

// ─── ANALYTICS CACHE ──────────────────────────────────────────────────────────

export const analyticsHostCache = {
  get:        (hostId: string) => get<unknown>(keys.analyticsHost(hostId)),
  set:        (hostId: string, data: unknown) => set(keys.analyticsHost(hostId), data, TTL.ANALYTICS_HOST),
  invalidate: (hostId: string) => del(keys.analyticsHost(hostId)),
};

// ─── AI CACHE ────────────────────────────────────────────────────────────────

export const aiPriceCache = {
  get:  (listingId: string) => get<unknown>(keys.aiPrice(listingId)),
  set:  (listingId: string, data: unknown) => set(keys.aiPrice(listingId), data, TTL.AI_PRICE),
};

export const aiImprovementCache = {
  get:  (hash: string) => get<unknown>(keys.aiImprovement(hash)),
  set:  (hash: string, data: unknown) => set(keys.aiImprovement(hash), data, TTL.AI_IMPROVEMENT),
};

// ─── SESSION CACHE ────────────────────────────────────────────────────────────

export const sessionCache = {
  get:        (token: string) => get<{ userId: string; role: string }>(keys.session(token)),
  set:        (token: string, data: { userId: string; role: string }) => set(keys.session(token), data, TTL.SESSION),
  invalidate: (token: string) => del(keys.session(token)),
};

// ─── RATE LIMITING ────────────────────────────────────────────────────────────

export async function checkRateLimit(
  ip: string,
  route: string,
  maxRequests = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const key = keys.rateLimit(ip, route);
  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, TTL.RATE_LIMIT);
    }
    return {
      allowed: current <= maxRequests,
      remaining: Math.max(0, maxRequests - current),
    };
  } catch {
    // If Redis is down, allow the request
    return { allowed: true, remaining: maxRequests };
  }
}

// ─── RECOMMENDATIONS CACHE ────────────────────────────────────────────────────

export const recommendationsCache = {
  get:  (userId: string) => get<string[]>(keys.recommendations(userId)),
  set:  (userId: string, ids: string[]) => set(keys.recommendations(userId), ids, TTL.RECOMMENDATIONS),
};
