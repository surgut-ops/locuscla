import { z } from 'zod';

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(['user', 'host']).default('user'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ─── LISTINGS ─────────────────────────────────────────────────────────────────

export const createListingSchema = z.object({
  title: z.string().min(10).max(255),
  description: z.string().min(50),
  type: z.enum(['apartment', 'house', 'room', 'studio']),
  pricePerNight: z.number().positive().max(1_000_000),
  currency: z.string().length(3).default('RUB'),
  maxGuests: z.number().int().min(1).max(50),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(20),
  areaM2: z.number().positive().optional(),
  address: z.string().min(5),
  city: z.string().min(1).max(100),
  country: z.string().default('Russia'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  features: z.array(z.string()).default([]),
});

export const updateListingSchema = createListingSchema.partial();

export const listingStatusSchema = z.object({
  status: z.enum(['draft', 'pending', 'active', 'paused']),
});

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

export const createBookingSchema = z.object({
  listingId: z.string().uuid(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  guests: z.number().int().min(1),
});

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  listingId: z.string().uuid().optional(),
  recipientId: z.string().uuid().optional(),
  content: z.string().min(1).max(5000),
  attachmentUrl: z.string().url().optional(),
});

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(2000),
});

// ─── SEARCH ───────────────────────────────────────────────────────────────────

export const searchSchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  type: z.enum(['apartment', 'house', 'room', 'studio']).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  bedrooms: z.coerce.number().int().optional(),
  maxGuests: z.coerce.number().int().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().positive().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// ─── AI ───────────────────────────────────────────────────────────────────────

export const aiImproveListingSchema = z.object({
  listingId: z.string().uuid(),
});

export const aiPriceAnalysisSchema = z.object({
  listingId: z.string().uuid(),
});

// ─── REPORTS ──────────────────────────────────────────────────────────────────

export const createReportSchema = z.object({
  listingId: z.string().uuid(),
  reason: z.enum(['scam', 'inappropriate_content', 'wrong_information', 'duplicate', 'other']),
  description: z.string().max(1000).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
