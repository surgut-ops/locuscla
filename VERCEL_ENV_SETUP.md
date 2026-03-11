# Настройка переменных окружения для Vercel

Как получить и добавить переменные в Vercel: **Project → Settings → Environment Variables**.

---

## Обязательные для деплоя (билд пройдёт без них, но приложение будет работать частично)

### 1. База данных (PostgreSQL)

**Переменные:** `DATABASE_URL`, `DATABASE_URL_DIRECT`

**Где взять:**
- **[Neon.tech](https://neon.tech)** (бесплатно)
  1. Регистрация → Create Project
  2. Скопируйте **Connection string** (pooled) → `DATABASE_URL`
  3. Для `DATABASE_URL_DIRECT` — выберите режим **Direct** и скопируйте строку

- **[Supabase](https://supabase.com)** (бесплатно)
  - Project Settings → Database → Connection string (URI)

Формат: `postgresql://user:password@host:5432/database?sslmode=require`

---

### 2. Redis (кеш, сессии)

**Переменные:** `REDIS_URL`, `REDIS_TOKEN`

**Где взять:** [console.upstash.com](https://console.upstash.com)
1. Sign Up → Create Database (free tier)
2. Выберите регион (например, eu-central-1)
3. Скопируйте **REST URL** → `REDIS_URL`
4. Скопируйте **REST Token** → `REDIS_TOKEN`

---

### 3. OpenAI (AI-функции: улучшение объявлений, анализ цен)

**Переменная:** `OPENAI_API_KEY`

**Где взять:** [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
1. Войдите или зарегистрируйтесь
2. Create new secret key
3. Скопируйте ключ (начинается с `sk-proj-` или `sk-`)

---

### 4. Typesense (поиск объявлений)

**Переменные:** `TYPESENSE_HOST`, `TYPESENSE_PORT`, `TYPESENSE_PROTOCOL`, `TYPESENSE_API_KEY`

**Где взять:** [cloud.typesense.org](https://cloud.typesense.org)
1. Create Cluster (free tier)
2. После создания — скопируйте:
   - **Host** (например `xxx.a1.typesense.net`) → `TYPESENSE_HOST`
   - **Port** → `443` → `TYPESENSE_PORT`
   - **Protocol** → `https` → `TYPESENSE_PROTOCOL`
   - **API Key** → `TYPESENSE_API_KEY`

---

### 5. Qdrant (семантический поиск)

**Переменные:** `QDRANT_URL`, `QDRANT_API_KEY`

**Где взять:** [cloud.qdrant.io](https://cloud.qdrant.io)
1. Sign Up → Create Cluster (free tier)
2. Скопируйте **Cluster URL** → `QDRANT_URL`
3. Скопируйте **API Key** → `QDRANT_API_KEY`

---

### 6. Mapbox (карты)

**Переменная:** `NEXT_PUBLIC_MAPBOX_TOKEN`

**Где взять:** [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens)
1. Sign Up → Create token
2. Скопируйте токен (начинается с `pk.`)

---

### 7. Auth

**Переменные:** `NEXTAUTH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`

**Где взять:**
- `NEXTAUTH_SECRET` — сгенерируйте: `openssl rand -hex 32` (минимум 32 символа)
- `JWT_ACCESS_EXPIRES_IN` — `15m`
- `JWT_REFRESH_EXPIRES_IN` — `7d`

---

### 8. App URL

**Переменная:** `NEXT_PUBLIC_APP_URL`

**Значение:** URL вашего деплоя, например `https://locus-clau.vercel.app`

---

## Опциональные (для полного функционала)

### Cloudflare R2 (загрузка изображений)

**Переменные:** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

**Где взять:** [dash.cloudflare.com](https://dash.cloudflare.com) → R2 → Create bucket

---

### Stripe (платежи)

**Переменные:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Где взять:** [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)

---

### Cron (фоновые задачи)

**Переменная:** `CRON_SECRET`

**Значение:** любой случайный секрет (например, `openssl rand -hex 16`)

---

## Сводная таблица — минимум для старта

| Переменная | Где получить |
|------------|--------------|
| `DATABASE_URL` | Neon.tech или Supabase |
| `DATABASE_URL_DIRECT` | То же, режим Direct |
| `REDIS_URL` | Upstash |
| `REDIS_TOKEN` | Upstash |
| `OPENAI_API_KEY` | platform.openai.com |
| `TYPESENSE_HOST` | cloud.typesense.org |
| `TYPESENSE_API_KEY` | cloud.typesense.org |
| `QDRANT_URL` | cloud.qdrant.io |
| `QDRANT_API_KEY` | cloud.qdrant.io |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | account.mapbox.com |
| `NEXTAUTH_SECRET` | `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | URL вашего Vercel-проекта |

---

## Как добавить в Vercel

1. Откройте проект на [vercel.com](https://vercel.com)
2. **Settings** → **Environment Variables**
3. Добавьте каждую переменную: **Name** + **Value**
4. Выберите окружение: **Production**, **Preview**, **Development**
5. **Save**
6. Сделайте **Redeploy** проекта
