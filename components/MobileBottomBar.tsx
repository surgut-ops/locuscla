'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

interface MobileBottomBarProps {
  onOpenAuth: () => void;
}

export default function MobileBottomBar({ onOpenAuth }: MobileBottomBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useApp();

  const isActive = (href: string) => pathname === href;
  const BLUE = '#0057E7';
  const GRAY = 'var(--text3, #8899aa)';

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
    } else {
      router.push('/listing/new');
    }
  };

  return (
    <>
      <style>{`
        .mobile-bottom-bar { display: none; }
        @media (max-width: 768px) {
          .mobile-bottom-bar {
            display: flex !important;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            z-index: 800;
            background: var(--nav-bg, rgba(15,17,22,0.96));
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid var(--border, rgba(255,255,255,0.08));
            height: 64px;
            padding: 0 4px;
            padding-bottom: env(safe-area-inset-bottom);
            align-items: center;
            justify-content: space-around;
          }
          body { padding-bottom: 80px !important; }
        }
      `}</style>

      <nav className="mobile-bottom-bar">
        <Link href="/" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', flex:1, textDecoration:'none', padding:'8px 0' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive('/') ? BLUE : 'none'} stroke={isActive('/') ? BLUE : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span style={{ fontSize:'10px', color: isActive('/') ? BLUE : GRAY, fontWeight: isActive('/') ? 600 : 400 }}>Главная</span>
        </Link>

        <Link href="/search" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', flex:1, textDecoration:'none', padding:'8px 0' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isActive('/search') ? BLUE : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span style={{ fontSize:'10px', color: isActive('/search') ? BLUE : GRAY, fontWeight: isActive('/search') ? 600 : 400 }}>Поиск</span>
        </Link>

        <a href="/listing/new" onClick={handleAddClick} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'52px', height:'52px', borderRadius:'50%', background:'linear-gradient(135deg, #0057E7, #0EA5E9)', marginTop:'-16px', boxShadow:'0 8px 24px rgba(0,87,231,0.45)', flexShrink:0, textDecoration:'none' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </a>

        <Link href="/messages" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', flex:1, textDecoration:'none', padding:'8px 0' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive('/messages') ? BLUE : 'none'} stroke={isActive('/messages') ? BLUE : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span style={{ fontSize:'10px', color: isActive('/messages') ? BLUE : GRAY, fontWeight: isActive('/messages') ? 600 : 400 }}>Чат</span>
        </Link>

        <Link href="/profile" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', flex:1, textDecoration:'none', padding:'8px 0' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive('/profile') ? BLUE : 'none'} stroke={isActive('/profile') ? BLUE : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span style={{ fontSize:'10px', color: isActive('/profile') ? BLUE : GRAY, fontWeight: isActive('/profile') ? 600 : 400 }}>Профиль</span>
        </Link>
      </nav>
    </>
  );
}
