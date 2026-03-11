import { NextRequest, NextResponse } from 'next/server';
import { updateListingSchema } from '@/lib/validators';
import { getListingById, updateListing, deleteListing } from '@/services/listing.service';
import { getAuthUser } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';
import { trackEvent } from '@/services/analytics.service';

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const listing = await getListingById(params.id);
    // Fire-and-forget analytics
    const userId = req.cookies.get('access_token') ? undefined : undefined;
    trackEvent(params.id, 'view', userId).catch(() => null);
    return NextResponse.json({ data: listing });
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    const body = await req.json();
    const parsed = updateListingSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    const listing = await updateListing(params.id, user.sub, parsed.data);
    return NextResponse.json({ data: listing });
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    await deleteListing(params.id, user.sub);
    return NextResponse.json({ data: { success: true } });
  } catch (e) {
    return handleRouteError(e);
  }
}
