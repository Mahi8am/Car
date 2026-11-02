/**
 * content/cars.ts
 * ───────────────
 * Featured Cars Collection for the Home Showcase & Marketplace.
 * Prices and specs tailored for Bangladeshi automotive market.
 */

export interface FeaturedCar {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: string;
  priceRaw: number; // in Lakh BDT
  mileage: string;
  engine: string;
  fuel: string;
  transmission: string;
  location: string;
  image: string;
  badge?: string;
  condition: 'Reconditioned' | 'Used' | 'Brand New';
}

export const featuredCars: FeaturedCar[] = [
  {
    id: 'toyota-prado-2022',
    name: 'Toyota Land Cruiser Prado TX-L',
    brand: 'Toyota',
    year: 2022,
    price: '৳ 1.35 Crore',
    priceRaw: 135,
    mileage: '18,500 km',
    engine: '2.8L Turbo Diesel',
    fuel: 'Diesel',
    transmission: 'Automatic · 4WD',
    location: 'Gulshan 2, Dhaka',
    image: '/images/cars/toyota-land-cruiser.jpg',
    badge: 'VERIFIED · READY STOCK',
    condition: 'Reconditioned',
  },
  {
    id: 'honda-civic-2023',
    name: 'Honda Civic RS Turbo',
    brand: 'Honda',
    year: 2023,
    price: '৳ 48.50 Lakh',
    priceRaw: 48.5,
    mileage: '11,200 km',
    engine: '1.5L VTEC Turbo',
    fuel: 'Octane',
    transmission: 'CVT with Paddle Shift',
    location: 'Dhanmondi, Dhaka',
    image: '/images/cars/honda-civic.jpg',
    badge: 'SINGLE OWNER · UNREGISTERED',
    condition: 'Used',
  },
  {
    id: 'suzuki-swift-2024',
    name: 'Suzuki Swift GLX Dualjet Hybrid',
    brand: 'Suzuki',
    year: 2024,
    price: '৳ 21.75 Lakh',
    priceRaw: 21.75,
    mileage: '4,800 km',
    engine: '1.2L Mild Hybrid',
    fuel: 'Hybrid / Petrol',
    transmission: 'Automatic',
    location: 'Banani, Dhaka',
    image: '/images/cars/suzuki-swift.jpg',
    badge: 'LIKE NEW · GRADE 5',
    condition: 'Reconditioned',
  },
  {
    id: 'mitsubishi-pajero-2021',
    name: 'Mitsubishi Pajero Sport Dakar Edition',
    brand: 'Mitsubishi',
    year: 2021,
    price: '৳ 82.00 Lakh',
    priceRaw: 82,
    mileage: '32,400 km',
    engine: '2.4L MIVEC Turbo Diesel',
    fuel: 'Diesel',
    transmission: '8-Speed Super Select 4WD',
    location: 'Uttara, Dhaka',
    image: '/images/cars/mitsubishi-pajero.jpg',
    badge: 'FULL SERVICE HISTORY',
    condition: 'Used',
  },
];

export default featuredCars;
