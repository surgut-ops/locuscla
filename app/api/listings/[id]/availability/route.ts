import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { handleRouteError } from '@/lib/errors';

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const blockedDates = await db.listingAvailability.findMany({
      where: { listingId: params.id, isBlocked: true },
      select: { date: true },
    });

    const bookedDates = await db.booking.findMany({
      where: { listingId: params.id, status: { in: ['pending', 'confirmed'] } },
      select: { checkIn: true, checkOut: true },
    });

    return NextResponse.json({ data: { blockedDates, bookedDates } });
  } catch (e) {
    return handleRouteError(e);
  }
}
