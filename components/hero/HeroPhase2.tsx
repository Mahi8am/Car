/**
 * components/hero/HeroPhase2.tsx
 * ──────────────────────────────
 * Hero Phase 2 — full-screen cinematic background image with overlaid editorial content.
 * - Background: cinematic car photo fills the entire viewport
 * - Gradient overlays for text legibility (dark bottom, slight left darkening)
 * - Headline, CTA buttons, and stats positioned over the image
 * - Zero hydration mismatch: 100% deterministic SSR/client markup
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { introState } from '@/lib/animation/introState';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIntroGate } from '@/lib/hooks/useIntroGate';

export function HeroPhase2() {
  const reducedMotion = useReducedMotion();
  const introMode = useIntroGate(reducedMotion);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      setMouseOffset({ x: nx * 18, y: ny * 18 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || introMode === 'skip' || introMode === 'repeat' || introState.introComplete) {
      if (containerRef.current) {
        containerRef.current.style.display = 'block';
        containerRef.current.style.visibility = 'visible';
        containerRef.current.style.opacity = '1';
      }
      return;
    }

    let raf: number;
    function checkProgress() {
      const p = introState.heroProgress;
      const isComplete = introState.introComplete;
      if (containerRef.current) {
        if (p > 0.001 || isComplete) {
          containerRef.current.style.display = 'block';
          containerRef.current.style.visibility = 'visible';
          containerRef.current.style.opacity = String(isComplete ? 1 : p);
        } else {
          containerRef.current.style.display = 'none';
          containerRef.current.style.visibility = 'hidden';
          containerRef.current.style.opacity = '0';
        }
      }
      if (!isComplete) {
        raf = requestAnimationFrame(checkProgress);
      }
    }

    raf = requestAnimationFrame(checkProgress);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, introMode]);

  return (
    <div
      ref={containerRef}
      id="hero-phase-2"
      aria-label="Garir Mela Hero Overview"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'hidden',
        display: 'none',
        visibility: 'hidden',
        opacity: 0,
      }}
    >
      {/* ── 0. Full-screen Cinematic Background with Mouse Parallax ───────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* The cinematic car photo with smooth mouse parallax */}
        <div
          style={{
            position: 'absolute',
            inset: '-5%',
            width: '110%',
            height: '110%',
            transform: reducedMotion
              ? 'none'
              : `translate(${mouseOffset.x}px, ${mouseOffset.y}px) scale(1.03)`,
            transition: reducedMotion
              ? 'none'
              : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <img
            src="/images/hero/hero-cinematic.jpg"
            alt=""
            aria-hidden="true"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              display: 'block',
            }}
          />
        </div>

        {/* Dark gradient overlay — bottom heavy for text legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(
                to top,
                rgba(7, 7, 7, 0.92) 0%,
                rgba(7, 7, 7, 0.65) 30%,
                rgba(7, 7, 7, 0.35) 55%,
                rgba(7, 7, 7, 0.18) 75%,
                rgba(7, 7, 7, 0.08) 100%
              )
            `,
            pointerEvents: 'none',
          }}
        />

        {/* Left gradient for headline legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(7,7,7,0.55) 0%, rgba(7,7,7,0.15) 45%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Subtle red accent stripe at bottom edge */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(to right, var(--red) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── 1. Content Layer ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 40,
          width: '100%',
          height: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingLeft: 'clamp(2.5rem, 6vw, 5.5rem)',
          paddingRight: 'clamp(2.5rem, 6vw, 5.5rem)',
          paddingBottom: 'clamp(3.5rem, 7vh, 5.5rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          pointerEvents: 'auto',
          boxSizing: 'border-box',
        }}
      >

        {/* ── Main Content: headline + CTAs stacked at bottom-left */}
        <div style={{ maxWidth: '680px' }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--red)',
              }}
            >
              BANGLADESH AUTOMOTIVE EXCHANGE
            </span>
            <div style={{ width: 32, height: 2, backgroundColor: 'var(--red)', flexShrink: 0 }} />
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-barlow-condensed), sans-serif',
              fontSize: 'clamp(3.75rem, 8vw, 7.5rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.025em',
              lineHeight: 0.9,
              color: '#ffffff',
              margin: '0 0 1.5rem 0',
              textShadow: '0 4px 32px rgba(0,0,0,0.65)',
            }}
          >
            FIND IT.<br />
            DRIVE IT.<br />
            <span style={{ color: 'var(--red)' }}>OWN IT.</span>
          </h1>

          {/* Supporting Copy */}
          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: 'clamp(0.95rem, 1.15vw, 1.1rem)',
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.65,
              maxWidth: '52ch',
              marginBottom: '2.25rem',
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}
          >
            The premier marketplace for verified cars across Bangladesh. Direct contact with certified dealers and private sellers — complete transparency, zero friction.
          </p>

          {/* CTAs with Bencho.dev Sweep and Hover Micro-Interactions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <Link
              href="/buy"
              className="bencho-sweep-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '1.05rem 2.4rem',
                backgroundColor: 'var(--red)',
                color: '#ffffff',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                border: '1.5px solid var(--red)',
                boxShadow: '0 4px 20px rgba(225,37,27,0.35)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = 'var(--red-deep)';
                el.style.borderColor = 'var(--red-deep)';
                el.style.boxShadow = '0 12px 32px -4px rgba(225,37,27,0.6)';
                const arrow = el.querySelector('.cta-arrow') as HTMLElement | null;
                if (arrow) arrow.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = 'var(--red)';
                el.style.borderColor = 'var(--red)';
                el.style.boxShadow = '0 4px 20px rgba(225,37,27,0.35)';
                const arrow = el.querySelector('.cta-arrow') as HTMLElement | null;
                if (arrow) arrow.style.transform = 'translateX(0)';
              }}
            >
              <span>BROWSE CARS</span>
              <span
                className="cta-arrow"
                style={{
                  fontSize: '1.15rem',
                  lineHeight: 1,
                  display: 'inline-block',
                  transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                →
              </span>
            </Link>

            <Link
              href="/sell"
              className="bencho-sweep-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '1.05rem 2.2rem',
                backgroundColor: 'rgba(7, 7, 7, 0.68)',
                color: '#ffffff',
                backdropFilter: 'blur(10px)',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'var(--red)';
                el.style.backgroundColor = 'rgba(7, 7, 7, 0.88)';
                el.style.boxShadow = '0 10px 28px -4px rgba(0,0,0,0.6)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(255,255,255,0.4)';
                el.style.backgroundColor = 'rgba(7, 7, 7, 0.68)';
                el.style.boxShadow = 'none';
              }}
            >
              <span>SELL YOUR CAR</span>
            </Link>
          </div>

          {/* Quick Metrics Strip */}
          <div
            style={{
              display: 'flex',
              gap: '2.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {[
              { value: '5,400+', label: 'Cars Listed' },
              { value: '64', label: 'Districts' },
              { value: '100%', label: 'Verified', red: true },
            ].map((stat) => (
              <div key={stat.label}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-barlow-condensed), sans-serif',
                    fontSize: 'clamp(1.65rem, 2.5vw, 2.1rem)',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: stat.red ? 'var(--red)' : '#ffffff',
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroPhase2;
