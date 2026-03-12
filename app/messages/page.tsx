'use client';

import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import MessagesPageContent from './MessagesPageContent';
import { useApp } from '@/context/AppContext';

function MessagesFallback() {
  return (
    <div style={{ paddingTop: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <p style={{ color: 'var(--text2)' }}>Загрузка сообщений...</p>
    </div>
  );
}

export default function MessagesPage() {
  const { setShowAuthModal } = useApp();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar onLogin={()=>setShowAuthModal(true)} onRegister={()=>setShowAuthModal(true)} />
      <Suspense fallback={<MessagesFallback />}>
        <MessagesPageContent />
      </Suspense>
    </div>
  );
}
