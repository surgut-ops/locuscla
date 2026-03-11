import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/services/auth.service';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const refreshToken = req.cookies.get('refresh_token')?.value;
  if (refreshToken) await logout(refreshToken).catch(() => null);
  const res = NextResponse.json({ data: { success: true } });
  res.cookies.delete('access_token');
  res.cookies.delete('refresh_token');
  return res;
}
