# LOCOS — Local Development & Validation Guide

This document is the **single source of truth** for running LOCOS locally.  
Follow every step in order. Do not skip steps.

---

## Prerequisites

Before starting, confirm you have these installed:

```bash
node --version    # Must be 18.17+ (LTS recommended: 20.x)
npm --version     # Must be 9+
git --version     # Any recent version
psql --version    # PostgreSQL 15 or 16 client
```

Install Node.js if needed: https://nodejs.org/en/download

---

## Step 1 — Clone the project

```bash
git clone https://github.com/your-org/locos-platform.git
cd locos-platform
```

---

## Step 2 — Install dependencies

```bash
npm install
```

This installs all packages from `package.json` including:
- Next.js 14, React 18, Tailwind CSS
- Prisma ORM, Zod, bcryptjs, jose
- Typesense, Qdrant, OpenAI, Upstash Redis SDK
- AWS SDK (for Cloudflare R2), Stripe, nodemailer

Expected output: `added N packages`  
If you see errors, check your Node.js version first.

---

## Step 3 — Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` in your editor and fill in values.

### Minimum required to start the dev server:

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `DATABASE_URL_DIRECT` | Same as above (without pgbouncer param for local) |
| `REDIS_URL` | Upstash console → your database → REST URL |
| `REDIS_TOKEN` | Upstash console → your database → REST Token |
| `NEXTAUTH_SECRET` | Run: `openssl rand -hex 32` |
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| `TYPESENSE_HOST` | Typesense Cloud dashboard |
| `TYPESENSE_API_KEY` | Typesense Cloud dashboard → API Keys |
| `QDRANT_URL` | Qdrant Cloud dashboard |
| `QDRANT_API_KEY` | Qdrant Cloud dashboard → API Keys |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | https://account.mapbox.com/access-tokens |

### Free-tier service setup (15 minutes):

**PostgreSQL (local)**
```bash
# macOS with Homebrew:
brew install postgresql@16
brew services start postgresql@16
createdb locos_dev

# Or use Docker:
docker run -d \
  --name locos-postgres \
  -e POSTGRES_DB=locos_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16

# Connection string for .env.local:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/locos_dev"
# DATABASE_URL_DIRECT="postgresql://postgres:postgres@localhost:5432/locos_dev"
```

**Redis (Upstash free tier)**
1. Go to https://console.upstash.com
2. Create a new Redis database (free tier, region closest to you)
3. Copy REST URL → `REDIS_URL`
4. Copy REST Token → `REDIS_TOKEN`

**Typesense (local Docker — simplest for dev)**
```bash
docker run -d \
  --name locos-typesense \
  -p 8108:8108 \
  -v /tmp/typesense-data:/data \
  typesense/typesense:0.25.2 \
  --data-dir /data \
  --api-key=local-typesense-key \
  --enable-cors

# Then set in .env.local:
# TYPESENSE_HOST="localhost"
# TYPESENSE_PORT="8108"
# TYPESENSE_PROTOCOL="http"
# TYPESENSE_API_KEY="local-typesense-key"
```

**Qdrant (local Docker)**
```bash
docker run -d \
  --name locos-qdrant \
  -p 6333:6333 \
  qdrant/qdrant

# Then set in .env.local:
# QDRANT_URL="http://localhost:6333"
# QDRANT_API_KEY=""   (leave blank for local)
```

---

## Step 4 — Set up the database (Prisma)

### 4a. Generate the Prisma client

This generates TypeScript types from `prisma/schema.prisma`:

```bash
npm run db:generate
```

Expected output:
```
✔ Generated Prisma Client (v5.x.x) to ./node_modules/@prisma/client
```

### 4b. Run migrations

Creates all tables, indexes, and constraints in your PostgreSQL database:

```bash
npm run db:migrate
```

You will be prompted: `Enter a name for the new migration:` → type `init`

Expected output:
```
Applying migration `20240101000000_init`
Your database is now in sync with your schema.
```

> **For CI / production** use `npm run db:migrate:deploy` instead (no prompts).

### 4c. Seed development data

Inserts test users and sample listings:

```bash
npm run db:seed
```

Creates:
- `admin@locos.app` / password: `admin123!` (role: admin)
- `host@example.com` / password: `host123!` (role: host)
- 4 sample active listings in Moscow and St. Petersburg

Expected output:
```
Seeding database...
Seed complete
```

### Verify database contents

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555  
You should see tables with seed data in `users`, `profiles`, and `listings`.

---

## Step 5 — Start the development server

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in Xs
```

Open http://localhost:3000 in your browser.

---

## Step 6 — Verify pages load correctly

### Pages to test:

| URL | Expected result |
|-----|----------------|
| `http://localhost:3000` | Homepage with hero section and listing cards |
| `http://localhost:3000/search` | Search page with filters |
| `http://localhost:3000/api/health` | JSON: `{ "status": "ok", ... }` |

### Test the health endpoint first:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2024-...",
  "checks": {
    "database": { "status": "ok", "latencyMs": 5 }
  }
}
```

If `database.status` is `"error"`, your `DATABASE_URL` is wrong or PostgreSQL is not running.

### Test the auth API:

```bash
# Register a test user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "USER"
  }'
```

Expected: `201 Created` with `{ "data": { "user": {...}, "accessToken": "..." } }`

```bash
# Login with seeded host account
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "host@example.com", "password": "host123!"}'
```

Expected: `200 OK` with tokens and user data.

### Test the listings API:

```bash
# Get all listings (public endpoint)
curl http://localhost:3000/api/listings
```

Expected: `200 OK` with array of listings from seed data.

---

## Step 7 — Run TypeScript check

Verify there are no type errors:

```bash
npm run type-check
```

Expected: exits with code 0, no error output.

---

## Step 8 — Run the linter

```bash
npm run lint
```

Expected: `✔ No ESLint warnings or errors`

---

## Step 9 — Run background workers manually

Workers can be triggered manually to test them independently of the cron scheduler.

### Prerequisites for workers:
- Database must be running and migrated (Steps 4a–4b)
- Typesense must be running (for sync-typesense)
- Qdrant + OpenAI key must be set (for sync-qdrant)

```bash
# Sync listings into Typesense search index
npm run workers:typesense

# Generate embeddings and push to Qdrant (requires OPENAI_API_KEY)
npm run workers:qdrant

# Rollup yesterday's analytics events into analytics_daily
npm run workers:analytics

# Run AI price analysis on listings (requires OPENAI_API_KEY)
npm run workers:price

# Scan listings for fraud signals
npm run workers:fraud

# Expire unpaid bookings past their 15-minute window
npm run workers:bookings
```

Expected output for each: `[worker-name] Starting... [worker-name] Completed N items`

---

## Step 10 — Open Prisma Studio (optional)

Visual database browser:

```bash
npm run db:studio
# Opens at http://localhost:5555
```

---

## Complete list of environment variables

### Required (app will not start without these)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (pooled) |
| `DATABASE_URL_DIRECT` | PostgreSQL connection string (direct, no pgbouncer) |
| `REDIS_URL` | Upstash Redis REST URL |
| `REDIS_TOKEN` | Upstash Redis REST token |
| `NEXTAUTH_SECRET` | JWT signing secret (min 32 chars) |

### Required for specific features

| Variable | Feature |
|----------|---------|
| `OPENAI_API_KEY` | AI enhancement, price analysis, embeddings, fraud detection |
| `TYPESENSE_HOST` | Full-text search |
| `TYPESENSE_PORT` | Full-text search |
| `TYPESENSE_PROTOCOL` | Full-text search |
| `TYPESENSE_API_KEY` | Full-text search |
| `QDRANT_URL` | Semantic vector search |
| `QDRANT_API_KEY` | Semantic vector search |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Map view with listing clusters |
| `R2_ACCOUNT_ID` | Image uploads |
| `R2_ACCESS_KEY_ID` | Image uploads |
| `R2_SECRET_ACCESS_KEY` | Image uploads |
| `R2_BUCKET_NAME` | Image uploads |
| `R2_PUBLIC_URL` | Image CDN URLs |
| `STRIPE_SECRET_KEY` | Payment processing |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook validation |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe frontend |

### Optional

| Variable | Description |
|----------|-------------|
| `SENTRY_DSN` | Error tracking (disabled if empty) |
| `CRON_SECRET` | Secures `/api/cron/*` endpoints |
| `NEXT_PUBLIC_APP_URL` | App base URL (defaults to localhost:3000) |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime (default: 15m) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (default: 7d) |

---

## Troubleshooting

### `Cannot find module '@prisma/client'`
```bash
npm run db:generate
```

### `Error: Environment variable not found: DATABASE_URL`
- Verify `.env.local` exists (not `.env.example`)
- Verify the file is in the project root (same level as `package.json`)

### `connect ECONNREFUSED 127.0.0.1:5432`
- PostgreSQL is not running. Start it:
  ```bash
  brew services start postgresql@16   # macOS
  sudo service postgresql start       # Linux
  docker start locos-postgres         # Docker
  ```

### `P2021: The table does not exist`
- Migrations haven't been run. Run:
  ```bash
  npm run db:migrate
  ```

### Homepage shows no listings
- This is expected if the Typesense index is empty
- Run the sync worker: `npm run workers:typesense`
- OR check that seed data was inserted: `npm run db:studio`

### `Rate limit exceeded` on API endpoints
- Each route has per-IP rate limits (e.g., 60 req/min for search)
- This is enforced via Redis — verify your Redis connection

### Redis connection error
- `REDIS_URL` must start with `https://` (Upstash REST, not redis://)
- `REDIS_TOKEN` must be the REST token, not the password

---

## NPM script reference

```
npm run dev              Start dev server (http://localhost:3000)
npm run build            Production build
npm run start            Start production server (after build)
npm run type-check       TypeScript type checking (no emit)
npm run lint             ESLint check

npm run db:generate      Generate Prisma TypeScript client
npm run db:migrate       Create + apply migration (dev)
npm run db:migrate:deploy Apply migrations (production/CI)
npm run db:seed          Insert seed data
npm run db:studio        Open Prisma Studio GUI (port 5555)

npm run workers:typesense  Sync listings → Typesense
npm run workers:qdrant     Generate embeddings → Qdrant
npm run workers:analytics  Roll up analytics events → daily table
npm run workers:price      AI price analysis for all listings
npm run workers:fraud      Fraud scan for new listings
npm run workers:bookings   Expire unpaid pending bookings
```
