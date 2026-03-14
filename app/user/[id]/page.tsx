'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { useApp } from '@/context/AppContext';
import { LISTINGS } from '@/lib/data';

export default function UserPublicPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const { setShowAuthModal } = useApp();
  const [tab, setTab] = useState<'listings' | 'reviews'>('listings');

  // Get user's listings from LISTINGS (mock: first 2 for demo user)
  const userListings = LISTINGS.filter((_, i) => i < 2).map((l) => ({
    id: String(l.id),
    title: l.title,
    price: l.price,
    location: l.location,
    rooms: l.rooms,
    area: l.area,
    img: l.images?.[0],
    status: 'active' as const,
  }));

  const profileUser = {
    id,
    name: 'Иван Петров',
    avatar: 'И',
    email: 'user@locus.ru',
    joinDate: '2024-06-15',
    rating: 4.9,
    reviewsCount: 124,
    verified: true,
    isSuperHost: true,
    listings: userListings,
    bio: 'Сдаю квартиры в Москве уже 3 года. Всегда на связи, быстро решаю вопросы. Чистота и порядок гарантированы.',
  };

  const joinYear = new Date(profileUser.joinDate).getFullYear();
  const yearsOnPlatform = new Date().getFullYear() - joinYear;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '80px' }}>
      <Navbar onLogin={()=>setShowAuthModal(true)} onRegister={()=>setShowAuthModal(true)} />

      {/* Hero */}
      <div style={{ paddingTop: 66, background: 'linear-gradient(135deg, #0057E7 0%, #0EA5E9 100%)', padding: '40px 0 60px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 700, color: '#fff', border: '3px solid rgba(255,255,255,0.4)' }}>
            {profileUser.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#fff' }}>{profileUser.name}</h1>
              {profileUser.isSuperHost && (
                <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' }}>
                  ⭐ Супер-хозяин
                </span>
              )}
              {profileUser.verified && (
                <span style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(74,222,128,0.3)' }}>
                  ✓ Верифицирован
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>⭐ {profileUser.rating}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{profileUser.reviewsCount} отзывов</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{profileUser.listings.length}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Объявлений</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{yearsOnPlatform > 0 ? yearsOnPlatform + ' г.' : '< 1 г.'}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>На Locus</div>
              </div>
            </div>
          </div>
          <Link href="/messages?dialog=1" style={{ padding: '12px 24px', borderRadius: '12px', background: '#fff', color: '#0057E7', fontWeight: 700, fontSize: '15px', textDecoration: 'none', flexShrink: 0 }}>
            💬 Написать
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '-20px auto 0', padding: '0 24px' }}>
        {profileUser.bio && (
          <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>О хозяине</h3>
            <p style={{ margin: 0, color: 'var(--text)', lineHeight: 1.6 }}>{profileUser.bio}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 0, background: 'var(--card-bg)', borderRadius: '12px', padding: 4, marginBottom: '20px', border: '1px solid var(--border)' }}>
          {[['listings', 'Объявления'], ['reviews', 'Отзывы']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key as 'listings' | 'reviews')}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', background: tab === key ? '#0057E7' : 'transparent', color: tab === key ? '#fff' : 'var(--text2)', transition: 'all 0.2s' }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'listings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {profileUser.listings.map((listing) => (
              <Link key={listing.id} href={`/listing/${listing.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  {listing.img ? (
                    <Image src={listing.img} alt={listing.title} width={120} height={100} style={{ objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '120px', height: '100px', background: 'var(--surface2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)' }}>—</div>
                  )}
                  <div style={{ padding: '16px', flex: 1 }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>{listing.title}</h3>
                    <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text2)' }}>{listing.location}</p>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
                      {listing.price.toLocaleString('ru')} ₽<span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text2)' }}>/мес</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Мария С.', date: '2024-11-15', rating: 5, text: 'Отличный хозяин! Всё как на фото, очень чисто и уютно. Быстро отвечал на все вопросы.' },
              { name: 'Пётр В.', date: '2024-10-03', rating: 5, text: 'Приятное общение, квартира в отличном состоянии. Рекомендую!' },
              { name: 'Анна К.', date: '2024-09-12', rating: 4, text: 'В целом всё хорошо, небольшая задержка с заселением, но хозяин компенсировал.' },
            ].map((review, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '15px' }}>{review.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{new Date(review.date).toLocaleDateString('ru', { month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div style={{ color: '#f59e0b', fontSize: '16px' }}>{'★'.repeat(review.rating)}</div>
                </div>
                <p style={{ margin: 0, color: 'var(--text)', lineHeight: 1.5 }}>{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
