import { NextResponse } from 'next/server';
import { getHostDashboard } from '@/services/analytics.service';
import { requireRole } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';

export async function GET(): Promise<NextResponse> {
  try {
    const user = await requireRole('host');
    const stats = await getHostDashboard(user.sub);
    return NextResponse.json({ data: stats });
  } catch (e) {
    return handleRouteError(e);
  }
}
