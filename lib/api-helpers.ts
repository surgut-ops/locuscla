// lib/api-helpers.ts
// Standardized response builders and route handler wrapper

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError, ValidationError, UnauthorizedError } from './errors';
import { checkRateLimit } from './cache.service';

// ─── Response types ───────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  data: T;
  meta?: {
    page?: number;
    perPage?: number;
    total?: number;
    cursor?: string | null;
    hasNext?: boolean;
  };
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
  fields?: Record<string, string>;
  requestId?: string;
}

// ─── Response builders ────────────────────────────────────────────────────────

export function ok<T>(data: T, meta?: ApiSuccessResponse<T>['meta']): NextResponse {
  return NextResponse.json({ data, ...(meta ? { meta } : {}) }, { status: 200 });
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json({ data }, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function apiError(
  message: string,
  status: number,
  code?: string,
  fields?: Record<string, string>
): NextResponse {
  const body: ApiErrorResponse = { error: message, ...(code ? { code } : {}), ...(fields ? { fields } : {}) };
  return NextResponse.json(body, { status });
}

// ─── Route handler wrapper ────────────────────────────────────────────────────

type HandlerFn = (req: NextRequest, ctx: { params: Record<string, string> }) => Promise<NextResponse>;

export function createHandler(handler: HandlerFn, options?: {
  rateLimit?: number;
}): HandlerFn {
  return async (req, ctx) => {
    // Rate limiting
    if (options?.rateLimit !== undefined) {
      const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
      const route = new URL(req.url).pathname;
      const { allowed } = await checkRateLimit(ip, route, options.rateLimit);
      if (!allowed) {
        return apiError('Too many requests', 429, 'RATE_LIMIT');
      }
    }

    try {
      return await handler(req, ctx);
    } catch (err) {
      // Zod validation errors
      if (err instanceof ZodError) {
        const fields = Object.fromEntries(
          err.errors.map(e => [e.path.join('.'), e.message])
        );
        return apiError('Validation failed', 400, 'VALIDATION_ERROR', fields);
      }

      // App errors (typed)
      if (err instanceof AppError) {
        return apiError(
          err.message,
          err.statusCode,
          err.code,
          err instanceof ValidationError ? err.fields : undefined
        );
      }

      // Unknown errors
      console.error('[API Error]', err);
      return apiError('Internal server error', 500, 'INTERNAL_ERROR');
    }
  };
}

// ─── Auth helper ──────────────────────────────────────────────────────────────

export function getRequestUserId(req: NextRequest): string {
  const userId = req.headers.get('x-user-id');
  if (!userId) throw new UnauthorizedError();
  return userId;
}

// ─── Pagination helpers ───────────────────────────────────────────────────────

export function parsePaginationParams(searchParams: URLSearchParams): {
  cursor?: string;
  limit: number;
} {
  const cursor = searchParams.get('cursor') ?? undefined;
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '24'), 100);
  return { cursor, limit };
}

export function buildSearchHash(params: Record<string, unknown>): string {
  const sorted = Object.keys(params)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});
  return Buffer.from(JSON.stringify(sorted)).toString('base64').slice(0, 64);
}
