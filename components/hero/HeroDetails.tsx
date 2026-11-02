/**
 * components/hero/HeroDetails.tsx
 * ─────────────────────────────────
 * Small details shown after the intro:
 *   - Vertical micro-label (rotated 90°, left side)
 *   - Animated scroll cue (thin vertical line, pulse animation)
 *
 * Revealed with introState.heroProgress (0→1) with a slight delay after Navbar.
 */

'use client';

import { useEffect, useRef } from 'react';
import { introState } from '@/lib/animation/introState';

export function HeroDetails() {
  const detailRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(true);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf: number;
    function tick() {
      if (inViewRef.current && detailRef.current) {
        // Stagger slightly after navbar (delay 0.3 within heroProgress)
        const p = Math.max(0, Math.min((introState.heroProgress - 0.25) / 0.75, 1));
        detailRef.current.style.opacity   = String(p);
        detailRef.current.style.transform = `translateY(${(1 - p) * 8}px)`;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={detailRef}
      className="hidden md:flex flex-col items-center gap-2 pointer-events-none"
      style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        opacity: 0,
      }}
      aria-hidden="true"
    >
      <span
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--charcoal)',
          opacity: 0.7,
        }}
      >
        SCROLL TO EXPLORE
      </span>

      {/* Short red animated scroll cue */}
      <div
        style={{
          width: 1.5,
          height: '2rem',
          background: 'rgba(35, 35, 38, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="scroll-cue-line"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'var(--red)',
          }}
        />
      </div>
    </div>
  );
}
