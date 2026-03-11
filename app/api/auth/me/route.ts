import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import db from '@/lib/db';
import { handleRouteError } from '@/lib/errors';

export async function GET(): Promise<NextResponse> {
  try {
    const { sub } = await getAuthUser();
    const user = await db.user.findUnique({
      where: { id: sub, deletedAt: null },
      include: { profile: true },
    });
    return NextResponse.json({ data: user });
  } catch (e) {
    return handleRouteError(e);
  }
}
