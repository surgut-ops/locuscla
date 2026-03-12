'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function AuthModal({ mode: initMode, onClose }: { mode: 'login'|'register'; onClose: ()=>void }) {
  const { login, register } = useApp();
  const [mode, setMode] = useState(initMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [globalError, setGlobalError] = useState('');

  const validate = () => {
    const e: Record<string,string> = {};
    if (mode === 'register' && !name.trim()) e.name = 'Введите имя';
    if (!email || !/\S+@\S+\.\S+/.test(email)) e.email = 'Введите корректный email';
    if (!password || password.length < 6) e.password = 'Минимум 6 символов';
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setGlobalError(''); setLoading(true);
    const result = mode === 'login'
      ? await login(email, password)
      : await register({ name, email, password, phone });
    setLoading(false);
    if (!result.ok) { setGlobalError(result.error || 'Ошибка'); return; }
    setSuccess(true);
    setTimeout(onClose, 1500);
  };

  const inp = (field: string): React.CSSProperties => ({
    width:'100%', padding:'13px 16px', border:`1.5px solid ${errors[field]?'var(--red)':'var(--border)'}`,
    borderRadius:12, fontSize:15, outline:'none', background:'var(--surface2)', color:'var(--text)',
    fontFamily:'inherit', transition:'border-color 0.2s', boxSizing:'border-box',
  });

  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,zIndex:1000,background:'rgba(5,10,30,0.75)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',animation:'fadeIn 0.2s ease' }}>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}} @keyframes bounce{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}`}</style>
      <div onClick={e=>e.stopPropagation()} style={{ background:'var(--surface)',borderRadius:28,padding:'36px',width:'100%',maxWidth:430,position:'relative',boxShadow:'0 32px 80px rgba(0,0,0,0.35)',animation:'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>

        {/* Close */}
        <button onClick={onClose} style={{ position:'absolute',top:16,right:16,background:'var(--surface2)',border:'none',borderRadius:'50%',width:32,height:32,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text2)' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Logo */}
        <div style={{ width:50,height:50,borderRadius:15,background:'linear-gradient(135deg,#0057E7,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18,boxShadow:'0 8px 24px rgba(0,87,231,0.35)' }}>
          <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>

        <h2 style={{ fontSize:24,fontWeight:800,color:'var(--text)',marginBottom:5 }}>{mode==='login'?'Добро пожаловать!':'Создать аккаунт'}</h2>
        <p style={{ color:'var(--text2)',fontSize:14,marginBottom:24 }}>{mode==='login'?'Войдите в аккаунт Locus':'Присоединяйтесь к 2 млн+ пользователей'}</p>

        {/* Demo hint */}
        {mode==='login' && (
          <div style={{ background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10,padding:'10px 14px',marginBottom:20,fontSize:12,color:'var(--text2)' }}>
            💡 Для теста: <strong>user@locus.ru</strong> / любой пароль 6+ символов<br/>
            Или: <strong>admin@locus.ru</strong> для доступа к панели администратора
          </div>
        )}

        {success ? (
          <div style={{ textAlign:'center',padding:'28px 0' }}>
            <div style={{ width:72,height:72,borderRadius:'50%',background:'#EDFBF4',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',animation:'bounce 0.5s ease' }}>
              <svg width="36" height="36" fill="none" stroke="#00C896" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p style={{ fontSize:18,color:'#00C896',fontWeight:800 }}>{mode==='login'?'Вход выполнен!':'Аккаунт создан!'}</p>
            <p style={{ fontSize:13,color:'var(--text2)',marginTop:6 }}>Перенаправляем...</p>
          </div>
        ) : (
          <>
            {/* Social */}
            <div style={{ display:'flex',gap:8,marginBottom:18 }}>
              {[{l:'Google',bg:'var(--surface2)',c:'var(--text)'},{l:'ВКонтакте',bg:'#0077FF',c:'#fff'},{l:'Яндекс',bg:'#FC3F1D',c:'#fff'}].map(s => (
                <button key={s.l} onClick={() => { setGlobalError('Социальный вход: скоро будет доступен'); }} style={{ flex:1,padding:'10px 6px',border:`1px solid var(--border)`,borderRadius:11,background:s.bg,color:s.c,cursor:'pointer',fontWeight:700,fontSize:12,fontFamily:'inherit' }}>{s.l}</button>
              ))}
            </div>

            <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:18 }}>
              <div style={{ flex:1,height:1,background:'var(--border)' }} />
              <span style={{ fontSize:12,color:'var(--text3)' }}>или email</span>
              <div style={{ flex:1,height:1,background:'var(--border)' }} />
            </div>

            {globalError && (
              <div style={{ background:'#FFF0F1',border:'1px solid #FFD0D4',borderRadius:10,padding:'10px 14px',marginBottom:14,fontSize:13,color:'var(--red)',fontWeight:600 }}>
                {globalError}
              </div>
            )}

            <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
              {mode==='register' && (
                <div>
                  <input placeholder="Ваше имя" value={name} onChange={e=>setName(e.target.value)} style={inp('name')} onFocus={e=>(e.target as HTMLInputElement).style.borderColor='var(--blue-mid)'} onBlur={e=>(e.target as HTMLInputElement).style.borderColor=errors.name?'var(--red)':'var(--border)'} />
                  {errors.name && <p style={{ fontSize:12,color:'var(--red)',marginTop:4 }}>{errors.name}</p>}
                </div>
              )}
              <div>
                <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inp('email')} onFocus={e=>(e.target as HTMLInputElement).style.borderColor='var(--blue-mid)'} onBlur={e=>(e.target as HTMLInputElement).style.borderColor=errors.email?'var(--red)':'var(--border)'} />
                {errors.email && <p style={{ fontSize:12,color:'var(--red)',marginTop:4 }}>{errors.email}</p>}
              </div>
              {mode==='register' && (
                <input placeholder="Телефон (необязательно)" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} style={inp('phone')} />
              )}
              <div>
                <div style={{ position:'relative' }}>
                  <input placeholder="Пароль" type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} style={{ ...inp('password'), paddingRight:44 }}
                    onFocus={e=>(e.target as HTMLInputElement).style.borderColor='var(--blue-mid)'}
                    onBlur={e=>(e.target as HTMLInputElement).style.borderColor=errors.password?'var(--red)':'var(--border)'}
                    onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
                  />
                  <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text3)',display:'flex',alignItems:'center' }}>
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{showPass?<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>:<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}</svg>
                  </button>
                </div>
                {errors.password && <p style={{ fontSize:12,color:'var(--red)',marginTop:4 }}>{errors.password}</p>}
              </div>

              <button onClick={handleSubmit} disabled={loading} style={{ width:'100%',padding:'14px',background:'linear-gradient(135deg,#0057E7,#0EA5E9)',color:'#fff',border:'none',borderRadius:13,fontSize:15,fontWeight:800,cursor:'pointer',boxShadow:'0 8px 24px rgba(0,87,231,0.35)',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:loading?0.85:1,fontFamily:'inherit' }}>
                {loading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation:'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></svg>}
                {loading ? 'Подождите...' : mode==='login' ? 'Войти' : 'Создать аккаунт'}
              </button>
            </div>

            <p style={{ textAlign:'center',marginTop:18,fontSize:14,color:'var(--text2)' }}>
              {mode==='login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
              <button onClick={()=>{setMode(mode==='login'?'register':'login');setErrors({});setGlobalError('');}} style={{ background:'none',border:'none',color:'var(--blue-mid)',fontWeight:800,cursor:'pointer',fontSize:14,fontFamily:'inherit' }}>
                {mode==='login' ? 'Создать' : 'Войти'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
