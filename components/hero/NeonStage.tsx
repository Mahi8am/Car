/**
 * components/hero/NeonStage.tsx
 * ─────────────────────────────
 * Hero Phase 2 Central Neon Stage:
 *   - Circular stage masked to circle() with edge vignette
 *   - Neon ring with crisp stroke and glow falloff
 *   - Radial glow behind the stage (pure CSS radial gradient, no expensive blur filters)
 *   - Ignition choreography: neon stroke draw + stepped photo flickers
 *   - Idle breathing animation (5.5s cycle), paused when off-screen or under reduced motion
 *   - 100% CSS responsive sizing and vector SVG viewBox, guaranteeing zero SSR hydration mismatch
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { introState } from '@/lib/animation/introState';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { imageManifest } from '@/content/images';

export function NeonStage() {
  const reducedMotion = useReducedMotion();
  const heroImage = imageManifest['hero-car'];

  const [ignited, setIgnited] = useState(false);
  const [flickerOpacity, setFlickerOpacity] = useState(0);
  const [inView, setInView] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Pause breathing animation when scrolled off-screen
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Ignition sequence driven by heroProgress or immediate in fallback
  useEffect(() => {
    if (reducedMotion || introState.introComplete) {
      setIgnited(true);
      setFlickerOpacity(1);
      return;
    }

    let raf: number;
    let ignitionStarted = false;

    function checkProgress() {
      const p = introState.heroProgress;

      if (p >= 0.7 && !ignitionStarted) {
        ignitionStarted = true;
        setIgnited(true);

        // Hard flickers: 2 stepped pulses before full ignition
        const timeline = [
          { time: 100, val: 0.75 },
          { time: 200, val: 0.15 },
          { time: 320, val: 0.90 },
          { time: 420, val: 0.50 },
          { time: 540, val: 1.00 },
        ];

        timeline.forEach(({ time, val }) => {
          setTimeout(() => setFlickerOpacity(val), time);
        });
      }

      if (!introState.introComplete) {
        raf = requestAnimationFrame(checkProgress);
      }
    }

    raf = requestAnimationFrame(checkProgress);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative aspect-square
        w-[clamp(260px,72vw,340px)]
        sm:w-[clamp(320px,46vw,420px)]
        md:w-[clamp(380px,38vw,480px)]
        lg:w-[clamp(440px,32vw,530px)]
        [@media(max-height:500px)_and_(orientation:landscape)]:w-[clamp(220px,56vh,270px)]"
      style={{
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {/* 1. Pre-baked radial glow behind stage circle (does not muddy bone disc) */}
      <div
        style={{
          position: 'absolute',
          inset: '-26%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(225, 37, 27, 0.42) 0%, rgba(225, 37, 27, 0.16) 45%, rgba(7, 7, 7, 0) 70%)',
          opacity: ignited ? (inView && !reducedMotion ? undefined : 0.9) : 0,
          animation:
            ignited && inView && !reducedMotion ? 'neonBreathing 5.5s ease-in-out infinite' : 'none',
          transition: 'opacity 0.6s ease-out',
          zIndex: 1,
        }}
      />

      {/* 2. Central Masked Stage Circle with Edge Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: 'var(--ink-950)',
          clipPath: 'circle(50% at 50% 50%)',
          zIndex: 2,
          opacity: ignited ? 1 : flickerOpacity,
          transition: 'opacity 0.15s ease',
        }}
      >
        {/* Car Image with Stepped Flicker Entrance */}
        {heroImage && (
          <Image
            src={heroImage.filename}
            alt={heroImage.alt}
            fill
            priority
            sizes="(max-width: 768px) 80vw, 50vw"
            placeholder="blur"
            blurDataURL={heroImage.blurDataURL}
            style={{
              objectFit: 'cover',
              objectPosition: `${heroImage.focalPoint.x}% ${heroImage.focalPoint.y}%`,
              opacity: flickerOpacity,
              filter: 'contrast(1.18) saturate(1.1)',
              transition: 'opacity 0.08s ease-out',
            }}
          />
        )}

        {/* Circular Edge Vignette (melts into near-black stage fill) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(7, 7, 7, 0) 55%, rgba(7, 7, 7, 0.6) 82%, rgba(7, 7, 7, 0.98) 98%)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
      </div>

      {/* 3. Outer Steel Base Ring */}
      <div
        style={{
          position: 'absolute',
          inset: -3,
          borderRadius: '50%',
          border: '1px solid var(--graphite-2)',
          opacity: ignited ? 0.65 : 0,
          transition: 'opacity 0.6s ease',
          zIndex: 4,
        }}
      />

      {/* 4. Crimson Neon Tube Ring with Crisp Stroke & SVG Dashdraw */}
      <svg
        style={{
          position: 'absolute',
          inset: -6,
          width: 'calc(100% + 12px)',
          height: 'calc(100% + 12px)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
        viewBox="0 0 100 100"
      >
        <circle
          cx={50}
          cy={50}
          r={48}
          fill="none"
          stroke="var(--red)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={301.6}
          strokeDashoffset={ignited ? 0 : 301.6}
          style={{
            transition: 'stroke-dashoffset 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'drop-shadow(0 0 6px rgba(225, 37, 27, 0.85)) drop-shadow(0 0 16px rgba(225, 37, 27, 0.45))',
          }}
        />
      </svg>
    </div>
  );
}

export default NeonStage;
