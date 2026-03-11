// app/page.tsx
import Link from 'next/link';
import { Suspense } from 'react';
import { searchService } from '@/services/search.service';
import type { IListingSummary } from '@/types';

async function FeaturedListings() {
  let listings: IListingSummary[] = [];
  try {
    const result = await searchService.search({ sortBy: 'rating', perPage: 8 });
    listings = result.listings;
  } catch {}

  return (
    <section className="py-12">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">
        Популярные объявления
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map(l => (
          <Link key={l.id} href={`/listings/${l.id}`}>
            <div className="card group cursor-pointer overflow-hidden">
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                {l.primaryImage && (
                  <img
                    src={l.primaryImage}
                    alt={l.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  {l.city}
                </p>
                <h3 className="font-semibold text-slate-900 mt-1 line-clamp-2 text-sm">
                  {l.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-slate-900">
                    {l.pricePerNight.toLocaleString('ru-RU')} ₽
                    <span className="text-xs font-normal text-slate-400">/ночь</span>
                  </span>
                  {l.avgRating > 0 && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      ★ {l.avgRating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Найдите идеальное жильё
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            AI-маркетплейс аренды с умным поиском и аналитикой
          </p>
          <div className="flex gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Город, район, тип жилья..."
              className="flex-1 px-4 py-3 rounded-xl text-slate-900 text-sm focus:outline-none"
            />
            <Link href="/search" className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Найти
            </Link>
          </div>
          <div className="flex gap-6 justify-center mt-6 text-sm text-blue-200">
            <span>🏠 5 млн объявлений</span>
            <span>⭐ AI-проверка</span>
            <span>🔍 Умный поиск</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <Suspense fallback={
          <div className="py-12 grid grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card h-64 animate-pulse bg-slate-100" />
            ))}
          </div>
        }>
          <FeaturedListings />
        </Suspense>
      </div>
    </main>
  );
}
