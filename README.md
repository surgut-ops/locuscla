# LOCOS Platform

> AI-powered rental marketplace — faster than Avito, smarter than Airbnb

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, TailwindCSS |
| Backend | Next.js API Routes, TypeScript |
| Database | PostgreSQL (Neon.tech) + Prisma ORM |
| Cache | Redis (Upstash) |
| Search | Typesense Cloud |
| Vector Search | Qdrant Cloud |
| Maps | Mapbox |
| AI | OpenAI (GPT-4o-mini + text-embedding-3-small) |
| Storage | Cloudflare R2 |
| Payments | Stripe |
| Deployment | Vercel |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local
# Fill in all values in .env.local

# 3. Generate Prisma client
npm run db:generate

# 4. Run migrations
npm run db:migrate

# 5. Seed database
npm run db:seed

# 6. Start dev server
npm run dev
```

## Project Structure

```
locos-platform/
├── app/
│   ├── (public)/          # Public pages
│   ├── (auth)/            # Auth pages
│   ├── (host)/dashboard/  # Host dashboard
│   ├── (admin)/           # Admin panel
│   └── api/               # API routes (thin controllers only)
├── services/              # All business logic
│   ├── ai.service.ts
│   ├── auth.service.ts
│   ├── listing.service.ts
│   ├── booking.service.ts
│   ├── search.service.ts
│   ├── message.service.ts
│   ├── analytics.service.ts
│   ├── moderation.service.ts
│   ├── cache.service.ts
│   └── storage.service.ts
├── lib/                   # Infrastructure singletons
│   ├── db/index.ts        # Prisma client
│   ├── redis.ts           # Redis client
│   ├── openai.ts          # OpenAI client
│   ├── typesense.ts       # Typesense client
│   ├── qdrant.ts          # Qdrant client
│   ├── auth.ts            # JWT utilities
│   ├── api-client.ts      # Frontend API client
│   ├── errors.ts          # Typed error classes
│   └── validators/        # Zod schemas
├── types/                 # TypeScript interfaces
├── workers/               # Background jobs
├── features/              # Frontend feature modules
└── prisma/
    ├── schema.prisma      # Database schema
    └── seeds/             # Dev seed data
```

## Golden Rules

1. **Never duplicate business logic** — all logic lives in `services/`
2. **Never call DB from routes** — routes call services only
3. **Never use raw fetch** — always use `api` client from `lib/api-client.ts`
4. **Strict TypeScript** — no `any` types allowed
5. **Cursor pagination** — never use OFFSET queries

## API Reference

| Method | Endpoint | Auth |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | User |
| GET | /api/listings | Public |
| POST | /api/listings | Host |
| GET | /api/listings/:id | Public |
| PATCH | /api/listings/:id | Owner |
| DELETE | /api/listings/:id | Owner |
| GET | /api/search | Public |
| GET | /api/search/semantic | Public |
| GET | /api/search/nearby | Public |
| GET | /api/messages | User |
| POST | /api/messages | User |
| POST | /api/bookings | User |
| GET | /api/bookings | User |
| POST | /api/ai/improve-listing | Host |
| POST | /api/ai/price-analysis | Host |
| GET | /api/ai/recommendations | User |
| GET | /api/analytics/host | Host |
| GET | /api/admin/listings | Admin |
| PATCH | /api/admin/listings/:id/approve | Admin |
| PATCH | /api/admin/listings/:id/reject | Admin |
| GET | /api/health | Public |

## Workers

Run via Vercel Cron Jobs:

| Worker | Schedule | Purpose |
|---|---|---|
| sync-typesense | Daily 03:00 UTC | Sync listings to search index |
| sync-qdrant | Daily 04:00 UTC | Generate + sync vector embeddings |
| analytics-rollup | Daily 05:00 UTC | Aggregate analytics data |
| price-analysis | Daily 06:00 UTC | AI price recommendations |
| fraud-scan | Daily 07:00 UTC | AI fraud detection |
| expire-bookings | Daily 08:00 UTC | Cancel unpaid bookings |

## Deployment

```bash
# Deploy to Vercel
vercel --prod

# Run migrations in production
npx prisma migrate deploy
```

Set all environment variables from `.env.example` in Vercel dashboard.
