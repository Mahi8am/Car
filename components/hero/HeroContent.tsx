/**
 * components/hero/HeroContent.tsx
 * ───────────────────────────────
 * Hero Phase 2 Content Block (Anchored over the Bone Disc):
 *   - Eyebrow: BUY · SELL
 *   - Headline: FIND IT. DRIVE IT. OWN IT. (Barlow Condensed, sharp uppercase)
 *   - Supporting copy in Manrope
 *   - Primary CTA (Browse Cars, red fill, sharp) & Secondary CTA (Sell, outlined)
 *   - Trust micro-line
 *   - High contrast (AAA > 12:1 on bone, AA on dark)
 *   - Smooth scroll via Lenis to #services
 *   - Responsive via CSS classes to guarantee 100% identical SSR/client DOM
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { heroContent } from '@/content/hero';
import { introState } from '@/lib/animation/introState';
import { scrollToTarget } from '@/lib/hooks/useLenis';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { openServicePanel } from '@/lib/serviceEvents';

export function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reducedMotion || introState.introComplete) {
      setRevealed(true);
      if (containerRef.current) {
        containerRef.current.style.opacity = '1';
        containerRef.current.style.transform = 'translateY(0)';
      }
      return;
    }

    let raf: number;
    function checkProgress() {
      const p = introState.heroProgress;
      if (containerRef.current) {
        // Stagger after neon stage ignition (starts around p = 0.5)
        const progress = Math.max(0, Math.min((p - 0.4) / 0.6, 1));
        containerRef.current.style.opacity = String(progress);
        containerRef.current.style.transform = `translateY(${(1 - progress) * 16}px)`;
        if (progress >= 1) {
          setRevealed(true);
        }
      }
      if (!introState.introComplete) {
        raf = requestAnimationFrame(checkProgress);
      }
    }

    raf = requestAnimationFrame(checkProgress);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  const handleCtaClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    panelKey?: 'buy' | 'sell'
  ) => {
    e.preventDefault();
    if (panelKey) {
      openServicePanel(panelKey);
    }
    scrollToTarget(href, -80);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center text-center md:items-start md:text-left w-full max-w-[460px] md:max-w-[520px]"
      style={{
        opacity: revealed || reducedMotion ? 1 : 0,
        transform: revealed || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
        transition: reducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
        zIndex: 60,
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '0.75rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--red)',
          }}
        >
          {heroContent.eyebrow}
        </span>
        <div style={{ width: 20, height: 1, backgroundColor: 'var(--red)' }} />
      </div>

      {/* Headline (Barlow Condensed, Bold, Uppercase) */}
      <h1
        style={{
          fontFamily: 'var(--font-barlow-condensed), sans-serif',
          fontSize: 'clamp(2.5rem, 4.6vw, 5.25rem)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '-0.025em',
          lineHeight: 0.92,
          color: 'var(--ink-950)', // Crisp dark on bone disc
          margin: '0 0 1rem 0',
        }}
      >
        {heroContent.headline.map((line, idx) => (
          <span key={idx} style={{ display: 'block' }}>
            {line}
          </span>
        ))}
      </h1>

      {/* Supporting copy (Manrope) */}
      <p
        style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: 'clamp(0.9rem, 1.1vw, 1.02rem)',
          color: 'var(--charcoal)',
          lineHeight: 1.55,
          maxWidth: '44ch',
          margin: '0 0 1.75rem 0',
        }}
      >
        {heroContent.supporting}
      </p>

      {/* CTAs */}
      <div
        className="flex flex-wrap gap-4 items-center justify-center md:justify-start"
        style={{
          marginBottom: '1.25rem',
        }}
      >
        {/* Primary CTA (Browse Cars) */}
        <a
          href={heroContent.primaryCta.href}
          onClick={(e) => handleCtaClick(e, heroContent.primaryCta.href, 'buy')}
          className="cta-btn primary-cta"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.85rem',
            backgroundColor: 'var(--red)',
            color: 'var(--bone)',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: 0,
            border: '1px solid var(--red)',
            transition: 'background-color 0.2s ease, transform 0.2s ease',
          }}
        >
          {heroContent.primaryCta.label}
          <ArrowUpRight size={15} />
        </a>

        {/* Secondary CTA (Sell Your Car) */}
        <a
          href={heroContent.secondaryCta.href}
          onClick={(e) => handleCtaClick(e, heroContent.secondaryCta.href, 'sell')}
          className="cta-btn secondary-cta"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.75rem',
            backgroundColor: 'transparent',
            color: 'var(--ink-950)',
            border: '1px solid var(--charcoal)',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: 0,
            transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
          }}
        >
          {heroContent.secondaryCta.label}
        </a>
      </div>

      {/* Trust micro-line */}
      <p
        style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '0.75rem',
          color: 'var(--muted)',
          margin: 0,
          letterSpacing: '0.02em',
        }}
      >
        {heroContent.trustLine.text}
      </p>
    </div>
  );
}

export default HeroContent;
