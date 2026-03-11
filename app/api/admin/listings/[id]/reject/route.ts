import { NextRequest, NextResponse } from 'next/server';
import { rejectListing } from '@/services/moderation.service';
import { requireRole } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    await requireRole('admin');
    const { reason } = await req.json() as { reason: string };
    await rejectListing(params.id, reason ?? 'Policy violation');
    return NextResponse.json({ data: { success: true } });
  } catch (e) {
    return handleRouteError(e);
  }
}
