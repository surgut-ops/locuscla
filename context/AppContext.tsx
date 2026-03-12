'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ─── TYPES ───────────────────────────────────────────────
export interface User {
  id: string; name: string; email: string; phone?: string;
  avatar?: string; role: 'user' | 'admin'; favorites: number[];
  createdAt: string;
}

interface AppCtx {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: User | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const Ctx = createContext<AppCtx>({} as AppCtx);
export const useApp = () => useContext(Ctx);

// Demo users DB (localStorage in real app would use JWT/backend)
const DEMO_USERS: User[] = [
  { id: 'admin1', name: 'Администратор', email: 'admin@locus.ru', role: 'admin', favorites: [], createdAt: '2024-01-01' },
  { id: 'user1', name: 'Иван Петров', email: 'user@locus.ru', role: 'user', favorites: [1, 3], createdAt: '2024-06-15' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load from storage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('locus_theme') as 'light' | 'dark';
      const savedUser = localStorage.getItem('locus_user');
      if (savedTheme) setTheme(savedTheme);
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {}
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem('locus_theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 900));
    const found = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { ok: false, error: 'Пользователь не найден' };
    if (password.length < 6) return { ok: false, error: 'Неверный пароль' };
    setUser(found);
    try { localStorage.setItem('locus_user', JSON.stringify(found)); } catch {}
    return { ok: true };
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    await new Promise(r => setTimeout(r, 1100));
    const exists = DEMO_USERS.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return { ok: false, error: 'Email уже зарегистрирован' };
    const newUser: User = {
      id: 'u_' + Date.now(), name: data.name, email: data.email,
      phone: data.phone, role: 'user', favorites: [], createdAt: new Date().toISOString().split('T')[0],
    };
    DEMO_USERS.push(newUser);
    setUser(newUser);
    try { localStorage.setItem('locus_user', JSON.stringify(newUser)); } catch {}
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem('locus_user'); } catch {}
  };

  const toggleFavorite = (id: number) => {
    if (!user) return;
    const updated = { ...user, favorites: user.favorites.includes(id) ? user.favorites.filter(f => f !== id) : [...user.favorites, id] };
    setUser(updated);
    try { localStorage.setItem('locus_user', JSON.stringify(updated)); } catch {}
  };

  const isFavorite = (id: number) => !!user?.favorites.includes(id);

  return <Ctx.Provider value={{ theme, toggleTheme, user, login, register, logout, toggleFavorite, isFavorite, showAuthModal, setShowAuthModal }}>{children}</Ctx.Provider>;
}
