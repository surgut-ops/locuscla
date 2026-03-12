'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

interface Message {
  from: 'me' | 'them';
  text: string;
  time: string;
}

interface Dialog {
  id: number;
  name: string;
  listing: string;
  lastMsg: string;
  time: string;
  unread: number;
  avatar: string;
  messages: Message[];
}

const MOCK_DIALOGS: Dialog[] = [
  {
    id: 1, name: 'Александр М.', listing: 'Студия на Арбате',
    lastMsg: 'Когда можно посмотреть?', time: '10 мин', unread: 2,
    avatar: 'А',
    messages: [
      { from: 'them', text: 'Здравствуйте, интересует ваша студия', time: '14:20' },
      { from: 'them', text: 'Когда можно посмотреть?', time: '14:21' },
    ]
  },
  {
    id: 2, name: 'Елена В.', listing: 'Апартаменты с видом',
    lastMsg: 'Хорошо, договорились!', time: '1 ч', unread: 0,
    avatar: 'Е',
    messages: [
      { from: 'me', text: 'Добрый день, квартира ещё свободна?', time: '13:00' },
      { from: 'them', text: 'Да, свободна!', time: '13:05' },
      { from: 'them', text: 'Хорошо, договорились!', time: '13:06' },
    ]
  },
  {
    id: 3, name: 'Дмитрий К.', listing: 'Дизайнерская 3-комнатная',
    lastMsg: 'Цена окончательная?', time: '3 ч', unread: 1,
    avatar: 'Д',
    messages: [
      { from: 'them', text: 'Добрый день! Интересует ваша квартира', time: '11:30' },
      { from: 'me', text: 'Здравствуйте! Чем могу помочь?', time: '11:45' },
      { from: 'them', text: 'Цена окончательная?', time: '11:46' },
    ]
  },
];

export default function MessagesPageContent() {
  const { user } = useApp();
  const searchParams = useSearchParams();
  const dialogParam = searchParams.get('dialog');
  const initialDialog = dialogParam ? parseInt(dialogParam, 10) : 0;
  const validInitialId = initialDialog > 0 && MOCK_DIALOGS.some(d => d.id === initialDialog) ? initialDialog : null;

  const [dialogs, setDialogs] = useState(MOCK_DIALOGS);
  const [activeId, setActiveId] = useState<number | null>(validInitialId);
  const [inputText, setInputText] = useState('');
  const [showList, setShowList] = useState(!validInitialId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeDialog = dialogs.find(d => d.id === activeId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeDialog?.messages]);

  const handleSelectDialog = (id: number) => {
    setActiveId(id);
    setShowList(false);
    setDialogs(prev => prev.map(d => d.id === id ? { ...d, unread: 0 } : d));
  };

  const handleSend = () => {
    if (!inputText.trim() || !activeId) return;
    const newMsg: Message = {
      from: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    };
    setDialogs(prev => prev.map(d =>
      d.id === activeId
        ? { ...d, messages: [...d.messages, newMsg], lastMsg: newMsg.text, time: 'сейчас' }
        : d
    ));
    setInputText('');
  };

  if (!user) {
    return (
      <div style={{ paddingTop: 90, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        <div style={{ fontSize: '48px' }}>💬</div>
        <h2 style={{ color: 'var(--text)' }}>Войдите, чтобы просмотреть сообщения</h2>
        <Link href="/" style={{ padding: '12px 24px', borderRadius: 12, background: 'var(--blue-mid)', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
          ← На главную
        </Link>
      </div>
    );
  }

  const avatarColors = ['#0057E7', '#7c3aed', '#059669', '#d97706', '#dc2626'];

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .messages-layout { flex-direction: column !important; }
          .dialog-list { width: 100% !important; display: ${showList ? 'flex' : 'none'} !important; flex-direction: column; }
          .chat-panel { display: ${!showList ? 'flex' : 'none'} !important; width: 100% !important; }
        }
      `}</style>
      <div style={{ paddingTop: 66, height: 'calc(100vh - 66px)', display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
        <div className="messages-layout" style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          <div className="dialog-list" style={{ width: '320px', borderRight: '1px solid var(--border)', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>Сообщения</h2>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {dialogs.map((d, i) => (
                <div
                  key={d.id}
                  onClick={() => handleSelectDialog(d.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', cursor: 'pointer',
                    background: activeId === d.id ? 'rgba(0,87,231,0.06)' : 'transparent',
                    borderLeft: activeId === d.id ? '3px solid #0057E7' : '3px solid transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: avatarColors[i % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
                    {d.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '14px' }}>{d.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text3)' }}>{d.time}</span>
                    </div>
                    <p style={{ margin: '0 0 2px', fontSize: '12px', color: 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.listing}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{d.lastMsg}</span>
                      {d.unread > 0 && (
                        <span style={{ background: '#0057E7', color: '#fff', borderRadius: '10px', padding: '2px 7px', fontSize: '11px', fontWeight: 600, flexShrink: 0, marginLeft: '6px' }}>{d.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chat-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', minWidth: 0 }}>
            {activeDialog ? (
              <>
                <div style={{ padding: '16px 20px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => setShowList(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: '20px', padding: '0 4px', display: 'none' }} className="back-btn">←</button>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0057E7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                    {activeDialog.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{activeDialog.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{activeDialog.listing}</div>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeDialog.messages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%', padding: '10px 14px',
                        borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: msg.from === 'me' ? 'linear-gradient(135deg, #0057E7, #0EA5E9)' : 'var(--card-bg)',
                        color: msg.from === 'me' ? '#fff' : 'var(--text)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      }}>
                        <p style={{ margin: '0 0 4px', fontSize: '15px', lineHeight: 1.4 }}>{msg.text}</p>
                        <span style={{ fontSize: '11px', opacity: 0.7 }}>{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div style={{ padding: '12px 16px', background: 'var(--card-bg)', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Написать сообщение..."
                    style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '15px', outline: 'none' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', background: inputText.trim() ? 'linear-gradient(135deg, #0057E7, #0EA5E9)' : 'var(--border)', border: 'none', cursor: inputText.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '48px' }}>💬</div>
                <p style={{ color: 'var(--text2)', fontSize: '16px' }}>Выберите диалог</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .back-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
