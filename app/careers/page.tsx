'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useApp } from '@/context/AppContext';

const VACANCIES = [
  {
    title: 'Frontend Developer',
    type: 'Remote',
    level: 'Middle / Senior',
    team: 'Продукт',
    description: 'Разрабатываем Next.js приложение с нуля. Работаем с TypeScript, React, современными паттернами. Ищем человека, который умеет создавать красивые и быстрые интерфейсы.',
    stack: ['Next.js', 'TypeScript', 'React', 'CSS-in-JS'],
    email: 'frontend@locus.ru',
    icon: '💻',
  },
  {
    title: 'Product Manager',
    type: 'Офис / Гибрид',
    level: 'Middle+',
    team: 'Продукт',
    description: 'Отвечаете за развитие ключевых фич платформы. Работаете с данными, пользователями и командой разработки. Опыт в proptech или fintech — большой плюс.',
    stack: ['Amplitude', 'Figma', 'SQL basics', 'JIRA'],
    email: 'pm@locus.ru',
    icon: '🎯',
  },
  {
    title: 'Data Analyst',
    type: 'Remote',
    level: 'Junior / Middle',
    team: 'Аналитика',
    description: 'Строим аналитическую инфраструктуру с нуля. Анализируем данные рынка аренды, поведение пользователей, эффективность AI-алгоритмов. Работаем в Clickhouse + Python.',
    stack: ['Python', 'SQL', 'ClickHouse', 'Tableau'],
    email: 'data@locus.ru',
    icon: '📊',
  },
  {
    title: 'Customer Support Lead',
    type: 'Офис, Москва',
    level: 'Middle',
    team: 'Поддержка',
    description: 'Строите лучшую службу поддержки в proptech. Отвечаете за SLA, обучаете команду, разрабатываете скрипты и процессы. Умеете работать в условиях неопределённости.',
    stack: ['Zendesk', 'Notion', 'Slack', 'Excel'],
    email: 'support-lead@locus.ru',
    icon: '🎧',
  },
];

const VALUES = [
  { icon: '🚀', title: 'Скорость', desc: 'Быстро принимаем решения. Нет бюрократии — только результат.' },
  { icon: '🧠', title: 'Честность', desc: 'Открыто говорим о проблемах и успехах. Прямая коммуникация.' },
  { icon: '🌱', title: 'Рост', desc: 'Каждый сотрудник получает бюджет на обучение и конференции.' },
  { icon: '❤️', title: 'Команда', desc: 'Небольшая, но сильная команда. Каждый вклад важен.' },
];

export default function CareersPage() {
  const [openVacancy, setOpenVacancy] = useState<number | null>(null);
  const { setShowAuthModal } = useApp();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '80px' }}>
      <Navbar onLogin={()=>setShowAuthModal(true)} onRegister={()=>setShowAuthModal(true)} />
      {/* Hero */}
      <div style={{ paddingTop: 66, background: 'linear-gradient(135deg, #0057E7 0%, #7c3aed 100%)', padding: '80px 20px', textAlign: 'center' }}>
        <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', display: 'inline-block' }}>
          🏢 КОМАНДА LOCUS
        </span>
        <h1 style={{ margin: '16px 0', fontSize: '42px', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
          Строим будущее<br />рынка аренды вместе
        </h1>
        <p style={{ margin: '0 auto 32px', color: 'rgba(255,255,255,0.8)', fontSize: '18px', maxWidth: '560px' }}>
          Мы — небольшая команда с большой миссией: сделать аренду жилья честной, безопасной и удобной для всех
        </p>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['30+', 'Человек в команде'], ['4', 'Открытые вакансии'], ['Remote', 'Дружелюбная среда']].map(([val, label], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>{val}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, color: 'var(--text)', marginBottom: '32px' }}>Наши ценности</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '60px' }}>
          {VALUES.map((v, i) => (
            <div key={i} style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', textAlign: 'center', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{v.icon}</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>{v.title}</h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text2)', lineHeight: 1.5 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Открытые вакансии</h2>
        <p style={{ color: 'var(--text2)', marginBottom: '28px' }}>Не нашли подходящую? Пишите на jobs@locus.ru — рассмотрим любые кандидатуры</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {VACANCIES.map((v, i) => (
            <div key={i} style={{ background: 'var(--card-bg)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '24px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '16px' }} onClick={() => setOpenVacancy(openVacancy === i ? null : i)}>
                <div style={{ fontSize: '36px', flexShrink: 0 }}>{v.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>{v.title}</h3>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(0,87,231,0.08)', color: '#0057E7', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{v.type}</span>
                        <span style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{v.level}</span>
                        <span style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{v.team}</span>
                      </div>
                    </div>
                    <span style={{ color: 'var(--text2)', fontSize: '20px', fontWeight: 300, transform: openVacancy === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>+</span>
                  </div>
                </div>
              </div>

              {openVacancy === i && (
                <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ paddingTop: '20px' }}>
                    <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: '16px' }}>{v.description}</p>
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Стек</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {v.stack.map((tech, j) => (
                          <span key={j} style={{ background: 'var(--bg)', color: 'var(--text)', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, border: '1px solid var(--border)' }}>{tech}</span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={`mailto:${v.email}?subject=Отклик на вакансию ${encodeURIComponent(v.title)}`}
                      style={{ display: 'inline-block', padding: '13px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #0057E7, #0EA5E9)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}
                    >
                      Откликнуться → {v.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
