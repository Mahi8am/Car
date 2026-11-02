/**
 * content/brands.ts
 * ─────────────────
 * Popular car brands in Bangladesh.
 * Japanese reconditioned imports dominate the market (Toyota, Honda, Nissan, Mitsubishi, Suzuki),
 * balanced by modern Korean offerings and European luxury marques.
 */

export interface BrandItem {
  id: string;
  name: string;
  origin: string;
  href: string;
  svgMark?: string; // Path or identifier for SVG mark
}

export interface BrandsSectionData {
  eyebrow: string;
  title: string;
  supporting: string;
  brands: BrandItem[];
  allBrandsLink: {
    label: string;
    href: string;
  };
  trademarkDisclaimer: string;
}

export const brandsContent: BrandsSectionData = {
  eyebrow: 'POPULAR IN BANGLADESH',
  title: 'SHOP BY BRAND.',
  supporting: 'From everyday Japanese favourites to European luxury.',
  // Exactly 12 brands in specified order (Plan2 §4.1)
  brands: [
    { id: 'toyota', name: 'Toyota', origin: 'Japan', href: '/buy?brand=Toyota' },
    { id: 'honda', name: 'Honda', origin: 'Japan', href: '/buy?brand=Honda' },
    { id: 'nissan', name: 'Nissan', origin: 'Japan', href: '/buy?brand=Nissan' },
    { id: 'mitsubishi', name: 'Mitsubishi', origin: 'Japan', href: '/buy?brand=Mitsubishi' },
    { id: 'suzuki', name: 'Suzuki', origin: 'Japan', href: '/buy?brand=Suzuki' },
    { id: 'hyundai', name: 'Hyundai', origin: 'South Korea', href: '/buy?brand=Hyundai' },
    { id: 'kia', name: 'Kia', origin: 'South Korea', href: '/buy?brand=Kia' },
    { id: 'mazda', name: 'Mazda', origin: 'Japan', href: '/buy?brand=Mazda' },
    { id: 'subaru', name: 'Subaru', origin: 'Japan', href: '/buy?brand=Subaru' },
    { id: 'lexus', name: 'Lexus', origin: 'Japan', href: '/buy?brand=Lexus' },
    { id: 'bmw', name: 'BMW', origin: 'Germany', href: '/buy?brand=BMW' },
    { id: 'mercedes-benz', name: 'Mercedes-Benz', origin: 'Germany', href: '/buy?brand=Mercedes-Benz' },
  ],
  allBrandsLink: {
    label: 'VIEW ALL BRANDS →',
    href: '/buy',
  },
  trademarkDisclaimer:
    'All brand marks and vehicle names are trademarks of their respective owners and are displayed solely to identify vehicle makes.',
};

export default brandsContent;
