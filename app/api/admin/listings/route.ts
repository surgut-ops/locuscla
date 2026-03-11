import { NextRequest, NextResponse } from 'next/server';
import { getPendingListings } from '@/services/moderation.service';
import { requireRole } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';
import { safeParseInt } from '@/lib/utils';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await requireRole('admin');
    const cursor = req.nextUrl.searchParams.get('cursor') ?? undefined;
    const limit = safeParseInt(req.nextUrl.searchParams.get('limit'), 20);
    const listings = await getPendingListings(cursor, limit);
    return NextResponse.json({ data: listings });
  } catch (e) {
    return handleRouteError(e);
  }
}
