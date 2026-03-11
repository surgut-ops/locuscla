import db from '@/lib/db';
import { listingCache, listingsCityCache } from './cache.service';
import { NotFoundError, ForbiddenError } from '@/lib/errors';
import type { CreateListingInput, UpdateListingInput } from '@/lib/validators';
import type { IListing, IListingSummary, CursorPagination } from '@/types';

export async function createListing(hostId: string, input: CreateListingInput): Promise<IListing> {
  const listing = await db.listing.create({
    data: {
      hostId,
      title: input.title,
      description: input.description,
      type: input.type as 'apartment' | 'house' | 'room' | 'studio',
      pricePerNight: input.pricePerNight,
      currency: input.currency,
      maxGuests: input.maxGuests,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      areaM2: input.areaM2,
      address: input.address,
      city: input.city,
      country: input.country,
      lat: input.lat,
      lng: input.lng,
      features: {
        create: input.features.map(f => ({ feature: f as 'wifi' | 'parking' })),
      },
    },
    include: { images: true, features: true, host: { include: { profile: true } } },
  });

  return formatListing(listing);
}

export async function getListingById(id: string): Promise<IListing> {
  const cached = await listingCache.get(id);
  if (cached) return cached as IListing;

  const listing = await db.listing.findUnique({
    where: { id, deletedAt: null },
    include: {
      images: { orderBy: { order: 'asc' } },
      features: true,
      host: { include: { profile: true } },
    },
  });

  if (!listing) throw new NotFoundError('Listing');

  const formatted = formatListing(listing);
  await listingCache.set(id, formatted);
  return formatted;
}

export async function updateListing(
  id: string,
  hostId: string,
  input: UpdateListingInput
): Promise<IListing> {
  const existing = await db.listing.findUnique({ where: { id, deletedAt: null } });
  if (!existing) throw new NotFoundError('Listing');
  if (existing.hostId !== hostId) throw new ForbiddenError();

  const listing = await db.listing.update({
    where: { id },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.description && { description: input.description }),
      ...(input.pricePerNight && { pricePerNight: input.pricePerNight }),
      ...(input.maxGuests && { maxGuests: input.maxGuests }),
      ...(input.bedrooms !== undefined && { bedrooms: input.bedrooms }),
      ...(input.bathrooms !== undefined && { bathrooms: input.bathrooms }),
      ...(input.city && { city: input.city }),
      ...(input.lat && { lat: input.lat }),
      ...(input.lng && { lng: input.lng }),
    },
    include: { images: true, features: true, host: { include: { profile: true } } },
  });

  await listingCache.invalidate(id);
  await listingsCityCache.invalidate(existing.city);

  return formatListing(listing);
}

export async function deleteListing(id: string, hostId: string): Promise<void> {
  const existing = await db.listing.findUnique({ where: { id, deletedAt: null } });
  if (!existing) throw new NotFoundError('Listing');
  if (existing.hostId !== hostId) throw new ForbiddenError();

  await db.listing.update({ where: { id }, data: { deletedAt: new Date(), status: 'paused' } });
  await listingCache.invalidate(id);
  await listingsCityCache.invalidate(existing.city);
}

export async function getListings(params: {
  city?: string;
  hostId?: string;
  status?: string;
  pagination: CursorPagination;
}): Promise<{ listings: IListingSummary[]; cursor?: string; total: number }> {
  const { pagination, ...filters } = params;
  const limit = pagination.limit;

  const where = {
    deletedAt: null as null,
    ...(filters.city && { city: filters.city }),
    ...(filters.hostId && { hostId: filters.hostId }),
    ...(filters.status ? { status: filters.status as 'active' } : { status: 'active' as const }),
    ...(pagination.cursor && { id: { gt: pagination.cursor } }),
  };

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
      include: { images: { where: { isPrimary: true }, take: 1 } },
    }),
    db.listing.count({ where }),
  ]);

  const hasMore = listings.length > limit;
  const items = hasMore ? listings.slice(0, -1) : listings;

  return {
    listings: items.map(formatListingSummary),
    cursor: hasMore ? items[items.length - 1].id : undefined,
    total,
  };
}

export async function getHostListings(hostId: string): Promise<{
  listings: (IListingSummary & { status: string })[];
  cursor?: string;
  total: number;
}> {
  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where: { hostId, deletedAt: null },
      take: 51,
      orderBy: { createdAt: 'desc' },
      include: { images: { where: { isPrimary: true }, take: 1 } },
    }),
    db.listing.count({ where: { hostId, deletedAt: null } }),
  ]);
  const hasMore = listings.length > 50;
  const items = hasMore ? listings.slice(0, -1) : listings;
  return {
    listings: items.map(l => ({
      ...formatListingSummary(l as Parameters<typeof formatListingSummary>[0]),
      status: l.status.toUpperCase(),
    })),
    cursor: hasMore ? items[items.length - 1].id : undefined,
    total,
  };
}

export async function getImageUploadUrl(
  listingId: string,
  hostId: string,
  filename: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const listing = await db.listing.findUnique({ where: { id: listingId, deletedAt: null } });
  if (!listing) throw new NotFoundError('Listing');
  if (listing.hostId !== hostId) throw new ForbiddenError();

  const { getSignedUploadUrl } = await import('./storage.service');
  const key = `listings/${listingId}/${Date.now()}-${filename}`;
  return getSignedUploadUrl(key, contentType);
}

export async function addListingImage(
  listingId: string,
  hostId: string,
  url: string,
  isPrimary = false
): Promise<void> {
  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.hostId !== hostId) throw new ForbiddenError();

  const count = await db.listingImage.count({ where: { listingId } });

  await db.listingImage.create({
    data: { listingId, url, order: count, isPrimary: isPrimary || count === 0 },
  });

  await listingCache.invalidate(listingId);
}

// ─── FORMAT HELPERS ───────────────────────────────────────────────────────────

function formatListing(listing: Record<string, unknown>): IListing {
  const l = listing as {
    id: string; hostId: string; title: string; description: string;
    type: string; status: string; pricePerNight: { toNumber: () => number };
    currency: string; maxGuests: number; bedrooms: number; bathrooms: number;
    areaM2: { toNumber: () => number } | null; address: string; city: string;
    country: string; lat: { toNumber: () => number }; lng: { toNumber: () => number };
    avgRating: { toNumber: () => number }; totalReviews: number; totalBookings: number;
    aiPriceSuggestion: { toNumber: () => number } | null; aiLastAnalyzedAt: Date | null;
    createdAt: Date; updatedAt: Date;
    images?: { id: string; listingId: string; url: string; order: number; isPrimary: boolean }[];
    features?: { feature: string }[];
  };

  return {
    id: l.id,
    hostId: l.hostId,
    title: l.title,
    description: l.description,
    type: l.type as 'apartment',
    status: l.status as 'active',
    pricePerNight: l.pricePerNight.toNumber(),
    currency: l.currency,
    maxGuests: l.maxGuests,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    areaM2: l.areaM2?.toNumber() ?? null,
    address: l.address,
    city: l.city,
    country: l.country,
    lat: l.lat.toNumber(),
    lng: l.lng.toNumber(),
    avgRating: l.avgRating.toNumber(),
    totalReviews: l.totalReviews,
    totalBookings: l.totalBookings,
    aiPriceSuggestion: l.aiPriceSuggestion?.toNumber() ?? null,
    aiLastAnalyzedAt: l.aiLastAnalyzedAt,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
    images: l.images,
    features: l.features?.map(f => f.feature as 'wifi'),
  };
}

function formatListingSummary(listing: {
  id: string; title: string; type: string; pricePerNight: { toNumber: () => number };
  currency: string; city: string; lat: { toNumber: () => number }; lng: { toNumber: () => number };
  avgRating: { toNumber: () => number }; totalReviews: number;
  images?: { url: string }[];
}): IListingSummary {
  return {
    id: listing.id,
    title: listing.title,
    type: listing.type as 'apartment',
    pricePerNight: listing.pricePerNight.toNumber(),
    currency: listing.currency,
    city: listing.city,
    lat: listing.lat.toNumber(),
    lng: listing.lng.toNumber(),
    avgRating: listing.avgRating.toNumber(),
    totalReviews: listing.totalReviews,
    primaryImage: listing.images?.[0]?.url ?? null,
  };
}
