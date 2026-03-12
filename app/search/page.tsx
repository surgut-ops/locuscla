'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import { useApp } from '@/context/AppContext';
import { LISTINGS } from '@/lib/data';

function SearchContent() {
  const searchParams = useSearchParams();
  const { toggleFavorite, isFavorite } = useApp();
  const [authModal, setAuthModal] = useState<'login'|'register'|null>(null);
  const [query, setQuery] = useState(searchParams.get('q')||'');
  const [view, setView] = useState<'grid'|'list'>('grid');
  const [sort, setSort] = useState('Новые');
  const [sortOpen, setSortOpen] = useState(false);
  const [propType, setPropType] = useState(searchParams.get('type')||'');
  const [rooms, setRooms] = useState<string[]>([]);
  const [verified, setVerified] = useState(false);
  const [priceMax, setPriceMax] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');

  const TYPES = ['Квартира','Студия','Апартаменты','Дом','Новостройка'];
  const ROOMS = ['Студия','1 комн.','2 комн.','3 комн.','4+'];

  // Filter + sort
  let result = [...LISTINGS];
  if (query) result = result.filter(l => l.title.toLowerCase().includes(query.toLowerCase()) || l.location.toLowerCase().includes(query.toLowerCase()) || l.city.toLowerCase().includes(query.toLowerCase()) || l.type.toLowerCase().includes(query.toLowerCase()));
  if (propType) result = result.filter(l => l.type === propType || (propType === 'Новостройка' && l.year >= 2020));
  if (rooms.length) result = result.filter(l => rooms.some(r => r==='Студия'?l.type==='Студия':r==='4+'?l.rooms>=4:l.rooms===parseInt(r)));
  if (verified) result = result.filter(l => l.verified);
  if (priceMax) result = result.filter(l => l.price <= parseInt(priceMax));
  if (searchParams.get('city')) result = result.filter(l => l.city === searchParams.get('city'));

  if (sort==='Дешевле') result.sort((a,b)=>a.price-b.price);
  else if (sort==='Дороже') result.sort((a,b)=>b.price-a.price);
  else if (sort==='Рейтинг') result.sort((a,b)=>b.rating-a.rating);

  const handleAI = async () => {
    if (!query) return;
    setAiLoading(true);
    await new Promise(r=>setTimeout(r,1200));
    setAiResult(`По запросу "${query}" найдено ${result.length} объявлений. Средняя цена: ${result.length?Math.round(result.reduce((a,b)=>a+b.price,0)/result.length).toLocaleString('ru-RU'):0} ₽/мес. Рекомендую начать с проверенных объявлений.`);
    setAiLoading(false);
  };

  const toggleRoom = (r:string) => setRooms(p=>p.includes(r)?p.filter(x=>x!==r):[...p,r]);
  const reset = () => { setPropType(''); setRooms([]); setVerified(false); setPriceMax(''); setQuery(''); setAiResult(''); };
  const hasFilters = propType||rooms.length||verified||priceMax||query;

  return (
    <>
      <Navbar onLogin={()=>setAuthModal('login')} onRegister={()=>setAuthModal('register')} />
      <div style={{ minHeight:'100vh',background:'var(--bg)',paddingTop:66 }}>

        {/* Search header */}
        <div style={{ background:'var(--surface)',borderBottom:'1px solid var(--border)',padding:'14px 24px',position:'sticky',top:66,zIndex:50 }}>
          <div style={{ maxWidth:1280,margin:'0 auto',display:'flex',gap:10,alignItems:'center',flexWrap:'wrap' }}>
            <div style={{ flex:1,minWidth:220,position:'relative' }}>
              <svg width="16" height="16" fill="none" stroke="var(--text3)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск по городу, метро, адресу..."
                style={{ width:'100%',paddingLeft:44,paddingRight:16,paddingTop:11,paddingBottom:11,border:'1.5px solid var(--border)',borderRadius:13,fontSize:14,background:'var(--surface2)',color:'var(--text)',outline:'none',fontFamily:'inherit',transition:'border-color 0.2s',boxSizing:'border-box' }}
                onFocus={e=>(e.target as HTMLInputElement).style.borderColor='var(--blue-mid)'}
                onBlur={e=>(e.target as HTMLInputElement).style.borderColor='var(--border)'}
              />
            </div>
            <button onClick={handleAI} disabled={aiLoading} style={{ display:'flex',alignItems:'center',gap:6,background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:13,padding:'11px 18px',fontSize:13,fontWeight:800,cursor:'pointer',flexShrink:0,boxShadow:'0 4px 14px rgba(0,87,231,0.35)',whiteSpace:'nowrap' }}>
              {aiLoading ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation:'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></svg>
               : <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>}
              AI-поиск
            </button>
            <div style={{ display:'flex',gap:4,background:'var(--surface2)',borderRadius:11,padding:3,border:'1px solid var(--border)',flexShrink:0 }}>
              {[{id:'grid',icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>},{id:'list',icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}].map(v=>(
                <button key={v.id} onClick={()=>setView(v.id as 'grid'|'list')} style={{ background:view===v.id?'var(--surface)':'none',border:'none',borderRadius:8,padding:'7px 9px',cursor:'pointer',color:view===v.id?'var(--blue-mid)':'var(--text3)',display:'flex',alignItems:'center',boxShadow:view===v.id?'var(--shadow-sm)':'none' }}>{v.icon}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ background:'var(--surface)',borderBottom:'1px solid var(--border)',padding:'10px 24px' }}>
          <div style={{ maxWidth:1280,margin:'0 auto',display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none',alignItems:'center' }}>
            {TYPES.map(t=>(
              <button key={t} onClick={()=>setPropType(propType===t?'':t)} style={{ padding:'7px 14px',borderRadius:30,fontSize:13,fontWeight:700,background:propType===t?'var(--blue-mid)':'var(--surface2)',color:propType===t?'#fff':'var(--text2)',border:`1.5px solid ${propType===t?'var(--blue-mid)':'var(--border)'}`,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,transition:'all 0.15s' }}>{t}</button>
            ))}
            {ROOMS.map(r=>(
              <button key={r} onClick={()=>toggleRoom(r)} style={{ padding:'7px 14px',borderRadius:30,fontSize:13,fontWeight:700,background:rooms.includes(r)?'var(--blue-mid)':'var(--surface2)',color:rooms.includes(r)?'#fff':'var(--text2)',border:`1.5px solid ${rooms.includes(r)?'var(--blue-mid)':'var(--border)'}`,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,transition:'all 0.15s' }}>{r}</button>
            ))}
            <button onClick={()=>setVerified(!verified)} style={{ padding:'7px 14px',borderRadius:30,fontSize:13,fontWeight:700,background:verified?'var(--green)':'var(--surface2)',color:verified?'#fff':'var(--text2)',border:`1.5px solid ${verified?'var(--green)':'var(--border)'}`,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,display:'flex',alignItems:'center',gap:5 }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Верифицированные
            </button>
            {hasFilters && <button onClick={reset} style={{ padding:'7px 14px',borderRadius:30,fontSize:13,fontWeight:700,background:'#FFF0F1',color:'var(--red)',border:'1.5px solid #FFD0D4',cursor:'pointer',whiteSpace:'nowrap',flexShrink:0 }}>✕ Сбросить</button>}
          </div>
        </div>

        {/* AI suggestion */}
        {aiResult && (
          <div style={{ padding:'12px 24px',background:'linear-gradient(135deg,rgba(0,87,231,0.06),rgba(14,165,233,0.06))',borderBottom:'1px solid rgba(0,87,231,0.12)' }}>
            <div style={{ maxWidth:1280,margin:'0 auto',display:'flex',gap:10,alignItems:'flex-start' }}>
              <div style={{ width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#0057E7,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2 }}>
                <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>
              </div>
              <div style={{ flex:1 }}>
                <span style={{ fontSize:13,color:'var(--blue-mid)',fontWeight:700 }}>AI-анализ: </span>
                <span style={{ fontSize:13,color:'var(--text2)' }}>{aiResult}</span>
              </div>
              <button onClick={()=>setAiResult('')} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text3)',padding:4,flexShrink:0 }}>✕</button>
            </div>
          </div>
        )}

        <div style={{ maxWidth:1280,margin:'0 auto',padding:'24px 24px 64px' }}>
          {/* Results header */}
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:12 }}>
            <h2 style={{ fontSize:20,fontWeight:800,color:'var(--text)' }}>
              {result.length>0 ? `Найдено ${result.length} объявлений` : 'Ничего не найдено'}
            </h2>
            <div style={{ position:'relative' }}>
              <button onClick={()=>setSortOpen(!sortOpen)} style={{ display:'flex',alignItems:'center',gap:8,background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:11,padding:'9px 16px',fontSize:13,fontWeight:700,color:'var(--text)',cursor:'pointer',boxShadow:'var(--shadow-sm)' }}>
                Сортировка: {sort}
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ transform:sortOpen?'rotate(180deg)':'rotate(0)',transition:'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {sortOpen && (
                <div style={{ position:'absolute',right:0,top:'110%',background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:13,boxShadow:'var(--shadow-lg)',overflow:'hidden',zIndex:100,minWidth:160,animation:'fadeIn 0.15s' }}>
                  {['Новые','Дешевле','Дороже','Рейтинг'].map(s=>(
                    <div key={s} onClick={()=>{setSort(s);setSortOpen(false);}} style={{ padding:'11px 16px',fontSize:14,cursor:'pointer',fontWeight:sort===s?800:500,color:sort===s?'var(--blue-mid)':'var(--text)',background:'transparent',transition:'background 0.1s' }}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='var(--bg3)'}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}
                    >{s}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          {result.length === 0 ? (
            <div style={{ textAlign:'center',padding:'80px 0' }}>
              <svg width="64" height="64" fill="none" stroke="var(--text3)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom:20 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              <h3 style={{ fontSize:22,fontWeight:800,color:'var(--text)',marginBottom:10 }}>Ничего не найдено</h3>
              <p style={{ color:'var(--text2)',marginBottom:24 }}>Попробуйте изменить параметры поиска</p>
              <button onClick={reset} style={{ background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:13,padding:'13px 28px',fontSize:14,fontWeight:800,cursor:'pointer' }}>Сбросить фильтры</button>
            </div>
          ) : view==='grid' ? (
            <div className="grid-cards">
              {result.map(item => (
                <Link key={item.id} href={`/listing/${item.id}`} style={{ textDecoration:'none' }}>
                  <div style={{ borderRadius:20,overflow:'hidden',background:'var(--surface)',boxShadow:'var(--shadow)',transition:'transform 0.3s,box-shadow 0.3s',cursor:'pointer' }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-5px)';(e.currentTarget as HTMLElement).style.boxShadow='var(--shadow-lg)';}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='var(--shadow)';}}
                  >
                    <div style={{ position:'relative',height:200,overflow:'hidden' }}>
                      <img src={item.images[0]} alt={item.title} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
                      {item.badge && <div style={{ position:'absolute',top:12,left:12,background:item.badge==='Топ'?'var(--orange)':item.badge==='Новое'?'var(--green)':'var(--purple)',color:'#fff',fontSize:10,fontWeight:800,padding:'4px 11px',borderRadius:20,textTransform:'uppercase' }}>{item.badge}</div>}
                      <button onClick={e=>{e.preventDefault();toggleFavorite(item.id);}} style={{ position:'absolute',top:10,right:10,background:'rgba(0,0,0,0.45)',backdropFilter:'blur(8px)',border:'none',borderRadius:'50%',width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>
                        <svg width="15" height="15" fill={isFavorite(item.id)?"#fff":"none"} stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                      <div style={{ position:'absolute',bottom:8,right:10,background:'rgba(0,0,0,0.72)',backdropFilter:'blur(8px)',color:'#fff',borderRadius:8,padding:'4px 10px',fontWeight:900,fontSize:15 }}>{item.price.toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <div style={{ padding:'14px 16px 18px' }}>
                      {item.metro && <div style={{ fontSize:11,color:'var(--blue-mid)',fontWeight:700,marginBottom:6,display:'flex',alignItems:'center',gap:4 }}>
                        <span style={{ width:6,height:6,borderRadius:'50%',background:'var(--blue-mid)',display:'inline-block' }}/>{item.metro} · {item.metroMin} мин
                        {item.verified && <span style={{ color:'var(--green)',marginLeft:6,display:'flex',alignItems:'center',gap:3 }}><svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Верифиц.</span>}
                      </div>}
                      <h3 style={{ margin:'0 0 4px',fontSize:15,fontWeight:800,color:'var(--text)',lineHeight:1.3 }}>{item.title}</h3>
                      <p style={{ margin:'0 0 10px',fontSize:12,color:'var(--text3)' }}>{item.location}</p>
                      <div style={{ display:'flex',gap:5,marginBottom:10 }}>
                        {[`${item.rooms}к`,`${item.area}м²`,item.floor+' эт.'].map((s,i)=><span key={i} style={{ fontSize:11,color:'var(--text2)',background:'var(--surface2)',borderRadius:7,padding:'3px 7px',fontWeight:600 }}>{s}</span>)}
                      </div>
                      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                        <span style={{ fontSize:12,display:'flex',alignItems:'center',gap:3 }}>
                          <svg width="11" height="11" fill="#FFB800" stroke="#FFB800" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          <span style={{ fontWeight:700,color:'var(--text)' }}>{item.rating}</span><span style={{ color:'var(--text3)' }}>({item.reviews})</span>
                        </span>
                        <span style={{ fontSize:12,color:'var(--blue-mid)',fontWeight:700 }}>Подробнее →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              {result.map(item => (
                <Link key={item.id} href={`/listing/${item.id}`} style={{ textDecoration:'none' }}>
                  <div style={{ display:'flex',gap:20,background:'var(--surface)',borderRadius:18,overflow:'hidden',boxShadow:'var(--shadow)',transition:'box-shadow 0.2s,transform 0.2s',cursor:'pointer' }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateX(3px)';(e.currentTarget as HTMLElement).style.boxShadow='var(--shadow-lg)';}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateX(0)';(e.currentTarget as HTMLElement).style.boxShadow='var(--shadow)';}}
                  >
                    <div style={{ position:'relative',width:220,minWidth:180,flexShrink:0 }}>
                      <img src={item.images[0]} alt="" style={{ width:'100%',height:'100%',minHeight:140,objectFit:'cover' }}/>
                      {item.badge && <div style={{ position:'absolute',top:10,left:10,background:'var(--orange)',color:'#fff',fontSize:10,fontWeight:800,padding:'3px 9px',borderRadius:20 }}>{item.badge}</div>}
                    </div>
                    <div style={{ padding:'18px 20px 18px 0',flex:1,display:'flex',flexDirection:'column',justifyContent:'space-between',minWidth:0 }}>
                      <div>
                        <div style={{ display:'flex',gap:8,marginBottom:7,flexWrap:'wrap' }}>
                          {item.metro && <span style={{ fontSize:11,color:'var(--blue-mid)',fontWeight:700 }}>{item.metro} · {item.metroMin} мин</span>}
                          {item.verified && <span style={{ fontSize:11,color:'var(--green)',fontWeight:700 }}>✓ Верифицировано</span>}
                        </div>
                        <h3 style={{ fontSize:17,fontWeight:800,color:'var(--text)',marginBottom:5 }}>{item.title}</h3>
                        <p style={{ fontSize:13,color:'var(--text2)',marginBottom:10 }}>{item.address}</p>
                        <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
                          {[`${item.rooms} комн.`,`${item.area} м²`,`${item.floor} эт.`,`${item.year} г.`].map((s,i)=><span key={i} style={{ fontSize:12,color:'var(--text2)',background:'var(--surface2)',borderRadius:8,padding:'4px 10px',fontWeight:600 }}>{s}</span>)}
                        </div>
                      </div>
                      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:12,flexWrap:'wrap',gap:8 }}>
                        <div>
                          <div style={{ fontSize:22,fontWeight:900,color:'var(--text)' }}>{item.price.toLocaleString('ru-RU')} <span style={{ fontSize:14,color:'var(--text2)' }}>₽/мес</span></div>
                          <div style={{ fontSize:12,color:'var(--text3)' }}>Залог: {item.deposit.toLocaleString('ru-RU')} ₽ · Комиссия: {item.commission}</div>
                        </div>
                        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:3 }}>
                            <svg width="13" height="13" fill="#FFB800" stroke="#FFB800" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <span style={{ fontSize:13,fontWeight:800,color:'var(--text)' }}>{item.rating}</span>
                            <span style={{ fontSize:12,color:'var(--text3)' }}>({item.reviews})</span>
                          </div>
                          <button onClick={e=>{e.preventDefault();toggleFavorite(item.id);}} style={{ background:isFavorite(item.id)?'#FFF0F1':'var(--surface2)',border:`1px solid ${isFavorite(item.id)?'#FFD0D4':'var(--border)'}`,borderRadius:9,padding:'7px 13px',cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontSize:12,fontWeight:700,color:isFavorite(item.id)?'var(--red)':'var(--text2)' }}>
                            ♥ {isFavorite(item.id)?'Сохранено':'Сохранить'}
                          </button>
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
      {authModal && <AuthModal mode={authModal} onClose={()=>setAuthModal(null)} />}
    </>
  );
}

export default function SearchPage() {
  return <Suspense><SearchContent /></Suspense>;
}
