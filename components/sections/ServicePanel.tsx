/**
 * components/sections/ServicePanel.tsx
 * ────────────────────────────────────
 * Editorial image panel for the "Two Doors" Services section (Buy · Sell).
 * - Desktop: side-by-side flex-grow expandable panel (75–85svh high).
 * - Mobile: stacked full-width editorial panel (aspect ≈ 4:5, bottom-anchored).
 * - Keyboard accessible: Enter/Space toggles, Left/Right arrow keys navigate between panels.
 * - Image grading: desaturated, warm-dark, high-contrast typography over dark scrim.
 * - Subtle desktop parallax (≤ 6%, desktop only, disabled under prefers-reduced-motion).
 * - Responsive via pure CSS classes to guarantee zero SSR hydration mismatch.
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ServicePanelData } from '@/content/services';
import imageManifest from '@/content/images';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface ServicePanelProps {
  panel: ServicePanelData;
  isOpen: boolean;
  onOpen: () => void;
  onKeyNav?: (key: string) => void;
}

export function ServicePanel({ panel, isOpen, onOpen, onKeyNav }: ServicePanelProps) {
  const imgData = imageManifest[panel.imageKey];
  const reducedMotion = useReducedMotion();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Subtle desktop mouse parallax (≤ 5% translation, desktop only, no reduced motion)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: nx * 16, y: ny * 16 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onKeyNav?.(e.key);
    }
  };

  return (
    <>
      {/* ── Mobile / Tablet Stacked Panel ───────────────────────────────────────── */}
      <div
        id={`service-panel-mobile-${panel.id}`}
        className="block md:hidden relative min-h-[440px] sm:min-h-[480px] bg-[var(--charcoal)] border border-[var(--graphite-2)] p-6 sm:p-8 flex flex-col justify-end overflow-hidden"
      >
        {/* Background image with film grading */}
        {imgData && (
          <Image
            src={imgData.filename}
            alt={imgData.alt}
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL={imgData.blurDataURL}
            style={{
              objectFit: 'cover',
              objectPosition: `${imgData.focalPoint.x}% ${imgData.focalPoint.y}%`,
              opacity: 0.38,
              filter: 'grayscale(25%) contrast(1.18) brightness(0.9)',
              zIndex: 0,
            }}
          />
        )}

        {/* Deep dark gradient scrim for contrast (WCAG AAA) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(7, 7, 7, 0.98) 45%, rgba(12, 11, 10, 0.7) 75%, rgba(22, 22, 23, 0.4) 100%)',
            zIndex: 1,
          }}
        />

        {/* Content anchored bottom-left */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Panel number + red accent rule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.85rem',
                color: 'var(--red)',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              {panel.number}
            </span>
            <div style={{ width: 18, height: 1, backgroundColor: 'var(--red)' }} />
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-barlow-condensed), sans-serif',
              fontSize: 'clamp(2.5rem, 8vw, 3.25rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: 'var(--bone)',
              margin: '0 0 0.5rem 0',
              lineHeight: 0.95,
            }}
          >
            {panel.title}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '0.92rem',
              color: 'var(--bone)',
              opacity: 0.82,
              margin: '0 0 1.25rem 0',
              lineHeight: 1.55,
              maxWidth: '38ch',
            }}
          >
            {panel.line}
          </p>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 1.75rem 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {panel.points.map((pt) => (
              <li
                key={pt}
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '0.82rem',
                  color: 'var(--steel)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                }}
              >
                <span style={{ color: 'var(--red)', fontSize: '0.65rem' }}>■</span>
                {pt}
              </li>
            ))}
          </ul>

          <Link
            href={panel.cta.href}
            className="cta-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              border: '1px solid var(--bone)',
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '0.78rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--bone)',
              textDecoration: 'none',
              backgroundColor: 'transparent',
              transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
            }}
          >
            {panel.cta.label}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Desktop Expandable Panel ──────────────────────────────────────────────── */}
      <div
        id={`service-panel-${panel.id}`}
        role="tab"
        aria-selected={isOpen}
        aria-expanded={isOpen}
        aria-controls={`service-panel-content-${panel.id}`}
        tabIndex={0}
        onMouseEnter={onOpen}
        onFocus={onOpen}
        onKeyDown={handleKeyDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hidden md:flex relative h-[78svh] min-h-[560px] max-h-[820px] overflow-hidden outline-none"
        style={{
          flex: isOpen ? '3.5 1 0%' : '1 1 0%',
          backgroundColor: isOpen ? 'var(--charcoal)' : 'var(--ink-900)',
          borderRight: '1px solid rgba(35, 35, 38, 0.15)',
          borderTop: '1px solid rgba(35, 35, 38, 0.15)',
          borderBottom: '1px solid rgba(35, 35, 38, 0.15)',
          transition: reducedMotion
            ? 'none'
            : 'flex 0.65s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease',
          cursor: isOpen ? 'default' : 'pointer',
        }}
      >
        {/* Desktop panel background image with subtle parallax & scale */}
        {imgData && (
          <div
            style={{
              position: 'absolute',
              inset: '-5%',
              width: '110%',
              height: '110%',
              transform: reducedMotion
                ? 'none'
                : `translate(${mouseOffset.x}px, ${mouseOffset.y}px) scale(${isOpen ? 1.05 : 1})`,
              transition: reducedMotion
                ? 'none'
                : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
              zIndex: 0,
            }}
          >
            <Image
              src={imgData.filename}
              alt={imgData.alt}
              fill
              sizes={isOpen ? '60vw' : '20vw'}
              placeholder="blur"
              blurDataURL={imgData.blurDataURL}
              style={{
                objectFit: 'cover',
                objectPosition: `${imgData.focalPoint.x}% ${imgData.focalPoint.y}%`,
                opacity: isOpen ? 0.38 : 0.16,
                filter: 'grayscale(25%) contrast(1.18) brightness(0.9)',
                transition: 'opacity 0.6s ease',
              }}
            />
          </div>
        )}

        {/* Background scrim & multiply gradient */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: isOpen
              ? 'linear-gradient(to top, rgba(7, 7, 7, 0.97) 25%, rgba(12, 11, 10, 0.65) 60%, rgba(22, 22, 23, 0.35) 100%)'
              : 'linear-gradient(to top, rgba(7, 7, 7, 0.98) 0%, rgba(12, 11, 10, 0.85) 100%)',
            zIndex: 1,
            transition: 'background 0.5s ease',
          }}
        />

        {/* ── Collapsed State Display (Vertical Editorial Typography) ──────────────── */}
        {!isOpen && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '3rem 1.25rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.85rem',
                color: 'var(--red)',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              {panel.number}
            </span>

            <span
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--bone)',
                opacity: 0.68,
                whiteSpace: 'nowrap',
                transition: 'opacity 0.25s ease, color 0.25s ease',
              }}
            >
              {panel.title}
            </span>

            <div style={{ width: 1, height: '2.5rem', backgroundColor: 'var(--graphite-2)' }} />
          </div>
        )}

        {/* ── Expanded State Content ───────────────────────────────────────────────── */}
        {isOpen && (
          <div
            id={`service-panel-content-${panel.id}`}
            style={{
              position: 'relative',
              zIndex: 3,
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(2.5rem, 4vw, 4rem) clamp(2rem, 3.5vw, 3.5rem)',
            }}
          >
            {/* Header: Number + Accent Line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.9rem',
                  color: 'var(--red)',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                }}
              >
                {panel.number}
              </span>
              <div style={{ width: 28, height: 1, backgroundColor: 'var(--red)' }} />
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: 'clamp(3rem, 4.5vw, 4.5rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: 'var(--bone)',
                margin: '0 0 0.85rem 0',
                lineHeight: 0.95,
              }}
            >
              {panel.title}
            </h3>

            {/* Line / Subtitle */}
            <p
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
                color: 'var(--bone)',
                opacity: 0.85,
                margin: '0 0 1.5rem 0',
                lineHeight: 1.6,
                maxWidth: '42ch',
              }}
            >
              {panel.line}
            </p>

            {/* Bullet Points */}
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 2.25rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
              }}
            >
              {panel.points.map((pt) => (
                <li
                  key={pt}
                  style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '0.88rem',
                    color: 'var(--steel)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  <span style={{ color: 'var(--red)', fontSize: '0.65rem' }}>■</span>
                  {pt}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div>
              <Link
                href={panel.cta.href}
                className="cta-btn primary-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.9rem 2rem',
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
                {panel.cta.label}
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ServicePanel;
