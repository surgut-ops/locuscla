import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators';
import { login } from '@/services/auth.service';
import { handleRouteError } from '@/lib/errors';
import { checkRateLimit } from '@/services/cache.service';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    const { allowed } = await checkRateLimit(ip, 'login', 10);
    if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });

    const { user, accessToken, refreshToken } = await login(parsed.data);
    const res = NextResponse.json({ data: user });
    res.cookies.set('access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 900 });
    res.cookies.set('refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 604800, path: '/api/auth/refresh' });
    return res;
  } catch (e) {
    return handleRouteError(e);
  }
}
