// PLAN1-LOCKED: do not modify behavior
/**
 * components/intro/IntroText.tsx
 * ────────────────────────────────
 * Scene 4 — Text introduction.
 *
 * Layout (desktop): absolute right side, vertically centred, left edge at ≈ 60% hero width.
 * Layout (portrait): absolute bottom strip, below the car.
 *
 * Content (from Plan1 §4 Scene 4):
 *   EYEBROW:   PREMIUM AUTOMOTIVE MARKETPLACE
 *   HEADLINE:  YOUR NEXT DRIVE / STARTS HERE·  (· = red full stop)
 *   BODY:      "Discover exceptional vehicles..."
 *   CTA:       [ EXPLORE COLLECTION → ]
 *
 * Reveal: introState.textProgress (0→1) drives opacity + translateY per line.
 * Exit:   same textProgress reversed (1→0) in the timeline exit tween.
 *
 * The reveal is implemented with vanilla CSS transforms — no SplitText dependency.
 * Each line has an overflow:hidden wrapper (mask) and an inner element that
 * rises from 100% translateY to 0 as textProgress increases.
 *
 * GSAP SplitText would add ≈12 KB and complexity; this approach is equivalent
 * for a 4-line staggered reveal. Documented in DECISIONS.md.
 */

'use client';

import { useRef, useEffect } from 'react';
import { introState } from '@/lib/animation/introState';
import { useViewportLayout } from '@/lib/hooks/useViewportLayout';
import type { ViewportLayout } from '@/lib/hooks/useViewportLayout';

/* ── Line reveal helper ──────────────────────────────────────────────────── */

interface MaskedLineProps {
  children: React.ReactNode;
  delay: number;       // 0–1 offset within textProgress
  style?: React.CSSProperties;
  innerRef: React.RefObject<HTMLDivElement | null>;
}

function MaskedLine({ children, style, innerRef }: MaskedLineProps) {
  return (
    <div style={{ overflow: 'hidden', ...style }}>
      <div ref={innerRef} style={{ willChange: 'transform, opacity' }}>
        {children}
      </div>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */

function getPositionStyle(layout: ViewportLayout): React.CSSProperties {
  const isPortrait = layout.mode === 'portrait';
  if (isPortrait) {
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'min(90vw, 420px)',
      zIndex: 5000,
      textAlign: 'center',
      alignItems: 'center',
      padding: 'clamp(1.25rem, 4vw, 1.75rem) clamp(1rem, 3.5vw, 1.5rem)',
      backgroundColor: 'rgba(12, 11, 10, 0.48)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: 'none',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
      borderRadius: '4px',
      opacity: 0,
      visibility: 'hidden',
    };
  }
  return {
    position: 'absolute',
    top: '50%',
    left: '58%',
    right: '4vw',
    transform: 'translateY(-50%)',
    zIndex: 5000,
    maxWidth: 'min(580px, 38vw)',
    backgroundColor: 'transparent',
  };
}

export function IntroText() {
  const layout = useViewportLayout();
  const isPortrait = layout.mode === 'portrait';

  // Refs for animated elements and the outer container box
  const containerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const line1Ref     = useRef<HTMLDivElement>(null);
  const line2Ref     = useRef<HTMLDivElement>(null);
  const bodyRef      = useRef<HTMLDivElement>(null);
  const ruleRef      = useRef<HTMLDivElement>(null);

  // Stagger offsets — each line starts revealing at this textProgress value
  const STAGGER = [0, 0.15, 0.28, 0.50] as const;

  useEffect(() => {
    let raf: number;

    function tick() {
      const p = introState.textProgress; // 0→1→0

      // On mobile, the opaque background box appears and disappears synchronously with text
      if (containerRef.current) {
        if (isPortrait) {
          if (p > 0.005) {
            const boxOpacity = Math.max(0, Math.min(p / 0.25, 1));
            containerRef.current.style.visibility = 'visible';
            containerRef.current.style.opacity = String(boxOpacity);
            containerRef.current.style.transform = `translate(-50%, -50%) scale(${0.96 + 0.04 * boxOpacity})`;
          } else {
            containerRef.current.style.visibility = 'hidden';
            containerRef.current.style.opacity = '0';
          }
        } else {
          containerRef.current.style.visibility = 'visible';
          containerRef.current.style.opacity = '1';
          containerRef.current.style.transform = 'translateY(-50%)';
        }
      }

      // Per-line progress — each line has its own 0→1 sub-range
      function lineP(start: number, duration = 0.3) {
        return Math.max(0, Math.min((p - start) / duration, 1));
      }

      const ep  = lineP(STAGGER[0], 0.25);
      const l1p = lineP(STAGGER[1], 0.28);
      const l2p = lineP(STAGGER[2], 0.28);
      const bp  = lineP(STAGGER[3], 0.28);

      function apply(ref: React.RefObject<HTMLDivElement | null>, progress: number, yPx = 22) {
        if (!ref.current) return;
        const y = (1 - progress) * yPx;
        const o = progress;
        ref.current.style.transform = `translateY(${y}px)`;
        ref.current.style.opacity   = String(o);
      }

      apply(eyebrowRef,  ep,  14);
      apply(ruleRef,     ep,  0);
      apply(line1Ref,    l1p, 28);
      apply(line2Ref,    l2p, 28);
      apply(bodyRef,     bp,  18);

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPortrait]);

  const positionStyle = getPositionStyle(layout);

  return (
    <div
      ref={containerRef}
      aria-live="polite"
      style={{
        ...positionStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isPortrait ? 'center' : 'flex-start',
        textAlign: isPortrait ? 'center' : 'left',
        gap: isPortrait ? '0.65rem' : '0.75rem',
      }}
    >
      {/* Thin vertical rule — left anchor (desktop only) */}
      {!isPortrait && (
        <div
          ref={ruleRef}
          style={{
            position: 'absolute',
            left: '-1.5rem',
            top: 0,
            bottom: 0,
            width: 1,
            background: 'var(--red)',
            opacity: 0,
            willChange: 'opacity',
          }}
          aria-hidden="true"
        />
      )}

      {/* Eyebrow */}
      <MaskedLine delay={0} innerRef={eyebrowRef}>
        <p
          style={{
            fontFamily: 'var(--font-manrope), ui-sans-serif',
            fontSize: isPortrait ? 12 : 11,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            margin: 0,
            textShadow: isPortrait
              ? '0 2px 4px #000000, 0 4px 14px rgba(0,0,0,0.95)'
              : 'none',
          }}
        >
          Premium Automotive <span style={{ color: 'var(--red)', fontWeight: 800 }}>Marketplace</span>
        </p>
      </MaskedLine>

      {/* Headline line 1 */}
      <MaskedLine delay={0.15} innerRef={line1Ref} style={{ lineHeight: 0.9 }}>
        <h1
          style={{
            fontFamily: 'var(--font-barlow-condensed), ui-sans-serif',
            fontSize: isPortrait ? 'clamp(2.5rem, 9.5vw, 4rem)' : 'clamp(2.8rem, 5.5vw, 5.5rem)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: '#ffffff',
            margin: 0,
            lineHeight: 0.9,
            whiteSpace: 'nowrap',
            textShadow: isPortrait
              ? '0 2px 4px #000000, 0 4px 16px rgba(0,0,0,0.95), 0 0 24px #000000'
              : 'none',
          }}
        >
          Your Next <span style={{ color: 'var(--red)' }}>Drive</span>
        </h1>
      </MaskedLine>

      {/* Headline line 2 */}
      <MaskedLine delay={0.28} innerRef={line2Ref} style={{ lineHeight: 0.9 }}>
        <div
          aria-hidden="true"  /* h1 is line 1; this completes the visual headline */
          style={{
            fontFamily: 'var(--font-barlow-condensed), ui-sans-serif',
            fontSize: isPortrait ? 'clamp(2.5rem, 9.5vw, 4rem)' : 'clamp(2.8rem, 5.5vw, 5.5rem)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: '#ffffff',
            margin: 0,
            lineHeight: 0.9,
            textShadow: isPortrait
              ? '0 2px 4px #000000, 0 4px 16px rgba(0,0,0,0.95), 0 0 24px #000000'
              : 'none',
          }}
        >
          Starts <span style={{ color: 'var(--red)' }}>Here</span><span style={{ color: 'var(--red)' }}>.</span>
        </div>
      </MaskedLine>

      {/* Body */}
      <MaskedLine delay={0.5} innerRef={bodyRef}>
        <p
          style={{
            fontFamily: 'var(--font-manrope), ui-sans-serif',
            fontSize: isPortrait ? 14 : 16,
            fontWeight: 500,
            color: '#ffffff',
            margin: '0.5rem 0 0',
            maxWidth: isPortrait ? '34ch' : '32ch',
            lineHeight: 1.55,
            textAlign: isPortrait ? 'center' : 'left',
            textShadow: isPortrait
              ? '0 1px 3px #000000, 0 3px 12px rgba(0,0,0,0.95), 0 0 16px #000000'
              : 'none',
          }}
        >
          Discover <span style={{ color: 'var(--red)', fontWeight: 700 }}>exceptional</span> vehicles. Find your next car,
          sell your own, or experience <span style={{ color: 'var(--red)', fontWeight: 700 }}>verified automotive excellence</span> across Bangladesh.
        </p>
      </MaskedLine>
    </div>
  );
}
