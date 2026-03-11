// app/api/cron/[job]/route.ts
// Vercel Cron Jobs trigger these endpoints on schedule
// Protected by CRON_SECRET to prevent unauthorized triggers

import { NextRequest, NextResponse } from 'next/server';

const JOBS: Record<string, () => Promise<void>> = {
  'sync-typesense': async () => {
    const { default: run } = await import('@/workers/sync-typesense');
  },
  'sync-qdrant': async () => {
    const { default: run } = await import('@/workers/sync-qdrant');
  },
  'analytics-rollup': async () => {
    const { default: run } = await import('@/workers/analytics-rollup');
  },
  'price-analysis': async () => {
    const { default: run } = await import('@/workers/price-analysis');
  },
  'fraud-scan': async () => {
    const { default: run } = await import('@/workers/fraud-scan');
  },
  'expire-bookings': async () => {
    const { default: run } = await import('@/workers/expire-bookings');
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: { job: string } }
) {
  // Verify Vercel Cron Secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobFn = JOBS[params.job];
  if (!jobFn) {
    return NextResponse.json({ error: 'Unknown job' }, { status: 404 });
  }

  const start = Date.now();
  try {
    await jobFn();
    return NextResponse.json({
      success: true,
      job: params.job,
      durationMs: Date.now() - start,
    });
  } catch (err) {
    console.error(`[cron/${params.job}] ERROR:`, err);
    return NextResponse.json(
      { error: 'Job failed', job: params.job },
      { status: 500 }
    );
  }
}
