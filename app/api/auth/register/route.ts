import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validators';
import { register } from '@/services/auth.service';
import { handleRouteError } from '@/lib/errors';
import { checkRateLimit } from '@/services/cache.service';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    const { allowed } = await checkRateLimit(ip, 'register', 5);
    if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      parsed.error.errors.forEach(e => { fields[e.path.join('.')] = e.message; });
      return NextResponse.json({ error: 'Validation failed', fields }, { status: 400 });
    }

    const { user, accessToken, refreshToken } = await register(parsed.data);
    const res = NextResponse.json({ data: user }, { status: 201 });
    res.cookies.set('access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 900 });
    res.cookies.set('refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 604800, path: '/api/auth/refresh' });
    return res;
  } catch (e) {
    return handleRouteError(e);
  }
}
