// app/listings/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listingService } from '@/services/listing.service';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const listing = await listingService.getListingById(params.id);
    return {
      title: listing.seoTitle ?? listing.title,
      description: listing.seoDescription ?? listing.description.slice(0, 160),
      openGraph: {
        title: listing.title,
        description: listing.description.slice(0, 160),
        images: listing.primaryImage ? [{ url: listing.primaryImage }] : [],
      },
    };
  } catch {
    return { title: 'Объявление не найдено' };
  }
}

export default async function ListingPage({ params }: Props) {
  let listing;
  try {
    listing = await listingService.getListingById(params.id);
  } catch {
    notFound();
  }

  if (listing.status !== 'ACTIVE') notFound();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Image gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-96 mb-8">
        {listing.images.slice(0, 5).map((img, i) => (
          <div
            key={img.id}
            className={`bg-slate-100 overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
          >
            <img src={img.url} alt={img.altText ?? listing.title} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main content */}
        <div className="col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
              <p className="text-slate-500 mt-1">
                {listing.city}, {listing.country} · {listing.bedrooms} спальни · {listing.maxGuests} гостей
              </p>
            </div>
            {listing.avgRating > 0 && (
              <div className="text-right">
                <span className="text-lg font-bold">★ {listing.avgRating.toFixed(1)}</span>
                <p className="text-xs text-slate-400">{listing.totalReviews} отзывов</p>
              </div>
            )}
          </div>

          <hr className="my-6" />

          {/* Host info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
              {listing.host.avatarUrl && (
                <img src={listing.host.avatarUrl} alt="host" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <p className="font-medium text-slate-900">
                Хозяин: {listing.host.profile?.firstName} {listing.host.profile?.lastName}
                {listing.host.profile?.isVerified && (
                  <span className="ml-2 text-xs bg-accent-500 text-white px-2 py-0.5 rounded-full">✓ Верифицирован</span>
                )}
              </p>
              <p className="text-xs text-slate-400">
                На LOCOS с {new Date(listing.host.createdAt).getFullYear()}
              </p>
            </div>
          </div>

          <hr className="my-6" />

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-3">Описание</h2>
            <p className="text-slate-600 leading-relaxed">{listing.description}</p>
          </div>

          {/* Features */}
          {listing.features.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-3">Удобства</h2>
              <div className="grid grid-cols-2 gap-2">
                {listing.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-slate-600 text-sm">
                    <span>✓</span> {f.replace(/_/g, ' ')}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking card */}
        <div className="col-span-1">
          <div className="card p-6 sticky top-6">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold">
                {listing.pricePerNight.toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-slate-400">/ночь</span>
            </div>

            {listing.aiPriceSuggestion && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm">
                <p className="text-blue-700 font-medium">💡 AI рекомендует</p>
                <p className="text-blue-600">
                  Рекомендованная цена: {listing.aiPriceSuggestion.toLocaleString('ru-RU')} ₽/ночь
                </p>
              </div>
            )}

            <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
              <div className="grid grid-cols-2">
                <div className="p-3 border-r border-slate-200">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Заезд</label>
                  <input type="date" className="w-full text-sm mt-1 outline-none" />
                </div>
                <div className="p-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Выезд</label>
                  <input type="date" className="w-full text-sm mt-1 outline-none" />
                </div>
              </div>
              <div className="p-3 border-t border-slate-200">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Гости</label>
                <select className="w-full text-sm mt-1 outline-none">
                  {[...Array(listing.maxGuests)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} гост{i === 0 ? 'ь' : i < 4 ? 'я' : 'ей'}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn-primary w-full py-3 text-base">
              Забронировать
            </button>

            <p className="text-xs text-center text-slate-400 mt-3">
              Оплата только после подтверждения
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
