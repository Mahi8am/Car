/**
 * components/hero/HeroClient.tsx
 * ────────────────────────────────
 * Client-only component that:
 *   1. Locks scroll while the intro is playing
 *   2. Activates Lenis smooth scroll once introState.introComplete = true
 *   3. Adds nav-link hover styles that can't go in globals.css (pseudo-class)
 *
 * Polls introState every 500ms — lightweight, no React state churn.
 */

'use client';

import { useEffect, useState } from 'react';
import { introState } from '@/lib/animation/introState';
import { useLenis } from '@/lib/hooks/useLenis';

export default function HeroClient() {
  const [introComplete, setIntroComplete] = useState(false);

  // Poll introState.introComplete (set by the master timeline at the very end)
  useEffect(() => {
    const id = setInterval(() => {
      if (introState.introComplete) {
        setIntroComplete(true);
        clearInterval(id);
      }
    }, 300);
    return () => clearInterval(id);
  }, []);

  // Lock scroll during intro
  useEffect(() => {
    if (!introComplete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [introComplete]);

  // Activate Lenis once intro is done
  useLenis(introComplete);

  return null;
}
