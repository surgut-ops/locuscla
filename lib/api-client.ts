// Unified typed API client — the ONLY way components call the backend.
// Never use raw fetch() in components or hooks.

import type { ApiResponse, ApiError } from '@/types';

class ApiClientError extends Error {
  public readonly status: number;
  public readonly body: ApiError;

  constructor(status: number, body: ApiError) {
    super(body.error);
    this.status = status;
    this.body = body;
  }
}

class ApiClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(path, this.baseUrl || 'http://localhost:3000');
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          url.searchParams.set(k, String(v));
        }
      });
    }
    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    options: {
      params?: Record<string, string | number | boolean>;
      body?: unknown;
      tags?: string[];
      revalidate?: number;
    } = {}
  ): Promise<T> {
    const url = this.buildUrl(path, options.params);

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: options.body ? JSON.stringify(options.body) : undefined,
      next: {
        tags: options.tags,
        revalidate: options.revalidate,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiClientError(res.status, error);
    }

    return res.json() as Promise<T>;
  }

  async get<T>(path: string, params?: Record<string, string | number | boolean>, tags?: string[]): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>('GET', path, { params, tags });
  }

  async post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>('POST', path, { body });
  }

  async patch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>('PATCH', path, { body });
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>('DELETE', path);
  }
}

export const api = new ApiClient();
export { ApiClientError };
