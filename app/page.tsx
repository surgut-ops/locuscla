'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import { useApp } from '@/context/AppContext';
import { LISTINGS, CATEGORIES, CITIES, ALL_CITIES } from '@/lib/data';

const HERO_IMGS = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1800&q=85',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1800&q=85',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1800&q=85',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1800&q=85',
];

// ── AI MODAL ────────────────────────────────────────────────────────────────
function AiModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role:'user'|'ai'; text:string}[]>([
    { role:'ai', text:'Привет! Я AI-помощник Locus. Опишите что вы ищете, и я подберу лучшие варианты. Например: "2-комнатная квартира в Москве до 80 000₽ рядом с метро"' }
  ]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(m => [...m, { role:'user', text:userMsg }]);
    setInput(''); setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const replies = [
      `По вашему запросу "${userMsg}" я нашёл ${Math.floor(Math.random()*20+5)} подходящих объявлений. Топ-3:\n\n1. Студия на Арбате — 55 000₽/мес, Арбатская 3 мин\n2. 2-комн. в центре — 72 000₽/мес, Сокол 4 мин\n3. Апартаменты — 70 000₽/мес, Китай-город 2 мин\n\nПоказать все результаты?`,
      `Отличный выбор! Анализирую рынок по запросу "${userMsg}"... Средняя цена в выбранном районе: 65 000₽/мес. Ниже рынка: 38 000₽/мес. Рекомендую обратить внимание на проверенные объявления.`,
      `Нашёл варианты по запросу: "${userMsg}". Все объявления проверены AI на подлинность. Хотите уточнить параметры или перейти к поиску?`,
    ];
    setMessages(m => [...m, { role:'ai', text:replies[Math.floor(Math.random()*replies.length)] }]);
    setLoading(false);
  };

  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,zIndex:1000,background:'rgba(5,10,30,0.8)',backdropFilter:'blur(12px)',display:'flex',alignItems:'flex-end',justifyContent:'center',padding:'20px',animation:'fadeIn 0.2s' }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:'100%',maxWidth:600,background:'var(--surface)',borderRadius:'28px 28px 20px 20px',boxShadow:'0 -20px 80px rgba(0,0,0,0.3)',animation:'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',overflow:'hidden' }}>
        {/* Header */}
        <div style={{ background:'linear-gradient(135deg,#0A1628,#0D2B6B)',padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <div style={{ display:'flex',alignItems:'center',gap:12 }}>
            <div style={{ width:40,height:40,borderRadius:12,background:'rgba(77,184,255,0.2)',border:'1px solid rgba(77,184,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#4DB8FF' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>
            </div>
            <div>
              <div style={{ color:'#fff',fontWeight:800,fontSize:15 }}>AI-помощник Locus</div>
              <div style={{ color:'rgba(255,255,255,0.6)',fontSize:12,display:'flex',alignItems:'center',gap:6 }}>
                <span style={{ width:7,height:7,borderRadius:'50%',background:'#00E5A0',display:'inline-block',animation:'pulse 2s infinite' }}/>
                Онлайн — GPT-4 powered
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.1)',border:'none',borderRadius:'50%',width:32,height:32,cursor:'pointer',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div style={{ height:300,overflowY:'auto',padding:'20px',display:'flex',flexDirection:'column',gap:12,background:'var(--surface)' }}>
          {messages.map((m,i) => (
            <div key={i} style={{ display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
              <div style={{ maxWidth:'80%',padding:'12px 16px',borderRadius:m.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px',background:m.role==='user'?'var(--blue-mid)':'var(--surface2)',color:m.role==='user'?'#fff':'var(--text)',fontSize:14,lineHeight:1.6,whiteSpace:'pre-line' }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display:'flex',gap:6,padding:'12px 16px',background:'var(--surface2)',borderRadius:'18px 18px 18px 4px',width:'fit-content' }}>
              {[0,1,2].map(i => <div key={i} style={{ width:8,height:8,borderRadius:'50%',background:'var(--text3)',animation:`pulse 1.4s ease ${i*0.2}s infinite` }}/>)}
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding:'16px 20px',borderTop:'1px solid var(--border)',background:'var(--surface)',display:'flex',gap:10 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Опишите жильё своими словами..."
            style={{ flex:1,padding:'12px 16px',border:'1.5px solid var(--border)',borderRadius:12,fontSize:14,outline:'none',background:'var(--surface2)',color:'var(--text)',fontFamily:'inherit' }}
          />
          <button onClick={send} disabled={loading||!input.trim()} style={{ background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:12,padding:'12px 20px',fontWeight:700,fontSize:14,cursor:'pointer',opacity:(!input.trim()||loading)?0.6:1 }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>

        {/* Prompts */}
        <div style={{ padding:'0 20px 18px',display:'flex',gap:8,flexWrap:'wrap' }}>
          {['2-комн. Москва до 80 000₽','Студия у метро','Дом с баней Подмосковье'].map(p => (
            <button key={p} onClick={()=>setInput(p)} style={{ padding:'6px 12px',borderRadius:20,fontSize:12,fontWeight:600,background:'var(--bg3)',border:'1px solid var(--border)',color:'var(--blue-mid)',cursor:'pointer' }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FILTER MODAL ──────────────────────────────────────────────────────────────
function FilterModal({ onClose, onApply }: { onClose:()=>void; onApply:(f:Record<string, string|string[]|number[]|boolean|undefined>)=>void }) {
  const [rooms, setRooms] = useState<number[]>([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [propType, setPropType] = useState('');
  const [metroWalk, setMetroWalk] = useState('');
  const [, setFloor] = useState('');
  const [verified, setVerified] = useState(false);
  const [withPhoto, setWithPhoto] = useState(false);
  const [noComm, setNoComm] = useState(false);
  const [areaMin, setAreaMin] = useState('');
  const [areaMax, setAreaMax] = useState('');

  const toggleRoom = (r:number) => setRooms(p => p.includes(r)?p.filter(x=>x!==r):[...p,r]);
  const hasFilters = rooms.length||priceMin||priceMax||propType||metroWalk||verified||noComm||areaMin||areaMax;

  const reset = () => { setRooms([]); setPriceMin(''); setPriceMax(''); setPropType(''); setMetroWalk(''); setFloor(''); setVerified(false); setWithPhoto(false); setNoComm(false); setAreaMin(''); setAreaMax(''); };

  const SectionTitle = ({t}:{t:string}) => <div style={{ fontSize:13,fontWeight:800,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:12,marginTop:20 }}>{t}</div>;
  const Chip = ({label,active,onClick}:{label:string;active:boolean;onClick:()=>void}) => (
    <button onClick={onClick} style={{ padding:'8px 16px',borderRadius:30,fontSize:14,fontWeight:700,background:active?'var(--blue-mid)':'var(--surface2)',color:active?'#fff':'var(--text)',border:`1.5px solid ${active?'var(--blue-mid)':'var(--border)'}`,cursor:'pointer',transition:'all 0.15s',whiteSpace:'nowrap' }}>{label}</button>
  );
  const Toggle = ({label,value,onChange}:{label:string;value:boolean;onChange:(v:boolean)=>void}) => (
    <div onClick={()=>onChange(!value)} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)',cursor:'pointer' }}>
      <span style={{ fontSize:14,fontWeight:600,color:'var(--text)' }}>{label}</span>
      <div style={{ width:44,height:24,borderRadius:12,background:value?'var(--blue-mid)':'var(--border)',position:'relative',transition:'background 0.2s',flexShrink:0 }}>
        <div style={{ position:'absolute',top:3,left:value?20:3,width:18,height:18,borderRadius:'50%',background:'#fff',transition:'left 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
      </div>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,zIndex:1000,background:'rgba(5,10,30,0.75)',backdropFilter:'blur(12px)',display:'flex',alignItems:'flex-end',justifyContent:'center',padding:'0',animation:'fadeIn 0.2s' }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:'100%',maxWidth:680,background:'var(--surface)',borderRadius:'24px 24px 0 0',maxHeight:'90vh',overflow:'hidden',display:'flex',flexDirection:'column',animation:'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
        {/* Header */}
        <div style={{ padding:'20px 24px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0 }}>
          <h3 style={{ fontSize:18,fontWeight:800,color:'var(--text)' }}>Все фильтры</h3>
          <div style={{ display:'flex',gap:10 }}>
            {hasFilters && <button onClick={reset} style={{ background:'none',border:'none',color:'var(--text3)',fontSize:13,fontWeight:600,cursor:'pointer',padding:'6px 10px' }}>Сбросить</button>}
            <button onClick={onClose} style={{ background:'var(--surface2)',border:'none',borderRadius:'50%',width:32,height:32,cursor:'pointer',color:'var(--text2)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div style={{ overflowY:'auto',padding:'0 24px 24px',flex:1 }}>
          <SectionTitle t="Тип недвижимости" />
          <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
            {['Квартира','Студия','Апартаменты','Дом','Таунхаус','Комната'].map(t => <Chip key={t} label={t} active={propType===t} onClick={()=>setPropType(propType===t?'':t)} />)}
          </div>

          <SectionTitle t="Комнатность" />
          <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
            {[{n:1,l:'Студия'},{n:1,l:'1'},{n:2,l:'2'},{n:3,l:'3'},{n:4,l:'4+'}].map((r,i) => <Chip key={i} label={r.l+' комн.'} active={rooms.includes(r.n)} onClick={()=>toggleRoom(r.n)} />)}
          </div>

          <SectionTitle t="Цена в месяц, ₽" />
          <div style={{ display:'flex',gap:12,alignItems:'center' }}>
            <input placeholder="от 20 000" value={priceMin} onChange={e=>setPriceMin(e.target.value)} style={{ flex:1,padding:'11px 14px',border:'1.5px solid var(--border)',borderRadius:11,fontSize:14,background:'var(--surface2)',color:'var(--text)',outline:'none',fontFamily:'inherit' }} />
            <span style={{ color:'var(--text3)' }}>—</span>
            <input placeholder="до 200 000" value={priceMax} onChange={e=>setPriceMax(e.target.value)} style={{ flex:1,padding:'11px 14px',border:'1.5px solid var(--border)',borderRadius:11,fontSize:14,background:'var(--surface2)',color:'var(--text)',outline:'none',fontFamily:'inherit' }} />
          </div>

          <SectionTitle t="Площадь, м²" />
          <div style={{ display:'flex',gap:12,alignItems:'center' }}>
            <input placeholder="от" value={areaMin} onChange={e=>setAreaMin(e.target.value)} style={{ flex:1,padding:'11px 14px',border:'1.5px solid var(--border)',borderRadius:11,fontSize:14,background:'var(--surface2)',color:'var(--text)',outline:'none',fontFamily:'inherit' }} />
            <span style={{ color:'var(--text3)' }}>—</span>
            <input placeholder="до" value={areaMax} onChange={e=>setAreaMax(e.target.value)} style={{ flex:1,padding:'11px 14px',border:'1.5px solid var(--border)',borderRadius:11,fontSize:14,background:'var(--surface2)',color:'var(--text)',outline:'none',fontFamily:'inherit' }} />
          </div>

          <SectionTitle t="Метро, пешком" />
          <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
            {['5 мин','10 мин','15 мин','20+ мин'].map(m => <Chip key={m} label={m} active={metroWalk===m} onClick={()=>setMetroWalk(metroWalk===m?'':m)} />)}
          </div>

          <SectionTitle t="Дополнительно" />
          <Toggle label="Только верифицированные" value={verified} onChange={setVerified} />
          <Toggle label="Только без комиссии" value={noComm} onChange={setNoComm} />
          <Toggle label="Только с фотографиями" value={withPhoto} onChange={setWithPhoto} />
        </div>

        <div style={{ padding:'16px 24px',borderTop:'1px solid var(--border)',flexShrink:0,background:'var(--surface)' }}>
          <button onClick={()=>{onApply({rooms,priceMin,priceMax,propType,metroWalk,verified,noComm,areaMin,areaMax});onClose();}} style={{ width:'100%',padding:'15px',background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:14,fontSize:16,fontWeight:800,cursor:'pointer',boxShadow:'0 8px 24px rgba(0,87,231,0.35)',fontFamily:'inherit' }}>
            Показать результаты
          </button>
        </div>
      </div>
    </div>
  );
}

// ── LISTING CARD ────────────────────────────────────────────────────────────
function ListingCard({ item }: { item: typeof LISTINGS[0] }) {
  const { toggleFavorite, isFavorite } = useApp();
  const fav = isFavorite(item.id);
  const [hov, setHov] = useState(false);

  return (
    <Link href={`/listing/${item.id}`} style={{ textDecoration:'none' }}>
      <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{ borderRadius:20,overflow:'hidden',background:'var(--surface)',boxShadow:hov?'var(--shadow-lg)':'var(--shadow)',transition:'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',transform:hov?'translateY(-5px)':'translateY(0)',cursor:'pointer' }}>
        <div style={{ position:'relative',height:210,overflow:'hidden' }}>
          <Image src={item.images[0]} alt={item.title} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit:'cover',transition:'transform 0.5s',transform:hov?'scale(1.06)':'scale(1)' }} />
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.6) 100%)' }}/>
          {item.badge && <div style={{ position:'absolute',top:12,left:12,background:item.badge==='Топ'?'var(--orange)':item.badge==='Новое'?'var(--green)':item.badge==='Премиум'?'var(--purple)':'var(--yellow)',color:'#fff',fontSize:10,fontWeight:800,padding:'4px 11px',borderRadius:20,textTransform:'uppercase',letterSpacing:'0.8px' }}>{item.badge}</div>}
          <button onClick={e=>{e.preventDefault();toggleFavorite(item.id);}} style={{ position:'absolute',top:10,right:10,background:fav?'var(--red)':'rgba(0,0,0,0.45)',backdropFilter:'blur(8px)',border:'none',borderRadius:'50%',width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.2s',transform:hov||fav?'scale(1.1)':'scale(1)' }}>
            <svg width="16" height="16" fill={fav?"#fff":"none"} stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <div style={{ position:'absolute',bottom:10,right:12,background:'rgba(0,0,0,0.72)',backdropFilter:'blur(8px)',color:'#fff',borderRadius:9,padding:'4px 11px' }}>
            <span style={{ fontSize:17,fontWeight:900 }}>{item.price.toLocaleString('ru-RU')} ₽</span>
            <span style={{ fontSize:10,opacity:0.75 }}>/мес</span>
          </div>
        </div>

        <div style={{ padding:'14px 16px 18px' }}>
          <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:7,flexWrap:'wrap' }}>
            {item.metro && <span style={{ display:'flex',alignItems:'center',gap:3,fontSize:11,color:'var(--blue-mid)',fontWeight:700 }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:'var(--blue-mid)',display:'inline-block' }}/>
              {item.metro} · {item.metroMin} мин
            </span>}
            {item.verified && <span style={{ display:'flex',alignItems:'center',gap:3,fontSize:11,color:'var(--green)',fontWeight:700 }}>
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              Верифицировано
            </span>}
          </div>

          <h3 style={{ margin:'0 0 4px',fontSize:15,fontWeight:800,color:'var(--text)',lineHeight:1.35,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>{item.title}</h3>
          <p style={{ margin:'0 0 12px',fontSize:12,color:'var(--text3)',display:'flex',alignItems:'center',gap:3 }}>
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {item.location}
          </p>

          <div style={{ display:'flex',gap:6,marginBottom:12,flexWrap:'wrap' }}>
            {[`${item.rooms} комн.`,`${item.area} м²`,`${item.floor} эт.`].map((s,i) => <span key={i} style={{ fontSize:11,color:'var(--text2)',background:'var(--surface2)',borderRadius:7,padding:'3px 8px',fontWeight:600 }}>{s}</span>)}
          </div>

          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
            <div style={{ display:'flex',alignItems:'center',gap:4 }}>
              <svg width="12" height="12" fill="#FFB800" stroke="#FFB800" strokeWidth="0" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style={{ fontSize:13,fontWeight:800,color:'var(--text)' }}>{item.rating}</span>
              <span style={{ fontSize:11,color:'var(--text3)' }}>({item.reviews})</span>
            </div>
            <span style={{ fontSize:12,color:'var(--blue-mid)',fontWeight:700,display:'flex',alignItems:'center',gap:3 }}>
              Подробнее
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── HOME PAGE ──────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { user } = useApp();
  const [authModal, setAuthModal] = useState<'login'|'register'|null>(null);
  const [aiModal, setAiModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [dealType, setDealType] = useState('Аренда');
  const [propType, setPropType] = useState('');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string|null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i+1)%HERO_IMGS.length), 5500);
    return () => clearInterval(t);
  }, []);

  // City autocomplete (ALL_CITIES)
  useEffect(() => {
    if (!query || query.length < 1) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    const startsWith = ALL_CITIES.filter(c => c.toLowerCase().startsWith(q));
    const contains = ALL_CITIES.filter(c => c.toLowerCase().includes(q) && !c.toLowerCase().startsWith(q));
    setSuggestions([...startsWith, ...contains].slice(0, 6));
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestions([]); setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (q?: string) => {
    const searchQ = q || query;
    router.push(`/search?q=${encodeURIComponent(searchQ)}`);
    setSuggestions([]);
  };

  const Dropdown = ({ name, value, placeholder, options, setter }: { name: string; value: string; placeholder: string; options: string[]; setter: (v: string) => void }) => (
    <div style={{ position:'relative' }}>
      <button onClick={e=>{e.stopPropagation();setActiveDropdown(activeDropdown===name?null:name);}} style={{ display:'flex',alignItems:'center',gap:5,padding:'9px 13px',background:value?'var(--bg3)':'rgba(255,255,255,0.15)',border:`1.5px solid ${value?'var(--blue-mid)':'rgba(255,255,255,0.3)'}`,backdropFilter:'blur(8px)',borderRadius:11,fontSize:13,fontWeight:700,color:value?'var(--blue-mid)':'#fff',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.15s' }}>
        {value||placeholder}
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ transform:activeDropdown===name?'rotate(180deg)':'rotate(0)',transition:'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {activeDropdown===name && (
        <div style={{ position:'absolute',top:'110%',left:0,zIndex:300,background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,boxShadow:'var(--shadow-lg)',minWidth:180,overflow:'hidden',animation:'fadeIn 0.15s' }}>
          <div onClick={()=>{setter('');setActiveDropdown(null);}} style={{ padding:'10px 14px',fontSize:13,color:'var(--text3)',cursor:'pointer',borderBottom:'1px solid var(--border)' }}>Любой</div>
          {options.map((opt:string) => (
            <div key={opt} onClick={()=>{setter(opt);setActiveDropdown(null);}} style={{ padding:'10px 14px',fontSize:14,cursor:'pointer',background:value===opt?'var(--bg3)':'transparent',color:value===opt?'var(--blue-mid)':'var(--text)',fontWeight:value===opt?700:400 }}
              onMouseEnter={e=>{if(value!==opt)(e.currentTarget as HTMLElement).style.background='var(--surface2)';}}
              onMouseLeave={e=>{if(value!==opt)(e.currentTarget as HTMLElement).style.background='transparent';}}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @media (max-width: 768px) {
          .stats-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
          .footer-grid { flex-direction: column !important; gap: 32px !important; }
          .city-scroll { overflow-x: auto !important; white-space: nowrap !important; -webkit-overflow-scrolling: touch !important; }
          .main-content { padding-bottom: 80px !important; }
        }
      `}</style>

      <Navbar onLogin={()=>setAuthModal('login')} onRegister={()=>setAuthModal('register')} transparent />

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ position:'relative',height:'100vh',minHeight:700,overflow:'hidden' }}>
        {HERO_IMGS.map((src,i) => (
          <div key={i} style={{ position:'absolute',inset:0,backgroundImage:`url(${src})`,backgroundSize:'cover',backgroundPosition:'center',opacity:heroIdx===i?1:0,transition:'opacity 1.4s ease' }}/>
        ))}
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(5,10,30,0.72) 0%,rgba(5,10,30,0.35) 55%,rgba(5,10,30,0.82) 100%)' }}/>

        {/* Dots */}
        <div style={{ position:'absolute',bottom:28,right:28,display:'flex',gap:7,zIndex:10 }}>
          {HERO_IMGS.map((_,i) => <button key={i} onClick={()=>setHeroIdx(i)} style={{ width:heroIdx===i?26:7,height:7,borderRadius:4,border:'none',background:heroIdx===i?'#fff':'rgba(255,255,255,0.4)',cursor:'pointer',transition:'all 0.3s',padding:0 }}/>)}
        </div>

        <div style={{ position:'relative',zIndex:5,maxWidth:1280,margin:'0 auto',padding:'0 24px',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',paddingTop:80 }}>
          {/* Badge */}
          <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.12)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.22)',borderRadius:30,padding:'7px 18px',marginBottom:22,width:'fit-content',animation:'fadeInUp 0.5s ease both' }}>
            <span style={{ width:8,height:8,borderRadius:'50%',background:'#00E5A0',boxShadow:'0 0 8px #00E5A0',display:'inline-block',animation:'pulse 2s infinite' }}/>
            <span style={{ color:'#fff',fontSize:13,fontWeight:700 }}>AI-поиск · 5 млн объявлений · Верифицировано</span>
          </div>

          <h1 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:'clamp(30px,5vw,64px)',fontWeight:900,color:'#fff',lineHeight:1.1,letterSpacing:'-1.5px',marginBottom:16,animation:'fadeInUp 0.6s ease 0.1s both' }}>
            Найдите идеальное<br/>
            <span style={{ color:'#4DB8FF' }}>жильё</span> — быстро
          </h1>

          <p style={{ color:'rgba(255,255,255,0.8)',fontSize:'clamp(15px,2vw,18px)',fontWeight:500,marginBottom:32,maxWidth:520,lineHeight:1.6,animation:'fadeInUp 0.6s ease 0.2s both' }}>
            Аренда и продажа с AI-верификацией, честными ценами и безопасными сделками
          </p>

          {/* Search box */}
          <div style={{ maxWidth:820,animation:'fadeInUp 0.6s ease 0.3s both' }} ref={searchRef}>
            <div style={{ background:'#fff',borderRadius:18,padding:'6px 6px 6px 18px',display:'flex',alignItems:'center',gap:10,boxShadow:'0 20px 60px rgba(0,0,0,0.3)',marginBottom:12 }}>
              <svg width="19" height="19" fill="none" stroke="#aaa" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <div style={{ flex:1,position:'relative' }}>
                <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()}
                  placeholder="Город, район, метро, адрес..."
                  style={{ width:'100%',border:'none',outline:'none',fontSize:16,background:'transparent',color:'#111',fontFamily:'inherit',padding:'8px 0' }}
                />
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div style={{ position:'absolute',top:'110%',left:-18,right:-10,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,boxShadow:'var(--shadow-lg)',overflow:'hidden',zIndex:200,animation:'fadeIn 0.15s' }}>
                    {suggestions.map((s,i) => (
                      <div key={i} onClick={()=>{setQuery(s);setSuggestions([]);handleSearch(s);}}
                        style={{ padding:'11px 16px',fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',gap:10,color:'var(--text)',borderBottom:i<suggestions.length-1?'1px solid var(--border)':'none' }}
                        onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='var(--bg3)'}
                        onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}
                      >
                        <svg width="14" height="14" fill="none" stroke="var(--text3)" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* AI btn */}
              <button onClick={()=>setAiModal(true)} style={{ display:'flex',alignItems:'center',gap:6,background:'linear-gradient(135deg,#EFF4FF,#E0F2FF)',border:'none',borderRadius:10,padding:'9px 14px',fontSize:12,color:'var(--blue-mid)',fontWeight:800,cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.2s' }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='linear-gradient(135deg,#0057E7,#0EA5E9)'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='linear-gradient(135deg,#EFF4FF,#E0F2FF)'}
                onMouseOver={e=>(e.currentTarget as HTMLElement).style.color='#fff'}
                onMouseOut={e=>(e.currentTarget as HTMLElement).style.color='var(--blue-mid)'}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>
                AI-поиск
              </button>
              <button onClick={()=>handleSearch()} style={{ background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:13,padding:'13px 24px',fontSize:15,fontWeight:800,cursor:'pointer',boxShadow:'0 8px 24px rgba(0,87,231,0.4)',display:'flex',alignItems:'center',gap:7,flexShrink:0 }}>
                <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Найти
              </button>
            </div>

            {/* Filters row */}
            <div style={{ display:'flex',alignItems:'center',gap:8,flexWrap:'wrap' }} onClick={()=>setActiveDropdown(null)}>
              {/* Deal type */}
              <div style={{ display:'flex',background:'rgba(255,255,255,0.15)',backdropFilter:'blur(10px)',borderRadius:11,padding:3,gap:2,border:'1px solid rgba(255,255,255,0.2)' }}>
                {['Аренда','Продажа','Посуточно'].map(t => (
                  <button key={t} onClick={e=>{e.stopPropagation();setDealType(t);}} style={{ background:dealType===t?'#fff':'transparent',border:'none',borderRadius:9,padding:'8px 13px',fontSize:13,fontWeight:700,color:dealType===t?'var(--blue-mid)':'rgba(255,255,255,0.85)',cursor:'pointer',transition:'all 0.2s',whiteSpace:'nowrap' }}>{t}</button>
                ))}
              </div>

              <div onClick={e=>e.stopPropagation()} style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
                <Dropdown name="type" value={propType} placeholder="Тип жилья" setter={setPropType} options={['Квартира','Студия','Апартаменты','Дом','Комната','Таунхаус']} />
                <Dropdown name="rooms" value={rooms} placeholder="Комнаты" setter={setRooms} options={['Студия','1 комната','2 комнаты','3 комнаты','4+ комнат']} />
                <Dropdown name="price" value={price} placeholder="Цена" setter={setPrice} options={['до 30 000 ₽','до 50 000 ₽','до 80 000 ₽','до 120 000 ₽','от 120 000 ₽']} />
              </div>

              <button onClick={()=>setFilterModal(true)} style={{ display:'flex',alignItems:'center',gap:7,background:'rgba(255,255,255,0.15)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.3)',borderRadius:11,padding:'9px 15px',fontSize:13,fontWeight:700,color:'#fff',cursor:'pointer' }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Ещё фильтры
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row" style={{ display:'flex',gap:'clamp(20px,4vw,40px)',marginTop:36,animation:'fadeInUp 0.6s ease 0.4s both',flexWrap:'wrap' }}>
            {[{v:'5 млн+',l:'Объявлений'},{v:'98%',l:'Верифицированы'},{v:'4.9★',l:'Рейтинг'},{v:'<48ч',l:'Время сделки'}].map((s,i) => (
              <div key={i}>
                <div style={{ fontSize:'clamp(18px,2.5vw,22px)',fontWeight:900,color:'#fff',letterSpacing:'-0.5px' }}>{s.v}</div>
                <div style={{ fontSize:12,color:'rgba(255,255,255,0.6)',fontWeight:500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITY TABS ──────────────────────────────── */}
      <div style={{ background:'var(--surface)',borderBottom:'1px solid var(--border)',padding:'0 24px' }}>
        <div className="city-scroll" style={{ maxWidth:1280,margin:'0 auto',display:'flex',gap:4,overflowX:'auto',scrollbarWidth:'none' }}>
          {CITIES.map(city => (
            <Link key={city} href={`/search?city=${encodeURIComponent(city)}`} style={{ textDecoration:'none' }}>
              <button style={{ background:'none',border:'none',padding:'14px 18px',fontSize:14,fontWeight:700,color:'var(--text2)',cursor:'pointer',whiteSpace:'nowrap',borderBottom:'2.5px solid transparent',transition:'all 0.2s' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='var(--blue-mid)';(e.currentTarget as HTMLElement).style.borderBottomColor='var(--blue-mid)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='var(--text2)';(e.currentTarget as HTMLElement).style.borderBottomColor='transparent';}}
              >{city}</button>
            </Link>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ─────────────────────────────── */}
      <section style={{ padding:'56px 24px',background:'var(--bg)' }}>
        <div style={{ maxWidth:1280,margin:'0 auto' }}>
          <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:12 }}>
            <div>
              <h2 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:'clamp(22px,3vw,28px)',fontWeight:900,marginBottom:6,color:'var(--text)',letterSpacing:'-0.5px' }}>Тип жилья</h2>
              <p style={{ color:'var(--text2)',fontSize:15 }}>Выберите подходящий формат</p>
            </div>
            <Link href="/search" style={{ textDecoration:'none',display:'flex',alignItems:'center',gap:5,color:'var(--blue-mid)',fontWeight:700,fontSize:14 }}>
              Все категории <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
          <div className="grid-cats">
            {CATEGORIES.map((cat,i) => (
              <Link key={i} href={`/search?type=${encodeURIComponent(cat.type)}`} style={{ textDecoration:'none' }}>
                <div style={{ position:'relative',borderRadius:18,overflow:'hidden',height:150,cursor:'pointer',transition:'transform 0.3s,box-shadow 0.3s',boxShadow:'var(--shadow)' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLElement).style.boxShadow='var(--shadow-lg)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='var(--shadow)';}}
                >
                  <Image src={cat.img} alt={cat.label} fill sizes="(max-width:768px) 50vw, 25vw" style={{ objectFit:'cover' }}/>
                  <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.7))' }}/>
                  <div style={{ position:'absolute',bottom:12,left:14 }}>
                    <div style={{ color:'#fff',fontWeight:800,fontSize:15 }}>{cat.label}</div>
                    <div style={{ color:'rgba(255,255,255,0.75)',fontSize:11,fontWeight:600 }}>{cat.count} объявл.</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LISTINGS ───────────────────────────────── */}
      <section style={{ padding:'0 24px 64px',background:'var(--surface)' }}>
        <div style={{ maxWidth:1280,margin:'0 auto' }}>
          <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:12,paddingTop:56,borderTop:'1px solid var(--border)' }}>
            <div>
              <h2 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:'clamp(22px,3vw,28px)',fontWeight:900,marginBottom:6,color:'var(--text)',letterSpacing:'-0.5px' }}>Популярные объявления</h2>
              <p style={{ color:'var(--text2)',fontSize:15 }}>Проверены AI · Обновлено сегодня</p>
            </div>
            <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
              {['Новые','Дешевле','Рейтинг'].map(f => (
                <button key={f} style={{ background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10,padding:'8px 16px',fontSize:13,fontWeight:700,color:'var(--text2)',cursor:'pointer' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--blue-mid)';(e.currentTarget as HTMLElement).style.color='var(--blue-mid)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--border)';(e.currentTarget as HTMLElement).style.color='var(--text2)';}}
                >{f}</button>
              ))}
            </div>
          </div>

          <div className="grid-cards">
            {LISTINGS.slice(0,6).map(item => <ListingCard key={item.id} item={item} />)}
          </div>

          <div style={{ textAlign:'center',marginTop:44 }}>
            <Link href="/search" style={{ textDecoration:'none' }}>
              <button style={{ display:'inline-flex',alignItems:'center',gap:10,background:'none',border:'2px solid var(--blue-mid)',color:'var(--blue-mid)',borderRadius:14,padding:'14px 44px',fontSize:15,fontWeight:800,cursor:'pointer',transition:'all 0.3s' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='var(--blue-mid)';(e.currentTarget as HTMLElement).style.color='#fff';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='none';(e.currentTarget as HTMLElement).style.color='var(--blue-mid)';}}
              >
                Смотреть все объявления
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── AI BANNER ──────────────────────────────── */}
      <section style={{ padding:'0 24px 72px' }}>
        <div style={{ maxWidth:1280,margin:'0 auto',background:'linear-gradient(135deg,#0A1628 0%,#0D2B6B 55%,#0057E7 100%)',borderRadius:28,padding:'clamp(36px,5vw,64px)',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',inset:0,opacity:0.05,backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',backgroundSize:'40px 40px' }}/>
          <div style={{ position:'absolute',top:'-25%',right:'8%',width:380,height:380,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,180,255,0.2) 0%,transparent 70%)',filter:'blur(40px)' }}/>

          <div className="grid-2" style={{ position:'relative',zIndex:1 }}>
            <div>
              <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(0,180,255,0.15)',border:'1px solid rgba(0,180,255,0.35)',borderRadius:30,padding:'6px 16px',marginBottom:22 }}>
                <svg width="13" height="13" fill="none" stroke="#4DB8FF" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 3l.5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5z"/></svg>
                <span style={{ color:'#4DB8FF',fontSize:12,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase' }}>AI-технологии</span>
              </div>
              <h2 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:'clamp(24px,3vw,32px)',fontWeight:900,color:'#fff',marginBottom:18,letterSpacing:'-0.8px',lineHeight:1.25 }}>
                Умный поиск<br/>знает, что вам нужно
              </h2>
              <p style={{ color:'rgba(255,255,255,0.75)',fontSize:15,lineHeight:1.7,marginBottom:32 }}>
                Опишите жильё своими словами — AI найдёт лучшие варианты, сравнит цены и предупредит о рисках сделки
              </p>
              <div style={{ display:'flex',flexDirection:'column',gap:14,marginBottom:32 }}>
                {[{t:'Анализ цены',d:'Сравнение с рыночными ценами района'},{t:'Проверка фото',d:'Выявление поддельных снимков'},{t:'Риски сделки',d:'Анализ договора на опасные пункты'}].map((f,i) => (
                  <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:12 }}>
                    <div style={{ width:28,height:28,borderRadius:8,background:'rgba(0,180,255,0.15)',border:'1px solid rgba(0,180,255,0.3)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <svg width="12" height="12" fill="none" stroke="#4DB8FF" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                    </div>
                    <div><div style={{ color:'#fff',fontWeight:700,fontSize:14 }}>{f.t}</div><div style={{ color:'rgba(255,255,255,0.6)',fontSize:13 }}>{f.d}</div></div>
                  </div>
                ))}
              </div>
              <button onClick={()=>setAiModal(true)} style={{ background:'#fff',color:'#0057E7',border:'none',borderRadius:13,padding:'13px 28px',fontSize:14,fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:8 }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>
                Попробовать AI-поиск
              </button>
            </div>

            {/* AI Widget */}
            <div style={{ background:'rgba(255,255,255,0.07)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:22,padding:26 }}>
              <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:20 }}>
                <div style={{ width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#0066FF,#00BFFF)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <svg width="15" height="15" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>
                </div>
                <div style={{ color:'#fff',fontWeight:700,fontSize:14 }}>AI-анализ объявления</div>
                <div style={{ marginLeft:'auto',fontSize:11,color:'#4DB8FF',fontWeight:700,background:'rgba(77,184,255,0.15)',padding:'3px 10px',borderRadius:20 }}>Активен</div>
              </div>
              <div style={{ height:1,background:'rgba(255,255,255,0.1)',marginBottom:18 }}/>
              {[{label:'Соответствие запросу',val:96,color:'#00E5A0'},{label:'Справедливость цены',val:84,color:'#4DB8FF'},{label:'Качество описания',val:91,color:'#A78BFA'},{label:'Надёжность хозяина',val:88,color:'#FB923C'}].map((s,i) => (
                <div key={i} style={{ marginBottom:15 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                    <span style={{ color:'rgba(255,255,255,0.7)',fontSize:12 }}>{s.label}</span>
                    <span style={{ color:'#fff',fontWeight:800,fontSize:12 }}>{s.val}%</span>
                  </div>
                  <div style={{ height:5,background:'rgba(255,255,255,0.1)',borderRadius:3,overflow:'hidden' }}>
                    <div style={{ height:'100%',width:`${s.val}%`,background:s.color,borderRadius:3 }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────── */}
      <section style={{ padding:'0 24px 72px',background:'var(--bg)' }}>
        <div style={{ maxWidth:1280,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:'clamp(22px,3vw,28px)',fontWeight:900,marginBottom:10,color:'var(--text)',letterSpacing:'-0.5px' }}>Как это работает</h2>
            <p style={{ color:'var(--text2)',fontSize:15 }}>3 шага до нового дома</p>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24 }}>
            {[
              {n:'01',img:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',t:'Опишите что ищёте',d:'Укажите параметры или опишите словами. AI сформирует персональную подборку из тысяч актуальных объявлений'},
              {n:'02',img:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80',t:'AI проверит и оценит',d:'Каждое объявление верифицируется: фото, цена, описание и надёжность арендодателя'},
              {n:'03',img:'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80',t:'Заключите сделку',d:'Онлайн-просмотр, безопасная переписка, электронный договор и гарантия возврата депозита'},
            ].map((step,i) => (
              <div key={i} style={{ background:'var(--surface)',borderRadius:22,overflow:'hidden',boxShadow:'var(--shadow)',transition:'transform 0.3s,box-shadow 0.3s' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLElement).style.boxShadow='var(--shadow-lg)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='var(--shadow)';}}
              >
                <div style={{ height:170,overflow:'hidden',position:'relative' }}>
                  <Image src={step.img} alt="" fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit:'cover' }}/>
                  <div style={{ position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(0,87,231,0.65),transparent)' }}/>
                  <div style={{ position:'absolute',top:16,left:18,fontFamily:"'Unbounded',sans-serif",fontSize:40,fontWeight:900,color:'rgba(255,255,255,0.2)',lineHeight:1 }}>{step.n}</div>
                </div>
                <div style={{ padding:'22px 24px 26px' }}>
                  <h3 style={{ fontSize:17,fontWeight:800,marginBottom:9,color:'var(--text)' }}>{step.t}</h3>
                  <p style={{ color:'var(--text2)',fontSize:14,lineHeight:1.7 }}>{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section style={{ padding:'0 24px 72px',background:'var(--surface)' }}>
        <div style={{ maxWidth:660,margin:'0 auto',textAlign:'center',paddingTop:72 }}>
          <div style={{ width:68,height:68,borderRadius:20,background:'linear-gradient(135deg,#0057E7,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 22px',boxShadow:'0 8px 30px rgba(0,87,231,0.35)' }}>
            <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h2 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:'clamp(24px,3vw,32px)',fontWeight:900,marginBottom:14,color:'var(--text)',letterSpacing:'-0.8px' }}>Сдаёте жильё?</h2>
          <p style={{ color:'var(--text2)',fontSize:17,lineHeight:1.65,marginBottom:32 }}>Разместите объявление бесплатно. AI определит оптимальную цену и поможет найти надёжных арендаторов</p>
          <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
            <button onClick={()=>{ if (!user) setAuthModal('register'); else router.push('/listing/new'); }} style={{ background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:14,padding:'14px 32px',fontSize:15,fontWeight:800,cursor:'pointer',boxShadow:'0 8px 28px rgba(0,87,231,0.4)' }}>Разместить бесплатно</button>
            <button style={{ background:'var(--surface2)',color:'var(--text)',border:'1.5px solid var(--border)',borderRadius:14,padding:'14px 24px',fontSize:15,fontWeight:700,cursor:'pointer' }}>Узнать AI-цену</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer style={{ background:'#0A1628',padding:'56px 24px 28px',color:'rgba(255,255,255,0.6)' }}>
        <div style={{ maxWidth:1280,margin:'0 auto' }}>
          <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:40,marginBottom:40 }} className="footer-grid grid-footer">
            <div>
              <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
                <div style={{ width:38,height:38,borderRadius:11,background:'linear-gradient(135deg,#0057E7,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <svg width="17" height="17" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <span style={{ fontFamily:"'Unbounded',sans-serif",color:'#fff',fontSize:20,fontWeight:900 }}>Locus</span>
              </div>
              <p style={{ fontSize:13,lineHeight:1.7,maxWidth:260,marginBottom:20 }}>AI-маркетплейс аренды нового поколения. Умный поиск, верификация и безопасные сделки.</p>
              <div style={{ display:'flex',gap:8 }}>
                {['App Store','Google Play'].map(a => <button key={a} style={{ background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'#fff',borderRadius:9,padding:'7px 12px',fontSize:12,cursor:'pointer',fontWeight:600 }}>{a}</button>)}
              </div>
            </div>
            {[
              {title:'Арендаторам',items:[{l:'Поиск жилья',h:'/search'},{l:'AI-поиск',h:'/search'},{l:'Карта',h:'/search'},{l:'Безопасность',h:'/faq'},{l:'FAQ',h:'/faq'}]},
              {title:'Арендодателям',items:[{l:'Разместить объявление',h:'/listing/new'},{l:'Тарифы',h:'/faq'},{l:'AI-оценка',h:'/search'},{l:'Управление',h:'/profile'},{l:'Аналитика',h:'/analytics'}]},
              {title:'Компания',items:[{l:'О нас',h:'/faq'},{l:'Блог',h:'/faq'},{l:'Пресс-центр',h:'/faq'},{l:'Карьера',h:'/careers'},{l:'Контакты',h:'/faq'}]},
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color:'#fff',fontWeight:800,fontSize:14,marginBottom:14 }}>{col.title}</h4>
                {col.items.map(item => (
                  <div key={item.l} style={{ marginBottom:9 }}>
                    <Link href={item.h} style={{ color:'rgba(255,255,255,0.5)',textDecoration:'none',fontSize:13,transition:'color 0.15s' }}
                      onMouseEnter={e=>(e.target as HTMLElement).style.color='#4DB8FF'}
                      onMouseLeave={e=>(e.target as HTMLElement).style.color='rgba(255,255,255,0.5)'}
                    >{item.l}</Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:22,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12 }}>
            <span style={{ fontSize:12 }}>© 2024 Locus. Все права защищены.</span>
            <div style={{ display:'flex',gap:18 }}>
              <Link href="/privacy" style={{ color:'rgba(255,255,255,0.35)',fontSize:12,textDecoration:'none' }}>Конфиденциальность</Link>
              <Link href="/terms" style={{ color:'rgba(255,255,255,0.35)',fontSize:12,textDecoration:'none' }}>Соглашение</Link>
              <Link href="/faq" style={{ color:'rgba(255,255,255,0.35)',fontSize:12,textDecoration:'none' }}>FAQ</Link>
              <Link href="/analytics" style={{ color:'rgba(255,255,255,0.35)',fontSize:12,textDecoration:'none' }}>Аналитика</Link>
              <Link href="/careers" style={{ color:'rgba(255,255,255,0.35)',fontSize:12,textDecoration:'none' }}>Карьера</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {authModal && <AuthModal mode={authModal} onClose={()=>setAuthModal(null)} />}
      {aiModal && <AiModal onClose={()=>setAiModal(false)} />}
      {filterModal && <FilterModal onClose={()=>setFilterModal(false)} onApply={(f)=>{const p=new URLSearchParams();Object.entries(f).forEach(([k,v])=>{if(v!==''&&v!==undefined&&v!==null){const s=Array.isArray(v)?v.join(','):String(v);if(s)p.set(k,s);}});router.push(`/search?${p.toString()}`);}} />}
    </>
  );
}
