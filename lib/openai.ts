import OpenAI from 'openai';

declare global {
  // eslint-disable-next-line no-var
  var __openai: OpenAI | undefined;
}

export const openai: OpenAI = globalThis.__openai ?? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  maxRetries: 3,
  timeout: 30_000,
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__openai = openai;
}

export default openai;
