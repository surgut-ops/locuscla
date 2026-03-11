import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  console.info('Seeding database...');

  // Admin user
  const adminHash = await bcrypt.hash('admin123!', 12);
  const admin = await db.user.upsert({
    where: { email: 'admin@locos.app' },
    update: {},
    create: {
      email: 'admin@locos.app',
      passwordHash: adminHash,
      role: 'admin',
      emailVerified: true,
      profile: { create: { firstName: 'Admin', lastName: 'LOCOS', isVerified: true, languages: ['ru', 'en'] } },
    },
  });

  // Host user
  const hostHash = await bcrypt.hash('host123!', 12);
  const host = await db.user.upsert({
    where: { email: 'host@example.com' },
    update: {},
    create: {
      email: 'host@example.com',
      passwordHash: hostHash,
      role: 'host',
      emailVerified: true,
      profile: { create: { firstName: 'Иван', lastName: 'Петров', isVerified: true, languages: ['ru'] } },
    },
  });

  // Sample listings
  const listings = [
    { title: 'Уютная студия в центре Москвы', city: 'Москва', type: 'studio' as const, price: 3500 },
    { title: 'Просторная 2-комнатная квартира у метро', city: 'Москва', type: 'apartment' as const, price: 5000 },
    { title: 'Комната в современном апартаменте', city: 'Санкт-Петербург', type: 'room' as const, price: 2000 },
    { title: 'Апартаменты с видом на Неву', city: 'Санкт-Петербург', type: 'apartment' as const, price: 7500 },
  ];

  for (const data of listings) {
    await db.listing.create({
      data: {
        hostId: host.id,
        title: data.title,
        description: `Отличное жильё для комфортного проживания в ${data.city}. Всё необходимое для жизни.`,
        type: data.type,
        status: 'active',
        pricePerNight: data.price,
        currency: 'RUB',
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        address: `ул. Примерная, ${Math.floor(Math.random() * 100) + 1}`,
        city: data.city,
        country: 'Russia',
        lat: data.city === 'Москва' ? 55.7558 + (Math.random() - 0.5) * 0.1 : 59.9311 + (Math.random() - 0.5) * 0.1,
        lng: data.city === 'Москва' ? 37.6176 + (Math.random() - 0.5) * 0.1 : 30.3609 + (Math.random() - 0.5) * 0.1,
        features: { create: [{ feature: 'wifi' }, { feature: 'kitchen' }] },
      },
    });
  }

  console.info('Seed complete');
}

main().catch(console.error).finally(() => db.$disconnect());
