/**
 * lib/hooks/useReducedMotion.ts
 * ──────────────────────────────
 * Returns true if the user has requested reduced motion.
 * When true, the cinematic intro is skipped entirely and the
 * resolved hero is shown immediately with a simple opacity fade.
 */

'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
