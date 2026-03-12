'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import { useApp } from '@/context/AppContext';
import { LISTINGS } from '@/lib/data';

export default function ProfilePage() {
  const { user, logout, toggleFavorite } = useApp();
  const [authModal, setAuthModal] = useState<'login'|'register'|null>(null);
  const [tab, setTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) { setName(user.name); setPhone(user.phone||''); }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locus_avatar');
      if (saved) setAvatarSrc(saved);
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setAvatarSrc(src);
      try { localStorage.setItem('locus_avatar', src); } catch {}
    };
    reader.readAsDataURL(file);
  };

  if (!user) return (
    <>
      <Navbar onLogin={()=>setAuthModal('login')} onRegister={()=>setAuthModal('register')} />
      <div style={{ minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:24,paddingTop:100 }}>
        <div style={{ width:80,height:80,borderRadius:24,background:'linear-gradient(135deg,#0057E7,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20,boxShadow:'0 8px 30px rgba(0,87,231,0.35)' }}>
          <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <h2 style={{ fontSize:26,fontWeight:900,color:'var(--text)',marginBottom:8,letterSpacing:'-0.5px' }}>Войдите в аккаунт</h2>
        <p style={{ color:'var(--text2)',marginBottom:28,textAlign:'center',maxWidth:320 }}>Чтобы просматривать профиль, избранное и управлять объявлениями</p>
        <div style={{ display:'flex',gap:12 }}>
          <button onClick={()=>setAuthModal('login')} style={{ background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:13,padding:'13px 32px',fontSize:15,fontWeight:800,cursor:'pointer',boxShadow:'0 8px 24px rgba(0,87,231,0.35)' }}>Войти</button>
          <button onClick={()=>setAuthModal('register')} style={{ background:'var(--surface2)',color:'var(--text)',border:'1.5px solid var(--border)',borderRadius:13,padding:'13px 24px',fontSize:15,fontWeight:700,cursor:'pointer' }}>Регистрация</button>
        </div>
      </div>
      {authModal && <AuthModal mode={authModal} onClose={()=>setAuthModal(null)} />}
    </>
  );

  const favListings = LISTINGS.filter(l => user.favorites.includes(l.id));
  const myListings = LISTINGS.slice(0,2);

  const saveProfile = () => { setSaved(true); setEditing(false); setTimeout(()=>setSaved(false),2500); };

  const Inp = ({ label, value, onChange, type='text', placeholder='' }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
    <div>
      <label style={{ display:'block',fontSize:12,fontWeight:700,color:'var(--text3)',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.6px' }}>{label}</label>
      {editing
        ? <input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder} style={{ width:'100%',padding:'12px 14px',border:'1.5px solid var(--border)',borderRadius:12,fontSize:14,background:'var(--surface2)',color:'var(--text)',outline:'none',fontFamily:'inherit',transition:'border-color 0.2s',boxSizing:'border-box' }} onFocus={e=>(e.target as HTMLInputElement).style.borderColor='var(--blue-mid)'} onBlur={e=>(e.target as HTMLInputElement).style.borderColor='var(--border)'} />
        : <div style={{ padding:'12px 14px',background:'var(--surface2)',borderRadius:12,fontSize:14,color:value?'var(--text)':'var(--text3)' }}>{value||'Не указано'}</div>
      }
    </div>
  );

  const tabs = [
    { id:'profile', label:'Профиль' },
    { id:'favorites', label:`Избранное (${user.favorites.length})` },
    { id:'listings', label:'Мои объявления' },
    { id:'security', label:'Безопасность' },
  ];

  return (
    <>
      <Navbar onLogin={()=>setAuthModal('login')} onRegister={()=>setAuthModal('register')} />
      <style>{`@keyframes bounce{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}`}</style>

      <div style={{ minHeight:'100vh',background:'var(--bg)',paddingTop:80 }}>
        {/* Profile header */}
        <div style={{ background:'linear-gradient(135deg,#0A1628,#0D2B6B)',padding:'48px 24px 24px' }}>
          <div style={{ maxWidth:1280,margin:'0 auto',display:'flex',alignItems:'center',gap:24,flexWrap:'wrap' }}>
            <div onClick={()=>avatarInputRef.current?.click()} title="Нажмите для смены фото" style={{ position:'relative',cursor:'pointer',width:88,height:88,flexShrink:0 }}>
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URLs from file upload not supported by next/image
                <img src={avatarSrc} alt="Аватар" style={{ width:88,height:88,borderRadius:26,objectFit:'cover',border:'3px solid rgba(255,255,255,0.3)',boxShadow:'0 8px 30px rgba(0,87,231,0.4)' }} />
              ) : (
                <div style={{ width:88,height:88,borderRadius:26,background:'linear-gradient(135deg,#0057E7,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,fontWeight:900,color:'#fff',boxShadow:'0 8px 30px rgba(0,87,231,0.4)' }}>{user.name[0]}</div>
              )}
              <div style={{ position:'absolute',bottom:0,right:0,width:28,height:28,borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,boxShadow:'0 2px 6px rgba(0,0,0,0.2)' }}>📷</div>
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:'none' }} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex',alignItems:'center',gap:10,flexWrap:'wrap' }}>
                <h1 style={{ fontSize:26,fontWeight:900,color:'#fff',marginBottom:2 }}>{user.name}</h1>
                {user.role==='admin' && <span style={{ background:'rgba(0,180,255,0.2)',border:'1px solid rgba(0,180,255,0.4)',color:'#4DB8FF',fontSize:11,fontWeight:800,padding:'3px 10px',borderRadius:20,letterSpacing:'0.8px',textTransform:'uppercase' }}>Admin</span>}
              </div>
              <p style={{ color:'rgba(255,255,255,0.55)',fontSize:14 }}>{user.email}</p>
              <div style={{ display:'flex',gap:16,marginTop:10,flexWrap:'wrap' }}>
                {[{n:user.favorites.length,l:'Избранных'},{n:myListings.length,l:'Объявлений'},{n:0,l:'Сделок'}].map((s,i) => (
                  <div key={i} style={{ textAlign:'center' }}>
                    <div style={{ color:'#fff',fontWeight:900,fontSize:18 }}>{s.n}</div>
                    <div style={{ color:'rgba(255,255,255,0.5)',fontSize:11 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
              {user.role==='admin' && <Link href="/admin"><button style={{ background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',color:'#fff',borderRadius:11,padding:'9px 18px',fontSize:13,fontWeight:700,cursor:'pointer' }}>Панель admin</button></Link>}
              <button onClick={logout} style={{ background:'rgba(255,70,70,0.15)',border:'1px solid rgba(255,70,70,0.3)',color:'#ff6b6b',borderRadius:11,padding:'9px 18px',fontSize:13,fontWeight:700,cursor:'pointer' }}>Выйти</button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background:'var(--surface)',borderBottom:'1px solid var(--border)',padding:'0 24px',position:'sticky',top:66,zIndex:50 }}>
          <div style={{ maxWidth:1280,margin:'0 auto',display:'flex',gap:4,overflowX:'auto',scrollbarWidth:'none' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:'none',border:'none',padding:'16px 18px',fontSize:14,fontWeight:700,color:tab===t.id?'var(--blue-mid)':'var(--text2)',cursor:'pointer',whiteSpace:'nowrap',borderBottom:`2.5px solid ${tab===t.id?'var(--blue-mid)':'transparent'}`,transition:'all 0.2s' }}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth:1280,margin:'0 auto',padding:'32px 24px 64px' }}>

          {/* Profile tab */}
          {tab==='profile' && (
            <div className="grid-2" style={{ gap:24 }}>
              <div style={{ background:'var(--surface)',borderRadius:22,padding:28,boxShadow:'var(--shadow)' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22 }}>
                  <h3 style={{ fontSize:17,fontWeight:800,color:'var(--text)' }}>Личные данные</h3>
                  {!editing
                    ? <button onClick={()=>setEditing(true)} style={{ background:'var(--bg3)',border:'none',borderRadius:9,padding:'8px 16px',fontSize:13,fontWeight:700,color:'var(--blue-mid)',cursor:'pointer' }}>Редактировать</button>
                    : <div style={{ display:'flex',gap:8 }}>
                        <button onClick={()=>setEditing(false)} style={{ background:'var(--surface2)',border:'none',borderRadius:9,padding:'8px 14px',fontSize:13,fontWeight:700,color:'var(--text2)',cursor:'pointer' }}>Отмена</button>
                        <button onClick={saveProfile} style={{ background:'var(--green)',border:'none',borderRadius:9,padding:'8px 16px',fontSize:13,fontWeight:700,color:'#fff',cursor:'pointer' }}>Сохранить</button>
                      </div>
                  }
                </div>
                {saved && <div style={{ background:'#EDFBF4',border:'1px solid #A7F3D0',borderRadius:10,padding:'10px 14px',marginBottom:16,fontSize:13,color:'#065F46',fontWeight:700,display:'flex',alignItems:'center',gap:8 }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  Данные сохранены!
                </div>}
                <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
                  <Inp label="Имя" value={name} onChange={setName} />
                  <Inp label="Email" value={user.email} onChange={()=>{}} />
                  <Inp label="Телефон" value={phone} onChange={setPhone} type="tel" placeholder="+7 (000) 000-00-00" />
                  <Inp label="Дата регистрации" value={user.createdAt} onChange={()=>{}} />
                </div>
                <div style={{ marginTop:'20px', paddingTop:'20px', borderTop:'1px solid var(--border)' }}>
                  <Link href={`/user/${user.id}`} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 20px', borderRadius:12, border:'1.5px solid var(--border)', background:'transparent', color:'var(--text)', textDecoration:'none', fontWeight:600, fontSize:14 }}>
                    👤 Открыть публичный профиль
                  </Link>
                </div>
              </div>

              <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
                <div style={{ background:'var(--surface)',borderRadius:22,padding:24,boxShadow:'var(--shadow)' }}>
                  <h3 style={{ fontSize:15,fontWeight:800,color:'var(--text)',marginBottom:14 }}>Верификация</h3>
                  {[{t:'Email',ok:true},{t:'Телефон',ok:!!user.phone},{t:'Документ',ok:false}].map(v => (
                    <div key={v.t} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)' }}>
                      <span style={{ fontSize:14,color:'var(--text)',fontWeight:600 }}>{v.t}</span>
                      <span style={{ fontSize:12,fontWeight:700,color:v.ok?'var(--green)':'var(--text3)',display:'flex',alignItems:'center',gap:5 }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">{v.ok?<polyline points="20 6 9 17 4 12"/>:<line x1="18" y1="6" x2="6" y2="18"/>}</svg>
                        {v.ok?'Подтверждён':'Не подтверждён'}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ background:'linear-gradient(135deg,#0A1628,#0D2B6B)',borderRadius:22,padding:24 }}>
                  <h3 style={{ fontSize:15,fontWeight:800,color:'#fff',marginBottom:8 }}>Locus Pro</h3>
                  <p style={{ color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:16 }}>Расширенные возможности, приоритетный поиск, AI-анализ договоров</p>
                  <button style={{ background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:11,padding:'10px 20px',fontSize:13,fontWeight:800,cursor:'pointer',width:'100%' }}>Подключить за 499₽/мес</button>
                </div>
              </div>
            </div>
          )}

          {/* Favorites tab */}
          {tab==='favorites' && (
            favListings.length === 0
            ? <div style={{ textAlign:'center',padding:'64px 0' }}>
                <div style={{ fontSize:60,marginBottom:16 }}>❤️</div>
                <h3 style={{ fontSize:20,fontWeight:800,color:'var(--text)',marginBottom:8 }}>Нет избранных</h3>
                <p style={{ color:'var(--text2)',marginBottom:24 }}>Сохраняйте объявления, нажимая на сердечко</p>
                <Link href="/search"><button style={{ background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:13,padding:'13px 28px',fontSize:14,fontWeight:800,cursor:'pointer' }}>Найти жильё</button></Link>
              </div>
            : <div className="grid-cards">
                {favListings.map(l => (
                  <div key={l.id} style={{ background:'var(--surface)',borderRadius:18,overflow:'hidden',boxShadow:'var(--shadow)' }}>
                    <Link href={`/listing/${l.id}`} style={{ textDecoration:'none' }}>
                      <div style={{ position:'relative',height:180 }}>
                        <Image src={l.images[0]} alt={l.title} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit:'cover' }}/>
                        <div style={{ position:'absolute',bottom:8,right:10,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(6px)',color:'#fff',borderRadius:8,padding:'3px 10px',fontSize:14,fontWeight:900 }}>{l.price.toLocaleString('ru-RU')} ₽</div>
                      </div>
                    </Link>
                    <div style={{ padding:'14px 16px 16px' }}>
                      <h4 style={{ fontWeight:800,fontSize:14,color:'var(--text)',marginBottom:5 }}>{l.title}</h4>
                      <p style={{ color:'var(--text3)',fontSize:12,marginBottom:12 }}>{l.location}</p>
                      <button onClick={()=>toggleFavorite(l.id)} style={{ width:'100%',padding:'9px',background:'#FFF0F1',border:'1px solid #FFD0D4',borderRadius:10,color:'var(--red)',fontSize:13,fontWeight:700,cursor:'pointer' }}>Удалить из избранного</button>
                    </div>
                  </div>
                ))}
              </div>
          )}

          {/* Listings tab */}
          {tab==='listings' && (
            <div>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,flexWrap:'wrap',gap:12 }}>
                <h3 style={{ fontSize:18,fontWeight:800,color:'var(--text)' }}>Мои объявления ({myListings.length})</h3>
                <button style={{ background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:11,padding:'10px 20px',fontSize:14,fontWeight:800,cursor:'pointer' }}>+ Добавить</button>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
                {myListings.map(l => (
                  <div key={l.id} style={{ background:'var(--surface)',borderRadius:16,padding:'16px',display:'flex',gap:16,boxShadow:'var(--shadow)',alignItems:'flex-start',flexWrap:'wrap' }}>
                    <Image src={l.images[0]} alt="" width={130} height={90} style={{ objectFit:'cover',borderRadius:12,flexShrink:0 }}/>
                    <div style={{ flex:1,minWidth:200 }}>
                      <h4 style={{ fontWeight:800,fontSize:15,color:'var(--text)',marginBottom:4 }}>{l.title}</h4>
                      <p style={{ color:'var(--text3)',fontSize:12,marginBottom:8 }}>{l.location}</p>
                      <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
                        <span style={{ background:'#EDFBF4',color:'#065F46',fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20 }}>Активно</span>
                        <span style={{ color:'var(--text2)',fontSize:12 }}>👁 {l.reviews*3} просмотров</span>
                        <span style={{ color:'var(--text2)',fontSize:12 }}>💬 {l.reviews} откликов</span>
                      </div>
                    </div>
                    <div style={{ textAlign:'right',flexShrink:0 }}>
                      <div style={{ fontSize:17,fontWeight:900,color:'var(--text)',marginBottom:6 }}>{l.price.toLocaleString('ru-RU')} ₽</div>
                      <div style={{ display:'flex',gap:8 }}>
                        <Link href={`/listing/${l.id}`}><button style={{ background:'var(--bg3)',border:'none',borderRadius:9,padding:'7px 14px',fontSize:12,fontWeight:700,color:'var(--blue-mid)',cursor:'pointer' }}>Просмотр</button></Link>
                        <button style={{ background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:9,padding:'7px 14px',fontSize:12,fontWeight:700,color:'var(--text2)',cursor:'pointer' }}>Редакт.</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security tab */}
          {tab==='security' && (
            <div style={{ maxWidth:520 }}>
              <div style={{ background:'var(--surface)',borderRadius:22,padding:28,boxShadow:'var(--shadow)',display:'flex',flexDirection:'column',gap:18 }}>
                <h3 style={{ fontSize:17,fontWeight:800,color:'var(--text)' }}>Безопасность</h3>
                <div>
                  <label style={{ display:'block',fontSize:12,fontWeight:700,color:'var(--text3)',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.6px' }}>Текущий пароль</label>
                  <input type="password" placeholder="••••••••" style={{ width:'100%',padding:'12px 14px',border:'1.5px solid var(--border)',borderRadius:12,fontSize:14,background:'var(--surface2)',color:'var(--text)',outline:'none',fontFamily:'inherit',boxSizing:'border-box' }}/>
                </div>
                <div>
                  <label style={{ display:'block',fontSize:12,fontWeight:700,color:'var(--text3)',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.6px' }}>Новый пароль</label>
                  <input type="password" placeholder="Минимум 8 символов" style={{ width:'100%',padding:'12px 14px',border:'1.5px solid var(--border)',borderRadius:12,fontSize:14,background:'var(--surface2)',color:'var(--text)',outline:'none',fontFamily:'inherit',boxSizing:'border-box' }}/>
                </div>
                <button style={{ background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:12,padding:'13px',fontSize:14,fontWeight:800,cursor:'pointer' }}>Изменить пароль</button>
                <div style={{ background:'#FFF0F1',border:'1px solid #FFD0D4',borderRadius:12,padding:'14px 16px' }}>
                  <div style={{ fontWeight:800,color:'var(--red)',fontSize:13,marginBottom:5 }}>Опасная зона</div>
                  <p style={{ color:'var(--text2)',fontSize:12,marginBottom:12 }}>После удаления аккаунт и все данные будут безвозвратно удалены</p>
                  <button style={{ background:'none',border:'1px solid var(--red)',color:'var(--red)',borderRadius:9,padding:'8px 16px',fontSize:13,fontWeight:700,cursor:'pointer' }}>Удалить аккаунт</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      {authModal && <AuthModal mode={authModal} onClose={()=>setAuthModal(null)} />}
    </>
  );
}
