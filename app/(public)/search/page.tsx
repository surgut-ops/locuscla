'use client';
import { useState, useEffect } from 'react';
import type { IListingSummary, ISearchParams } from '@/types';
import { api } from '@/lib/api-client';
import { cn, formatPrice } from '@/lib/utils';

export default function SearchPage() {
  const [listings, setListings] = useState<IListingSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');

  const search = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (query) params.q = query;
      if (city) params.city = city;
      const result = await api.get<{ listings: IListingSummary[] }>('/api/search', params);
      setListings(result.data.listings ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10 p-4">
        <div className="max-w-6xl mx-auto flex gap-3">
          <input
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Что ищете?"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <input
            className="w-40 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Город"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <button
            onClick={search}
            className="bg-brand-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-600 transition-colors"
          >
            Найти
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Поиск...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ListingCard({ listing }: { listing: IListingSummary }) {
  return (
    <a href={`/listings/${listing.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
        {listing.primaryImage ? (
          <img src={listing.primaryImage} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Нет фото</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{listing.city}</p>
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{listing.title}</h3>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">{formatPrice(listing.pricePerNight, listing.currency)}<span className="font-normal text-gray-500 text-sm">/ночь</span></span>
          {listing.avgRating > 0 && (
            <span className="text-sm text-gray-600">★ {listing.avgRating.toFixed(1)}</span>
          )}
        </div>
      </div>
    </a>
  );
}
