import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import LayoutClient from '@/components/LayoutClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Locus — AI-маркетплейс аренды жилья',
  description: 'Найдите идеальное жильё с AI-верификацией, честными ценами и безопасными сделками',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <AppProvider>
          <LayoutClient>{children}</LayoutClient>
        </AppProvider>
      </body>
    </html>
  );
}
