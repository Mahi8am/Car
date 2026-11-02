/**
 * site.config.ts
 * ──────────────
 * Brand copy and navigation. Edit here to update every usage site.
 * The owner will provide the real brand name; use the placeholder for now.
 */

const siteConfig = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  /** PLACEHOLDER — owner will confirm. Read from logo but do not invent a name in UI. */
  brandName: 'Garir Mela',

  // ── SEO ────────────────────────────────────────────────────────────────────
  siteTitle: 'Garir Mela — Premium Automotive Marketplace',
  metaDescription:
    'Discover, buy, sell, or rent exceptional vehicles on Bangladesh\'s most curated automotive marketplace.',
  themeColor: '#070707',

  // ── Open Graph ─────────────────────────────────────────────────────────────
  ogImage: '/og-image.png',

  // ── Navigation (Plan1: all non-functional href="#") ─────────────────────────
  navItems: [
    { label: 'Buy',         href: '#' },
    { label: 'Sell',        href: '#' },
    { label: 'Rent',        href: '#' },
    { label: 'Collections', href: '#' },
  ],

  // ── Hero copy ──────────────────────────────────────────────────────────────
  heroEyebrow: 'Premium Automotive Marketplace',
  heroHeadline: ['YOUR NEXT DRIVE', 'STARTS HERE.'],
  heroDescription:
    'Discover exceptional vehicles. Find your next car, sell your own, or experience something different.',
  heroCta: 'Explore Collection',
} as const;

export type SiteConfig = typeof siteConfig;
export default siteConfig;
