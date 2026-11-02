/**
 * content/hero.ts
 * ───────────────
 * Copy and structured content for the resolved hero state (Phase 2).
 * Designed for strict contrast against bone disc, red form, and central dark stage.
 * Bangla-ready: plain string objects.
 */

export interface HeroContent {
  eyebrow: string;
  headline: string[];
  supporting: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  trustLine: {
    text: string;
    isPlaceholder: boolean;
  };
  serviceShortcuts: Array<{
    number: string;
    label: string;
    href: string;
    panelKey: 'buy' | 'sell';
  }>;
}

export const heroContent: HeroContent = {
  eyebrow: 'BUY · SELL',
  headline: ['FIND IT.', 'DRIVE IT.', 'OWN IT.'],
  supporting:
    'Verified cars from trusted sellers across Bangladesh. Buy or sell with transparent pricing and direct seller contact.',
  primaryCta: {
    label: 'BROWSE CARS',
    href: '/buy',
  },
  secondaryCta: {
    label: 'SELL YOUR CAR',
    href: '/sell',
  },
  trustLine: {
    text: 'Verified sellers · Transparent pricing · Direct contact',
    isPlaceholder: true,
  },
  serviceShortcuts: [
    { number: '01', label: 'BUY', href: '/buy', panelKey: 'buy' },
    { number: '02', label: 'SELL', href: '/sell', panelKey: 'sell' },
  ],
};

export default heroContent;
