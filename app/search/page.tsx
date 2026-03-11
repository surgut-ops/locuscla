'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IconSearch, IconFilter, IconChevron, IconStar, IconShield, IconHeart, IconMapPin, IconGrid, IconList, IconMap, IconBrain, IconArrow } from '@/components/Icons';

const ALL_LISTINGS = [
  { id: 1, img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80', title: 'Студия в центре Арбата', location: 'Москва, Арбат', price: 55000, rooms: 1, area: 32, floor: '4/9', metro: 'Арбатская', metroMin: 3, badge: 'Топ', verified: true, rating: 4.9, reviews: 47, type: 'Студия' },
  { id: 2, img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80', title: 'Апартаменты с панорамным видом', location: 'СПб, Невский пр.', price: 85000, rooms: 2, area: 65, floor: '12/16', metro: 'Невский пр.', metroMin: 2, badge: 'Новое', verified: true, rating: 5.0, reviews: 23, type: 'Апартаменты' },
  { id: 3, img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80', title: 'Дизайнерская 3-комнатная', location: 'Москва, Пресня', price: 120000, rooms: 3, area: 95, floor: '3/5', metro: '1905 года', metroMin: 7, badge: 'Премиум', verified: true, rating: 4.8, reviews: 89, type: 'Квартира' },
  { id: 4, img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=700&q=80', title: 'Уютная 2-комнатная квартира', location: 'Казань, Центр', price: 45000, rooms: 2, area: 55, floor: '2/9', metro: 'Кремлёвская', metroMin: 5, verified: true, rating: 4.7, reviews: 31, type: 'Квартира' },
  { id: 5, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80', title: 'Светлая студия у метро', location: 'Москва, Выхино', price: 38000, rooms: 1, area: 28, floor: '7/14', metro: 'Выхино', metroMin: 1, verified: false, rating: 4.5, reviews: 12, type: 'Студия' },
  { id: 6, img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80', title: 'Загородный дом с баней', location: 'Подмосковье, Истра', price: 95000, rooms: 4, area: 180, floor: '2 этажа', verified: true, rating: 4.9, reviews: 15, badge: 'Эксклюзив', type: 'Дом' },
  { id: 7, img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80', title: 'Просторная 2-комнатная', location: 'Москва, Сокол', price: 72000, rooms: 2, area: 68, floor: '8/12', metro: 'Сокол', metroMin: 4, verified: true, rating: 4.6, reviews: 28, type: 'Квартира' },
  { id: 8, img: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=700&q=80', title: 'Современная 1-комнатная', location: 'Москва, Таганка', price: 62000, rooms: 1, area: 45, floor: '5/17', metro: 'Таганская', metroMin: 6, badge: 'Топ', verified: true, rating: 4.8, reviews: 55, type: 'Квартира' },
  { id: 9, img: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=700&q=80', title: 'Апартаменты-студия центр', location: 'Москва, Китай-город', price: 70000, rooms: 1, area: 38, floor: '3/6', metro: 'Китай-город', metroMin: 2, verified: true, rating: 4.7, reviews: 19, type: 'Апартаменты' },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('Новые');
  const [openSort, setOpenSort] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [propType, setPropType] = useState('');
  const [verified, setVerified] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);

  const toggleSaved = (id: number) => setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleRoom = (r: number) => setSelectedRooms(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  const filtered = ALL_LISTINGS
    .filter(l => !query || l.title.toLowerCase().includes(query.toLowerCase()) || l.location.toLowerCase().includes(query.toLowerCase()))
    .filter(l => !priceMin || l.price >= parseInt(priceMin.replace(/\D/g, '')))
    .filter(l => !priceMax || l.price <= parseInt(priceMax.replace(/\D/g, '')))
    .filter(l => selectedRooms.length === 0 || selectedRooms.includes(l.rooms))
    .filter(l => !propType || l.type === propType)
    .filter(l => !verified || l.verified)
    .sort((a, b) => sortBy === 'Дешевле' ? a.price - b.price : sortBy === 'Дороже' ? b.price - a.price : sortBy === 'Рейтинг' ? b.rating - a.rating : b.id - a.id);

  const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={{
      padding: '8px 16px', borderRadius: 30, fontSize: 13, fontWeight: 700,
      background: active ? '#0066FF' : '#fff', color: active ? '#fff' : '#555',
      border: `1.5px solid ${active ? '#0066FF' : '#e5e7eb'}`, cursor: 'pointer', transition: 'all 0.2s',
      whiteSpace: 'nowrap',
    }}>{label}</button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FF', paddingTop: 70 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Manrope:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Manrope', sans-serif; }
        .search-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media(max-width:1100px) { .search-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:700px) { .search-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Search Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '20px 24px', position: 'sticky', top: 70, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Main search */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
            <div style={{ flex: 1, background: '#F4F6FB', borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 600 }}>
              <span style={{ color: '#aaa' }}><IconSearch /></span>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск по городу, метро, адресу..."
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, fontFamily: 'Manrope, sans-serif', color: '#111' }}
              />
              {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>}
            </div>

            {/* AI Search btn */}
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #0057E7, #0EA5E9)', color: '#fff', border: 'none', borderRadius: 14, padding: '12px 20px', fontWeight: 800, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(0,87,231,0.35)' }}>
              <IconBrain /> AI-поиск
            </button>

            {/* View mode */}
            <div style={{ display: 'flex', background: '#F4F6FB', borderRadius: 10, padding: 3, gap: 2 }}>
              {[{ mode: 'grid' as const, Icon: IconGrid }, { mode: 'list' as const, Icon: IconList }].map(({ mode, Icon }) => (
                <button key={mode} onClick={() => setViewMode(mode)} style={{ background: viewMode === mode ? '#fff' : 'transparent', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: viewMode === mode ? '#0066FF' : '#888', boxShadow: viewMode === mode ? '0 2px 6px rgba(0,0,0,0.08)' : 'none', display: 'flex', alignItems: 'center' }}>
                  <Icon />
                </button>
              ))}
              <button style={{ background: 'transparent', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}>
                <IconMap />
              </button>
            </div>
          </div>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
            <FilterChip label="Любой тип" active={!propType} onClick={() => setPropType('')} />
            {['Квартира', 'Студия', 'Апартаменты', 'Дом', 'Новостройка'].map(t => (
              <FilterChip key={t} label={t} active={propType === t} onClick={() => setPropType(propType === t ? '' : t)} />
            ))}
            <div style={{ width: 1, background: '#e5e7eb', flexShrink: 0 }} />
            {[{ n: 1, l: '1 комн.' }, { n: 2, l: '2 комн.' }, { n: 3, l: '3 комн.' }, { n: 4, l: '4+' }].map(r => (
              <FilterChip key={r.n} label={r.l} active={selectedRooms.includes(r.n)} onClick={() => toggleRoom(r.n)} />
            ))}
            <div style={{ width: 1, background: '#e5e7eb', flexShrink: 0 }} />
            <FilterChip label="Только верифицированные" active={verified} onClick={() => setVerified(!verified)} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px' }}>
        {/* Results header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 22, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.5px' }}>
              {filtered.length > 0 ? `Найдено ${filtered.length} объявлений` : 'Ничего не найдено'}
            </h1>
            {query && <p style={{ color: '#888', fontSize: 14 }}>По запросу: «{query}»</p>}
          </div>

          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setOpenSort(!openSort)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '10px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#333' }}>
              Сортировка: {sortBy} <IconChevron dir={openSort ? 'up' : 'down'} />
            </button>
            {openSort && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 16, boxShadow: '0 16px 40px rgba(0,0,0,0.12)', minWidth: 180, overflow: 'hidden', zIndex: 50 }}>
                {['Новые', 'Дешевле', 'Дороже', 'Рейтинг'].map(s => (
                  <div key={s} onClick={() => { setSortBy(s); setOpenSort(false); }} style={{ padding: '11px 16px', fontSize: 14, cursor: 'pointer', fontWeight: sortBy === s ? 800 : 400, color: sortBy === s ? '#0066FF' : '#333', background: sortBy === s ? '#EFF4FF' : 'transparent' }}
                    onMouseEnter={e => { if (sortBy !== s) (e.currentTarget as HTMLElement).style.background = '#F8FAFF'; }}
                    onMouseLeave={e => { if (sortBy !== s) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >{s}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI suggestion bar */}
        {query && (
          <div style={{ background: 'linear-gradient(135deg, #EFF4FF, #E0F2FF)', border: '1px solid #C7DDFF', borderRadius: 16, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#0066FF', borderRadius: 10, padding: 8, display: 'flex' }}><IconBrain /></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#0A1628', marginBottom: 2 }}>AI нашёл похожие варианты</div>
              <div style={{ fontSize: 13, color: '#555' }}>Также попробуйте: <span style={{ color: '#0066FF', cursor: 'pointer', fontWeight: 700 }}>рядом с метро</span>, <span style={{ color: '#0066FF', cursor: 'pointer', fontWeight: 700 }}>с мебелью</span>, <span style={{ color: '#0066FF', cursor: 'pointer', fontWeight: 700 }}>без комиссии</span></div>
            </div>
          </div>
        )}

        {/* Listings */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>
              <svg width="72" height="72" fill="none" stroke="#ccc" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto', display: 'block' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: '#333' }}>Ничего не найдено</h3>
            <p style={{ color: '#888', fontSize: 15, marginBottom: 24 }}>Попробуйте изменить параметры поиска</p>
            <button onClick={() => { setQuery(''); setSelectedRooms([]); setPropType(''); setVerified(false); }} style={{ background: '#0066FF', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
              Сбросить фильтры
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="search-grid">
            {filtered.map(item => (
              <Link key={item.id} href={`/listing/${item.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', transition: 'all 0.3s', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; }}
                >
                  <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
                    {item.badge && (
                      <div style={{ position: 'absolute', top: 12, left: 12, background: item.badge === 'Топ' ? '#FF6B35' : item.badge === 'Новое' ? '#00C896' : item.badge === 'Премиум' ? '#7C3AED' : '#F59E0B', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{item.badge}</div>
                    )}
                    <button onClick={(e) => { e.preventDefault(); toggleSaved(item.id); }} style={{ position: 'absolute', top: 10, right: 10, background: saved.includes(item.id) ? '#FF4757' : 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <IconHeart filled={saved.includes(item.id)} />
                    </button>
                    <div style={{ position: 'absolute', bottom: 10, right: 12, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: '#fff', borderRadius: 8, padding: '4px 10px' }}>
                      <span style={{ fontSize: 16, fontWeight: 900 }}>{item.price.toLocaleString('ru-RU')} ₽</span>
                      <span style={{ fontSize: 10, opacity: 0.75 }}>/мес</span>
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      {item.metro && <span style={{ fontSize: 11, color: '#0066FF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0066FF', display: 'inline-block' }} />{item.metro} · {item.metroMin} мин
                      </span>}
                      {item.verified && <span style={{ fontSize: 11, color: '#00C896', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}><IconShield /> Верифицировано</span>}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111', margin: '0 0 5px', lineHeight: 1.3 }}>{item.title}</h3>
                    <p style={{ fontSize: 12, color: '#999', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 3 }}><IconMapPin />{item.location}</p>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                      {[`${item.rooms} комн.`, `${item.area} м²`, `${item.floor} эт.`].map((s, i) => (
                        <span key={i} style={{ fontSize: 11, color: '#555', background: '#F4F6FB', borderRadius: 7, padding: '3px 8px', fontWeight: 600 }}>{s}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <IconStar filled />
                        <span style={{ fontSize: 13, fontWeight: 800 }}>{item.rating}</span>
                        <span style={{ fontSize: 12, color: '#bbb' }}>({item.reviews})</span>
                      </div>
                      <span style={{ fontSize: 12, color: '#0066FF', fontWeight: 700 }}>Подробнее →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map(item => (
              <Link key={item.id} href={`/listing/${item.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', display: 'flex', gap: 0, transition: 'all 0.3s', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; }}
                >
                  <div style={{ position: 'relative', width: 280, flexShrink: 0 }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {item.badge && <div style={{ position: 'absolute', top: 12, left: 12, background: '#0066FF', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase' }}>{item.badge}</div>}
                  </div>
                  <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        {item.metro && <span style={{ fontSize: 12, color: '#0066FF', fontWeight: 600 }}>{item.metro} · {item.metroMin} мин</span>}
                        {item.verified && <span style={{ fontSize: 11, color: '#00C896', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}><IconShield /> Верифицировано</span>}
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 6 }}>{item.title}</h3>
                      <p style={{ fontSize: 13, color: '#888', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}><IconMapPin />{item.location}</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[`${item.rooms} комн.`, `${item.area} м²`, `${item.floor} эт.`].map((s, i) => (
                          <span key={i} style={{ fontSize: 12, background: '#F4F6FB', borderRadius: 8, padding: '4px 10px', fontWeight: 600, color: '#555' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <IconStar filled />
                        <span style={{ fontWeight: 800 }}>{item.rating}</span>
                        <span style={{ fontSize: 12, color: '#bbb' }}>({item.reviews} отзывов)</span>
                      </div>
                      <div>
                        <span style={{ fontSize: 24, fontWeight: 900, color: '#111' }}>{item.price.toLocaleString('ru-RU')} ₽</span>
                        <span style={{ fontSize: 13, color: '#888' }}>/мес</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope, sans-serif' }}>Загрузка...</div>}>
      <SearchContent />
    </Suspense>
  );
}
