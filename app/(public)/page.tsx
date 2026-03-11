import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-brand-700 to-brand-500 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Найдите идеальное жильё с AI</h1>
          <p className="text-xl text-blue-100 mb-10">
            Умный поиск, AI-аналитика и мгновенное бронирование
          </p>
          <Link href="/search" className="inline-block bg-white text-brand-700 font-semibold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors">
            Начать поиск
          </Link>
        </div>
      </section>
    </main>
  );
}
