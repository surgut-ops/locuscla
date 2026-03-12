export const CITIES = [
  'Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург',
  'Новосибирск', 'Краснодар', 'Сочи', 'Нижний Новгород',
  'Самара', 'Уфа', 'Ростов-на-Дону', 'Пермь', 'Воронеж', 'Волгоград',
];

export const METRO_STATIONS: Record<string, string[]> = {
  'Москва': ['Арбатская', 'Невский пр.', '1905 года', 'Выхино', 'Китай-город', 'Таганская', 'Сокол', 'Бульвар Дмитрия Донского', 'Саларьево', 'Тропарёво'],
  'Санкт-Петербург': ['Невский пр.', 'Гостиный двор', 'Василеостровская', 'Площадь Восстания', 'Чернышевская'],
  'Казань': ['Кремлёвская', 'Козья Слобода', 'Яшьлек', 'Аметьево', 'Горки'],
};

export interface Listing {
  id: number; title: string; location: string; city: string; address: string;
  price: number; rooms: number; area: number; floor: string; year: number;
  verified: boolean; badge?: string; rating: number; reviews: number;
  metro?: string; metroMin?: number; type: string;
  images: string[]; description: string;
  amenities: string[]; deposit: number; commission: string;
  minTerm: string; util: string;
  owner: { name: string; photo: string; rating: number; reviews: number; years: number };
  aiScore: { match: number; price: number; description: number; owner: number };
  lat?: number; lng?: number;
}

export const LISTINGS: Listing[] = [
  {
    id: 1, title: 'Студия в центре Арбата', location: 'Москва, Арбат', city: 'Москва',
    address: 'ул. Арбат, д. 14', price: 55000, rooms: 1, area: 32, floor: '4/9', year: 2015,
    verified: true, badge: 'Топ', rating: 4.9, reviews: 47, metro: 'Арбатская', metroMin: 3, type: 'Студия',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=85','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85','https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=85','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85'],
    description: 'Уютная студия в самом сердце Москвы, на знаменитой улице Арбат. Квартира полностью укомплектована всем необходимым: свежий ремонт, качественная мебель, современная техника. В шаговой доступности рестораны, магазины и культурные объекты.',
    amenities: ['Wi-Fi', 'Стиральная машина', 'Холодильник', 'Кондиционер', 'Телевизор', 'Мебель', 'Посудомойка', 'Можно с животными'],
    owner: { name: 'Александр М.', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', rating: 4.9, reviews: 124, years: 3 },
    deposit: 55000, commission: '0%', minTerm: 'от 1 месяца', util: 'включены',
    aiScore: { match: 96, price: 82, description: 94, owner: 97 }, lat: 55.752, lng: 37.593,
  },
  {
    id: 2, title: 'Апартаменты с панорамным видом', location: 'СПб, Невский пр.', city: 'Санкт-Петербург',
    address: 'Невский пр., д. 80', price: 85000, rooms: 2, area: 65, floor: '12/16', year: 2019,
    verified: true, badge: 'Новое', rating: 5.0, reviews: 23, metro: 'Невский пр.', metroMin: 2, type: 'Апартаменты',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=85','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85'],
    description: 'Роскошные апартаменты с панорамным видом на Невский проспект. Дизайнерский интерьер, высокие потолки, большие окна. Два балкона с захватывающим видом на центр Санкт-Петербурга.',
    amenities: ['Wi-Fi', 'Стиральная машина', 'Холодильник', 'Кондиционер', 'Телевизор', 'Мебель', 'Балкон', 'Паркинг'],
    owner: { name: 'Елена В.', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', rating: 5.0, reviews: 67, years: 5 },
    deposit: 85000, commission: '0%', minTerm: 'от 3 месяцев', util: 'включены',
    aiScore: { match: 98, price: 88, description: 97, owner: 99 }, lat: 59.931, lng: 30.346,
  },
  {
    id: 3, title: 'Дизайнерская 3-комнатная', location: 'Москва, Пресня', city: 'Москва',
    address: 'ул. Красная Пресня, д. 12', price: 120000, rooms: 3, area: 95, floor: '3/5', year: 2018,
    verified: true, badge: 'Премиум', rating: 4.8, reviews: 89, metro: '1905 года', metroMin: 7, type: 'Квартира',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85','https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=85'],
    description: 'Просторная трёхкомнатная квартира с авторским дизайном. Высокие потолки 3.2м, паркет из массива дуба, встроенная кухня с техникой Miele. Тихий зелёный двор, консьерж.',
    amenities: ['Wi-Fi', 'Посудомойка', 'Стиральная машина', 'Холодильник', 'Кондиционер', 'Телевизор', 'Мебель', 'Балкон', 'Паркинг', 'Консьерж'],
    owner: { name: 'Дмитрий К.', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', rating: 4.8, reviews: 43, years: 7 },
    deposit: 120000, commission: '50%', minTerm: 'от 6 месяцев', util: 'не включены',
    aiScore: { match: 94, price: 76, description: 92, owner: 95 }, lat: 55.759, lng: 37.574,
  },
  {
    id: 4, title: 'Уютная 2-комнатная квартира', location: 'Казань, Центр', city: 'Казань',
    address: 'ул. Баумана, д. 25', price: 45000, rooms: 2, area: 55, floor: '2/9', year: 2010,
    verified: true, rating: 4.7, reviews: 31, metro: 'Кремлёвская', metroMin: 5, type: 'Квартира',
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=85','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85'],
    description: 'Уютная двухкомнатная квартира в историческом центре Казани. Рядом пешеходная улица Баумана, Казанский Кремль. Хороший ремонт, вся необходимая мебель.',
    amenities: ['Wi-Fi', 'Стиральная машина', 'Холодильник', 'Телевизор', 'Мебель'],
    owner: { name: 'Алина Р.', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', rating: 4.7, reviews: 28, years: 2 },
    deposit: 45000, commission: '0%', minTerm: 'от 1 месяца', util: 'включены',
    aiScore: { match: 91, price: 90, description: 88, owner: 93 }, lat: 55.796, lng: 49.109,
  },
  {
    id: 5, title: 'Светлая студия у метро', location: 'Москва, Выхино', city: 'Москва',
    address: 'ул. Ташкентская, д. 8', price: 38000, rooms: 1, area: 28, floor: '7/14', year: 2005,
    verified: false, rating: 4.5, reviews: 12, metro: 'Выхино', metroMin: 1, type: 'Студия',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85'],
    description: 'Компактная светлая студия в 1 минуте от метро Выхино. Всё необходимое для комфортного проживания. Хороший транспортный узел.',
    amenities: ['Wi-Fi', 'Холодильник', 'Телевизор', 'Стиральная машина'],
    owner: { name: 'Сергей Н.', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', rating: 4.5, reviews: 8, years: 1 },
    deposit: 38000, commission: '100%', minTerm: 'от 1 месяца', util: 'не включены',
    aiScore: { match: 85, price: 95, description: 80, owner: 82 }, lat: 55.717, lng: 37.821,
  },
  {
    id: 6, title: 'Загородный дом с баней', location: 'Подмосковье, Истра', city: 'Москва',
    address: 'д. Новые Петровцы, ул. Лесная, д. 3', price: 95000, rooms: 4, area: 180, floor: '2 этажа', year: 2016,
    verified: true, badge: 'Эксклюзив', rating: 4.9, reviews: 15, type: 'Дом',
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=85','https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=85'],
    description: 'Просторный загородный дом 180м² с баней, беседкой и большим участком 15 соток. 4 спальни, 2 санузла. До МКАД 25км по Новорижскому шоссе.',
    amenities: ['Wi-Fi', 'Баня', 'Беседка', 'Паркинг', 'Камин', 'Стиральная машина', 'Посудомойка', 'Можно с животными'],
    owner: { name: 'Виктор П.', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', rating: 4.9, reviews: 22, years: 4 },
    deposit: 95000, commission: '0%', minTerm: 'от 3 месяцев', util: 'не включены',
    aiScore: { match: 97, price: 85, description: 96, owner: 98 }, lat: 55.920, lng: 36.863,
  },
  {
    id: 7, title: 'Просторная 2-комнатная на Соколе', location: 'Москва, Сокол', city: 'Москва',
    address: 'Ленинградский пр., д. 55', price: 72000, rooms: 2, area: 68, floor: '8/12', year: 2012,
    verified: true, rating: 4.6, reviews: 28, metro: 'Сокол', metroMin: 4, type: 'Квартира',
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85'],
    description: 'Просторная двушка на 8 этаже с хорошим видом. Современный ремонт, встроенная кухня, гардеробная. Рядом парк Покровское-Стрешнево.',
    amenities: ['Wi-Fi', 'Стиральная машина', 'Холодильник', 'Кондиционер', 'Телевизор', 'Мебель', 'Паркинг'],
    owner: { name: 'Ольга М.', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', rating: 4.6, reviews: 19, years: 3 },
    deposit: 72000, commission: '0%', minTerm: 'от 6 месяцев', util: 'включены',
    aiScore: { match: 92, price: 84, description: 90, owner: 94 }, lat: 55.799, lng: 37.515,
  },
  {
    id: 8, title: 'Современная 1-комнатная у Таганки', location: 'Москва, Таганка', city: 'Москва',
    address: 'ул. Таганская, д. 1', price: 62000, rooms: 1, area: 45, floor: '5/17', year: 2020,
    verified: true, badge: 'Топ', rating: 4.8, reviews: 55, metro: 'Таганская', metroMin: 6, type: 'Квартира',
    images: ['https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=900&q=85'],
    description: 'Стильная однокомнатная квартира в новом доме. Панорамные окна, высокие потолки. Евроремонт 2023 года, вся новая мебель и техника.',
    amenities: ['Wi-Fi', 'Стиральная машина', 'Холодильник', 'Кондиционер', 'Телевизор', 'Мебель', 'Посудомойка'],
    owner: { name: 'Михаил Т.', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80', rating: 4.8, reviews: 31, years: 2 },
    deposit: 62000, commission: '50%', minTerm: 'от 1 месяца', util: 'включены',
    aiScore: { match: 95, price: 80, description: 93, owner: 96 }, lat: 55.737, lng: 37.650,
  },
  {
    id: 9, title: 'Апартаменты-студия в центре', location: 'Москва, Китай-город', city: 'Москва',
    address: 'Маросейка, д. 7', price: 70000, rooms: 1, area: 38, floor: '3/6', year: 2017,
    verified: true, rating: 4.7, reviews: 19, metro: 'Китай-город', metroMin: 2, type: 'Апартаменты',
    images: ['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900&q=85'],
    description: 'Современные апартаменты в историческом центре Москвы. 2 минуты пешком от метро Китай-город. Дизайнерский ремонт, панорамные окна.',
    amenities: ['Wi-Fi', 'Холодильник', 'Кондиционер', 'Телевизор', 'Мебель', 'Стиральная машина'],
    owner: { name: 'Анна Л.', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80', rating: 4.7, reviews: 14, years: 2 },
    deposit: 70000, commission: '0%', minTerm: 'от 1 месяца', util: 'включены',
    aiScore: { match: 93, price: 78, description: 91, owner: 95 }, lat: 55.756, lng: 37.634,
  },
];

export const CATEGORIES = [
  { img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80', label: 'Студии', type: 'Студия', count: '18 400' },
  { img: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&q=80', label: '1-комнатные', type: 'Квартира', count: '34 200' },
  { img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80', label: '2-комнатные', type: 'Квартира', count: '29 800' },
  { img: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&q=80', label: '3+ комнаты', type: 'Квартира', count: '15 600' },
  { img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80', label: 'Дома', type: 'Дом', count: '8 100' },
  { img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80', label: 'Апартаменты', type: 'Апартаменты', count: '12 300' },
  { img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80', label: 'Новостройки', type: 'Новостройка', count: '5 200' },
  { img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80', label: 'Загородные', type: 'Дом', count: '9 700' },
];
