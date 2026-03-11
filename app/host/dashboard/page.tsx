// app/host/dashboard/page.tsx
// Host analytics dashboard — server component

import { analyticsService } from '@/services/analytics.service';
import { listingService } from '@/services/listing.service';

// Note: In production, get hostId from authenticated session
// This shows the data structure used

export default async function HostDashboardPage() {
  // Placeholder — in real app this comes from auth middleware
  const PLACEHOLDER_HOST_ID = 'HOST_ID_FROM_SESSION';

  let analytics;
  let listingsData;

  try {
    [analytics, listingsData] = await Promise.all([
      analyticsService.getHostAnalytics(PLACEHOLDER_HOST_ID, 30),
      listingService.getHostListings(PLACEHOLDER_HOST_ID),
    ]);
  } catch {
    analytics = null;
    listingsData = { listings: [], cursor: null, hasNext: false };
  }

  const stats = analytics ? [
    { label: 'Просмотры', value: analytics.totalViews.toLocaleString(), icon: '👁' },
    { label: 'Доход', value: `${analytics.totalRevenue.toLocaleString('ru-RU')} ₽`, icon: '💰' },
    { label: 'Бронирования', value: analytics.totalBookings.toLocaleString(), icon: '📅' },
    { label: 'Конверсия', value: `${analytics.conversionRate.toFixed(1)}%`, icon: '📈' },
    { label: 'Рейтинг', value: analytics.avgRating.toFixed(1), icon: '⭐' },
    { label: 'Загруженность', value: `${analytics.occupancyRate}%`, icon: '🏠' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard хозяина</h1>
          <a href="/host/listings/new" className="btn-primary">
            + Добавить объявление
          </a>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="card p-4">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue chart placeholder */}
        {analytics && analytics.revenueByWeek.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="font-semibold text-lg mb-4">Доход по неделям</h2>
            <div className="flex items-end gap-2 h-32">
              {analytics.revenueByWeek.map(({ week, revenue }) => {
                const max = Math.max(...analytics.revenueByWeek.map(w => w.revenue));
                const height = max > 0 ? (revenue / max) * 100 : 0;
                return (
                  <div key={week} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-brand-500 rounded-t"
                      style={{ height: `${height}%` }}
                      title={`${revenue.toLocaleString('ru-RU')} ₽`}
                    />
                    <span className="text-xs text-slate-400">
                      {week.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top listings */}
        {analytics && analytics.topListings.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="font-semibold text-lg mb-4">Топ объявлений</h2>
            <div className="divide-y divide-slate-100">
              {analytics.topListings.map((l, i) => (
                <div key={l.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-xs flex items-center justify-center font-bold text-slate-500">
                      {i + 1}
                    </span>
                    <a href={`/listings/${l.id}`} className="font-medium text-slate-900 hover:text-brand-500">
                      {l.title}
                    </a>
                  </div>
                  <div className="flex gap-6 text-sm text-slate-500">
                    <span>{l.views.toLocaleString()} просм.</span>
                    <span>{l.bookings} броней</span>
                    <span className="font-medium text-slate-900">
                      {l.revenue.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listings management */}
        <div className="card p-6">
          <h2 className="font-semibold text-lg mb-4">Мои объявления</h2>
          {listingsData.listings.length === 0 ? (
            <p className="text-slate-400 text-sm">Нет объявлений. Создайте первое!</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {listingsData.listings.map(l => (
                <div key={l.id} className="py-3 flex items-center justify-between">
                  <div>
                    <a href={`/listings/${l.id}`} className="font-medium text-slate-900 hover:text-brand-500">
                      {l.title}
                    </a>
                    <p className="text-xs text-slate-400 mt-0.5">{l.city}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      l.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      l.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {l.status}
                    </span>
                    <span className="font-medium">{l.pricePerNight.toLocaleString('ru-RU')} ₽</span>
                    <a href={`/host/listings/${l.id}/edit`} className="text-sm text-brand-500 hover:underline">
                      Редактировать
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
