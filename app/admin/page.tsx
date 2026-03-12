'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import { useApp } from '@/context/AppContext';
import { LISTINGS } from '@/lib/data';

const STATS = [
  { label:'Объявлений', val:'127,840', delta:'+342 сегодня', icon:'📋', color:'#0057E7' },
  { label:'Пользователей', val:'89,241', delta:'+127 сегодня', icon:'👥', color:'#00C896' },
  { label:'Сделок', val:'12,390', delta:'+43 сегодня', icon:'🤝', color:'#A78BFA' },
  { label:'Выручка', val:'₽4.2М', delta:'+₽127К сегодня', icon:'💰', color:'#FB923C' },
];

export default function AdminPage() {
  const { user } = useApp();
  const [authModal, setAuthModal] = useState<'login'|'register'|null>(null);
  const [tab, setTab] = useState('dashboard');

  if (!user || user.role !== 'admin') return (
    <>
      <Navbar onLogin={()=>setAuthModal('login')} onRegister={()=>setAuthModal('register')} />
      <div style={{ minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:24,paddingTop:100 }}>
        <div style={{ fontSize:72,marginBottom:16 }}>🔐</div>
        <h2 style={{ fontSize:26,fontWeight:900,color:'var(--text)',marginBottom:8 }}>Доступ закрыт</h2>
        <p style={{ color:'var(--text2)',marginBottom:24,textAlign:'center' }}>Эта страница доступна только администраторам</p>
        <div style={{ background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:12,padding:'12px 20px',fontSize:13,color:'var(--text2)',marginBottom:24 }}>
          Для теста войдите как <strong>admin@locus.ru</strong>
        </div>
        <div style={{ display:'flex',gap:12 }}>
          <button onClick={()=>setAuthModal('login')} style={{ background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:13,padding:'13px 28px',fontSize:14,fontWeight:800,cursor:'pointer' }}>Войти</button>
          <Link href="/"><button style={{ background:'var(--surface2)',color:'var(--text)',border:'1.5px solid var(--border)',borderRadius:13,padding:'13px 24px',fontSize:14,fontWeight:700,cursor:'pointer' }}>На главную</button></Link>
        </div>
      </div>
      {authModal && <AuthModal mode={authModal} onClose={()=>setAuthModal(null)} />}
    </>
  );

  const tabs = ['dashboard','listings','users','ai_reports','settings'];
  const tabLabels: Record<string,string> = { dashboard:'Обзор', listings:'Объявления', users:'Пользователи', ai_reports:'AI-отчёты', settings:'Настройки' };

  return (
    <>
      <Navbar onLogin={()=>setAuthModal('login')} onRegister={()=>setAuthModal('register')} />
      <div style={{ minHeight:'100vh',background:'var(--bg)',paddingTop:66 }}>
        {/* Header */}
        <div style={{ background:'linear-gradient(135deg,#0A1628,#0D2B6B)',padding:'28px 24px 0' }}>
          <div style={{ maxWidth:1400,margin:'0 auto' }}>
            <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:28,flexWrap:'wrap' }}>
              <div style={{ width:44,height:44,borderRadius:13,background:'rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22 }}>⚙️</div>
              <div>
                <h1 style={{ fontSize:22,fontWeight:900,color:'#fff' }}>Панель администратора</h1>
                <p style={{ color:'rgba(255,255,255,0.5)',fontSize:13 }}>Locus Admin · {user.name}</p>
              </div>
            </div>
            <div style={{ display:'flex',gap:2,overflowX:'auto',scrollbarWidth:'none' }}>
              {tabs.map(t => <button key={t} onClick={()=>setTab(t)} style={{ background:'none',border:'none',padding:'12px 18px',fontSize:14,fontWeight:700,color:tab===t?'#fff':'rgba(255,255,255,0.5)',cursor:'pointer',whiteSpace:'nowrap',borderBottom:`2.5px solid ${tab===t?'#4DB8FF':'transparent'}`,transition:'all 0.2s' }}>{tabLabels[t]}</button>)}
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1400,margin:'0 auto',padding:'28px 24px 64px' }}>

          {/* Dashboard */}
          {tab==='dashboard' && <>
            {/* Stats */}
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:28 }}>
              {STATS.map((s,i) => (
                <div key={i} style={{ background:'var(--surface)',borderRadius:18,padding:22,boxShadow:'var(--shadow)',borderLeft:`4px solid ${s.color}` }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10 }}>
                    <span style={{ fontSize:12,color:'var(--text2)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.6px' }}>{s.label}</span>
                    <span style={{ fontSize:24 }}>{s.icon}</span>
                  </div>
                  <div style={{ fontSize:26,fontWeight:900,color:'var(--text)',marginBottom:4 }}>{s.val}</div>
                  <div style={{ fontSize:12,color:'var(--green)',fontWeight:700 }}>{s.delta}</div>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="grid-2" style={{ gap:20 }}>
              <div style={{ background:'var(--surface)',borderRadius:20,padding:24,boxShadow:'var(--shadow)' }}>
                <h3 style={{ fontSize:16,fontWeight:800,color:'var(--text)',marginBottom:16 }}>Последние объявления</h3>
                {LISTINGS.slice(0,5).map(l => (
                  <div key={l.id} style={{ display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid var(--border)',alignItems:'center' }}>
                    <img src={l.images[0]} alt="" style={{ width:44,height:44,objectFit:'cover',borderRadius:9,flexShrink:0 }}/>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontWeight:700,fontSize:13,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{l.title}</div>
                      <div style={{ fontSize:11,color:'var(--text3)' }}>{l.location} · {l.price.toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <span style={{ background:l.verified?'#EDFBF4':'#FFF7ED',color:l.verified?'#065F46':'#92400E',fontSize:10,fontWeight:800,padding:'3px 8px',borderRadius:20,flexShrink:0 }}>{l.verified?'Верифиц.':'На проверке'}</span>
                  </div>
                ))}
              </div>

              <div style={{ background:'var(--surface)',borderRadius:20,padding:24,boxShadow:'var(--shadow)' }}>
                <h3 style={{ fontSize:16,fontWeight:800,color:'var(--text)',marginBottom:16 }}>AI-система</h3>
                <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  {[
                    {l:'Верифицировано сегодня',v:342,max:500,color:'var(--green)'},
                    {l:'Выявлено мошенничеств',v:12,max:50,color:'var(--red)'},
                    {l:'Проанализировано цен',v:891,max:1000,color:'var(--blue-mid)'},
                    {l:'AI-чатов за сутки',v:2340,max:5000,color:'#A78BFA'},
                  ].map((m,i) => (
                    <div key={i}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                        <span style={{ fontSize:13,color:'var(--text2)',fontWeight:600 }}>{m.l}</span>
                        <span style={{ fontSize:13,fontWeight:800,color:'var(--text)' }}>{m.v}</span>
                      </div>
                      <div style={{ height:6,background:'var(--surface2)',borderRadius:4 }}>
                        <div style={{ height:'100%',width:`${(m.v/m.max)*100}%`,background:m.color,borderRadius:4,transition:'width 1s' }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>}

          {/* Listings */}
          {tab==='listings' && (
            <div>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:12 }}>
                <h3 style={{ fontSize:18,fontWeight:800,color:'var(--text)' }}>Все объявления</h3>
                <div style={{ display:'flex',gap:8 }}>
                  <input placeholder="Поиск..." style={{ padding:'9px 14px',border:'1.5px solid var(--border)',borderRadius:11,fontSize:14,background:'var(--surface2)',color:'var(--text)',outline:'none',fontFamily:'inherit' }}/>
                  <select style={{ padding:'9px 14px',border:'1.5px solid var(--border)',borderRadius:11,fontSize:14,background:'var(--surface2)',color:'var(--text)',outline:'none',fontFamily:'inherit' }}>
                    <option>Все статусы</option><option>Активные</option><option>На проверке</option><option>Заблокированные</option>
                  </select>
                </div>
              </div>
              <div style={{ background:'var(--surface)',borderRadius:18,boxShadow:'var(--shadow)',overflow:'hidden' }}>
                <table style={{ width:'100%',borderCollapse:'collapse' }}>
                  <thead><tr style={{ background:'var(--surface2)',borderBottom:'1px solid var(--border)' }}>
                    {['ID','Объявление','Город','Цена','Статус','Рейтинг','Действия'].map(h => <th key={h} style={{ padding:'12px 14px',textAlign:'left',fontSize:12,fontWeight:800,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.6px',whiteSpace:'nowrap' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {LISTINGS.map(l => (
                      <tr key={l.id} style={{ borderBottom:'1px solid var(--border)' }}
                        onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='var(--bg3)'}
                        onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}
                      >
                        <td style={{ padding:'11px 14px',fontSize:12,color:'var(--text3)',fontWeight:700 }}>#{l.id}</td>
                        <td style={{ padding:'11px 14px' }}>
                          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                            <img src={l.images[0]} alt="" style={{ width:38,height:30,objectFit:'cover',borderRadius:7 }}/>
                            <div style={{ fontSize:13,fontWeight:700,color:'var(--text)',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{l.title}</div>
                          </div>
                        </td>
                        <td style={{ padding:'11px 14px',fontSize:13,color:'var(--text2)' }}>{l.city}</td>
                        <td style={{ padding:'11px 14px',fontSize:13,fontWeight:800,color:'var(--text)',whiteSpace:'nowrap' }}>{l.price.toLocaleString('ru-RU')} ₽</td>
                        <td style={{ padding:'11px 14px' }}><span style={{ background:l.verified?'#EDFBF4':'#FFF7ED',color:l.verified?'#065F46':'#92400E',fontSize:11,fontWeight:800,padding:'3px 9px',borderRadius:20,whiteSpace:'nowrap' }}>{l.verified?'Активно':'На проверке'}</span></td>
                        <td style={{ padding:'11px 14px',fontSize:13,fontWeight:700,color:'var(--text)' }}>★ {l.rating}</td>
                        <td style={{ padding:'11px 14px' }}>
                          <div style={{ display:'flex',gap:6 }}>
                            <Link href={`/listing/${l.id}`}><button style={{ background:'var(--bg3)',border:'none',borderRadius:7,padding:'6px 11px',fontSize:11,fontWeight:700,color:'var(--blue-mid)',cursor:'pointer' }}>Открыть</button></Link>
                            <button style={{ background:'#FFF0F1',border:'none',borderRadius:7,padding:'6px 11px',fontSize:11,fontWeight:700,color:'var(--red)',cursor:'pointer' }}>Удалить</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users */}
          {tab==='users' && (
            <div style={{ background:'var(--surface)',borderRadius:18,padding:24,boxShadow:'var(--shadow)' }}>
              <h3 style={{ fontSize:16,fontWeight:800,color:'var(--text)',marginBottom:16 }}>Пользователи (мок-данные)</h3>
              {[{n:'Иван Петров',e:'user@locus.ru',role:'user',date:'2024-06-15',ok:true},{n:'Администратор',e:'admin@locus.ru',role:'admin',date:'2024-01-01',ok:true},{n:'Анна Смирнова',e:'anna@mail.ru',role:'user',date:'2024-11-03',ok:true}].map((u,i) => (
                <div key={i} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 0',borderBottom:'1px solid var(--border)',flexWrap:'wrap',gap:12 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                    <div style={{ width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#0057E7,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:16,flexShrink:0 }}>{u.n[0]}</div>
                    <div>
                      <div style={{ fontWeight:700,fontSize:14,color:'var(--text)' }}>{u.n}</div>
                      <div style={{ fontSize:12,color:'var(--text3)' }}>{u.e}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    <span style={{ background:u.role==='admin'?'rgba(0,87,231,0.1)':'var(--surface2)',color:u.role==='admin'?'var(--blue-mid)':'var(--text2)',fontSize:11,fontWeight:800,padding:'3px 10px',borderRadius:20 }}>{u.role}</span>
                    <span style={{ fontSize:12,color:'var(--text3)' }}>с {u.date}</span>
                    <button style={{ background:'#FFF0F1',border:'none',borderRadius:7,padding:'5px 11px',fontSize:11,fontWeight:700,color:'var(--red)',cursor:'pointer' }}>Блок</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==='ai_reports' && (
            <div style={{ background:'var(--surface)',borderRadius:20,padding:28,boxShadow:'var(--shadow)' }}>
              <h3 style={{ fontSize:17,fontWeight:800,color:'var(--text)',marginBottom:20 }}>AI-отчёты системы</h3>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16 }}>
                {[{t:'Детектор мошенничества',d:'12 подозрительных объявлений за 24ч',color:'var(--red)'},{t:'Анализ цен',d:'Средняя цена выросла на 3.2% за неделю',color:'var(--green)'},{t:'Качество описаний',d:'87% объявлений имеют высокое качество',color:'var(--blue-mid)'},{t:'Верификация фото',d:'98.4% фотографий подлинные',color:'#A78BFA'}].map((r,i) => (
                  <div key={i} style={{ background:'var(--surface2)',borderRadius:14,padding:18,borderLeft:`3px solid ${r.color}` }}>
                    <div style={{ fontWeight:800,fontSize:14,color:'var(--text)',marginBottom:6 }}>{r.t}</div>
                    <div style={{ fontSize:13,color:'var(--text2)' }}>{r.d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='settings' && (
            <div style={{ maxWidth:600 }}>
              <div style={{ background:'var(--surface)',borderRadius:20,padding:28,boxShadow:'var(--shadow)' }}>
                <h3 style={{ fontSize:17,fontWeight:800,color:'var(--text)',marginBottom:20 }}>Настройки системы</h3>
                {[{l:'AI-модерация объявлений',v:true},{l:'Авто-верификация фото',v:true},{l:'Детектор мошенничества',v:true},{l:'Email-уведомления',v:false},{l:'SMS-уведомления',v:false}].map((s,i) => (
                  <div key={i} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 0',borderBottom:'1px solid var(--border)' }}>
                    <span style={{ fontSize:14,fontWeight:600,color:'var(--text)' }}>{s.l}</span>
                    <div style={{ width:44,height:24,borderRadius:12,background:s.v?'var(--green)':'var(--border)',position:'relative',cursor:'pointer' }}>
                      <div style={{ position:'absolute',top:3,left:s.v?20:3,width:18,height:18,borderRadius:'50%',background:'#fff',transition:'left 0.2s' }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      {authModal && <AuthModal mode={authModal} onClose={()=>setAuthModal(null)} />}
    </>
  );
}
