import { NextRequest, NextResponse } from 'next/server';
import { approveListing } from '@/services/moderation.service';
import { requireRole } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    await requireRole('admin');
    await approveListing(params.id);
    return NextResponse.json({ data: { success: true } });
  } catch (e) {
    return handleRouteError(e);
  }
}
