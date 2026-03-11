// Worker: Generate embeddings and sync to Qdrant
// Schedule: Daily 04:00 UTC (Vercel Hobby — once/day)

import db from '@/lib/db';
import { qdrantClient, LISTINGS_VECTORS_COLLECTION, ensureListingsVectorsCollection } from '@/lib/qdrant';
import { generateListingEmbedding } from '@/services/ai.service';

async function syncListingsToQdrant(): Promise<void> {
  await ensureListingsVectorsCollection();

  const cutoff = new Date(Date.now() - 15 * 60 * 1000);
  const listings = await db.listing.findMany({
    where: { status: 'active', deletedAt: null, updatedAt: { gte: cutoff } },
    select: { id: true, city: true, pricePerNight: true, avgRating: true, type: true },
  });

  if (listings.length === 0) {
    console.info('Qdrant sync: no updates');
    return;
  }

  for (const listing of listings) {
    try {
      const vector = await generateListingEmbedding(listing.id);
      await qdrantClient.upsert(LISTINGS_VECTORS_COLLECTION, {
        wait: false,
        points: [{
          id: listing.id,
          vector,
          payload: {
            listingId: listing.id,
            city: listing.city,
            pricePerNight: Number(listing.pricePerNight),
            avgRating: Number(listing.avgRating),
            type: listing.type,
          },
        }],
      });
    } catch (err) {
      console.error(`Qdrant sync failed for listing ${listing.id}:`, err);
    }
  }

  console.info(`Qdrant sync: processed ${listings.length} listings`);
}

syncListingsToQdrant().catch(console.error);
