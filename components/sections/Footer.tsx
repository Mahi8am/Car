/**
 * components/sections/Footer.tsx
 * ──────────────────────────────
 * Restrained, editorial footer on --ink-950 (Milestone P2-M5):
 * - Logo + one-line tagline
 * - Link columns (Marketplace: Buy, Sell · Company: About, Contact · Support: Help, Terms, Privacy)
 * - Inter-wired marketplace links: opens matching panel in Services
 * - Contact block with clearly marked placeholders
 * - Inline SVG social icons (Facebook, Instagram, YouTube)
 * - Very large cropped brand wordmark in --graphite bleeding off bottom edge
 * - Copyright line and accessible smooth-scroll "Back to top" control
 */

'use client';

import Image from 'next/image';
import { ArrowUp } from 'lucide-react';
import { siteConfig } from '@/content/site';
import { scrollToTarget } from '@/lib/hooks/useLenis';
import { openServicePanel, type ServicePanelId } from '@/lib/serviceEvents';

/* ── Inline SVG Social Icons ─────────────────────────────────────────────── */

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function Footer() {
  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget('#hero', 0);
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string
  ) => {
    if (href === '#services') {
      e.preventDefault();
      const panelKey: ServicePanelId = label.toLowerCase().includes('sell') ? 'sell' : 'buy';
      openServicePanel(panelKey);
      scrollToTarget('#services', -80);
    }
  };

  return (
    <footer
      id="footer"
      aria-label="Footer"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bone)',
        color: 'var(--ink-950)',
        borderTop: '1px solid rgba(35, 35, 38, 0.15)',
        paddingTop: '6.5rem',
        paddingBottom: '2rem',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        {/* Top Grid: Brand & Tagline + Nav Link Columns + Contact Block */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12"
          style={{ marginBottom: '4rem' }}
        >
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2">
            <Image
              src="/brand/logo.png"
              alt={siteConfig.brandName}
              width={96}
              height={52}
              style={{ width: 'clamp(72px, 8vw, 96px)', height: 'auto', marginBottom: '1.25rem' }}
            />
            <p
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.95rem',
                color: 'rgba(22, 22, 23, 0.78)',
                lineHeight: 1.6,
                maxWidth: '38ch',
                marginBottom: '1.75rem',
              }}
            >
              The premier automotive marketplace in Bangladesh. Buy and sell verified cars with confidence across the nation.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '1.1rem', alignItems: 'center' }}>
              <a
                href={siteConfig.footer.socials[0]?.href || '#'}
                aria-label="Facebook"
                style={{ color: 'rgba(22, 22, 23, 0.75)', transition: 'color 0.2s' }}
                className="hover:text-[var(--red)]"
              >
                <FacebookIcon />
              </a>
              <a
                href={siteConfig.footer.socials[1]?.href || '#'}
                aria-label="Instagram"
                style={{ color: 'rgba(22, 22, 23, 0.75)', transition: 'color 0.2s' }}
                className="hover:text-[var(--red)]"
              >
                <InstagramIcon />
              </a>
              <a
                href={siteConfig.footer.socials[2]?.href || '#'}
                aria-label="YouTube"
                style={{ color: 'rgba(22, 22, 23, 0.75)', transition: 'color 0.2s' }}
                className="hover:text-[var(--red)]"
              >
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* Col 2 & 3: Link Columns */}
          {siteConfig.footer.columns.slice(0, 2).map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--red)',
                  marginBottom: '1.25rem',
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href, link.label)}
                      style={{
                        fontFamily: 'var(--font-manrope), sans-serif',
                        fontSize: '0.88rem',
                        color: 'rgba(22, 22, 23, 0.75)',
                        textDecoration: 'none',
                        transition: 'color 0.2s, opacity 0.2s',
                      }}
                      className="hover:text-[var(--red)] hover:opacity-100"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 4: Support & Contact Block */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--red)',
                marginBottom: '1.25rem',
              }}
            >
              Contact
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.88rem',
                color: 'rgba(22, 22, 23, 0.78)',
                lineHeight: 1.55,
              }}
            >
              <span>{siteConfig.footer.contact.email}</span>
              <span>{siteConfig.footer.contact.phone}</span>
              <span>{siteConfig.footer.contact.location}</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--red)',
                  textTransform: 'uppercase',
                  marginTop: '0.35rem',
                  letterSpacing: '0.04em',
                }}
              >
                [{siteConfig.footer.contact.note}]
              </span>
            </div>
          </div>
        </div>

        {/* Back to top + Bottom Copyright Line */}
        <div
          style={{
            borderTop: '1px solid rgba(35, 35, 38, 0.12)',
            paddingTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          className="sm:flex-row"
        >
          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '0.78rem',
              color: 'rgba(22, 22, 23, 0.7)',
              margin: 0,
            }}
          >
            {siteConfig.footer.copyright}
          </p>

          <button
            type="button"
            onClick={handleBackToTop}
            aria-label="Back to top"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink-950)',
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'color 0.2s',
            }}
            className="hover:text-[var(--red)]"
          >
            Back to top
            <ArrowUp size={14} color="var(--red)" />
          </button>
        </div>
      </div>

      {/* Massive watermark wordmark in the background with footer contents over it */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          textAlign: 'center',
          fontFamily: 'var(--font-barlow-condensed), sans-serif',
          fontSize: 'clamp(5rem, 16vw, 18rem)',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '-0.025em',
          color: 'var(--ink-950)',
          opacity: 0.05,
          lineHeight: 0.8,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 0,
        }}
      >
        {siteConfig.footer.closingWatermark}
      </div>
    </footer>
  );
}

export default Footer;
