'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useApp } from '@/context/AppContext';

const FAQ_ITEMS = [
  {
    q: 'Как снять квартиру через Locus?',
    a: 'Используйте поиск на главной странице — введите город и параметры жилья. Все объявления проверены AI, поэтому вы можете быть уверены в достоверности информации. После выбора квартиры нажмите "Записаться на просмотр" или "Написать хозяину".'
  },
  {
    q: 'Что такое AI-верификация?',
    a: 'AI-верификация — это автоматический анализ объявления нашим искусственным интеллектом. AI проверяет подлинность фотографий, соответствие цены рыночному уровню, достоверность описания и надёжность хозяина. Все проверенные объявления имеют отметку "AI-верификация пройдена".'
  },
  {
    q: 'Как работает система оплаты?',
    a: 'На Locus вы договариваетесь с хозяином напрямую. Мы рекомендуем использовать безопасную сделку: средства зачисляются на эскроу-счёт и передаются хозяину только после вашего заселения. Это защищает обе стороны от мошенничества.'
  },
  {
    q: 'Как разместить объявление?',
    a: 'Нажмите "+ Разместить" в верхнем меню или на главной странице. Пройдите 5 шагов: тип жилья, характеристики, цена, фото и описание, публикация. Первое объявление — бесплатно. Для размещения дополнительных объявлений потребуется подписка Locus Pro.'
  },
  {
    q: 'Что такое Locus Pro?',
    a: 'Locus Pro — платная подписка за 499 ₽/мес, которая даёт: неограниченное количество объявлений, приоритетный показ в поиске, AI-анализ договоров аренды, расширенную статистику по вашим объявлениям и доступ к аналитике рынка.'
  },
  {
    q: 'Как вернуть залог?',
    a: 'Залог возвращается в течение 3 дней после освобождения квартиры при условии отсутствия повреждений. Если хозяин не возвращает залог без оснований, обратитесь в нашу службу поддержки — мы поможем урегулировать спор.'
  },
  {
    q: 'Как связаться с поддержкой?',
    a: 'Напишите нам на support@locus.ru или воспользуйтесь чатом на сайте. Время ответа — до 2 часов в рабочее время (пн-пт 9:00–20:00 МСК). Для срочных вопросов доступен телефон: 8-800-100-20-30 (бесплатно по России).'
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { setShowAuthModal } = useApp();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '80px' }}>
      <Navbar onLogin={()=>setShowAuthModal(true)} onRegister={()=>setShowAuthModal(true)} />
      {/* Hero */}
      <div style={{ paddingTop: 66, background: 'linear-gradient(135deg, #0057E7 0%, #0EA5E9 100%)', padding: '60px 0 80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❓</div>
          <h1 style={{ margin: '0 0 12px', fontSize: '36px', fontWeight: 800, color: '#fff' }}>Часто задаваемые вопросы</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '18px' }}>
            Ответы на самые популярные вопросы о сервисе Locus
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '-30px auto 0', padding: '0 24px' }}>
        <div style={{ background: 'var(--card-bg)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--border)' }}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i}>
              {i > 0 && <div style={{ height: '1px', background: 'var(--border)', margin: '0 20px' }} />}
              <div
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{ padding: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}
              >
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>{item.q}</h3>
                <span style={{
                  fontSize: '20px',
                  color: openIdx === i ? '#0057E7' : 'var(--text2)',
                  transform: openIdx === i ? 'rotate(45deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                  flexShrink: 0,
                  fontWeight: 300,
                }}>+</span>
              </div>
              {openIdx === i && (
                <div style={{ padding: '0 20px 20px' }}>
                  <p style={{ margin: 0, color: 'var(--text2)', lineHeight: 1.7, fontSize: '15px' }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', padding: '32px', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 8px', color: 'var(--text)' }}>Не нашли ответ?</h3>
          <p style={{ margin: '0 0 16px', color: 'var(--text2)' }}>Напишите нам — мы всегда готовы помочь</p>
          <a href="mailto:support@locus.ru" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #0057E7, #0EA5E9)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>
            Написать в поддержку
          </a>
        </div>
      </div>
    </div>
  );
}
