import { typesenseClient, LISTINGS_COLLECTION } from '@/lib/typesense';
import { qdrantClient, LISTINGS_VECTORS_COLLECTION } from '@/lib/qdrant';
import { generateEmbedding } from './ai.service';
import { searchCache, hashSearchParams } from './cache.service';
import db from '@/lib/db';
import type { ISearchParams, ISearchResult, IListingSummary } from '@/types';

export async function searchListings(params: ISearchParams): Promise<ISearchResult> {
  const hash = hashSearchParams(params as Record<string, unknown>);
  const cached = await searchCache.get(hash);
  if (cached) return cached as ISearchResult;

  try {
    const result = await typesenseSearch(params);
    await searchCache.set(hash, result);
    return result;
  } catch {
    // Fallback to DB when Typesense is unavailable (e.g. empty index, not running)
    return dbSearchFallback(params);
  }
}

async function dbSearchFallback(params: ISearchParams): Promise<ISearchResult> {
  const limit = params.limit ?? 20;
  const orderBy = params.sortBy === 'price_asc' ? { pricePerNight: 'asc' as const } :
    params.sortBy === 'price_desc' ? { pricePerNight: 'desc' as const } :
    params.sortBy === 'newest' ? { createdAt: 'desc' as const } :
    { avgRating: 'desc' as const };

  const priceFilter: { gte?: number; lte?: number } = {};
  if (params.minPrice !== undefined) priceFilter.gte = params.minPrice;
  if (params.maxPrice !== undefined) priceFilter.lte = params.maxPrice;

  const where = {
    status: 'active' as const,
    deletedAt: null as null,
    ...(params.city && { city: params.city }),
    ...(params.type && { type: params.type }),
    ...(Object.keys(priceFilter).length > 0 && { pricePerNight: priceFilter }),
    ...(params.minRating !== undefined && { avgRating: { gte: params.minRating } }),
  };

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      take: limit,
      orderBy,
      include: { images: { where: { isPrimary: true }, take: 1 } },
    }),
    db.listing.count({ where }),
  ]);

  return {
    listings: listings.map(l => ({
      id: l.id,
      title: l.title,
      type: l.type as 'apartment',
      pricePerNight: Number(l.pricePerNight),
      currency: l.currency,
      city: l.city,
      lat: Number(l.lat),
      lng: Number(l.lng),
      avgRating: Number(l.avgRating),
      totalReviews: l.totalReviews,
      primaryImage: l.images[0]?.url ?? null,
    })),
    total,
    facets: { cities: [], types: [], priceRanges: [] },
    cursor: undefined,
  };
}

export async function semanticSearch(query: string, filters: Partial<ISearchParams>): Promise<IListingSummary[]> {
  const embedding = await generateEmbedding(query);

  const qdrantResults = await qdrantClient.search(LISTINGS_VECTORS_COLLECTION, {
    vector: embedding,
    limit: filters.limit ?? 20,
    with_payload: true,
    filter: buildQdrantFilter(filters),
    score_threshold: 0.6,
  });

  const listingIds = qdrantResults.map(r => r.payload?.listingId as string).filter(Boolean);

  if (listingIds.length === 0) return [];

  const listings = await db.listing.findMany({
    where: { id: { in: listingIds }, status: 'active', deletedAt: null },
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });

  // Preserve Qdrant ranking order
  return listingIds
    .map(id => listings.find(l => l.id === id))
    .filter(Boolean)
    .map(l => ({
      id: l!.id,
      title: l!.title,
      type: l!.type as 'apartment',
      pricePerNight: Number(l!.pricePerNight),
      currency: l!.currency,
      city: l!.city,
      lat: Number(l!.lat),
      lng: Number(l!.lng),
      avgRating: Number(l!.avgRating),
      totalReviews: l!.totalReviews,
      primaryImage: l!.images[0]?.url ?? null,
    }));
}

export async function nearbySearch(
  lat: number,
  lng: number,
  radiusKm: number,
  limit = 20
): Promise<IListingSummary[]> {
  const radians = radiusKm / 6371;

  const listings = await db.$queryRaw<{ id: string; distance: number }[]>`
    SELECT id,
      (6371 * acos(
        cos(radians(${lat})) * cos(radians(CAST(lat AS float))) *
        cos(radians(CAST(lng AS float)) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(CAST(lat AS float)))
      )) AS distance
    FROM listings
    WHERE status = 'active'
      AND deleted_at IS NULL
      AND (6371 * acos(
        cos(radians(${lat})) * cos(radians(CAST(lat AS float))) *
        cos(radians(CAST(lng AS float)) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(CAST(lat AS float)))
      )) < ${radiusKm}
    ORDER BY distance ASC
    LIMIT ${limit}
  `;

  if (listings.length === 0) return [];

  const fullListings = await db.listing.findMany({
    where: { id: { in: listings.map(l => l.id) } },
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });

  return listings.map(({ id }) => {
    const l = fullListings.find(fl => fl.id === id)!;
    return {
      id: l.id, title: l.title, type: l.type as 'apartment',
      pricePerNight: Number(l.pricePerNight), currency: l.currency,
      city: l.city, lat: Number(l.lat), lng: Number(l.lng),
      avgRating: Number(l.avgRating), totalReviews: l.totalReviews,
      primaryImage: l.images[0]?.url ?? null,
    };
  });
}

// ─── TYPESENSE HELPERS ────────────────────────────────────────────────────────

async function typesenseSearch(params: ISearchParams): Promise<ISearchResult> {
  const searchParameters = {
    q: params.q ?? '*',
    query_by: 'title,description',
    filter_by: buildTypesenseFilter(params),
    sort_by: buildTypesenseSort(params.sortBy),
    per_page: params.limit ?? 20,
    page: 1,
    facet_by: 'city,type,pricePerNight',
    max_facet_values: 20,
  };

  const result = await typesenseClient
    .collections(LISTINGS_COLLECTION)
    .documents()
    .search(searchParameters);

  return {
    listings: (result.hits ?? []).map(hit => hit.document as unknown as IListingSummary),
    total: result.found,
    facets: parseFacets(result.facet_counts ?? []),
    cursor: undefined,
  };
}

function buildTypesenseFilter(params: ISearchParams): string {
  const filters: string[] = ['status:=active'];

  if (params.city) filters.push(`city:=${params.city}`);
  if (params.type) filters.push(`type:=${params.type}`);
  if (params.minPrice !== undefined) filters.push(`pricePerNight:>=${params.minPrice}`);
  if (params.maxPrice !== undefined) filters.push(`pricePerNight:<=${params.maxPrice}`);
  if (params.minRating !== undefined) filters.push(`avgRating:>=${params.minRating}`);
  if (params.bedrooms !== undefined) filters.push(`bedrooms:=${params.bedrooms}`);
  if (params.maxGuests !== undefined) filters.push(`maxGuests:>=${params.maxGuests}`);
  if (params.features && params.features.length > 0) {
    filters.push(`features:=[${params.features.join(',')}]`);
  }
  if (params.lat !== undefined && params.lng !== undefined && params.radiusKm !== undefined) {
    filters.push(`(lat:>=${params.lat - 0.5} && lat:<=${params.lat + 0.5})`);
  }

  return filters.join(' && ');
}

function buildTypesenseSort(sortBy?: string): string {
  const sorts: Record<string, string> = {
    price_asc:  'pricePerNight:asc',
    price_desc: 'pricePerNight:desc',
    rating:     'avgRating:desc',
    newest:     'createdAt:desc',
  };
  return sorts[sortBy ?? ''] ?? 'avgRating:desc';
}

function parseFacets(facetCounts: { field_name: string; counts: { value: string; count: number }[] }[]) {
  const cities = facetCounts.find(f => f.field_name === 'city')?.counts ?? [];
  const types = facetCounts.find(f => f.field_name === 'type')?.counts ?? [];

  return {
    cities: cities.map(c => ({ value: c.value, count: c.count })),
    types: types.map(t => ({ value: t.value, count: t.count })),
    priceRanges: [],
  };
}

function buildQdrantFilter(filters: Partial<ISearchParams>) {
  if (!filters.city) return undefined;
  return {
    must: [{ key: 'city', match: { value: filters.city } }],
  };
}

// Wrapper for components using search({ sortBy, perPage })
export const searchService = {
  search: (params: { sortBy?: string; perPage?: number } & Partial<ISearchParams>) =>
    searchListings({ ...params, limit: params.perPage ?? params.limit ?? 20 }),
};
