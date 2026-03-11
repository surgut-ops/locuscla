# Статус ключей (из ваших скриншотов)

## ✅ Уже добавлено в .env.local

### Qdrant (cloud.qdrant.io)
- `QDRANT_URL` = `https://0aaa6dac-b0eb-4392-88f4-2a336ac426d5.eu-west-2-0.aws.cloud.qdrant.io`
- `QDRANT_API_KEY` = ваш API‑ключ

---

## ⚠️ Нужно добавить вручную

### 1. Neon (PostgreSQL)

В **console.neon.tech** → проект locus → **Connect** → скопируйте **Connection string** целиком.

Вставьте в .env.local:
```
DATABASE_URL="<скопированная строка>"
DATABASE_URL_DIRECT="<та же строка, но host без -pooler>"
```

Для `DATABASE_URL_DIRECT` замените `-pooler` в хосте на просто `round-meadow-adept80.us-east-1.aws.neon.tech`.

---

### 2. Redis — нужен Upstash (не Redis Labs)

Ваш текущий Redis — **Redis Labs (cloud.redis.io)**. Проект использует **Upstash** (REST API), поэтому Redis Labs не подойдёт.

1. Перейдите на **[console.upstash.com](https://console.upstash.com)**
2. Create Database (free tier)
3. Скопируйте **REST URL** → `REDIS_URL`
4. Скопируйте **REST Token** → `REDIS_TOKEN`

---

### 3. Typesense (поиск)

1. **[cloud.typesense.org](https://cloud.typesense.org)** → Create Cluster (free)
2. Скопируйте Host → `TYPESENSE_HOST`
3. Скопируйте API Key → `TYPESENSE_API_KEY`
4. `TYPESENSE_PORT` = `443`, `TYPESENSE_PROTOCOL` = `https`

---

### 4. OpenAI

1. **[platform.openai.com/api-keys](https://platform.openai.com/api-keys)**
2. Create key → вставить в `OPENAI_API_KEY`

---

### 5. Mapbox (карты)

1. **[account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens)**
2. Create token → вставить в `NEXT_PUBLIC_MAPBOX_TOKEN`

---

### 6. Auth

`NEXTAUTH_SECRET` — сгенерируйте:
```bash
openssl rand -hex 32
```

---

## Минимум для запуска

| Переменная          | Где взять                        |
|---------------------|-----------------------------------|
| DATABASE_URL        | Neon → Connect                    |
| DATABASE_URL_DIRECT | Neon (без -pooler)                |
| REDIS_URL           | Upstash (не Redis Labs)           |
| REDIS_TOKEN         | Upstash                           |
| TYPESENSE_HOST      | cloud.typesense.org               |
| TYPESENSE_API_KEY   | cloud.typesense.org               |
| NEXTAUTH_SECRET     | `openssl rand -hex 32`            |

Остальные (OpenAI, Mapbox) можно добавить позже — приложение запустится и без них.
