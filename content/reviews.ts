/**
 * content/reviews.ts
 * ──────────────────
 * Client reviews & testimonials from verified Bangladeshi buyers and sellers.
 */

export interface Review {
  id: string;
  author: string;
  role: string;
  location: string;
  type: 'VERIFIED BUYER' | 'VERIFIED SELLER';
  vehicle: string;
  rating: number;
  review: string;
  date: string;
  avatarInitials: string;
}

export const reviews: Review[] = [
  {
    id: 'review-1',
    author: 'Rafiqul Islam',
    role: 'Managing Director, Horizon Trade',
    location: 'Gulshan 2, Dhaka',
    type: 'VERIFIED BUYER',
    vehicle: 'Toyota Land Cruiser Prado',
    rating: 5,
    review:
      'Found a genuine Japanese reconditioned Prado through Garir Mela. The pre-delivery inspection document matched the vehicle 100%. Negotiated directly with the showroom owner without aggressive middlemen.',
    date: 'OCTOBER 2026',
    avatarInitials: 'RI',
  },
  {
    id: 'review-2',
    author: 'Nusrat Jahan',
    role: 'Principal Architect',
    location: 'Dhanmondi, Dhaka',
    type: 'VERIFIED SELLER',
    vehicle: 'Honda Civic RS Turbo',
    rating: 5,
    review:
      'Listed my Civic on Tuesday, completed the transfer by Friday. Garir Mela verified my ownership papers within 2 hours. Only serious, pre-screened buyers contacted me. Incredibly smooth experience.',
    date: 'SEPTEMBER 2026',
    avatarInitials: 'NJ',
  },
  {
    id: 'review-3',
    author: 'Tanvir Ahmed Choudhury',
    role: 'Tech Entrepreneur',
    location: 'Sylhet & Dhaka',
    type: 'VERIFIED BUYER',
    vehicle: 'Mitsubishi Pajero Sport',
    rating: 5,
    review:
      'Traveling between Sylhet highway and Dhaka requires a dependable SUV. The transparent auction sheet verification and honest vehicle history make Garir Mela the gold standard for car shopping in BD.',
    date: 'AUGUST 2026',
    avatarInitials: 'TC',
  },
];

export default reviews;
