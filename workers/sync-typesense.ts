// Worker: Sync listings from PostgreSQL to Typesense
// Schedule: Every 5 minutes (Vercel Cron)

import db from '@/lib/db';
import { typesenseClient, LISTINGS_COLLECTION, ensureListingsCollection } from '@/lib/typesense';

async function syncListingsToTypesense(): Promise<void> {
  await ensureListingsCollection();

  // Get all active listings updated in last 10 minutes
  const cutoff = new Date(Date.now() - 10 * 60 * 1000);
  const listings = await db.listing.findMany({
    where: {
      status: 'active',
      deletedAt: null,
      updatedAt: { gte: cutoff },
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      features: true,
    },
  });

  if (listings.length === 0) {
    console.info('Typesense sync: no updates');
    return;
  }

  const documents = listings.map(l => ({
    id: l.id,
    title: l.title,
    description: l.description.slice(0, 500),
    city: l.city,
    type: l.type,
    pricePerNight: Number(l.pricePerNight),
    avgRating: Number(l.avgRating),
    bedrooms: l.bedrooms,
    maxGuests: l.maxGuests,
    lat: Number(l.lat),
    lng: Number(l.lng),
    features: l.features.map(f => f.feature),
    status: l.status,
    primaryImage: l.images[0]?.url ?? '',
    createdAt: Math.floor(l.createdAt.getTime() / 1000),
  }));

  await typesenseClient
    .collections(LISTINGS_COLLECTION)
    .documents()
    .import(documents, { action: 'upsert' });

  console.info(`Typesense sync: upserted ${documents.length} listings`);
}

// Full re-index (run manually when needed)
export async function fullReindex(): Promise<void> {
  await ensureListingsCollection();

  const batchSize = 500;
  let cursor: string | undefined;
  let total = 0;

  while (true) {
    const listings = await db.listing.findMany({
      where: { status: 'active', deletedAt: null, ...(cursor && { id: { gt: cursor } }) },
      take: batchSize,
      orderBy: { id: 'asc' },
      include: { images: { where: { isPrimary: true }, take: 1 }, features: true },
    });

    if (listings.length === 0) break;

    const documents = listings.map(l => ({
      id: l.id, title: l.title, description: l.description.slice(0, 500),
      city: l.city, type: l.type, pricePerNight: Number(l.pricePerNight),
      avgRating: Number(l.avgRating), bedrooms: l.bedrooms, maxGuests: l.maxGuests,
      lat: Number(l.lat), lng: Number(l.lng),
      features: l.features.map(f => f.feature), status: l.status,
      primaryImage: l.images[0]?.url ?? '',
      createdAt: Math.floor(l.createdAt.getTime() / 1000),
    }));

    await typesenseClient.collections(LISTINGS_COLLECTION).documents().import(documents, { action: 'upsert' });
    total += documents.length;
    cursor = listings[listings.length - 1].id;

    if (listings.length < batchSize) break;
  }

  console.info(`Full reindex complete: ${total} listings`);
}

syncListingsToTypesense().catch(console.error);
