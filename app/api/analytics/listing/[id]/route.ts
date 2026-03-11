import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { handleRouteError, ForbiddenError } from '@/lib/errors';

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    const listing = await db.listing.findUnique({ where: { id: params.id } });
    if (!listing || listing.hostId !== user.sub) throw new ForbiddenError();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await db.analyticsDaily.findMany({
      where: { listingId: params.id, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ data });
  } catch (e) {
    return handleRouteError(e);
  }
}
