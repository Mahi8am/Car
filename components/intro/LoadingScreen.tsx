/**
 * components/intro/LoadingScreen.tsx
 * ────────────────────────────────────
 * The first thing the user sees while assets are loading.
 * Design: near-black full viewport, logo centred, thin red progress line at
 * the bottom. Hands off to Scene 1 (dark entrance) seamlessly — no flash.
 *
 * For M1 this renders as a full static page so the owner can verify
 * font loading, colors, and logo appearance.
 * The component will be made dynamic (progress-driven) in M2.
 */

'use client';

import Image from 'next/image';

interface LoadingScreenProps {
  /** 0–1 progress. Drives the red line width. */
  progress?: number;
  /** True once loading is complete — triggers fade-out. */
  complete?: boolean;
}

export default function LoadingScreen({ progress = 0.15, complete = false }: LoadingScreenProps) {
  return (
    <div
      className="loading-screen"
      aria-label="Loading"
      aria-live="polite"
      role="status"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 9999,
        background: 'var(--ink-950)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: complete ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: complete ? 'none' : 'auto',
      }}
    >
      {/* Grain overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px',
          opacity: 0.035,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {/*
          logo-white.png: all visible pixels set to --bone (#EDE7DC), transparent bg.
          Use this on dark backgrounds. Use /brand/logo.png (original) on light backgrounds.
        */}
        <Image
          src="/brand/logo-white.png"
          alt="Garir Mela"
          width={143}
          height={80}
          priority
          style={{
            opacity: 0.9,
            width: 'clamp(90px, 12vw, 143px)',
            height: 'auto',
          }}
        />
      </div>

      {/* Progress line — thin red bar at the very bottom */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1.5px',
          background: 'var(--graphite-2)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'var(--red)',
            width: `${Math.min(progress * 100, 100)}%`,
            transition: 'width 0.3s ease',
            transformOrigin: 'left',
          }}
        />
      </div>

      {/* Micro label */}
      <p
        className="micro-label"
        style={{
          position: 'absolute',
          bottom: '2rem',
          color: 'var(--muted)',
          opacity: 0.7,
          letterSpacing: '0.2em',
        }}
      >
        Premium Automotive Marketplace
      </p>
    </div>
  );
}
