// ─── SHARED TYPES ─────────────────────────────────────────────────────────────
// All types are defined here and imported across the codebase.
// Never define types inline in components or services.

export type UserRole = 'user' | 'host' | 'admin';
export type ListingType = 'apartment' | 'house' | 'room' | 'studio';
export type ListingStatus = 'draft' | 'pending' | 'active' | 'paused' | 'rejected';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type ReportReason = 'scam' | 'inappropriate_content' | 'wrong_information' | 'duplicate' | 'other';
export type AnalyticsEvent = 'view' | 'click' | 'book' | 'favorite' | 'message';
export type ListingFeature =
  | 'wifi' | 'parking' | 'pool' | 'gym' | 'air_conditioning' | 'heating'
  | 'washer' | 'dryer' | 'kitchen' | 'tv' | 'elevator' | 'balcony'
  | 'garden' | 'pet_friendly' | 'smoking_allowed' | 'wheelchair_accessible';

// ─── API RESPONSE ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  error: string;
  fields?: Record<string, string>;
  requestId?: string;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  hasNext: boolean;
  cursor?: string;
}

export interface CursorPagination {
  cursor?: string;
  limit: number;
}

// ─── USER TYPES ───────────────────────────────────────────────────────────────

export interface IUser {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  avatarUrl: string | null;
  phone: string | null;
  createdAt: Date;
  profile?: IProfile;
}

export interface IProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  avgRating: number;
  totalReviews: number;
  isVerified: boolean;
  languages: string[];
  city: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
}

export interface IPublicUser {
  id: string;
  avatarUrl: string | null;
  role: UserRole;
  profile: Pick<IProfile, 'firstName' | 'lastName' | 'avgRating' | 'totalReviews' | 'isVerified'>;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ─── LISTING TYPES ────────────────────────────────────────────────────────────

export interface IListing {
  id: string;
  hostId: string;
  title: string;
  description: string;
  type: ListingType;
  status: ListingStatus;
  pricePerNight: number;
  currency: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  areaM2: number | null;
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  avgRating: number;
  totalReviews: number;
  totalBookings: number;
  aiPriceSuggestion: number | null;
  aiLastAnalyzedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  images?: IListingImage[];
  features?: ListingFeature[];
  host?: IPublicUser;
}

export interface IListingImage {
  id: string;
  listingId: string;
  url: string;
  order: number;
  isPrimary: boolean;
}

export interface IListingSummary {
  id: string;
  title: string;
  type: ListingType;
  pricePerNight: number;
  currency: string;
  city: string;
  lat: number;
  lng: number;
  avgRating: number;
  totalReviews: number;
  primaryImage: string | null;
}

// ─── BOOKING TYPES ────────────────────────────────────────────────────────────

export interface IBooking {
  id: string;
  listingId: string;
  guestId: string;
  hostId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: BookingStatus;
  totalPrice: number;
  serviceFee: number;
  stripePaymentId: string | null;
  paymentStatus: PaymentStatus;
  cancelledAt: Date | null;
  cancelReason: string | null;
  createdAt: Date;
  listing?: IListingSummary;
  guest?: IPublicUser;
}

// ─── MESSAGING TYPES ──────────────────────────────────────────────────────────

export interface IConversation {
  id: string;
  listingId: string | null;
  lastMessageAt: Date;
  isArchived: boolean;
  participants: IPublicUser[];
  lastMessage?: IMessage;
  listing?: IListingSummary;
}

export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachmentUrl: string | null;
  isRead: boolean;
  createdAt: Date;
  sender?: IPublicUser;
}

// ─── REVIEW TYPES ─────────────────────────────────────────────────────────────

export interface IReview {
  id: string;
  listingId: string;
  bookingId: string;
  authorId: string;
  rating: number;
  comment: string;
  reply: string | null;
  createdAt: Date;
  author?: IPublicUser;
}

// ─── ANALYTICS TYPES ──────────────────────────────────────────────────────────

export interface IAnalyticsDaily {
  id: string;
  listingId: string;
  date: Date;
  views: number;
  uniqueViews: number;
  bookings: number;
  revenue: number;
  avgRating: number | null;
}

export interface IHostDashboardStats {
  totalViews: number;
  conversionRate: number;
  totalRevenue: number;
  occupancyRate: number;
  avgRating: number;
  activeListings: number;
  pendingBookings: number;
  revenueByWeek: { week: string; revenue: number }[];
  topListings: { id: string; title: string; views: number; bookings: number }[];
}

// ─── AI TYPES ─────────────────────────────────────────────────────────────────

export interface IAiListingEnhancement {
  title: string;
  description: string;
  seoDescription: string;
  tags: string[];
}

export interface IAiPriceAnalysis {
  suggestedPrice: number;
  currentPrice: number;
  confidence: 'low' | 'medium' | 'high';
  reasoning: string;
  seasonalTips: string;
  marketAvg: number;
}

export interface IAiFraudAnalysis {
  riskScore: number;
  riskFlags: string[];
  recommendation: 'approve' | 'review' | 'reject';
}

// ─── SEARCH TYPES ─────────────────────────────────────────────────────────────

export interface ISearchParams {
  q?: string;
  city?: string;
  type?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  bedrooms?: number;
  maxGuests?: number;
  features?: ListingFeature[];
  lat?: number;
  lng?: number;
  radiusKm?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  cursor?: string;
  limit?: number;
}

export interface ISearchResult {
  listings: IListingSummary[];
  total: number;
  facets: ISearchFacets;
  cursor?: string;
}

export interface ISearchFacets {
  cities: { value: string; count: number }[];
  types: { value: string; count: number }[];
  priceRanges: { min: number; max: number; count: number }[];
}
