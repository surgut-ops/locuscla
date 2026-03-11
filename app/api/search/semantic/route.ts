import { NextRequest, NextResponse } from 'next/server';
import { semanticSearch } from '@/services/search.service';
import { handleRouteError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const q = req.nextUrl.searchParams.get('q');
    if (!q) return NextResponse.json({ error: 'Query required' }, { status: 400 });
    const city = req.nextUrl.searchParams.get('city') ?? undefined;
    const listings = await semanticSearch(q, { city });
    return NextResponse.json({ data: listings });
  } catch (e) {
    return handleRouteError(e);
  }
}
