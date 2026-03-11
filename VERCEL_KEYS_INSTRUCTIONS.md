# Инструкция: добавить ключи в Vercel

## Важно: .env.local не попадает в Git

Файл `.env.local` указан в `.gitignore` — ваши ключи **не уйдут** на GitHub. Они только локально.

---

## Шаги для деплоя на Vercel

### 1. Vercel → ваш проект → Settings → Environment Variables

### 2. Добавьте переменные (скопируйте значения из .env.local)

| Переменная | Откуда взять |
|------------|--------------|
| `DATABASE_URL` | Neon: Connect → Connection string (pooled) |
| `DATABASE_URL_DIRECT` | Neon: Connection string (direct, без -pooler) |
| `REDIS_URL` | Upstash: REST URL |
| `REDIS_TOKEN` | Upstash: REST Token |
| `TYPESENSE_HOST` | cloud.typesense.org → ваш кластер → Nodes |
| `TYPESENSE_API_KEY` | cloud.typesense.org → Admin API Key |
| `QDRANT_URL` | cloud.qdrant.io → Endpoint |
| `QDRANT_API_KEY` | cloud.qdrant.io → API Key |
| `OPENAI_API_KEY` | platform.openai.com/api-keys |
| `NEXTAUTH_SECRET` | `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | URL деплоя, например `https://locus-clau.vercel.app` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | account.mapbox.com (по желанию) |
| `CRON_SECRET` | Любая случайная строка |

### 3. TYPESENSE_PORT и TYPESENSE_PROTOCOL

- `TYPESENSE_PORT` = `443`
- `TYPESENSE_PROTOCOL` = `https`

### 4. Redeploy

После добавления переменных: Deployments → три точки у последнего деплоя → **Redeploy**.

---

## Минимум для первого запуска

Если нужно только проверить, что билд проходит:

- `DATABASE_URL`, `DATABASE_URL_DIRECT`
- `REDIS_URL`, `REDIS_TOKEN`
- `TYPESENSE_HOST`, `TYPESENSE_API_KEY`
- `QDRANT_URL`, `QDRANT_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`

Остальное можно добавить позже.

---

## Проверка настроек Vercel (по вашему скрину)

### Исправьте:

1. **TYPESENSE_HOST** — у вас опечатка:
   - Сейчас: `zck4euxv3518d7gap.1.a1.typesense.net` (точка перед `1`)
   - Правильно: `zck4euxv3518d7gap-1.a1.typesense.net` (дефис `-1`)

2. **QDRANT_URL** — проверьте, что указан полный URL без лишних символов:
   - Правильно: `https://0aaa6dac-b0eb-4392-88f4-2a336ac426d5.eu-west-2-0.aws.cloud.qdrant.io`

3. **OPENAI_API_KEY** — сейчас пустой. Добавьте ключ с platform.openai.com (или placeholder, если AI не нужен).

4. **Добавьте, если нет:**
   - `NEXTAUTH_SECRET` — скопируйте из `.env.local` (сгенерированный ключ)
   - `NEXT_PUBLIC_APP_URL` — например `https://locus-clau.vercel.app`
   - `TYPESENSE_PORT` = `443`
   - `TYPESENSE_PROTOCOL` = `https`

### Neon

Полную строку подключения нужно скопировать в Neon: **Connect** → выбрать **Connection pooling** → **Copy** (с snippet). Вставьте в `DATABASE_URL` и `DATABASE_URL_DIRECT` (для direct — connection string без `-pooler` в хосте).

**Важно:** роль в URL должна быть `neondb_owner` (с подчёркиванием), а не `neondb.owner`.

---

## Ошибка «table does not exist» при билде

Причина: в Neon не применена схема БД. Добавлен скрипт `vercel-build`, который при деплое делает `prisma db push` (создаёт таблицы) перед сборкой. После коммита и redeploy билд должен пройти.
