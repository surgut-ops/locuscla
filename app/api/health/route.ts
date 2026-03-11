import { NextResponse } from 'next/server';
import db from '@/lib/db';
import redis from '@/lib/redis';

export async function GET(): Promise<NextResponse> {
  const checks = await Promise.allSettled([
    db.$queryRaw`SELECT 1`,
    redis.ping(),
  ]);

  const status = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: checks[0].status === 'fulfilled' ? 'ok' : 'error',
      redis: checks[1].status === 'fulfilled' ? 'ok' : 'error',
    },
  };

  const httpStatus = Object.values(status.services).every(s => s === 'ok') ? 200 : 503;
  return NextResponse.json(status, { status: httpStatus });
}
