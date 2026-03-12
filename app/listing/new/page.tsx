'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useApp } from '@/context/AppContext';
import { ALL_CITIES, AMENITIES } from '@/lib/data';

const TYPES = ['Студия', 'Квартира', 'Апартаменты', 'Дом', 'Новостройка'] as const;

type WizardData = Partial<{
  type: string;
  city: string;
  address: string;
  title: string;
  rooms: number;
  area: number;
  floor: string;
  year: number;
  price: number;
  deposit: number;
  commission: string;
  minTerm: string;
  util: string;
  amenities: string[];
  description: string;
  images: string[];
}>;

export default function NewListingPage() {
  const { user, setShowAuthModal } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({});

  // Auth check
  useEffect(() => {
    if (user === null && typeof window !== 'undefined') {
      setShowAuthModal(true);
    }
  }, [user, setShowAuthModal]);

  const update = (key: keyof WizardData, val: unknown) => {
    setData((prev) => ({ ...prev, [key]: val }));
  };

  const next = () => {
    if (step < 5) setStep(step + 1);
    else handlePublish();
  };

  const prev = () => setStep(Math.max(1, step - 1));

  const handlePublish = () => {
    // In real app: POST to API
    alert('Объявление отправлено на модерацию!');
    router.push('/profile?tab=listings');
  };

  const toggleAmenity = (a: string) => {
    const current = data.amenities || [];
    update(
      'amenities',
      current.includes(a) ? current.filter((x) => x !== a) : [...current, a]
    );
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar onLogin={() => setShowAuthModal(true)} />
        <div style={{ paddingTop: 100, textAlign: 'center', padding: 40 }}>
          <h2>Войдите, чтобы разместить объявление</h2>
          <p style={{ color: 'var(--text2)', marginTop: 12 }}>
            После входа вы сможете пройти пошаговый мастер размещения.
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    { n: 1, label: 'Тип жилья' },
    { n: 2, label: 'Город и адрес' },
    { n: 3, label: 'Характеристики' },
    { n: 4, label: 'Удобства' },
    { n: 5, label: 'Фото и описание' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar onLogin={()=>setShowAuthModal(true)} onRegister={()=>setShowAuthModal(true)} />
      <div style={{ paddingTop: 90, maxWidth: 640, margin: '0 auto', padding: '0 20px 80px' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {steps.map((s) => (
            <div
              key={s.n}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                background: step >= s.n ? 'var(--blue-mid)' : 'var(--surface2)',
                color: step >= s.n ? '#fff' : 'var(--text2)',
              }}
            >
              {s.n}. {s.label}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: 20,
            padding: 32,
            border: '1px solid var(--border)',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          }}
        >
          {/* Step 1: Type */}
          {step === 1 && (
            <>
              <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700 }}>
                Выберите тип жилья
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => update('type', t)}
                    style={{
                      padding: '14px 24px',
                      borderRadius: 12,
                      border: `2px solid ${data.type === t ? 'var(--blue-mid)' : 'var(--border)'}`,
                      background: data.type === t ? 'rgba(0,87,231,0.08)' : 'transparent',
                      color: data.type === t ? 'var(--blue-mid)' : 'var(--text)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: City & Address */}
          {step === 2 && (
            <>
              <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700 }}>
                Город и адрес
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Город
                  </label>
                  <select
                    value={data.city || ''}
                    onChange={(e) => update('city', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: '1px solid var(--border)',
                      fontSize: 15,
                      background: 'var(--surface)',
                      color: 'var(--text)',
                    }}
                  >
                    <option value="">Выберите город</option>
                    {ALL_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Адрес
                  </label>
                  <input
                    type="text"
                    value={data.address || ''}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder="ул. Примерная, д. 1"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: '1px solid var(--border)',
                      fontSize: 15,
                      background: 'var(--surface)',
                      color: 'var(--text)',
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Characteristics */}
          {step === 3 && (
            <>
              <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700 }}>
                Характеристики
              </h2>
              <div style={{ display: 'grid', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Комнат
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={data.rooms ?? ''}
                      onChange={(e) => update('rooms', +e.target.value || undefined)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        fontSize: 15,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Площадь, м²
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={data.area ?? ''}
                      onChange={(e) => update('area', +e.target.value || undefined)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        fontSize: 15,
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Этаж (например 4/9)
                    </label>
                    <input
                      type="text"
                      value={data.floor || ''}
                      onChange={(e) => update('floor', e.target.value)}
                      placeholder="4/9"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        fontSize: 15,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Год постройки
                    </label>
                    <input
                      type="number"
                      min={1900}
                      max={2030}
                      value={data.year ?? ''}
                      onChange={(e) => update('year', +e.target.value || undefined)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        fontSize: 15,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Цена, ₽/мес
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={data.price ?? ''}
                    onChange={(e) => update('price', +e.target.value || undefined)}
                    placeholder="50000"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: '1px solid var(--border)',
                      fontSize: 15,
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Залог, ₽
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={data.deposit ?? ''}
                      onChange={(e) => update('deposit', +e.target.value || undefined)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        fontSize: 15,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Комиссия
                    </label>
                    <select
                      value={data.commission || '0%'}
                      onChange={(e) => update('commission', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        fontSize: 15,
                        background: 'var(--surface)',
                      }}
                    >
                      <option value="0%">0%</option>
                      <option value="50%">50%</option>
                      <option value="100%">100%</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Минимальный срок
                    </label>
                    <input
                      type="text"
                      value={data.minTerm || ''}
                      onChange={(e) => update('minTerm', e.target.value)}
                      placeholder="от 1 месяца"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        fontSize: 15,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Коммунальные
                    </label>
                    <select
                      value={data.util || 'включены'}
                      onChange={(e) => update('util', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        fontSize: 15,
                        background: 'var(--surface)',
                      }}
                    >
                      <option value="включены">Включены</option>
                      <option value="не включены">Не включены</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 4: Amenities */}
          {step === 4 && (
            <>
              <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700 }}>
                Удобства
              </h2>
              <p style={{ color: 'var(--text2)', marginBottom: 20, fontSize: 14 }}>
                Отметьте всё, что есть в квартире
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {AMENITIES.map((a) => {
                  const selected = (data.amenities || []).includes(a);
                  return (
                    <button
                      key={a}
                      onClick={() => toggleAmenity(a)}
                      style={{
                        padding: '12px 18px',
                        borderRadius: 12,
                        border: `2px solid ${selected ? 'var(--blue-mid)' : 'var(--border)'}`,
                        background: selected ? 'rgba(0,87,231,0.08)' : 'transparent',
                        color: selected ? 'var(--blue-mid)' : 'var(--text)',
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Step 5: Photos & description */}
          {step === 5 && (
            <>
              <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700 }}>
                Фото и описание
              </h2>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  Заголовок
                </label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="Уютная студия в центре"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    fontSize: 15,
                    background: 'var(--surface)',
                    color: 'var(--text)',
                  }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  Описание
                </label>
                <textarea
                  value={data.description || ''}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Опишите квартиру: расположение, ремонт, что входит..."
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    fontSize: 15,
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  URL фотографий (через запятую)
                </label>
                <input
                  type="text"
                  value={(data.images || []).join(', ')}
                  onChange={(e) =>
                    update(
                      'images',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="https://... https://..."
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    fontSize: 15,
                    background: 'var(--surface)',
                    color: 'var(--text)',
                  }}
                />
                <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 8 }}>
                  В продакшене здесь будет загрузка файлов
                </p>
              </div>
            </>
          )}

          {/* Navigation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 32,
              paddingTop: 24,
              borderTop: '1px solid var(--border)',
            }}
          >
            <button
              onClick={prev}
              disabled={step === 1}
              style={{
                padding: '12px 24px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: step === 1 ? 'transparent' : 'var(--surface2)',
                color: step === 1 ? 'var(--text3)' : 'var(--text)',
                fontWeight: 600,
                cursor: step === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Назад
            </button>
            <button
              onClick={next}
              style={{
                padding: '12px 32px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #0057E7, #0EA5E9)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {step === 5 ? 'Опубликовать' : 'Далее'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
