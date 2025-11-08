import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const apartments: Prisma.ApartmentCreateInput[] = [
  {
    name: 'Sunset View Apartment',
    unitNumber: 'A-1205',
    project: 'Sunset Residences',
    bedrooms: 3,
    bathrooms: 2,
    price: new Prisma.Decimal(225000),
    area: 140,
    address: '1205 Palm Street',
    city: 'Cairo',
    country: 'Egypt',
    description: 'Spacious apartment with panoramic city views and modern finishes.',
    images: [
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511'
    ],
    amenities: ['Pool Access', 'Gym Membership', '24/7 Security', 'Smart Thermostat']
  },
  {
    name: 'Sunset Corner Suite',
    unitNumber: 'A-1502',
    project: 'Sunset Residences',
    bedrooms: 2,
    bathrooms: 2,
    price: new Prisma.Decimal(195000),
    area: 120,
    address: '1502 Palm Street',
    city: 'Cairo',
    country: 'Egypt',
    description: 'Corner unit with dual balconies and abundant natural light throughout.',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'
    ],
    amenities: ['Dual Balconies', 'Gym Membership', '24/7 Security', 'Smart Thermostat']
  },
  {
    name: 'Sunset Family Home',
    unitNumber: 'A-2008',
    project: 'Sunset Residences',
    bedrooms: 4,
    bathrooms: 3,
    price: new Prisma.Decimal(285000),
    area: 180,
    address: '2008 Palm Street',
    city: 'Cairo',
    country: 'Egypt',
    description: 'Luxurious family home with master suite and spacious living areas.',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'
    ],
    amenities: ['Master Suite', 'Pool Access', 'Gym Membership', '24/7 Security', 'Kids Play Area']
  },
  {
    name: 'Nile Breeze Loft',
    unitNumber: 'B-903',
    project: 'Nile Towers',
    bedrooms: 2,
    bathrooms: 2,
    price: new Prisma.Decimal(185000),
    area: 115,
    address: '903 River Lane',
    city: 'Giza',
    country: 'Egypt',
    description: 'Loft-style unit with river-facing balcony and premium interiors.',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'
    ],
    amenities: ['Balcony', 'Covered Parking', 'Concierge Service', 'In-unit Laundry']
  },
  {
    name: 'Nile Riverside Penthouse',
    unitNumber: 'B-PH15',
    project: 'Nile Towers',
    bedrooms: 5,
    bathrooms: 4,
    price: new Prisma.Decimal(450000),
    area: 350,
    address: 'PH-15 River Lane',
    city: 'Giza',
    country: 'Egypt',
    description: 'Exclusive penthouse with private rooftop terrace and unobstructed Nile views.',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858'
    ],
    amenities: ['Private Rooftop', 'River Views', 'Concierge Service', 'Private Elevator', 'Wine Cellar']
  },
  {
    name: 'Nile Studio Plus',
    unitNumber: 'B-501',
    project: 'Nile Towers',
    bedrooms: 1,
    bathrooms: 1,
    price: new Prisma.Decimal(125000),
    area: 75,
    address: '501 River Lane',
    city: 'Giza',
    country: 'Egypt',
    description: 'Modern studio with efficient layout and river glimpses from the balcony.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9'
    ],
    amenities: ['Balcony', 'Covered Parking', 'Concierge Service', 'Gym Access']
  },
  {
    name: 'Gardenia Residence',
    unitNumber: 'C-704',
    project: 'Green Meadows',
    bedrooms: 4,
    bathrooms: 3,
    price: new Prisma.Decimal(310000),
    area: 190,
    address: '704 Garden Avenue',
    city: 'New Cairo',
    country: 'Egypt',
    description: 'Family-friendly home overlooking landscaped gardens and club house.',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'
    ],
    amenities: ['Club House', 'Kids Area', 'Smart Home System', 'Solar Water Heating']
  },
  {
    name: 'Gardenia Garden Villa',
    unitNumber: 'C-V12',
    project: 'Green Meadows',
    bedrooms: 5,
    bathrooms: 4,
    price: new Prisma.Decimal(395000),
    area: 280,
    address: 'Villa 12 Garden Avenue',
    city: 'New Cairo',
    country: 'Egypt',
    description: 'Spacious villa with private garden, perfect for large families and entertaining.',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
      'https://images.unsplash.com/photo-1469796466635-455ede028aca'
    ],
    amenities: ['Private Garden', 'Club House', 'Kids Area', 'Smart Home System', 'Solar Water Heating', 'BBQ Area']
  },
  {
    name: 'Skyline Studio',
    unitNumber: 'D-405',
    project: 'Downtown Heights',
    bedrooms: 1,
    bathrooms: 1,
    price: new Prisma.Decimal(95000),
    area: 65,
    address: '405 Center Boulevard',
    city: 'Alexandria',
    country: 'Egypt',
    description: 'Bright studio ideal for young professionals, near business district.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9'
    ],
    amenities: ['Rooftop Lounge', 'High-speed Internet', 'Co-working Space', '24/7 Security']
  },
  {
    name: 'Palm Oasis Penthouse',
    unitNumber: 'PH-32',
    project: 'Palm Oasis Towers',
    bedrooms: 5,
    bathrooms: 4,
    price: new Prisma.Decimal(525000),
    area: 320,
    address: '32 Tamarisk Road',
    city: 'Dubai',
    country: 'UAE',
    description: 'Expansive penthouse with private pool, double-height living room, and panoramic skyline views.',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858'
    ],
    amenities: ['Private Pool', 'Sky Deck', 'Cinema Room', 'Butler Service']
  },
  {
    name: 'Palm Oasis Sky Suite',
    unitNumber: 'SS-28',
    project: 'Palm Oasis Towers',
    bedrooms: 3,
    bathrooms: 3,
    price: new Prisma.Decimal(385000),
    area: 200,
    address: '28 Tamarisk Road',
    city: 'Dubai',
    country: 'UAE',
    description: 'Premium sky suite with floor-to-ceiling windows and access to exclusive sky lounge.',
    images: [
      'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca',
      'https://images.unsplash.com/photo-1503602642458-232111445657'
    ],
    amenities: ['Sky Lounge Access', 'Premium Finishes', 'Concierge', 'EV Charging']
  },
  {
    name: 'Palm Oasis Garden Apartment',
    unitNumber: 'GA-05',
    project: 'Palm Oasis Towers',
    bedrooms: 2,
    bathrooms: 2,
    price: new Prisma.Decimal(245000),
    area: 135,
    address: '05 Tamarisk Road',
    city: 'Dubai',
    country: 'UAE',
    description: 'Ground-floor apartment with private garden terrace and direct pool access.',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
    ],
    amenities: ['Private Garden', 'Pool Access', 'Gym Membership', '24/7 Security']
  },
  {
    name: 'Marina Edge Retreat',
    unitNumber: '12F',
    project: 'Marina Edge Residences',
    bedrooms: 3,
    bathrooms: 3,
    price: new Prisma.Decimal(345000),
    area: 180,
    address: '12 Marina Promenade',
    city: 'Abu Dhabi',
    country: 'UAE',
    description: 'Corner apartment with floor-to-ceiling windows and sweeping marina vistas.',
    images: [
      'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca',
      'https://images.unsplash.com/photo-1503602642458-232111445657'
    ],
    amenities: ['Yacht Dock', 'Infinity Pool', 'Spa', 'EV Chargers']
  },
  {
    name: 'Marina Edge Waterfront',
    unitNumber: 'WF-08',
    project: 'Marina Edge Residences',
    bedrooms: 4,
    bathrooms: 4,
    price: new Prisma.Decimal(425000),
    area: 240,
    address: '08 Marina Promenade',
    city: 'Abu Dhabi',
    country: 'UAE',
    description: 'Luxurious waterfront residence with private dock access and panoramic marina views.',
    images: [
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be'
    ],
    amenities: ['Private Dock', 'Yacht Dock', 'Infinity Pool', 'Spa', 'EV Chargers', 'Butler Service']
  },
  {
    name: 'Lagoon Breeze Duplex',
    unitNumber: 'G-08',
    project: 'Blue Lagoon Residences',
    bedrooms: 4,
    bathrooms: 4,
    price: new Prisma.Decimal(289000),
    area: 210,
    address: '8 Lagoon Crescent',
    city: 'Doha',
    country: 'Qatar',
    description: 'Waterfront duplex with private garden, outdoor kitchen, and master suite balcony.',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
    ],
    amenities: ['Private Garden', 'Outdoor Kitchen', 'Smart Blinds', 'Community Marina']
  },
  {
    name: 'Pearl Executive Suite',
    unitNumber: '804',
    project: 'Pearl Business Residences',
    bedrooms: 2,
    bathrooms: 2,
    price: new Prisma.Decimal(265000),
    area: 130,
    address: '804 Pearl Plaza',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    description: 'Executive suite with integrated office, elegant finishes, and city center accessibility.',
    images: [
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be'
    ],
    amenities: ['Business Lounge', 'Conference Pods', 'Concierge', 'Gym & Spa']
  },
  {
    name: 'Azure Beach Residence',
    unitNumber: 'B-27',
    project: 'Azure Beachfront',
    bedrooms: 3,
    bathrooms: 2,
    price: new Prisma.Decimal(305000),
    area: 175,
    address: '27 Coral Road',
    city: 'Hurghada',
    country: 'Egypt',
    description: 'Beachfront home with wraparound terrace, direct beach access, and calming interior palette.',
    images: [
      'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c',
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353'
    ],
    amenities: ['Private Beach', 'Water Sports Hub', 'Sunset Deck', 'Resort Pool']
  },
  {
    name: 'Heritage Courtyard Flat',
    unitNumber: 'H-12',
    project: 'Citadel Courtyard',
    bedrooms: 2,
    bathrooms: 1,
    price: new Prisma.Decimal(145000),
    area: 95,
    address: '12 Citadel Alley',
    city: 'Luxor',
    country: 'Egypt',
    description: 'Charming flat blending modern comfort with traditional courtyard living, near historic temples.',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb'
    ],
    amenities: ['Shared Courtyard', 'Cultural Lounge', 'Artisanal Market Access', 'Bike Storage']
  },
  {
    name: 'Metroline Micro Loft',
    unitNumber: 'L-210',
    project: 'Metroline Lofts',
    bedrooms: 1,
    bathrooms: 1,
    price: new Prisma.Decimal(78000),
    area: 48,
    address: '210 Metroline Avenue',
    city: 'Cairo',
    country: 'Egypt',
    description: 'Compact loft with modular furniture, walk-in wardrobe wall, and metro access downstairs.',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      'https://images.unsplash.com/photo-1484100356142-db6ab6244067'
    ],
    amenities: ['Modular Storage', 'Metro Access', 'Smart Lighting', 'Community Rooftop']
  },
  {
    name: 'Mangrove Serenity Villa',
    unitNumber: 'V-18',
    project: 'Mangrove Isles',
    bedrooms: 4,
    bathrooms: 5,
    price: new Prisma.Decimal(415000),
    area: 260,
    address: '18 Mangrove Lane',
    city: 'Jeddah',
    country: 'Saudi Arabia',
    description: 'Lakeside villa with private dock, plunge pool, and lush landscaping inspired by mangrove forests.',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
      'https://images.unsplash.com/photo-1469796466635-455ede028aca'
    ],
    amenities: ['Private Dock', 'Plunge Pool', 'Outdoor Cinema', 'Solar Panels']
  },
  {
    name: 'Citiscape Corner Loft',
    unitNumber: 'Loft-72',
    project: 'Citiscape One',
    bedrooms: 2,
    bathrooms: 2,
    price: new Prisma.Decimal(198000),
    area: 125,
    address: '72 Skyline Road',
    city: 'Amman',
    country: 'Jordan',
    description: 'Industrial-inspired corner loft with exposed brick, steel beams, and skyline views.',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e'
    ],
    amenities: ['Sky Lounge', 'Art Gallery Lobby', 'Coworking Hub', 'Yoga Studio']
  }
];

const formatImageUrl = (url: string) => {
  if (!url.startsWith('http')) {
    return url;
  }
  const params = 'auto=format&fit=crop&w=1600&q=80';
  return url.includes('?') ? `${url}&${params}` : `${url}?${params}`;
};

const normalizeImages = (
  images?: Prisma.ApartmentCreateimagesInput | string[]
): string[] => {
  if (!images) {
    return [];
  }

  if (Array.isArray(images)) {
    return images.map(formatImageUrl);
  }

  if ('set' in images && Array.isArray(images.set)) {
    return images.set.map(formatImageUrl);
  }

  return [];
};

const seedData = apartments.map((apartment) => ({
  ...apartment,
  images: normalizeImages(apartment.images)
}));

async function main() {
  await prisma.apartment.deleteMany();
  for (const apartment of seedData) {
    await prisma.apartment.create({ data: apartment });
  }
  console.log(`Seeded ${seedData.length} apartments.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

