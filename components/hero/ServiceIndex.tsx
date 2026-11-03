/**
 * components/hero/ServiceIndex.tsx
 * ────────────────────────────────
 * In-Hero Service Shortcuts Index (Anchored over the Red Form):
 *   - 01 BUY · 02 SELL
 *   - Type: Barlow Condensed bold, uppercase (≥ 24px display text to satisfy contrast rule on --red)
 *   - Each item links with smooth-scroll to #services
 *   - Staggered entrance in sync with heroProgress
 *   - Responsive via CSS classes (flex md:hidden vs hidden md:flex) to prevent SSR hydration mismatch
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { heroContent } from '@/content/hero';
import { introState } from '@/lib/animation/introState';
import { scrollToTarget } from '@/lib/hooks/useLenis';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { openServicePanel } from '@/lib/serviceEvents';

export function ServiceIndex() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reducedMotion || introState.introComplete) {
      queueMicrotask(() => setRevealed(true));
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
        // Stagger after headline (starts around p = 0.5)
        const progress = Math.max(0, Math.min((p - 0.5) / 0.5, 1));
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

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    panelKey?: 'buy' | 'sell'
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (panelKey) {
        openServicePanel(panelKey);
      }
      scrollToTarget(href, -80);
    }
  };

  return (
    <div
      ref={containerRef}
      aria-label="Service shortcuts"
      style={{
        opacity: revealed || reducedMotion ? 1 : 0,
        transform: revealed || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
        transition: reducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
        zIndex: 60,
      }}
    >
      {/* ── Mobile compact row ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4 justify-center items-center md:hidden">
        {heroContent.serviceShortcuts.map((item) => (
          <a
            key={item.number}
            href={item.href}
            onClick={(e) => handleItemClick(e, item.href, item.panelKey)}
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: '0.4rem',
              textDecoration: 'none',
              padding: '0.4rem 0.75rem',
              border: '1px solid rgba(245, 245, 247, 0.4)',
              backgroundColor: 'rgba(7, 7, 7, 0.4)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.7rem',
                color: 'var(--red)',
                fontWeight: 600,
              }}
            >
              {item.number}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--bone)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}
            >
              {item.label}
            </span>
          </a>
        ))}
      </div>

      {/* ── Desktop stacked index on Red Form ────────────────────────────────────── */}
      <div className="hidden md:flex flex-col gap-5 items-start">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--bone)',
              opacity: 0.9,
            }}
          >
            MARKETPLACE PILLARS
          </span>
          <div style={{ width: 16, height: 1, backgroundColor: 'var(--bone)', opacity: 0.8 }} />
        </div>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
          role="list"
        >
          {heroContent.serviceShortcuts.map((item) => (
            <li key={item.number}>
              <a
                href={item.href}
                onClick={(e) => handleItemClick(e, item.href, item.panelKey)}
                className="group"
                style={{
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: '0.75rem',
                  textDecoration: 'none',
                  color: 'var(--bone)',
                  transition: 'transform 0.2s ease, opacity 0.2s ease',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'rgba(245, 245, 247, 0.75)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.number}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-barlow-condensed), sans-serif',
                    fontSize: 'clamp(1.75rem, 2.2vw, 2.5rem)', // Large display text (≥ 24px) for contrast rule
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  {item.label}
                  <ArrowUpRight
                    size={18}
                    style={{
                      opacity: 0.6,
                      transition: 'transform 0.2s ease, opacity 0.2s ease',
                    }}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* ── Additional Right-Side Editorial Text & Network Info ─────────── */}
        <div style={{ marginTop: '0.75rem', maxWidth: '280px' }}>
          <div
            style={{
              width: '100%',
              height: 1,
              backgroundColor: 'rgba(237, 231, 220, 0.25)',
              marginBottom: '1rem',
            }}
          />

          {/* Active Network Status Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '0.5rem',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--bone)',
                opacity: 0.9,
              }}
            >
              LIVE MARKET NETWORK
            </span>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '0.78rem',
              color: 'var(--bone)',
              opacity: 0.85,
              lineHeight: 1.5,
              margin: '0 0 0.5rem 0',
            }}
          >
            Verified imports and domestic cars across Dhaka, Chittagong & Sylhet.
          </p>

          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.65rem',
              color: 'rgba(237, 231, 220, 0.7)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            DIRECT SELLER CONTACT · NO HIDDEN FEES
          </span>
        </div>
      </div>
    </div>
  );
}

export default ServiceIndex;
