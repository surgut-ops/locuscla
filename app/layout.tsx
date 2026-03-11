import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'LOCOS — Аренда жилья', template: '%s | LOCOS' },
  description: 'Современная платформа аренды жилья с AI-аналитикой',
  keywords: ['аренда', 'квартира', 'жильё', 'LOCOS'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">{children}</body>
    </html>
  );
}
