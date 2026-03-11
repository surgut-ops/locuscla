// All API routes are dynamic — no static pre-rendering during build
export const dynamic = 'force-dynamic';

export default function ApiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
