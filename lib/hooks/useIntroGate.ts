/**
 * lib/hooks/useIntroGate.ts
 * ──────────────────────────
 * Controls whether the full intro plays, the brief repeat-visit reveal
 * fires, or the intro is skipped entirely.
 *
 * Rules:
 *  - Once-per-session: if the session has played the intro before,
 *    show only the brief resolved-hero reveal. No WebGL, no GLB download.
 *  - ?intro=replay  → force full intro regardless of session.
 *  - ?intro=skip    → jump straight to resolved hero.
 *  - prefers-reduced-motion → always skip.
 */

'use client';

import { useEffect, useState } from 'react';

export type IntroMode = 'full' | 'replay' | 'skip' | 'repeat';

const SESSION_KEY = 'gm_intro_played';

export function useIntroGate(reducedMotion: boolean): IntroMode {
  const [mode, setMode] = useState<IntroMode>('full');

  useEffect(() => {
    if (reducedMotion) {
      setMode('skip');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const override = params.get('intro');

    if (override === 'replay') {
      setMode('replay');
      return;
    }

    if (override === 'skip') {
      setMode('skip');
      return;
    }

    const played = sessionStorage.getItem(SESSION_KEY);
    if (played === '1') {
      setMode('repeat');
      return;
    }

    setMode('full');
  }, [reducedMotion]);

  return mode;
}

/** Call this when the full intro completes to record the session. */
export function markIntroDone() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // sessionStorage unavailable — ignore
  }
}
