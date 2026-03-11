'use client';

import { useState } from 'react';
import { IconX, IconMail, IconEye, IconCheck } from './Icons';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitch: () => void;
}

export default function AuthModal({ mode, onClose, onSwitch }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email || !email.includes('@')) errs.email = 'Введите корректный email';
    if (!password || password.length < 6) errs.password = 'Минимум 6 символов';
    if (mode === 'register' && !name.trim()) errs.name = 'Введите имя';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSuccess(true);
    setTimeout(onClose, 1800);
  };

  const inp = (hasErr: boolean): React.CSSProperties => ({
    width: '100%', padding: '13px 16px', border: `1.5px solid ${hasErr ? '#FF4757' : '#e8eaf0'}`,
    borderRadius: 12, fontSize: 15, outline: 'none', background: '#FAFBFF',
    fontFamily: 'Manrope, sans-serif', color: '#111', transition: 'border-color 0.2s', boxSizing: 'border-box',
  });

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,10,30,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}} @keyframes bounce{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}`}</style>

      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 28, padding: '40px', width: '100%', maxWidth: 440, position: 'relative', boxShadow: '0 32px 80px rgba(0,0,0,0.28)', animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#F4F6FB', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
          <IconX />
        </button>

        {/* Logo */}
        <div style={{ width: 54, height: 54, borderRadius: 16, background: 'linear-gradient(135deg, #0057E7, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 8px 24px rgba(0,87,231,0.35)' }}>
          <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 5px', color: '#111', fontFamily: 'Manrope, sans-serif' }}>
          {mode === 'login' ? 'Добро пожаловать!' : 'Создать аккаунт'}
        </h2>
        <p style={{ margin: '0 0 28px', color: '#888', fontSize: 14 }}>
          {mode === 'login' ? 'Войдите в свой аккаунт Locus' : 'Присоединяйтесь к 2 млн+ пользователей'}
        </p>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#EDFBF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'bounce 0.5s ease' }}>
              <svg width="36" height="36" fill="none" stroke="#00C896" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p style={{ fontSize: 17, color: '#00C896', fontWeight: 800 }}>
              {mode === 'login' ? 'Вход выполнен!' : 'Аккаунт создан!'}
            </p>
          </div>
        ) : (
          <>
            {/* Social login */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Google', bg: '#fff', border: '#ddd', color: '#333' },
                { label: 'ВКонтакте', bg: '#0077FF', border: '#0077FF', color: '#fff' },
                { label: 'Яндекс', bg: '#FC3F1D', border: '#FC3F1D', color: '#fff' },
              ].map(s => (
                <button key={s.label} style={{ flex: 1, padding: '10px 8px', border: `1.5px solid ${s.border}`, borderRadius: 12, background: s.bg, color: s.color, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>
                  {s.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: '#eee' }} />
              <span style={{ fontSize: 13, color: '#ccc' }}>или</span>
              <div style={{ flex: 1, height: 1, background: '#eee' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {mode === 'register' && (
                <div>
                  <input placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)} style={inp(!!errors.name)} />
                  {errors.name && <p style={{ fontSize: 12, color: '#FF4757', marginTop: 4 }}>{errors.name}</p>}
                </div>
              )}
              <div>
                <div style={{ position: 'relative' }}>
                  <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ ...inp(!!errors.email), paddingRight: 44 }} />
                  <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }}><IconMail /></div>
                </div>
                {errors.email && <p style={{ fontSize: 12, color: '#FF4757', marginTop: 4 }}>{errors.email}</p>}
              </div>
              {mode === 'register' && (
                <input placeholder="Телефон" type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={inp(false)} />
              )}
              <div>
                <div style={{ position: 'relative' }}>
                  <input placeholder="Пароль" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} style={{ ...inp(!!errors.password), paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex' }}>
                    <IconEye off={showPass} />
                  </button>
                </div>
                {errors.password && <p style={{ fontSize: 12, color: '#FF4757', marginTop: 4 }}>{errors.password}</p>}
              </div>

              <button onClick={handleSubmit} disabled={loading} style={{
                width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0057E7, #0EA5E9)',
                color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,87,231,0.35)', transition: 'all 0.2s',
                opacity: loading ? 0.8 : 1, fontFamily: 'Manrope, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                {loading ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
                  </svg>
                ) : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
              </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#888' }}>
              {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
              <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#0066FF', fontWeight: 800, cursor: 'pointer', fontSize: 14 }}>
                {mode === 'login' ? 'Создать' : 'Войти'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
