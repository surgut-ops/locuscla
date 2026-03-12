'use client';

import MobileBottomBar from '@/components/MobileBottomBar';
import AuthModal from '@/components/AuthModal';
import { useApp } from '@/context/AppContext';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const { showAuthModal, setShowAuthModal } = useApp();

  return (
    <>
      {children}
      <MobileBottomBar onOpenAuth={() => setShowAuthModal(true)} />
      {showAuthModal && (
        <AuthModal mode="login" onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}
