import { NextRequest, NextResponse } from 'next/server';
import { searchSchema } from '@/lib/validators';
import { searchListings } from '@/services/search.service';
import { handleRouteError } from '@/lib/errors';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const parsed = searchSchema.safeParse(params);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid search params' }, { status: 400 });
    const result = await searchListings(parsed.data);
    return NextResponse.json({ data: result });
  } catch (e) {
    return handleRouteError(e);
  }
}
