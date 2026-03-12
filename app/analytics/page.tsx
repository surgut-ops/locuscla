'use client';

import Navbar from '@/components/Navbar';
import { useApp } from '@/context/AppContext';

const CITY_DATA = [
  { city: 'Москва', avg: 75000, change: '+12%', demand: 'Очень высокий' },
  { city: 'Санкт-Петербург', avg: 52000, change: '+9%', demand: 'Высокий' },
  { city: 'Сочи', avg: 68000, change: '+18%', demand: 'Высокий' },
  { city: 'Казань', avg: 35000, change: '+7%', demand: 'Средний' },
  { city: 'Екатеринбург', avg: 38000, change: '+6%', demand: 'Средний' },
  { city: 'Краснодар', avg: 40000, change: '+15%', demand: 'Высокий' },
  { city: 'Нижний Новгород', avg: 32000, change: '+5%', demand: 'Средний' },
  { city: 'Новосибирск', avg: 30000, change: '+4%', demand: 'Средний' },
  { city: 'Тюмень', avg: 33000, change: '+8%', demand: 'Средний' },
  { city: 'Уфа', avg: 28000, change: '+3%', demand: 'Низкий' },
];

const STATS = [
  { label: 'Средняя цена\nв Москве', value: '75 000 ₽/мес', icon: '🏙️', sub: '+12% за год', color: '#0057E7' },
  { label: 'Рост цен\nза год', value: '+11%', icon: '📈', sub: 'по всей России', color: '#10b981' },
  { label: 'Топ-район\nМосквы', value: 'Арбат', icon: '📍', sub: 'самый популярный', color: '#f59e0b' },
  { label: 'Спрос vs\nпредложение', value: '2.4x', icon: '⚖️', sub: 'спрос выше нормы', color: '#8b5cf6' },
];

export default function AnalyticsPage() {
  const { setShowAuthModal } = useApp();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '80px' }}>
      <Navbar onLogin={()=>setShowAuthModal(true)} onRegister={()=>setShowAuthModal(true)} />
      {/* Hero */}
      <div style={{ paddingTop: 66, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '60px 20px', textAlign: 'center' }}>
        <span style={{ background: 'rgba(0,87,231,0.2)', color: '#60a5fa', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '16px', display: 'inline-block' }}>
          📊 АНАЛИТИКА РЫНКА
        </span>
        <h1 style={{ margin: '12px 0', fontSize: '36px', fontWeight: 800, color: '#fff' }}>Рынок аренды в России</h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '17px' }}>
          Актуальные данные и тренды — обновлено сегодня
        </p>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: stat.color, opacity: 0.08, borderRadius: '0 16px 0 60px' }} />
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text2)', whiteSpace: 'pre-line', lineHeight: 1.4, marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--card-bg)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
          <div style={{ padding: '24px 24px 16px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>
              Топ-10 городов по средней цене аренды
            </h2>
            <p style={{ margin: 0, color: 'var(--text2)', fontSize: '14px' }}>Цена 1-комнатной квартиры, в месяц</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>#</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Город</th>
                  <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ср. цена</th>
                  <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Рост за год</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Спрос</th>
                </tr>
              </thead>
              <tbody>
                {CITY_DATA.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px', color: 'var(--text2)', fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text)' }}>{row.city}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700, color: 'var(--text)', fontSize: '16px' }}>
                      {row.avg.toLocaleString('ru')} ₽
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>{row.change}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                        background: row.demand === 'Очень высокий' ? 'rgba(239,68,68,0.1)' : row.demand === 'Высокий' ? 'rgba(245,158,11,0.1)' : row.demand === 'Средний' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                        color: row.demand === 'Очень высокий' ? '#ef4444' : row.demand === 'Высокий' ? '#f59e0b' : row.demand === 'Средний' ? '#10b981' : '#6b7280',
                      }}>{row.demand}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', gridColumn: 'span 2' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>📊 Аналитический обзор</h3>
            <div style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '15px' }}>
              <p>Рынок аренды жилья в России демонстрирует устойчивый рост — средние цены увеличились на 11% по сравнению с прошлым годом. Наиболее заметный рост наблюдается в курортных городах: Сочи показывает +18%, что связано с увеличением внутреннего туризма и спроса на жильё для длительного проживания.</p>
              <p>Москва остаётся самым дорогим рынком с медианной ценой 75 000 ₽/мес, однако дефицит предложения сохраняется — на одну квартиру приходится в среднем 2,4 потенциальных арендатора. Наиболее доступными остаются города Поволжья и Сибири.</p>
              <p>По прогнозам аналитиков Locus, в 2025 году рост цен замедлится до 7-8% на фоне увеличения нового строительства и снижения ключевой ставки. Наиболее перспективными для инвестиций остаются Краснодар и Казань.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
