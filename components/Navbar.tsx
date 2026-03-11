'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconHome, IconBrain } from './Icons';

interface NavbarProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function Navbar({ onLogin, onRegister }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkStyle = {
    background: 'none', border: 'none', padding: '8px 12px', borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    color: scrolled ? '#444' : 'rgba(255,255,255,0.9)',
    transition: 'all 0.2s', textDecoration: 'none',
    display: 'inline-block',
  } as React.CSSProperties;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, #0057E7, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,87,231,0.4)' }}>
            <IconHome />
          </div>
          <span style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px', color: scrolled ? '#111' : '#fff', textShadow: scrolled ? 'none' : '0 2px 8px rgba(0,0,0,0.3)' }}>
            Locus
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[
            { href: '/search', label: 'Аренда' },
            { href: '/search?mode=buy', label: 'Продажа' },
            { href: '/search?type=Новостройки', label: 'Новостройки' },
            { href: '/search?view=map', label: 'Карта' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={navLinkStyle}
              onMouseEnter={e => (e.target as HTMLElement).style.color = scrolled ? '#0066FF' : '#fff'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = scrolled ? '#444' : 'rgba(255,255,255,0.9)'}
            >{item.label}</Link>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 10, color: scrolled ? '#0066FF' : 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 13, cursor: 'pointer', background: scrolled ? '#EFF4FF' : 'rgba(255,255,255,0.12)' }}>
            <IconBrain /> AI-поиск
          </div>
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onLogin} style={{
            background: 'none', border: `1.5px solid ${scrolled ? '#0066FF' : 'rgba(255,255,255,0.5)'}`,
            color: scrolled ? '#0066FF' : '#fff', padding: '8px 18px', borderRadius: 11, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
          }}>Войти</button>
          <button onClick={onRegister} style={{
            background: 'linear-gradient(135deg, #0057E7, #0EA5E9)', color: '#fff', border: 'none',
            padding: '9px 20px', borderRadius: 11, fontWeight: 800, fontSize: 14, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,87,231,0.4)', whiteSpace: 'nowrap',
          }}>+ Разместить</button>
        </div>
      </div>
    </nav>
  );
}
