'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import Navbar from '@/components/Navbar';
import { IconSearch, IconHome, IconMapPin, IconStar, IconShield, IconHeart, IconFilter, IconChevron, IconBrain, IconArrow, IconSparkle } from '@/components/Icons';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1800&q=90',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1800&q=90',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1800&q=90',
];

const FEATURED = [
  { id: 1, img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80', title: 'Студия в центре', location: 'Москва, Арбат', price: '55 000', rooms: 1, area: 32, metro: 'Арбатская', metroMin: 3, badge: 'Топ', verified: true, rating: 4.9, reviews: 47 },
  { id: 2, img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80', title: 'Апартаменты с панорамным видом', location: 'СПб, Невский пр.', price: '85 000', rooms: 2, area: 65, metro: 'Невский пр.', metroMin: 2, badge: 'Новое', verified: true, rating: 5.0, reviews: 23 },
  { id: 3, img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80', title: 'Дизайнерская 3-комнатная', location: 'Москва, Пресня', price: '120 000', rooms: 3, area: 95, metro: '1905 года', metroMin: 7, badge: 'Премиум', verified: true, rating: 4.8, reviews: 89 },
  { id: 4, img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=700&q=80', title: 'Уютная 2-комнатная', location: 'Казань, Центр', price: '45 000', rooms: 2, area: 55, metro: 'Кремлёвская', metroMin: 5, verified: true, rating: 4.7, reviews: 31 },
  { id: 5, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80', title: 'Светлая студия рядом с метро', location: 'Москва, Выхино', price: '38 000', rooms: 1, area: 28, metro: 'Выхино', metroMin: 1, verified: false, rating: 4.5, reviews: 12 },
  { id: 6, img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80', title: 'Загородный дом с баней', location: 'Подмосковье, Истра', price: '95 000', rooms: 4, area: 180, verified: true, rating: 4.9, reviews: 15, badge: 'Эксклюзив' },
];

const CATEGORIES = [
  { img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80', label: 'Студии', count: '18 400' },
  { img: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&q=80', label: '1-комнатные', count: '34 200' },
  { img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80', label: '2-комнатные', count: '29 800' },
  { img: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&q=80', label: '3+ комнаты', count: '15 600' },
  { img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80', label: 'Дома', count: '8 100' },
  { img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80', label: 'Апартаменты', count: '12 300' },
  { img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80', label: 'Новостройки', count: '5 200' },
  { img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80', label: 'Загородные', count: '9 700' },
];

const CITIES = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск', 'Краснодар', 'Сочи', 'Нижний Новгород'];

function ListingCard({ item }: { item: typeof FEATURED[0] }) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/listing/${item.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: 20, overflow: 'hidden', background: '#fff',
          boxShadow: hovered ? '0 24px 64px rgba(0,0,0,0.14)' : '0 2px 16px rgba(0,0,0,0.07)',
          transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          cursor: 'pointer',
        }}
      >
        <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hovered ? 'scale(1.07)' : 'scale(1)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
          {item.badge && (
            <div style={{
              position: 'absolute', top: 14, left: 14, color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.8px', textTransform: 'uppercase',
              background: item.badge === 'Топ' ? '#FF6B35' : item.badge === 'Новое' ? '#00C896' : item.badge === 'Премиум' ? '#7C3AED' : '#F59E0B',
            }}>{item.badge}</div>
          )}
          <button onClick={(e) => { e.preventDefault(); setSaved(!saved); }} style={{
            position: 'absolute', top: 12, right: 12, background: saved ? '#FF4757' : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
            border: 'none', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
          }}><IconHeart filled={saved} /></button>
          <div style={{ position: 'absolute', bottom: 12, right: 14, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', color: '#fff', borderRadius: 10, padding: '5px 12px' }}>
            <span style={{ fontSize: 18, fontWeight: 900 }}>{item.price} ₽</span>
            <span style={{ fontSize: 11, opacity: 0.75 }}>/мес</span>
          </div>
        </div>
        <div style={{ padding: '16px 18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            {item.metro && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#0066FF', fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0066FF', display: 'inline-block' }} />
                {item.metro} · {item.metroMin} мин
              </span>
            )}
            {item.verified && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#00C896', fontWeight: 700 }}>
                <IconShield /> Верифицировано
              </span>
            )}
          </div>
          <h3 style={{ margin: '0 0 5px', fontSize: 16, fontWeight: 800, color: '#111', lineHeight: 1.3 }}>{item.title}</h3>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconMapPin />{item.location}
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {[`${item.rooms} комн.`, `${item.area} м²`].map((s, i) => (
              <span key={i} style={{ fontSize: 12, color: '#555', background: '#F4F6FB', borderRadius: 8, padding: '4px 10px', fontWeight: 600 }}>{s}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <IconStar filled />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>{item.rating}</span>
              <span style={{ fontSize: 12, color: '#bbb' }}>({item.reviews})</span>
            </div>
            <span style={{ fontSize: 13, color: '#0066FF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              Подробнее <IconArrow />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FilterBar() {
  const [dealType, setDealType] = useState('Аренда');
  const [propType, setPropType] = useState('');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');
  const [metro, setMetro] = useState('');
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  const DropBtn = ({ name, value, placeholder, options, setter }: { name: string; value: string; placeholder: string; options: string[]; setter: (v: string) => void }) => (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpenDrop(openDrop === name ? null : name)} style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px',
        background: value ? '#EFF4FF' : '#fff', border: `1.5px solid ${value ? '#0066FF' : '#e5e7eb'}`,
        borderRadius: 12, fontSize: 14, fontWeight: 600, color: value ? '#0066FF' : '#555',
        cursor: 'pointer', whiteSpace: 'nowrap', minWidth: 120, transition: 'all 0.15s',
      }}>
        {value || placeholder} <IconChevron dir={openDrop === name ? 'up' : 'down'} />
      </button>
      {openDrop === name && (
        <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 200, background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 16, boxShadow: '0 16px 40px rgba(0,0,0,0.14)', minWidth: 180, overflow: 'hidden' }}>
          <div onClick={() => { setter(''); setOpenDrop(null); }} style={{ padding: '10px 16px', fontSize: 13, color: '#999', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>Любой</div>
          {options.map(opt => (
            <div key={opt} onClick={() => { setter(opt); setOpenDrop(null); }} style={{
              padding: '10px 16px', fontSize: 14, cursor: 'pointer',
              background: value === opt ? '#EFF4FF' : 'transparent', color: value === opt ? '#0066FF' : '#333', fontWeight: value === opt ? 700 : 400,
            }}
            onMouseEnter={e => { if (value !== opt) (e.currentTarget as HTMLElement).style.background = '#F8FAFF'; }}
            onMouseLeave={e => { if (value !== opt) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: 12, padding: 3, gap: 2, border: '1px solid rgba(255,255,255,0.2)' }}>
        {['Аренда', 'Продажа', 'Посуточно'].map(t => (
          <button key={t} onClick={() => setDealType(t)} style={{
            background: dealType === t ? '#fff' : 'transparent', border: 'none', borderRadius: 10,
            padding: '8px 14px', fontSize: 13, fontWeight: 700, color: dealType === t ? '#0066FF' : 'rgba(255,255,255,0.85)',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>{t}</button>
        ))}
      </div>
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <DropBtn name="propType" value={propType} placeholder="Тип жилья" setter={setPropType} options={['Квартира', 'Студия', 'Апартаменты', 'Комната', 'Дом / Коттедж', 'Таунхаус']} />
        <DropBtn name="rooms" value={rooms} placeholder="Комнаты" setter={setRooms} options={['Студия', '1 комната', '2 комнаты', '3 комнаты', '4+ комнат']} />
        <DropBtn name="price" value={price} placeholder="Цена" setter={setPrice} options={['до 30 000 ₽', 'до 50 000 ₽', 'до 80 000 ₽', 'до 120 000 ₽', 'от 120 000 ₽']} />
        <DropBtn name="metro" value={metro} placeholder="Метро / Район" setter={setMetro} options={['Центр', 'до 5 мин пешком', 'до 10 мин пешком', 'до 15 мин', 'Без метро']} />
      </div>
      <Link href="/search" style={{ textDecoration: 'none' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12, padding: '10px 16px', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
          <IconFilter /> Ещё фильтры
        </button>
      </Link>
    </div>
  );
}

export default function HomePage() {
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [query, setQuery] = useState('');
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Manrope', sans-serif; background: #F7F9FF; color: #111; -webkit-font-smoothing: antialiased; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.6 } }
        .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .categories-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        @media(max-width:1100px) { .cards-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:700px) { .cards-grid { grid-template-columns: 1fr; } .categories-grid { grid-template-columns: repeat(2,1fr); } }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 4px; }
      `}</style>

      <Navbar onLogin={() => setAuthMode('login')} onRegister={() => setAuthMode('register')} />

      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 680, overflow: 'hidden' }}>
        {HERO_IMAGES.map((src, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: heroIdx === i ? 1 : 0, transition: 'opacity 1.2s ease' }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,10,30,0.7) 0%, rgba(5,10,30,0.35) 55%, rgba(5,10,30,0.8) 100%)' }} />

        {/* Slideshow dots */}
        <div style={{ position: 'absolute', bottom: 32, right: 32, display: 'flex', gap: 8, zIndex: 10 }}>
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} style={{ width: heroIdx === i ? 28 : 8, height: 8, borderRadius: 4, border: 'none', background: heroIdx === i ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 5, maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 80 }}>
          {/* AI badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 30, padding: '7px 18px', marginBottom: 24, width: 'fit-content', animation: 'fadeInUp 0.5s ease both' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E5A0', boxShadow: '0 0 8px #00E5A0', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>AI-поиск нового поколения · 5 млн объявлений</span>
          </div>

          <h1 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(32px, 5vw, 66px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 18, animation: 'fadeInUp 0.6s ease 0.1s both' }}>
            Найдите идеальное<br />
            <span style={{ color: '#4DB8FF' }}>жильё</span> — быстро
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 18, fontWeight: 500, marginBottom: 36, maxWidth: 520, animation: 'fadeInUp 0.6s ease 0.2s both' }}>
            Аренда и продажа с AI-верификацией, честными ценами и безопасными сделками
          </p>

          {/* Search box */}
          <div style={{ animation: 'fadeInUp 0.6s ease 0.3s both', maxWidth: 800 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '6px 6px 6px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', marginBottom: 14 }}>
              <IconSearch />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Город, район, метро, адрес или тип жилья..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', fontFamily: 'Manrope, sans-serif', color: '#111' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EFF4FF', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#0066FF', fontWeight: 700, whiteSpace: 'nowrap' }}>
                <IconBrain /> AI-поиск
              </div>
              <Link href={`/search?q=${encodeURIComponent(query)}`} style={{ textDecoration: 'none' }}>
                <button style={{ background: 'linear-gradient(135deg, #0057E7, #0EA5E9)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 28px', fontSize: 16, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,87,231,0.45)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconSearch /> Найти
                </button>
              </Link>
            </div>
            <FilterBar />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 36, marginTop: 40, animation: 'fadeInUp 0.6s ease 0.4s both' }}>
            {[{ val: '5 млн+', lbl: 'Объявлений' }, { val: '98%', lbl: 'Верифицированы' }, { val: '4.9★', lbl: 'Рейтинг' }, { val: '<48ч', lbl: 'Время сделки' }].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITY TABS */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CITIES.map(city => (
            <Link key={city} href={`/search?city=${encodeURIComponent(city)}`} style={{ textDecoration: 'none' }}>
              <button style={{ background: 'none', border: 'none', padding: '16px 20px', fontSize: 14, fontWeight: 700, color: '#555', cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: '2.5px solid transparent', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0066FF'; (e.currentTarget as HTMLElement).style.borderBottomColor = '#0066FF'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#555'; (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'; }}
              >{city}</button>
            </Link>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section style={{ padding: '64px 24px', background: '#F7F9FF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 28, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.8px' }}>Тип жилья</h2>
              <p style={{ color: '#888', fontSize: 15 }}>Выберите нужный формат</p>
            </div>
            <Link href="/search" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0066FF', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>Все <IconArrow /></button>
            </Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <Link key={i} href={`/search?type=${encodeURIComponent(cat.label)}`} style={{ textDecoration: 'none' }}>
                <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', height: 160, cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.18)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                >
                  <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.7) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{cat.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600 }}>{cat.count} объявл.</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 28, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.8px' }}>Популярные объявления</h2>
              <p style={{ color: '#888', fontSize: 15 }}>Проверены AI · Обновлено сегодня</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Новые', 'Дешевле', 'Рейтинг'].map(f => (
                <button key={f} style={{ background: '#F4F6FB', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#555', cursor: 'pointer' }}>{f}</button>
              ))}
            </div>
          </div>
          <div className="cards-grid">
            {FEATURED.map(item => <ListingCard key={item.id} item={item} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/search" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'none', border: '2px solid #0066FF', color: '#0066FF', borderRadius: 16, padding: '16px 48px', fontSize: 16, fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0066FF'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = '#0066FF'; }}
              >Все объявления <IconArrow /></button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI BANNER */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', background: 'linear-gradient(135deg, #0A1628 0%, #0D2B6B 50%, #0057E7 100%)', borderRadius: 32, padding: '72px 64px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div style={{ position: 'absolute', top: '-30%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,180,255,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,180,255,0.15)', border: '1px solid rgba(0,180,255,0.35)', borderRadius: 30, padding: '6px 16px', marginBottom: 24 }}>
                <IconSparkle />
                <span style={{ color: '#4DB8FF', fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>AI-технологии</span>
              </div>
              <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 20, letterSpacing: '-1px', lineHeight: 1.2 }}>
                Умный поиск<br />знает, что вам нужно
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
                Опишите жильё своими словами — AI найдёт лучшие варианты, сравнит цены и предупредит о рисках
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
                {[{ t: 'Анализ цены', d: 'Сравнение с рыночными ценами района' }, { t: 'Проверка фото', d: 'Выявление поддельных снимков' }, { t: 'Риски сделки', d: 'Предупреждение об опасных пунктах' }].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,180,255,0.15)', border: '1px solid rgba(0,180,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconShield />
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{f.t}</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/search" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#fff', color: '#0057E7', border: 'none', borderRadius: 14, padding: '14px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconBrain /> Попробовать AI-поиск
                </button>
              </Link>
            </div>
            {/* AI widget */}
            <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0066FF, #00BFFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconBrain /></div>
                <div style={{ color: '#fff', fontWeight: 700 }}>AI-анализ объявления</div>
                <div style={{ marginLeft: 'auto', fontSize: 12, color: '#4DB8FF', fontWeight: 700, background: 'rgba(77,184,255,0.15)', padding: '3px 10px', borderRadius: 20 }}>Активен</div>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 20 }} />
              {[{ label: 'Соответствие запросу', val: 96, color: '#00E5A0' }, { label: 'Справедливость цены', val: 84, color: '#4DB8FF' }, { label: 'Качество описания', val: 91, color: '#A78BFA' }, { label: 'Надёжность хозяина', val: 88, color: '#FB923C' }].map((item, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{item.label}</span>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{item.val}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.val}%`, background: item.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 28, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.8px' }}>Как это работает</h2>
            <p style={{ color: '#888', fontSize: 16 }}>3 шага до нового дома</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
            {[
              { n: '01', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80', title: 'Опишите что ищёте', desc: 'Укажите город, бюджет и параметры. AI сформирует персональную подборку из тысяч актуальных объявлений' },
              { n: '02', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80', title: 'AI проверит и оценит', desc: 'Каждое объявление верифицируется: фото, цена, описание и надёжность арендодателя' },
              { n: '03', img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80', title: 'Заключите сделку', desc: 'Онлайн-просмотр, безопасная переписка, электронный договор и гарантия возврата депозита' },
            ].map((step, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', transition: 'transform 0.3s, box-shadow 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}
              >
                <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                  <img src={step.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,87,231,0.65), transparent)' }} />
                  <div style={{ position: 'absolute', top: 20, left: 20, fontFamily: "'Unbounded', sans-serif", fontSize: 42, fontWeight: 900, color: 'rgba(255,255,255,0.22)', lineHeight: 1 }}>{step.n}</div>
                </div>
                <div style={{ padding: '24px 28px 28px' }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: '#F7F9FF' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: 'linear-gradient(135deg, #0057E7, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <IconHome />
          </div>
          <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 32, fontWeight: 900, marginBottom: 16, letterSpacing: '-1px' }}>Сдаёте жильё?</h2>
          <p style={{ color: '#666', fontSize: 17, lineHeight: 1.6, marginBottom: 36 }}>Разместите объявление бесплатно. AI определит оптимальную цену и поможет найти надёжных арендаторов</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => setAuthMode('register')} style={{ background: 'linear-gradient(135deg, #0057E7, #0EA5E9)', color: '#fff', border: 'none', borderRadius: 16, padding: '16px 36px', fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 30px rgba(0,87,231,0.4)' }}>Разместить бесплатно</button>
            <button style={{ background: '#fff', color: '#333', border: '2px solid #e5e7eb', borderRadius: 16, padding: '16px 28px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Узнать цену</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0A1628', padding: '64px 24px 32px', color: 'rgba(255,255,255,0.65)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #0057E7, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconHome /></div>
                <span style={{ fontFamily: "'Unbounded', sans-serif", color: '#fff', fontSize: 20, fontWeight: 900 }}>Locus</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>AI-маркетплейс аренды нового поколения. Умный поиск и безопасные сделки.</p>
            </div>
            {[
              { title: 'Арендаторам', items: ['Поиск жилья', 'AI-поиск', 'Безопасность', 'FAQ'] },
              { title: 'Арендодателям', items: ['Разместить', 'Тарифы', 'AI-оценка', 'Аналитика'] },
              { title: 'Компания', items: ['О нас', 'Пресс-центр', 'Карьера', 'Контакты'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color: '#fff', fontWeight: 800, fontSize: 14, marginBottom: 16 }}>{col.title}</h4>
                {col.items.map(item => (
                  <div key={item} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 14 }}
                      onMouseEnter={e => (e.target as HTMLElement).style.color = '#4DB8FF'}
                      onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
                    >{item}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 13 }}>© 2024 Locus. Все права защищены.</span>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Конфиденциальность', 'Соглашение'].map(t => (
                <a key={t} href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>{t}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSwitch={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} />}
    </>
  );
}
