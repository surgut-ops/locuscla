'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function Navbar({ onLogin, onRegister, transparent = false }: { onLogin?: ()=>void; onRegister?: ()=>void; transparent?: boolean }) {
  const { theme, toggleTheme, user, logout } = useApp();
  const router = useRouter();

  const handleAddListing = () => {
    if (!user) {
      (onRegister ?? onLogin)?.();
    } else {
      router.push('/listing/new');
    }
  };
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const glass = !scrolled && transparent;
  const tc = glass ? '#fff' : 'var(--text)';
  const tc2 = glass ? 'rgba(255,255,255,0.8)' : 'var(--text2)';

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} style={{ padding:'7px 13px', borderRadius:9, fontSize:14, fontWeight:600, color:tc2, textDecoration:'none', whiteSpace:'nowrap', transition:'all 0.2s' }}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='var(--blue-mid)';(e.currentTarget as HTMLElement).style.background='var(--bg3)';}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color=tc2;(e.currentTarget as HTMLElement).style.background='transparent';}}
    >{label}</Link>
  );

  return (
    <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:900, background:scrolled||!transparent?'var(--nav-bg)':'transparent', backdropFilter:scrolled||!transparent?'blur(20px)':'none', borderBottom:scrolled||!transparent?'1px solid var(--border)':'none', transition:'all 0.3s', padding:'0 max(24px, env(safe-area-inset-left))' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:66, gap:16 }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <div style={{ width:36,height:36,borderRadius:11,background:'linear-gradient(135deg,#0057E7,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px rgba(0,87,231,0.4)',flexShrink:0 }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <span style={{ fontFamily:"'Unbounded',sans-serif",fontSize:20,fontWeight:900,color:tc,letterSpacing:'-0.5px',transition:'color 0.3s' }}>Locus</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display:'flex',alignItems:'center',gap:2,flex:1,justifyContent:'center' }} className="hide-mobile">
          <NavLink href="/" label="Главная" />
          <NavLink href="/search" label="Аренда" />
          <NavLink href="/search?mode=buy" label="Продажа" />
          <NavLink href="/search?type=Новостройка" label="Новостройки" />
          <Link href="/search" style={{ display:'flex',alignItems:'center',gap:5,padding:'7px 13px',borderRadius:9,fontSize:13,fontWeight:700,color:'var(--blue-mid)',background:'var(--bg3)',textDecoration:'none' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>
            AI-поиск
          </Link>
        </div>

        {/* Right side */}
        <div style={{ display:'flex',alignItems:'center',gap:8,flexShrink:0 }}>
          {/* Theme toggle */}
          <button onClick={toggleTheme} style={{ width:36,height:36,borderRadius:10,background:glass?'rgba(255,255,255,0.15)':'var(--surface2)',border:glass?'1px solid rgba(255,255,255,0.3)':'1px solid var(--border)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:tc2,transition:'all 0.2s',flexShrink:0 }}>
            {theme==='dark'
              ? <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            }
          </button>

          {/* User menu */}
          {user ? (
            <div ref={menuRef} style={{ position:'relative' }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display:'flex',alignItems:'center',gap:8,background:glass?'rgba(255,255,255,0.15)':'var(--surface2)',border:glass?'1px solid rgba(255,255,255,0.3)':'1px solid var(--border)',borderRadius:11,padding:'5px 10px',cursor:'pointer' }}>
                <div style={{ width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#0057E7,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:12,fontWeight:800,flexShrink:0 }}>{user.name[0]}</div>
                <span className="hide-mobile" style={{ fontSize:13,fontWeight:700,color:tc }}>{user.name.split(' ')[0]}</span>
                <svg width="11" height="11" fill="none" stroke={tc2} strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {userMenuOpen && (
                <div style={{ position:'absolute',right:0,top:'110%',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:16,boxShadow:'var(--shadow-lg)',minWidth:200,overflow:'hidden',zIndex:200,animation:'fadeIn 0.15s ease' }}>
                  <div style={{ padding:'12px 16px',borderBottom:'1px solid var(--border)' }}>
                    <div style={{ fontWeight:700,fontSize:13,color:'var(--text)' }}>{user.name}</div>
                    <div style={{ fontSize:12,color:'var(--text3)' }}>{user.email}</div>
                    {user.role === 'admin' && <div style={{ fontSize:11,color:'var(--blue-mid)',fontWeight:700,marginTop:2 }}>Администратор</div>}
                  </div>
                  {[['/profile','Мой профиль'],['/favorites','Избранное'],['/profile?tab=listings','Мои объявления'], ...(user.role==='admin'?[['/admin','Панель администратора']]:[])] .map(([href,label]) => (
                    <Link key={href} href={href} onClick={()=>setUserMenuOpen(false)} style={{ display:'flex',alignItems:'center',padding:'11px 16px',textDecoration:'none',color:'var(--text)',fontSize:14,fontWeight:600,transition:'background 0.15s' }}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='var(--bg3)'}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}
                    >{label}</Link>
                  ))}
                  <button onClick={()=>{logout();setUserMenuOpen(false);}} style={{ width:'100%',padding:'11px 16px',textAlign:'left',background:'none',border:'none',borderTop:'1px solid var(--border)',color:'var(--red)',fontSize:14,fontWeight:700,cursor:'pointer' }}>
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={onLogin} className="hide-mobile" style={{ background:'none',border:`1.5px solid ${glass?'rgba(255,255,255,0.5)':'var(--border)'}`,color:tc,padding:'8px 16px',borderRadius:11,fontWeight:700,fontSize:14,cursor:'pointer',whiteSpace:'nowrap' }}>Войти</button>
              <button onClick={handleAddListing} className="hide-mobile" style={{ background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',padding:'9px 18px',borderRadius:11,fontWeight:800,fontSize:14,cursor:'pointer',boxShadow:'0 4px 14px rgba(0,87,231,0.4)',whiteSpace:'nowrap' }}>+ Разместить</button>
            </>
          )}

          {/* Mobile hamburger */}
          <button onClick={()=>setMobileOpen(!mobileOpen)} className="show-mobile" style={{ display:'none',width:36,height:36,background:glass?'rgba(255,255,255,0.15)':'var(--surface2)',border:glass?'1px solid rgba(255,255,255,0.3)':'1px solid var(--border)',borderRadius:9,alignItems:'center',justifyContent:'center',cursor:'pointer',color:tc,flexShrink:0 }}>
            {mobileOpen
              ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop:'1px solid var(--border)',background:'var(--nav-bg)',padding:'16px 24px 24px',animation:'fadeIn 0.2s ease' }}>
          <div style={{ display:'flex',flexDirection:'column',gap:6,marginBottom:16 }}>
            {[['/', 'Главная'], ['/search', 'Аренда'], ['/search?mode=buy', 'Продажа'], ['/search', 'AI-поиск'], ['/messages', '💬 Сообщения']].map(([href,label]) => (
              <Link key={label} href={href} onClick={()=>setMobileOpen(false)} style={{ padding:'12px 14px',borderRadius:11,fontSize:15,fontWeight:600,color:'var(--text)',textDecoration:'none',background:'var(--surface2)' }}>{label}</Link>
            ))}
          </div>
          {!user && (
            <div style={{ display:'flex',gap:10 }}>
              <button onClick={()=>{onLogin?.();setMobileOpen(false);}} style={{ flex:1,padding:'13px',background:'none',border:'1.5px solid var(--border)',color:'var(--text)',borderRadius:12,fontWeight:700,fontSize:15,cursor:'pointer' }}>Войти</button>
              <button onClick={()=>{handleAddListing();setMobileOpen(false);}} style={{ flex:1,padding:'13px',background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:12,fontWeight:800,fontSize:15,cursor:'pointer' }}>+ Разместить</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
