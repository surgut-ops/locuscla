import { QdrantClient } from '@qdrant/js-client-rest';

// Placeholders for build when env vars are missing. Set in Vercel for production.
const qdrantUrl = process.env.QDRANT_URL || 'https://placeholder.qdrant.io';
const qdrantApiKey = process.env.QDRANT_API_KEY || 'build-placeholder';

export const qdrantClient = new QdrantClient({
  url: qdrantUrl,
  apiKey: qdrantApiKey,
});

export const LISTINGS_VECTORS_COLLECTION = 'listings_vectors';
export const VECTOR_SIZE = 1536; // OpenAI text-embedding-3-small

export async function ensureListingsVectorsCollection(): Promise<void> {
  const collections = await qdrantClient.getCollections();
  const exists = collections.collections.some(c => c.name === LISTINGS_VECTORS_COLLECTION);

  if (!exists) {
    await qdrantClient.createCollection(LISTINGS_VECTORS_COLLECTION, {
      vectors: {
        size: VECTOR_SIZE,
        distance: 'Cosine',
      },
      optimizers_config: {
        default_segment_number: 4,
      },
      replication_factor: 2,
    });

    await qdrantClient.createPayloadIndex(LISTINGS_VECTORS_COLLECTION, {
      field_name: 'city',
      field_schema: 'keyword',
    });

    console.info('Created Qdrant listings_vectors collection');
  }
}
