import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { IJwtPayload, UserRole } from '@/types';
import { UnauthorizedError } from './errors';

const ACCESS_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

export async function signAccessToken(payload: Omit<IJwtPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_EXPIRES)
    .sign(ACCESS_SECRET);
}

export async function signRefreshToken(payload: Omit<IJwtPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_EXPIRES)
    .sign(ACCESS_SECRET);
}

export async function verifyToken(token: string): Promise<IJwtPayload> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload as unknown as IJwtPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export async function getAuthUser(): Promise<IJwtPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) throw new UnauthorizedError();
  return verifyToken(token);
}

export async function requireRole(role: UserRole): Promise<IJwtPayload> {
  const user = await getAuthUser();
  const roleOrder: Record<UserRole, number> = { user: 0, host: 1, admin: 2 };
  if (roleOrder[user.role] < roleOrder[role]) {
    throw new UnauthorizedError(`Requires ${role} role`);
  }
  return user;
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): Response {
  res.headers.append('Set-Cookie', `access_token=${accessToken}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=900`);
  res.headers.append('Set-Cookie', `refresh_token=${refreshToken}; HttpOnly; Secure; Path=/api/auth/refresh; SameSite=Strict; Max-Age=604800`);
  return res;
}
