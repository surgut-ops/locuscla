// Centralized AI service — all OpenAI calls go through here.
// No component or route calls OpenAI directly.

import openai from '@/lib/openai';
import db from '@/lib/db';
import { aiPriceCache, aiImprovementCache } from './cache.service';
import type { IAiListingEnhancement, IAiPriceAnalysis, IAiFraudAnalysis } from '@/types';
import { NotFoundError } from '@/lib/errors';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const COMPLETION_MODEL = 'gpt-4o-mini';

// ─── LISTING ENHANCEMENT ──────────────────────────────────────────────────────

export async function improveListing(listingId: string): Promise<IAiListingEnhancement> {
  const listing = await db.listing.findUnique({
    where: { id: listingId, deletedAt: null },
    include: { features: true },
  });

  if (!listing) throw new NotFoundError('Listing');

  const inputHash = Buffer.from(`${listing.title}|${listing.description}|${listing.city}`).toString('base64url');
  const cached = await aiImprovementCache.get(inputHash);
  if (cached) return cached as IAiListingEnhancement;

  const featureList = listing.features.map(f => f.feature).join(', ');
  const truncatedDesc = listing.description.slice(0, 1000);

  const response = await openai.chat.completions.create({
    model: COMPLETION_MODEL,
    max_tokens: 600,
    messages: [
      {
        role: 'system',
        content: `You are a professional Russian real estate copywriter. Improve rental listings to maximize bookings.
Return JSON only with keys: title, description, seoDescription, tags (array of 5 strings).
Rules: keep Russian tone, be specific, highlight best features, avoid generic phrases.`,
      },
      {
        role: 'user',
        content: `Listing type: ${listing.type}
City: ${listing.city}
Current title: ${listing.title}
Current description: ${truncatedDesc}
Features: ${featureList}
Price: ${listing.pricePerNight} ${listing.currency}/night`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const raw = JSON.parse(response.choices[0].message.content ?? '{}');
  const result: IAiListingEnhancement = {
    title: raw.title ?? listing.title,
    description: raw.description ?? listing.description,
    seoDescription: raw.seoDescription ?? '',
    tags: raw.tags ?? [],
  };

  await aiImprovementCache.set(inputHash, result);
  return result;
}

// ─── PRICE ANALYSIS ───────────────────────────────────────────────────────────

export async function analyzePricing(listingId: string): Promise<IAiPriceAnalysis> {
  const cached = await aiPriceCache.get(listingId);
  if (cached) return cached as IAiPriceAnalysis;

  const listing = await db.listing.findUnique({
    where: { id: listingId, deletedAt: null },
  });

  if (!listing) throw new NotFoundError('Listing');

  // Get market context from analytics
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 90);

  const marketData = await db.listing.aggregate({
    where: {
      city: listing.city,
      type: listing.type,
      status: 'active',
      deletedAt: null,
      id: { not: listingId },
    },
    _avg: { pricePerNight: true },
    _min: { pricePerNight: true },
    _max: { pricePerNight: true },
    _count: true,
  });

  const marketAvg = Number(marketData._avg.pricePerNight ?? listing.pricePerNight);

  const response = await openai.chat.completions.create({
    model: COMPLETION_MODEL,
    max_tokens: 400,
    messages: [
      {
        role: 'system',
        content: `You are a real estate pricing expert for Russian rental market.
Return JSON only with keys: suggestedPrice (number), confidence (low|medium|high), reasoning (string, max 100 words), seasonalTips (string, max 50 words).`,
      },
      {
        role: 'user',
        content: `Listing: ${listing.type} in ${listing.city}
Bedrooms: ${listing.bedrooms}, Area: ${listing.areaM2 ?? 'unknown'}m²
Current price: ${listing.pricePerNight} ${listing.currency}/night
Market average in same city+type: ${marketAvg} ${listing.currency}/night
Market listings: ${marketData._count} comparable listings
Market range: ${marketData._min.pricePerNight} - ${marketData._max.pricePerNight}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const raw = JSON.parse(response.choices[0].message.content ?? '{}');
  const result: IAiPriceAnalysis = {
    suggestedPrice: raw.suggestedPrice ?? marketAvg,
    currentPrice: Number(listing.pricePerNight),
    confidence: raw.confidence ?? 'medium',
    reasoning: raw.reasoning ?? '',
    seasonalTips: raw.seasonalTips ?? '',
    marketAvg,
  };

  await aiPriceCache.set(listingId, result);

  // Store suggestion in listing record
  await db.listing.update({
    where: { id: listingId },
    data: {
      aiPriceSuggestion: result.suggestedPrice,
      aiLastAnalyzedAt: new Date(),
    },
  });

  return result;
}

// ─── FRAUD DETECTION ──────────────────────────────────────────────────────────

export async function detectFraud(listingId: string): Promise<IAiFraudAnalysis> {
  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { images: true, host: { include: { profile: true } } },
  });

  if (!listing) throw new NotFoundError('Listing');

  // Check for duplicate descriptions
  const similarCount = await db.listing.count({
    where: {
      city: listing.city,
      description: { contains: listing.description.slice(0, 100) },
      id: { not: listingId },
      deletedAt: null,
    },
  });

  // Get market avg for price anomaly check
  const marketData = await db.listing.aggregate({
    where: {
      city: listing.city,
      type: listing.type,
      status: 'active',
      deletedAt: null,
      id: { not: listingId },
    },
    _avg: { pricePerNight: true },
  });

  const marketAvg = Number(marketData._avg.pricePerNight ?? 0);
  const currentPrice = Number(listing.pricePerNight);
  const riskFlags: string[] = [];

  if (similarCount > 0) riskFlags.push('Duplicate description detected');
  if (marketAvg > 0 && currentPrice < marketAvg * 0.3) riskFlags.push('Price suspiciously low (< 30% of market avg)');
  if (listing.images.length === 0) riskFlags.push('No photos uploaded');
  if (listing.description.length < 100) riskFlags.push('Very short description');
  if (!listing.host.emailVerified) riskFlags.push('Host email not verified');

  const response = await openai.chat.completions.create({
    model: COMPLETION_MODEL,
    max_tokens: 200,
    messages: [
      {
        role: 'system',
        content: `You are a fraud detection system for a rental marketplace. Return JSON only with: riskScore (0-100 integer), recommendation (approve|review|reject).`,
      },
      {
        role: 'user',
        content: `Listing analysis:
Title: ${listing.title}
Risk flags: ${riskFlags.join('; ') || 'none'}
Similar listings count: ${similarCount}
Host verified: ${listing.host.emailVerified}
Images count: ${listing.images.length}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const raw = JSON.parse(response.choices[0].message.content ?? '{}');

  return {
    riskScore: raw.riskScore ?? riskFlags.length * 20,
    riskFlags,
    recommendation: raw.recommendation ?? (riskFlags.length >= 3 ? 'review' : 'approve'),
  };
}

// ─── EMBEDDINGS ───────────────────────────────────────────────────────────────

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.slice(0, 8000), // Token limit safety
  });
  return response.data[0].embedding;
}

export async function generateListingEmbedding(listingId: string): Promise<number[]> {
  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { features: true },
  });

  if (!listing) throw new NotFoundError('Listing');

  const text = [
    listing.title,
    listing.description,
    listing.city,
    listing.type,
    listing.features.map(f => f.feature).join(' '),
  ].join(' ');

  return generateEmbedding(text);
}

// ─── RECOMMENDATIONS ─────────────────────────────────────────────────────────

export async function getPersonalizedRecommendations(
  userId: string,
  limit = 10
): Promise<string[]> {
  // Get user's booking history for collaborative filtering
  const userBookings = await db.booking.findMany({
    where: { guestId: userId, status: 'completed' },
    include: { listing: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  if (userBookings.length === 0) {
    // Cold start: return popular listings
    const popular = await db.listing.findMany({
      where: { status: 'active', deletedAt: null },
      orderBy: [{ avgRating: 'desc' }, { totalBookings: 'desc' }],
      take: limit,
      select: { id: true },
    });
    return popular.map(l => l.id);
  }

  // Use city preference from history
  const cities = userBookings.map(b => b.listing.city);
  const preferredCity = cities.sort((a, b) =>
    cities.filter(v => v === a).length - cities.filter(v => v === b).length
  ).pop()!;

  const recommendations = await db.listing.findMany({
    where: {
      status: 'active',
      deletedAt: null,
      city: preferredCity,
      id: { notIn: userBookings.map(b => b.listingId) },
    },
    orderBy: [{ avgRating: 'desc' }, { totalBookings: 'desc' }],
    take: limit,
    select: { id: true },
  });

  return recommendations.map(l => l.id);
}
