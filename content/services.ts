/**
 * content/services.ts
 * ───────────────────
 * Editorial copy and specifications for the "Four Doors" Services section.
 * Buy · Sell · Rent · Home Service
 */

export interface ServicePanelData {
  id: 'buy' | 'sell';
  number: string;
  title: string;
  line: string;
  points: string[];
  cta: {
    label: string;
    href: string;
  };
  imageKey: string;
}

export interface ServicesSectionData {
  eyebrow: string;
  title: string;
  supporting: string;
  panels: ServicePanelData[];
}

export const servicesContent: ServicesSectionData = {
  eyebrow: 'WHAT WE DO',
  title: 'EVERYTHING YOUR CAR NEEDS.',
  supporting:
    'From discovering verified pre-owned cars to selling directly to serious buyers across Bangladesh.',
  panels: [
    {
      id: 'buy',
      number: '01',
      title: 'BUY',
      line: 'Browse new and reconditioned cars from trusted sellers across Bangladesh.',
      points: [
        'Filter by brand, budget and year',
        'Clear, honest pricing',
        'Contact sellers directly',
      ],
      cta: {
        label: 'BROWSE CARS',
        href: '/buy',
      },
      imageKey: 'service-buy',
    },
    {
      id: 'sell',
      number: '02',
      title: 'SELL',
      line: 'List your car in minutes and reach serious buyers.',
      points: [
        'Quick listing',
        'Photo guidance',
        'Enquiries in one place',
      ],
      cta: {
        label: 'SELL YOUR CAR',
        href: '/sell',
      },
      imageKey: 'service-sell',
    },
  ],
};

export default servicesContent;
