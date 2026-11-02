/**
 * components/intro/SkipButton.tsx
 * ─────────────────────────────────
 * Appears ~1.2 s into the intro, keyboard accessible (first focusable element).
 * On click/Enter: cross-dissolves to the resolved hero (via skipIntro callback).
 *
 * Design:
 *   - Monospace micro-label with a subtle animated underline
 *   - Positioned fixed top-right, appears with a gentle fade
 *   - Does NOT appear during reduced-motion (IntroSequence already returns null)
 */

'use client';

import { useEffect, useState } from 'react';
import { TIMING } from '@/lib/animation/timing';

interface SkipButtonProps {
  onSkip: () => void;
}

export function SkipButton({ onSkip }: SkipButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), TIMING.skipAppearAt * 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <button
      id="skip-intro-btn"
      aria-label="Skip intro"
      onClick={onSkip}
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.75rem',
        zIndex: 99999,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem 0',
        // Fade in
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-4px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        pointerEvents: visible ? 'auto' : 'none',
        // Typography
        fontFamily: 'var(--font-manrope), ui-sans-serif',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--steel)',
        lineHeight: 1,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4em',
          borderBottom: '1px solid transparent',
          paddingBottom: '2px',
          // Underline appears on hover via CSS class — avoid style props for pseudo-states
        }}
        className="skip-inner"
      >
        Skip
        {/* Tiny right arrow */}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </button>
  );
}
