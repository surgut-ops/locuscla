// lib/cache.service.ts
// Centralized Redis cache layer — ALL cache operations go through this service
// Never import Redis directly anywhere else in the codebase

import { Redis } from '@upstash/redis';

// ─── Client singleton ─────────────────────────────────────────────────────────

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

// ─── TTL constants (seconds) ──────────────────────────────────────────────────

export const TTL = {
  LISTING: 5 * 60,             // 5 minutes
  LISTINGS_PAGE: 2 * 60,       // 2 minutes
  SEARCH: 60,                  // 1 minute
  USER_PROFILE: 10 * 60,       // 10 minutes
  ANALYTICS_HOST_DAILY: 60 * 60, // 1 hour
  AI_PRICE: 24 * 60 * 60,      // 24 hours
  AI_IMPROVE: 24 * 60 * 60,    // 24 hours
  SESSION: 7 * 24 * 60 * 60,   // 7 days
  RATE_LIMIT: 60,              // 1 minute
  RECOMMENDATIONS: 60 * 60,   // 1 hour
  GEO_CLUSTER: 5 * 60,        // 5 minutes
} as const;

// ─── Key builders ─────────────────────────────────────────────────────────────

export const CacheKeys = {
  listing: (id: string) => `listing:${id}`,
  listingsPage: (city: string, page: number, filters: string) =>
    `listings:city:${city}:page:${page}:${filters}`,
  search: (hash: string) => `search:${hash}`,
  userProfile: (id: string) => `user:${id}:profile`,
  hostAnalyticsDaily: (hostId: string) => `analytics:host:${hostId}:daily`,
  aiPrice: (listingId: string) => `ai:price:${listingId}`,
  aiImprove: (hash: string) => `ai:improve:${hash}`,
  session: (token: string) => `session:${token}`,
  rateLimit: (ip: string, route: string) => `rate-limit:${ip}:${route}`,
  recommendations: (userId: string) => `recommendations:${userId}`,
  geoCluster: (city: string, zoom: number) => `geo:cluster:${city}:${zoom}`,
  availability: (listingId: string, month: string) =>
    `availability:${listingId}:${month}`,
};

// ─── Generic operations ───────────────────────────────────────────────────────

async function get<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get<T>(key);
    return value;
  } catch (err) {
    console.error('[Cache] GET error:', key, err);
    return null;
  }
}

async function set<T>(key: string, value: T, ttl: number): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttl });
  } catch (err) {
    console.error('[Cache] SET error:', key, err);
  }
}

async function del(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (err) {
    console.error('[Cache] DEL error:', key, err);
  }
}

async function delPattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    console.error('[Cache] DEL pattern error:', pattern, err);
  }
}

// ─── Rate limiting (sliding window) ──────────────────────────────────────────

export async function checkRateLimit(
  ip: string,
  route: string,
  limit: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const key = CacheKeys.rateLimit(ip, route);
  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, TTL.RATE_LIMIT);
    }
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
    };
  } catch {
    // Allow request if Redis is down
    return { allowed: true, remaining: limit };
  }
}

// ─── Session management ───────────────────────────────────────────────────────

export async function setSession(token: string, userId: string): Promise<void> {
  await set(CacheKeys.session(token), userId, TTL.SESSION);
}

export async function getSession(token: string): Promise<string | null> {
  return get<string>(CacheKeys.session(token));
}

export async function deleteSession(token: string): Promise<void> {
  await del(CacheKeys.session(token));
}

// ─── Listing cache ────────────────────────────────────────────────────────────

export async function getCachedListing<T>(id: string): Promise<T | null> {
  return get<T>(CacheKeys.listing(id));
}

export async function setCachedListing<T>(id: string, data: T): Promise<void> {
  await set(CacheKeys.listing(id), data, TTL.LISTING);
}

export async function invalidateListing(id: string, city?: string): Promise<void> {
  await del(CacheKeys.listing(id));
  if (city) {
    await delPattern(`listings:city:${city}:*`);
  }
}

// ─── Search cache ─────────────────────────────────────────────────────────────

export async function getCachedSearch<T>(hash: string): Promise<T | null> {
  return get<T>(CacheKeys.search(hash));
}

export async function setCachedSearch<T>(hash: string, data: T): Promise<void> {
  await set(CacheKeys.search(hash), data, TTL.SEARCH);
}

// ─── User profile cache ───────────────────────────────────────────────────────

export async function getCachedProfile<T>(userId: string): Promise<T | null> {
  return get<T>(CacheKeys.userProfile(userId));
}

export async function setCachedProfile<T>(userId: string, data: T): Promise<void> {
  await set(CacheKeys.userProfile(userId), data, TTL.USER_PROFILE);
}

export async function invalidateProfile(userId: string): Promise<void> {
  await del(CacheKeys.userProfile(userId));
}

// ─── Analytics cache ──────────────────────────────────────────────────────────

export async function getCachedHostAnalytics<T>(hostId: string): Promise<T | null> {
  return get<T>(CacheKeys.hostAnalyticsDaily(hostId));
}

export async function setCachedHostAnalytics<T>(hostId: string, data: T): Promise<void> {
  await set(CacheKeys.hostAnalyticsDaily(hostId), data, TTL.ANALYTICS_HOST_DAILY);
}

export async function invalidateHostAnalytics(hostId: string): Promise<void> {
  await del(CacheKeys.hostAnalyticsDaily(hostId));
}

// ─── AI result cache ──────────────────────────────────────────────────────────

export async function getCachedAiPrice<T>(listingId: string): Promise<T | null> {
  return get<T>(CacheKeys.aiPrice(listingId));
}

export async function setCachedAiPrice<T>(listingId: string, data: T): Promise<void> {
  await set(CacheKeys.aiPrice(listingId), data, TTL.AI_PRICE);
}

export async function getCachedAiImprove<T>(hash: string): Promise<T | null> {
  return get<T>(CacheKeys.aiImprove(hash));
}

export async function setCachedAiImprove<T>(hash: string, data: T): Promise<void> {
  await set(CacheKeys.aiImprove(hash), data, TTL.AI_IMPROVE);
}

// ─── Recommendations cache ────────────────────────────────────────────────────

export async function getCachedRecommendations<T>(userId: string): Promise<T | null> {
  return get<T>(CacheKeys.recommendations(userId));
}

export async function setCachedRecommendations<T>(userId: string, data: T): Promise<void> {
  await set(CacheKeys.recommendations(userId), data, TTL.RECOMMENDATIONS);
}

// ─── Geo cluster cache ────────────────────────────────────────────────────────

export async function getCachedGeoCluster<T>(city: string, zoom: number): Promise<T | null> {
  return get<T>(CacheKeys.geoCluster(city, zoom));
}

export async function setCachedGeoCluster<T>(city: string, zoom: number, data: T): Promise<void> {
  await set(CacheKeys.geoCluster(city, zoom), data, TTL.GEO_CLUSTER);
}

export const cache = {
  get,
  set,
  del,
  delPattern,
  checkRateLimit,
  setSession,
  getSession,
  deleteSession,
  getCachedListing,
  setCachedListing,
  invalidateListing,
  getCachedSearch,
  setCachedSearch,
  getCachedProfile,
  setCachedProfile,
  invalidateProfile,
  getCachedHostAnalytics,
  setCachedHostAnalytics,
  invalidateHostAnalytics,
  getCachedAiPrice,
  setCachedAiPrice,
  getCachedAiImprove,
  setCachedAiImprove,
  getCachedRecommendations,
  setCachedRecommendations,
  getCachedGeoCluster,
  setCachedGeoCluster,
};
