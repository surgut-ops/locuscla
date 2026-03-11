import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import db from '@/lib/db';
import { signAccessToken, signRefreshToken } from '@/lib/auth';
import { sessionCache } from './cache.service';
import { ConflictError, NotFoundError, UnauthorizedError } from '@/lib/errors';
import type { RegisterInput, LoginInput } from '@/lib/validators';
import type { IUser } from '@/types';

export async function register(input: RegisterInput): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
  const exists = await db.user.findUnique({ where: { email: input.email } });
  if (exists) throw new ConflictError('Email already in use');

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await db.user.create({
    data: {
      email: input.email,
      passwordHash,
      role: input.role === 'host' ? 'host' : 'user',
      profile: {
        create: {
          firstName: input.firstName,
          lastName: input.lastName,
        },
      },
    },
    include: { profile: true },
  });

  const tokens = await createTokenPair(user.id, user.email, user.role);
  return { user: formatUser(user), ...tokens };
}

export async function login(input: LoginInput): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
  const user = await db.user.findUnique({
    where: { email: input.email, deletedAt: null },
    include: { profile: true },
  });

  if (!user) throw new UnauthorizedError('Invalid credentials');

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid credentials');

  const tokens = await createTokenPair(user.id, user.email, user.role);
  return { user: formatUser(user), ...tokens };
}

export async function logout(refreshToken: string): Promise<void> {
  const session = await db.session.findUnique({ where: { refreshToken } });
  if (!session) return;

  await db.session.delete({ where: { refreshToken } });
  await sessionCache.invalidate(refreshToken);
}

async function createTokenPair(userId: string, email: string, role: string): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = { sub: userId, email, role: role as 'user' | 'host' | 'admin' };
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(payload),
    signRefreshToken(payload),
  ]);

  // Store refresh token in DB and cache
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.session.create({
    data: { id: randomUUID(), userId, refreshToken, expiresAt },
  });
  await sessionCache.set(refreshToken, { userId, role });

  return { accessToken, refreshToken };
}

function formatUser(user: { id: string; email: string; role: string; emailVerified: boolean; avatarUrl: string | null; phone: string | null; createdAt: Date; profile?: { firstName: string; lastName: string; avgRating: unknown; totalReviews: number; isVerified: boolean; languages: string[] } | null }): IUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role as 'user' | 'host' | 'admin',
    emailVerified: user.emailVerified,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    createdAt: user.createdAt,
  };
}
