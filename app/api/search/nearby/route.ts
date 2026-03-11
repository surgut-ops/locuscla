import { NextRequest, NextResponse } from 'next/server';
import { nearbySearch } from '@/services/search.service';
import { handleRouteError } from '@/lib/errors';
import { safeParseFloat, safeParseInt } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const sp = req.nextUrl.searchParams;
    const lat = safeParseFloat(sp.get('lat'), 0);
    const lng = safeParseFloat(sp.get('lng'), 0);
    const radiusKm = safeParseFloat(sp.get('radius'), 10);
    const limit = safeParseInt(sp.get('limit'), 20);
    if (!lat || !lng) return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
    const listings = await nearbySearch(lat, lng, radiusKm, limit);
    return NextResponse.json({ data: listings });
  } catch (e) {
    return handleRouteError(e);
  }
}
