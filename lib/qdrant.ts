import { QdrantClient } from '@qdrant/js-client-rest';

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
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
