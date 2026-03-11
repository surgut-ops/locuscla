import { NextRequest, NextResponse } from 'next/server';
import { createListingSchema } from '@/lib/validators';
import { createListing, getListings } from '@/services/listing.service';
import { requireRole } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';
import { safeParseInt } from '@/lib/utils';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;
    const result = await getListings({
      city: searchParams.get('city') ?? undefined,
      status: 'active',
      pagination: {
        cursor: searchParams.get('cursor') ?? undefined,
        limit: safeParseInt(searchParams.get('limit'), 20),
      },
    });
    return NextResponse.json({ data: result.listings, meta: { total: result.total, cursor: result.cursor, hasNext: !!result.cursor, page: 1, perPage: 20 } });
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await requireRole('host');
    const body = await req.json();
    const parsed = createListingSchema.safeParse(body);
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      parsed.error.errors.forEach(e => { fields[e.path.join('.')] = e.message; });
      return NextResponse.json({ error: 'Validation failed', fields }, { status: 400 });
    }
    const listing = await createListing(user.sub, parsed.data);
    return NextResponse.json({ data: listing }, { status: 201 });
  } catch (e) {
    return handleRouteError(e);
  }
}
