import { NextRequest, NextResponse } from 'next/server';
import { createBookingSchema } from '@/lib/validators';
import { createBooking, getUserBookings } from '@/services/booking.service';
import { getAuthUser } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    const body = await req.json();
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    const booking = await createBooking(user.sub, parsed.data);
    return NextResponse.json({ data: booking }, { status: 201 });
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    const role = user.role === 'host' ? 'host' : 'guest';
    const bookings = await getUserBookings(user.sub, role);
    return NextResponse.json({ data: bookings });
  } catch (e) {
    return handleRouteError(e);
  }
}
