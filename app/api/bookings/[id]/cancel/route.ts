import { NextRequest, NextResponse } from 'next/server';
import { cancelBooking } from '@/services/booking.service';
import { getAuthUser } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    const body = await req.json().catch(() => ({})) as { reason?: string };
    await cancelBooking(params.id, user.sub, body.reason);
    return NextResponse.json({ data: { success: true } });
  } catch (e) {
    return handleRouteError(e);
  }
}
