import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Manrope, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';
import siteConfig from '@/config/site.config';

/* ── Self-hosted fonts via next/font (display: swap) ───────────────────────── */

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: '--font-bengali',
  subsets: ['bengali'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

/* ── Viewport (theme-color lives here in Next.js 16+) ───────────────────────── */

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

/* ── Metadata ────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  // TODO: update to production domain when available
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : new URL('http://localhost:3000'),
  title: siteConfig.siteTitle,
  description: siteConfig.metaDescription,
  openGraph: {
    title: siteConfig.siteTitle,
    description: siteConfig.metaDescription,
    type: 'website',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.siteTitle,
    description: siteConfig.metaDescription,
  },
};

/* ── Root layout ────────────────────────────────────────────────────────────── */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${manrope.variable} ${notoSansBengali.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
