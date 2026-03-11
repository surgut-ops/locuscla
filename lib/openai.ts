import OpenAI from 'openai';

declare global {
  // eslint-disable-next-line no-var
  var __openai: OpenAI | undefined;
}

// Use placeholder during build when key is missing (Vercel collects page data at build time).
// Set OPENAI_API_KEY in Vercel Environment Variables for production runtime.
const apiKey = process.env.OPENAI_API_KEY || 'sk-placeholder-for-build';

export const openai: OpenAI = globalThis.__openai ?? new OpenAI({
  apiKey,
  maxRetries: 3,
  timeout: 30_000,
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__openai = openai;
}

export default openai;
