'use client';
import { useState, useEffect } from 'react';
import type { IHostDashboardStats } from '@/types';
import { api } from '@/lib/api-client';
import { formatPrice } from '@/lib/utils';

export default function HostDashboardPage() {
  const [stats, setStats] = useState<IHostDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<IHostDashboardStats>('/api/analytics/host')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Загрузка дашборда...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">Ошибка загрузки данных</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Панель арендодателя</h1>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Просмотры" value={stats.totalViews.toLocaleString('ru-RU')} icon="👁" />
          <KpiCard label="Конверсия" value={`${stats.conversionRate.toFixed(1)}%`} icon="📈" />
          <KpiCard label="Доход (30 дн.)" value={formatPrice(stats.totalRevenue)} icon="💰" />
          <KpiCard label="Загруженность" value={`${stats.occupancyRate.toFixed(0)}%`} icon="🏠" />
          <KpiCard label="Активных объявлений" value={stats.activeListings.toString()} icon="📋" />
          <KpiCard label="Ожидают бронирования" value={stats.pendingBookings.toString()} icon="⏳" />
          <KpiCard label="Средний рейтинг" value={stats.avgRating.toFixed(1)} icon="⭐" />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">Доход по неделям</h2>
          <div className="flex items-end gap-2 h-40">
            {stats.revenueByWeek.map(({ week, revenue }) => {
              const maxRevenue = Math.max(...stats.revenueByWeek.map(w => w.revenue), 1);
              const height = (revenue / maxRevenue) * 100;
              return (
                <div key={week} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-brand-500 rounded-t" style={{ height: `${height}%` }} title={formatPrice(revenue)} />
                  <span className="text-xs text-gray-400 rotate-45 origin-left">{week.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Listings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">Топ объявлений</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left py-2">Объявление</th>
                <th className="text-right py-2">Просмотры</th>
                <th className="text-right py-2">Бронирования</th>
              </tr>
            </thead>
            <tbody>
              {stats.topListings.map(l => (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="py-2 text-gray-900">{l.title}</td>
                  <td className="py-2 text-right text-gray-600">{l.views.toLocaleString('ru-RU')}</td>
                  <td className="py-2 text-right text-gray-600">{l.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
