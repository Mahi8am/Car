/**
 * components/sections/Brands.tsx
 * ──────────────────────────────
 * Popular Brands in Bangladesh (Milestone P2-M5):
 * - Hairline-grid logo wall: 6x2 desktop, 4x3 tablet, 3x4 phone.
 * - Section rhythm: on --bone (warm off-white) with --ink-950 text.
 * - Single deliberate large geometric form bleeding off the right edge.
 * - Section heading with masked line reveal (matches Plan 1 Scene 4).
 * - Real <a> links with red hover sweeps and ArrowUpRight indicators.
 * - Quiet link: VIEW ALL BRANDS → and trademark disclaimer.
 */

'use client';

import Link from 'next/link';
import { brandsContent } from '@/content/brands';
import { BrandCell } from './BrandCell';
import { useInView } from '@/lib/hooks/useInView';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { ArrowUpRight } from 'lucide-react';

export function Brands() {
  const { ref: headerRef, isInView: headerInView } = useInView<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="brands"
      aria-labelledby="brands-heading"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bone)',
        color: 'var(--ink-950)',
        padding: '7.5rem 0 6.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Deliberate dark geometric disc motif bleeding off top-right edge */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-14vw',
          right: '-14vw',
          width: '44vw',
          height: '44vw',
          borderRadius: '50%',
          backgroundColor: 'rgba(22, 22, 23, 0.04)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        {/* Section Header with Masked Line Reveal */}
        <div ref={headerRef} style={{ marginBottom: '3.75rem', maxWidth: '720px' }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem',
              opacity: headerInView || reducedMotion ? 1 : 0,
              transform: headerInView || reducedMotion ? 'translateY(0)' : 'translateY(12px)',
              transition: reducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.8rem',
                color: 'var(--red)',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              {brandsContent.eyebrow}
            </span>
            <div style={{ width: 28, height: 1, backgroundColor: 'var(--red)' }} />
          </div>

          {/* Masked Line Heading Reveal */}
          <div style={{ overflow: 'hidden', paddingBottom: '0.2rem', marginBottom: '0.85rem' }}>
            <h2
              id="brands-heading"
              style={{
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: 'clamp(2.75rem, 5.5vw, 5.25rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: 'var(--ink-950)',
                lineHeight: 0.92,
                margin: 0,
                transform: headerInView || reducedMotion ? 'translateY(0%)' : 'translateY(105%)',
                transition: reducedMotion ? 'none' : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {brandsContent.title}
            </h2>
          </div>

          {/* Supporting line */}
          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '1.05rem',
              color: 'rgba(22, 22, 23, 0.78)',
              lineHeight: 1.6,
              maxWidth: '52ch',
              margin: 0,
              opacity: headerInView || reducedMotion ? 0.9 : 0,
              transform: headerInView || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
              transition: reducedMotion ? 'none' : 'opacity 0.7s ease-out 0.2s, transform 0.7s ease-out 0.2s',
            }}
          >
            {brandsContent.supporting}
          </p>
        </div>

        {/* Hairline Grid Logo Wall: Desktop 6x2, Tablet 4x3, Phone 3x4 */}
        <div
          role="region"
          aria-label="Car brands in Bangladesh"
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          style={{
            borderTop: '1px solid rgba(35, 35, 38, 0.15)',
            borderLeft: '1px solid rgba(35, 35, 38, 0.15)',
          }}
        >
          {brandsContent.brands.map((brand) => (
            <BrandCell key={brand.id} brand={brand} />
          ))}
        </div>

        {/* Footer controls: Quiet "VIEW ALL BRANDS" link + Trademark note */}
        <div
          style={{
            marginTop: '3rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            alignItems: 'flex-start',
          }}
        >
          <Link
            href={brandsContent.allBrandsLink.href}
            className="group"
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-950)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderBottom: '1.5px solid var(--red)',
              paddingBottom: '3px',
              transition: 'color 0.2s ease',
            }}
          >
            <span>{brandsContent.allBrandsLink.label}</span>
            <ArrowUpRight
              size={15}
              className="text-[var(--red)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>

          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '0.72rem',
              color: 'rgba(22, 22, 23, 0.7)',
              opacity: 0.8,
              lineHeight: 1.5,
              maxWidth: '68ch',
              margin: 0,
            }}
          >
            {brandsContent.trademarkDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Brands;
