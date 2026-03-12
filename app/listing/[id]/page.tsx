'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { IconStar, IconShield, IconHeart, IconMapPin, IconShare, IconPhone, IconMessage, IconBed, IconArea, IconFloor, IconCalendar, IconWifi, IconParking, IconPet, IconBrain, IconChevron, IconCheck } from '@/components/Icons';

const LISTINGS: Record<string, {
  id: number; title: string; location: string; address: string; price: number; priceMonth: number;
  rooms: number; area: number; floor: string; year: number; verified: boolean; badge?: string;
  rating: number; reviews: number; metro?: string; metroMin?: number;
  images: string[]; description: string; amenities: string[];
  owner: { name: string; photo: string; rating: number; reviews: number; years: number };
  deposit: number; commission: string; minTerm: string; util: string;
  aiScore: { match: number; price: number; description: number; owner: number };
}> = {
  '1': {
    id: 1, title: 'Студия в центре Арбата', location: 'Москва, Арбат', address: 'ул. Арбат, д. 14', price: 55000, priceMonth: 55000,
    rooms: 1, area: 32, floor: '4/9', year: 2015, verified: true, badge: 'Топ', rating: 4.9, reviews: 47,
    metro: 'Арбатская', metroMin: 3,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=85',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=85',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900&q=85',
    ],
    description: 'Уютная студия в самом сердце Москвы, на знаменитой улице Арбат. Квартира полностью укомплектована всем необходимым для комфортного проживания. Свежий ремонт, качественная мебель, современная техника. В шаговой доступности множество ресторанов, магазинов и культурных объектов. Идеально для деловых людей и тех, кто ценит расположение.',
    amenities: ['Wi-Fi', 'Стиральная машина', 'Холодильник', 'Кондиционер', 'Телевизор', 'Мебель', 'Посудомойка', 'Можно с животными'],
    owner: { name: 'Александр М.', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', rating: 4.9, reviews: 124, years: 3 },
    deposit: 55000, commission: '0%', minTerm: 'от 1 месяца', util: 'включены',
    aiScore: { match: 96, price: 82, description: 94, owner: 97 },
  },
  '2': {
    id: 2, title: 'Апартаменты с панорамным видом', location: 'СПб, Невский пр.', address: 'Невский пр., д. 80', price: 85000, priceMonth: 85000,
    rooms: 2, area: 65, floor: '12/16', year: 2019, verified: true, badge: 'Новое', rating: 5.0, reviews: 23,
    metro: 'Невский пр.', metroMin: 2,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=85',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=85',
    ],
    description: 'Роскошные апартаменты с панорамным видом на Невский проспект. Полностью обновлённый дизайнерский интерьер, высокие потолки, большие окна. Два просторных балкона с захватывающим видом на центр Санкт-Петербурга. Квартира оснащена всей необходимой техникой премиум-класса.',
    amenities: ['Wi-Fi', 'Стиральная машина', 'Холодильник', 'Кондиционер', 'Телевизор', 'Мебель', 'Балкон', 'Паркинг'],
    owner: { name: 'Елена В.', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', rating: 5.0, reviews: 67, years: 5 },
    deposit: 85000, commission: '0%', minTerm: 'от 3 месяцев', util: 'включены',
    aiScore: { match: 98, price: 88, description: 97, owner: 99 },
  },
};

const REVIEWS = [
  { name: 'Михаил К.', date: 'Январь 2026', rating: 5, text: 'Отличная квартира, всё как на фото. Хозяин очень отзывчивый, ответил на все вопросы. Буду рекомендовать друзьям.', avatar: 'М' },
  { name: 'Анастасия Л.', date: 'Декабрь 2025', rating: 5, text: 'Жила 3 месяца. Квартира уютная, чистая, хорошее расположение. Всё работает. Спасибо!', avatar: 'А' },
  { name: 'Дмитрий П.', date: 'Ноябрь 2025', rating: 4, text: 'Хорошая квартира за разумные деньги. Рядом метро, магазины. Единственный минус — шум с улицы ночью.', avatar: 'Д' },
  { name: 'Ирина С.', date: 'Октябрь 2025', rating: 5, text: 'Прекрасная студия! Идеально для одного человека или пары. Всё есть, ничего лишнего. Буду снимать снова.', avatar: 'И' },
];

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Wi-Fi': <IconWifi />,
  'Паркинг': <IconParking />,
  'Можно с животными': <IconPet />,
};

export default function ListingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, setShowAuthModal, toggleFavorite, isFavorite } = useApp();
  const listing = LISTINGS[params.id] || LISTINGS['1'];
  const [mainPhoto, setMainPhoto] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'amenities' | 'reviews' | 'location'>('desc');
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FF', fontFamily: 'Manrope, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Manrope:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        @media (max-width: 768px) {
          .listing-layout { display: flex !important; flex-direction: column !important; gap: 0 !important; }
          .listing-sidebar { position: static !important; width: 100% !important; max-width: 100% !important; margin-top: 20px !important; }
          .gallery-grid { grid-template-columns: 1fr !important; height: 260px !important; }
          .gallery-grid > div:not(:first-child) { display: none !important; }
        }
      `}</style>

      {/* Simple navbar for listing page */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #f0f0f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/search" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, color: '#555', fontSize: 14, fontWeight: 600 }}>
              <IconChevron dir="left" /> Назад
            </Link>
            <div style={{ width: 1, height: 20, background: '#e5e7eb' }} />
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 18, fontWeight: 900, color: '#111', letterSpacing: '-0.5px' }}>Locus</span>
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#555' }}>
              <IconShare /> Поделиться
            </button>
            <button onClick={() => { if (user) toggleFavorite(listing.id); else setShowAuthModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 7, background: isFavorite(listing.id) ? '#FFF0F1' : 'none', border: `1.5px solid ${isFavorite(listing.id) ? '#FF4757' : '#e5e7eb'}`, borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: isFavorite(listing.id) ? '#FF4757' : '#555' }}>
              <IconHeart filled={isFavorite(listing.id)} /> {isFavorite(listing.id) ? 'В избранном' : 'Сохранить'}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 80px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, color: '#888' }}>
          <Link href="/" style={{ color: '#0066FF', textDecoration: 'none', fontWeight: 600 }}>Главная</Link>
          <span>/</span>
          <Link href="/search" style={{ color: '#0066FF', textDecoration: 'none', fontWeight: 600 }}>Аренда</Link>
          <span>/</span>
          <span>{listing.location}</span>
          <span>/</span>
          <span style={{ color: '#333', fontWeight: 600 }}>{listing.title}</span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            {listing.badge && (
              <span style={{ background: listing.badge === 'Топ' ? '#FF6B35' : listing.badge === 'Новое' ? '#00C896' : '#7C3AED', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{listing.badge}</span>
            )}
            {listing.verified && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#EDFBF4', color: '#00C896', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
                <IconShield color="#00C896" /> AI-верификация пройдена
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, color: '#111', lineHeight: 1.3, marginBottom: 10, letterSpacing: '-0.5px' }}>
            {listing.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: '#666' }}>
              <IconMapPin /> {listing.address}
            </span>
            {listing.metro && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: '#0066FF', fontWeight: 600 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0066FF', display: 'inline-block' }} />
                {listing.metro} — {listing.metroMin} мин пешком
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <IconStar filled />
              <span style={{ fontWeight: 800, fontSize: 14 }}>{listing.rating}</span>
              <span style={{ fontSize: 13, color: '#888' }}>({listing.reviews} отзывов)</span>
            </div>
          </div>
        </div>

        {/* Photo gallery */}
        <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 40, borderRadius: 20, overflow: 'hidden', height: 480 }}>
          <div style={{ position: 'relative', height: '100%', cursor: 'pointer' }}>
            <img src={listing.images[mainPhoto]} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12, height: '100%' }}>
            {listing.images.slice(1, 5).map((img, i) => (
              <div key={i} style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', borderRadius: 4 }} onClick={() => setMainPhoto(i + 1)}>
                <img src={img} alt={`photo${i + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                  onMouseEnter={e => (e.target as HTMLImageElement).style.transform = 'scale(1.05)'}
                  onMouseLeave={e => (e.target as HTMLImageElement).style.transform = 'scale(1)'}
                />
                {i === 3 && listing.images.length > 5 && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>
                    +{listing.images.length - 5} фото
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content + sidebar */}
        <div className="listing-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
          {/* Left */}
          <div>
            {/* Quick specs */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', marginBottom: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                {[
                  { icon: <IconBed />, label: 'Комнат', val: String(listing.rooms) },
                  { icon: <IconArea />, label: 'Площадь', val: `${listing.area} м²` },
                  { icon: <IconFloor />, label: 'Этаж', val: listing.floor },
                  { icon: <IconCalendar />, label: 'Год постройки', val: String(listing.year) },
                ].map((spec, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '16px 12px', background: '#F7F9FF', borderRadius: 16 }}>
                    <div style={{ color: '#0066FF', display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{spec.icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#111', marginBottom: 4 }}>{spec.val}</div>
                    <div style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>{spec.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Score */}
            <div style={{ background: 'linear-gradient(135deg, #0A1628, #0D2B6B)', borderRadius: 20, padding: '24px 28px', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,180,255,0.2)', border: '1px solid rgba(0,180,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4DB8FF' }}><IconBrain /></div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>AI-анализ объявления</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Locus проверил это объявление</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Соответствие описания', val: listing.aiScore.match, color: '#00E5A0' },
                  { label: 'Справедливость цены', val: listing.aiScore.price, color: '#4DB8FF' },
                  { label: 'Качество объявления', val: listing.aiScore.description, color: '#A78BFA' },
                  { label: 'Надёжность хозяина', val: listing.aiScore.owner, color: '#FB923C' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{s.label}</span>
                      <span style={{ color: '#fff', fontWeight: 800, fontSize: 12 }}>{s.val}%</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.val}%`, background: s.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', marginBottom: 28 }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                {[
                  { key: 'desc', label: 'Описание' },
                  { key: 'amenities', label: 'Удобства' },
                  { key: 'reviews', label: `Отзывы (${listing.reviews})` },
                  { key: 'location', label: 'Расположение' },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key as 'desc' | 'amenities' | 'reviews' | 'location')} style={{
                    flex: 1, padding: '16px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 700,
                    color: activeTab === tab.key ? '#0066FF' : '#888',
                    borderBottom: `2.5px solid ${activeTab === tab.key ? '#0066FF' : 'transparent'}`,
                    transition: 'all 0.2s',
                  }}>{tab.label}</button>
                ))}
              </div>

              <div style={{ padding: '28px' }}>
                {activeTab === 'desc' && (
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: '#444' }}>{listing.description}</p>
                )}

                {activeTab === 'amenities' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {listing.amenities.map((a, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#F7F9FF', borderRadius: 12 }}>
                        <div style={{ color: '#0066FF', display: 'flex' }}>
                          {AMENITY_ICONS[a] || <IconCheck />}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{a}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, padding: '20px', background: '#F7F9FF', borderRadius: 16 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 48, fontWeight: 900, color: '#111', lineHeight: 1 }}>{listing.rating}</div>
                        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 6 }}>
                          {[1,2,3,4,5].map(s => <IconStar key={s} filled={s <= Math.round(listing.rating)} />)}
                        </div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>из 5</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        {[5,4,3,2,1].map(s => (
                          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: '#555', width: 8, textAlign: 'right' }}>{s}</span>
                            <IconStar filled />
                            <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', background: '#FFB800', borderRadius: 3, width: s === 5 ? '75%' : s === 4 ? '18%' : '7%' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      {REVIEWS.map((r, i) => (
                        <div key={i} style={{ padding: '20px', background: '#F7F9FF', borderRadius: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0066FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16 }}>{r.avatar}</div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                              <div style={{ fontSize: 12, color: '#888' }}>{r.date}</div>
                            </div>
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                              {[1,2,3,4,5].map(s => <IconStar key={s} filled={s <= r.rating} />)}
                            </div>
                          </div>
                          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{r.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div>
                    <p style={{ fontSize: 15, color: '#444', marginBottom: 16 }}>
                      <strong>{listing.address}</strong> — {listing.location}
                    </p>
                    {listing.metro && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '12px 16px', background: '#EFF4FF', borderRadius: 12 }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#0066FF', display: 'inline-block' }} />
                        <span style={{ fontWeight: 700, color: '#0066FF' }}>Метро {listing.metro}</span>
                        <span style={{ color: '#555' }}>— {listing.metroMin} минут пешком</span>
                      </div>
                    )}
                    <div style={{ height: 280, background: 'linear-gradient(135deg, #e8f0fe, #d2e3fc)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0066FF', fontWeight: 700, fontSize: 15 }}>
                      🗺 Карта (подключите Google Maps API)
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Owner */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>Арендодатель</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img src={listing.owner.photo} alt={listing.owner.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{listing.owner.name}</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#666' }}><IconStar filled />{listing.owner.rating}</span>
                    <span style={{ fontSize: 13, color: '#666' }}>{listing.owner.reviews} отзывов</span>
                    <span style={{ fontSize: 13, color: '#666' }}>{listing.owner.years} года на Locus</span>
                  </div>
                </div>
                {listing.verified && (
                  <div style={{ background: '#EDFBF4', border: '1px solid #B7F3DD', borderRadius: 12, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconShield />
                    <span style={{ fontSize: 12, color: '#00C896', fontWeight: 700 }}>Супер-хозяин</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking */}
          <div className="listing-sidebar" style={{ position: 'sticky', top: 90 }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: '28px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' }}>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 28, fontWeight: 900, color: '#111' }}>{listing.price.toLocaleString('ru-RU')} ₽</span>
                <span style={{ fontSize: 14, color: '#888' }}>/мес</span>
              </div>

              {/* Details table */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
                {[
                  { label: 'Залог', val: `${listing.deposit.toLocaleString('ru-RU')} ₽` },
                  { label: 'Комиссия', val: listing.commission },
                  { label: 'Срок аренды', val: listing.minTerm },
                  { label: 'Коммунальные', val: listing.util },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none' }}>
                    <span style={{ fontSize: 14, color: '#777' }}>{row.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{row.val}</span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => { if (!user) setShowAuthModal(true); else { alert('Заявка на просмотр отправлена! Хозяин свяжется с вами.'); } }} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #0057E7, #0EA5E9)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,87,231,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <IconCalendar /> Записаться на просмотр
                </button>

                <button onClick={() => setShowPhone(!showPhone)} style={{ width: '100%', padding: '13px', background: showPhone ? '#F7F9FF' : '#fff', color: '#111', border: '1.5px solid #e5e7eb', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <IconPhone />{showPhone ? '+7 (999) 123-45-67' : 'Показать телефон'}
                </button>

                <button onClick={() => router.push('/messages?dialog=1')} style={{ width: '100%', padding: '13px', background: '#fff', color: '#0066FF', border: '1.5px solid #0066FF', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <IconMessage /> Написать хозяину
                </button>
              </div>

              <p style={{ fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: 14 }}>
                Вы ни за что не платите до подписания договора
              </p>
            </div>

            {/* Price analysis */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', marginTop: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <IconBrain />
                <span style={{ fontWeight: 800, fontSize: 14 }}>Анализ цены</span>
              </div>
              <p style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>
                Средняя цена в районе: <strong>62 000 ₽/мес</strong>
              </p>
              <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${listing.aiScore.price}%`, background: 'linear-gradient(to right, #00E5A0, #0066FF)', borderRadius: 3 }} />
              </div>
              <p style={{ fontSize: 12, color: '#00C896', fontWeight: 700 }}>
                Цена ниже рыночной на 11% — выгодное предложение
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
