import { NextRequest, NextResponse } from 'next/server';
import { aiImproveListingSchema } from '@/lib/validators';
import { improveListing } from '@/services/ai.service';
import { requireRole } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await requireRole('host');
    const body = await req.json();
    const parsed = aiImproveListingSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'listingId required' }, { status: 400 });
    const result = await improveListing(parsed.data.listingId);
    return NextResponse.json({ data: result });
  } catch (e) {
    return handleRouteError(e);
  }
}
