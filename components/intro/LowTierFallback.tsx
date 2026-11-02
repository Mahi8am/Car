'use client';

/**
 * components/intro/LowTierFallback.tsx
 * ──────────────────────────────────────
 * 2D resolved-hero reveal for:
 *   - Low device tier (no WebGL)
 *   - prefers-reduced-motion
 *   - repeat visit (same session)
 *   - ?intro=skip
 *
 * Shows the resolved color-block composition (charcoal bg with red/bone shapes)
 * as a simple CSS layout, then fades in the navbar and hero details by snapping
 * introState.heroProgress to 1 and introState.introComplete to true.
 *
 * No Three.js, no GLB download, no GSAP timeline. Pure CSS + a short rAF ramp.
 */

import { useEffect } from 'react';
import { introState } from '@/lib/animation/introState';
import { useViewportLayout } from '@/lib/hooks/useViewportLayout';
import { getComposition } from '@/components/transition/shapes';

interface Props {
  /** Delay in ms before the hero snaps in (0 = instant, 600 = brief dark hold). */
  delayMs?: number;
}

export function LowTierFallback({ delayMs = 300 }: Props) {
  const layout = useViewportLayout();
  const composition = getComposition(layout.mode);

  useEffect(() => {
    const id = setTimeout(() => {
      // Ramp heroProgress 0→1 over ~600ms via rAF
      const startTime = performance.now();
      const duration  = 600;

      function tick(now: number) {
        const t = Math.min((now - startTime) / duration, 1);
        introState.heroProgress   = t;
        introState.transformProgress = t;   // ensures TrackMorphLayer doesn't block
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          introState.introComplete = true;
          introState.heroProgress  = 1;
        }
      }
      requestAnimationFrame(tick);
    }, delayMs);

    return () => clearTimeout(id);
  }, [delayMs]);

  return (
    <div
      aria-hidden="true"
      style={{
        position:   'absolute',
        inset:      0,
        zIndex:     0,
        background: composition.background,
        overflow:   'hidden',
      }}
    >
      {/* SVG canvas rendering exact composition shapes from shapes.ts */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        {composition.layers.map((layer, idx) => {
          if (layer.type === 'circle') {
            return (
              <circle
                key={idx}
                cx={layer.cx}
                cy={layer.cy}
                r={layer.r}
                fill={layer.color}
              />
            );
          }
          if (layer.type === 'rect') {
            return (
              <rect
                key={idx}
                x={layer.x}
                y={layer.y}
                width={layer.width}
                height={layer.height}
                fill={layer.color}
                opacity={0.3}
              />
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}
