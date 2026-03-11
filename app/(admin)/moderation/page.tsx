'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';

interface PendingListing {
  id: string;
  title: string;
  city: string;
  pricePerNight: number;
  currency: string;
  host: { email: string; profile: { firstName: string; lastName: string } | null };
  images: { url: string }[];
  createdAt: string;
}

export default function ModerationPage() {
  const [listings, setListings] = useState<PendingListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    api.get<PendingListing[]>('/api/admin/listings')
      .then(r => setListings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const approve = async (id: string) => {
    setProcessing(id);
    try {
      await api.patch(`/api/admin/listings/${id}/approve`, {});
      setListings(prev => prev.filter(l => l.id !== id));
    } finally {
      setProcessing(null);
    }
  };

  const reject = async (id: string) => {
    const reason = prompt('Причина отклонения:');
    if (!reason) return;
    setProcessing(id);
    try {
      await api.patch(`/api/admin/listings/${id}/reject`, { reason });
      setListings(prev => prev.filter(l => l.id !== id));
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Модерация объявлений ({listings.length})</h1>
        <div className="space-y-4">
          {listings.map(listing => (
            <div key={listing.id} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
              {listing.images[0] && (
                <img src={listing.images[0].url} alt="" className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
                <p className="text-sm text-gray-500">{listing.city} · {listing.pricePerNight} {listing.currency}/ночь</p>
                <p className="text-sm text-gray-500">
                  {listing.host.profile?.firstName} {listing.host.profile?.lastName} · {listing.host.email}
                </p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => approve(listing.id)}
                  disabled={processing === listing.id}
                  className="bg-accent-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600 disabled:opacity-50"
                >
                  Одобрить
                </button>
                <button
                  onClick={() => reject(listing.id)}
                  disabled={processing === listing.id}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
                >
                  Отклонить
                </button>
              </div>
            </div>
          ))}
          {listings.length === 0 && (
            <div className="text-center py-20 text-gray-500">Нет объявлений для модерации</div>
          )}
        </div>
      </div>
    </div>
  );
}
