# LOCOS — Database Schema Reference

## Tables

### users
Primary user accounts.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | auto-generated |
| email | VARCHAR(255) | unique, indexed |
| passwordHash | TEXT | bcrypt |
| role | ENUM | USER, HOST, ADMIN |
| emailVerified | BOOLEAN | default false |
| avatarUrl | TEXT | CDN URL |
| phone | VARCHAR(20) | optional |
| isActive | BOOLEAN | default true |
| createdAt | TIMESTAMPTZ | auto |
| updatedAt | TIMESTAMPTZ | auto |
| deletedAt | TIMESTAMPTZ | soft delete |

### profiles
Extended user info.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| userId | UUID FK | users.id, unique |
| firstName | VARCHAR(100) | |
| lastName | VARCHAR(100) | |
| bio | VARCHAR(1000) | |
| avgRating | DECIMAL(3,2) | computed |
| totalReviews | INT | counter cache |
| isVerified | BOOLEAN | identity check |
| languages | TEXT[] | array |
| city | VARCHAR(100) | |
| country | VARCHAR(100) | |
| lat | DECIMAL(10,8) | |
| lng | DECIMAL(11,8) | |

### listings
Core listing data.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hostId | UUID FK | users.id |
| title | VARCHAR(255) | indexed |
| description | TEXT | |
| type | ENUM | APARTMENT, HOUSE, ROOM, STUDIO, VILLA, HOSTEL |
| status | ENUM | DRAFT, PENDING, ACTIVE, PAUSED, REJECTED, ARCHIVED |
| pricePerNight | DECIMAL(10,2) | indexed |
| currency | VARCHAR(3) | ISO 4217 |
| maxGuests | INT | |
| bedrooms | INT | |
| bathrooms | INT | |
| areaM2 | DECIMAL(8,2) | optional |
| address | TEXT | |
| city | VARCHAR(100) | indexed |
| country | VARCHAR(100) | indexed |
| lat | DECIMAL(10,8) | GIST indexed |
| lng | DECIMAL(11,8) | GIST indexed |
| avgRating | DECIMAL(3,2) | counter cache |
| totalReviews | INT | counter cache |
| totalBookings | INT | counter cache |
| aiPriceSuggestion | DECIMAL(10,2) | from price-analysis worker |
| aiRiskScore | SMALLINT | 0-100, fraud score |
| aiRiskFlags | TEXT[] | fraud flag names |
| aiLastAnalyzedAt | TIMESTAMPTZ | last AI run |
| seoTitle | VARCHAR(70) | |
| seoDescription | VARCHAR(160) | |
| typesenseSyncedAt | TIMESTAMPTZ | sync tracking |
| qdrantSyncedAt | TIMESTAMPTZ | sync tracking |
| deletedAt | TIMESTAMPTZ | soft delete |

### bookings

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| listingId | UUID FK | |
| guestId | UUID FK | |
| hostId | UUID FK | |
| checkIn | DATE | indexed |
| checkOut | DATE | indexed |
| nights | INT | computed |
| guests | INT | |
| status | ENUM | PENDING, CONFIRMED, CANCELLED, COMPLETED, REFUNDED |
| totalPrice | DECIMAL(10,2) | |
| pricePerNight | DECIMAL(10,2) | snapshot |
| serviceFee | DECIMAL(10,2) | 12% commission |
| paymentStatus | ENUM | UNPAID, PAID, REFUNDED |
| stripePaymentId | TEXT | |
| expiresAt | TIMESTAMPTZ | 15min for unpaid |

### Key Indexes

```sql
-- Geo search
CREATE INDEX listings_geo ON listings USING GIST (point(lat, lng));

-- City + status filter (most common query)
CREATE INDEX listings_city_status ON listings (city, status, deleted_at);

-- Price range
CREATE INDEX listings_price ON listings (price_per_night);

-- Booking availability check
CREATE INDEX bookings_availability ON bookings (listing_id, check_in, check_out);

-- Analytics time-series
CREATE INDEX analytics_daily_listing_date ON analytics_daily (listing_id, date);
```
