import Typesense from 'typesense';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

export const typesenseClient = new Typesense.Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST!,
    port: parseInt(process.env.TYPESENSE_PORT ?? '443'),
    protocol: (process.env.TYPESENSE_PROTOCOL ?? 'https') as 'https' | 'http',
  }],
  apiKey: process.env.TYPESENSE_API_KEY!,
  connectionTimeoutSeconds: 10,
  retryIntervalSeconds: 0.1,
  numRetries: 3,
});

export const LISTINGS_COLLECTION = 'listings';

export const listingsSchema: CollectionCreateSchema = {
  name: LISTINGS_COLLECTION,
  fields: [
    { name: 'id',            type: 'string' },
    { name: 'title',         type: 'string',   weight: 3 },
    { name: 'description',   type: 'string',   weight: 1 },
    { name: 'city',          type: 'string',   facet: true },
    { name: 'type',          type: 'string',   facet: true },
    { name: 'pricePerNight', type: 'float',    facet: true, sort: true },
    { name: 'avgRating',     type: 'float',    facet: true, sort: true },
    { name: 'bedrooms',      type: 'int32',    facet: true },
    { name: 'maxGuests',     type: 'int32' },
    { name: 'lat',           type: 'float' },
    { name: 'lng',           type: 'float' },
    { name: 'features',      type: 'string[]', facet: true },
    { name: 'status',        type: 'string' },
    { name: 'primaryImage',  type: 'string',   optional: true },
    { name: 'createdAt',     type: 'int64',    sort: true },
  ],
  default_sorting_field: 'avgRating',
};

export async function ensureListingsCollection(): Promise<void> {
  try {
    await typesenseClient.collections(LISTINGS_COLLECTION).retrieve();
  } catch {
    await typesenseClient.collections().create(listingsSchema);
    console.info('Created Typesense listings collection');
  }
}
