import { NextRequest, NextResponse } from 'next/server';
import { getReports } from '@/services/moderation.service';
import { requireRole } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await requireRole('admin');
    const status = req.nextUrl.searchParams.get('status') ?? undefined;
    const reports = await getReports(status);
    return NextResponse.json({ data: reports });
  } catch (e) {
    return handleRouteError(e);
  }
}
