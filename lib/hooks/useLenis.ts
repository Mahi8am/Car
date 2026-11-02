/**
 * lib/hooks/useLenis.ts
 * ──────────────────────
 * Initialises Lenis smooth scroll after the intro completes.
 * Lenis is only active when `enabled = true` (passed from page.tsx
 * when introState.introComplete becomes true).
 *
 * Exposes scrollToTarget() for consistent fixed-navbar offset smooth scrolling.
 */

'use client';

import { useEffect } from 'react';
import type Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let lenis: Lenis | null = null;
    let rafId: number;

    import('lenis').then(({ default: LenisClass }) => {
      lenis = new LenisClass({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      window.__lenis = lenis;

      function raf(time: number) {
        lenis!.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      if (typeof window !== 'undefined') {
        delete window.__lenis;
      }
    };
  }, [enabled]);
}

/**
 * Smoothly scrolls to a target selector or element with fixed-nav offset.
 */
export function scrollToTarget(target: string | HTMLElement, offset: number = -80) {
  if (typeof window === 'undefined') return;

  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset, duration: 1.2 });
    return;
  }

  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
