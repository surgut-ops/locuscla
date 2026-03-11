# LOCOS — Local Setup Script (PowerShell)
# Run: .\setup-local.ps1

Write-Host "=== LOCOS Local Setup ===" -ForegroundColor Cyan

# 1. Docker
Write-Host "`n[1/6] Starting Docker containers..." -ForegroundColor Yellow
docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker failed. Ensure Docker Desktop is running." -ForegroundColor Red
    exit 1
}
Start-Sleep -Seconds 5

# 2. Prisma
Write-Host "`n[2/6] Generating Prisma client..." -ForegroundColor Yellow
npm run db:generate

# 3. Migrations
Write-Host "`n[3/6] Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init

# 4. Seed
Write-Host "`n[4/6] Seeding database..." -ForegroundColor Yellow
npm run db:seed

# 5. Typesense sync (optional - DB fallback works without)
Write-Host "`n[5/6] Syncing Typesense (optional)..." -ForegroundColor Yellow
npm run workers:typesense 2>$null

# 6. Start
Write-Host "`n[6/6] Starting dev server..." -ForegroundColor Green
Write-Host "Open http://localhost:3000 in your browser" -ForegroundColor Green
Write-Host "`nIMPORTANT: Get FREE Redis at https://console.upstash.com and update .env.local" -ForegroundColor Yellow
npm run dev
