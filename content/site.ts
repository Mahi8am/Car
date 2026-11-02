/**
 * content/site.ts
 * ───────────────
 * Global site metadata, navigation items, contact information, and footer content.
 * Bangla-ready: plain string objects, no hard-coded text inside components.
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  panelKey?: 'buy' | 'sell';
}

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  navItems: NavItem[];
  footer: {
    columns: FooterColumn[];
    contact: {
      email: string;
      phone: string;
      location: string;
      note: string;
    };
    socials: Array<{ name: string; href: string }>;
    closingWatermark: string;
    copyright: string;
  };
}

export const siteConfig: SiteConfig = {
  brandName: 'Garir Mela',
  tagline: 'Premium Automotive Marketplace',
  navItems: [
    { id: 'nav-home', label: 'Home', href: '/' },
    { id: 'nav-buy', label: 'Buy', href: '/buy' },
    { id: 'nav-sell', label: 'Sell', href: '/sell' },
  ],
  footer: {
    columns: [
      {
        title: 'Marketplace',
        links: [
          { label: 'Browse All Cars', href: '/buy' },
          { label: 'Featured Inventory', href: '/#featured-cars' },
          { label: 'Sell Your Car', href: '/sell' },
          { label: 'Popular Brands', href: '/#brands' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About Us', href: '#' },
          { label: 'Contact', href: '#' },
          { label: 'Careers', href: '#' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Help Center', href: '#' },
          { label: 'Terms & Conditions', href: '#' },
          { label: 'Privacy Policy', href: '#' },
        ],
      },
    ],
    contact: {
      email: 'hello@garirmela.com',
      phone: '+880 1700-000000',
      location: 'Dhaka, Bangladesh',
      note: 'PLACEHOLDER: Verify before launch',
    },
    socials: [
      { name: 'Facebook', href: '#' },
      { name: 'Instagram', href: '#' },
      { name: 'YouTube', href: '#' },
    ],
    closingWatermark: 'GARIR MELA',
    copyright: '© 2026 Garir Mela. All rights reserved.',
  },
};

export default siteConfig;
