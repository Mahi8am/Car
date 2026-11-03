/**
 * lib/hooks/useViewportLayout.ts
 * ───────────────────────────────
 * Returns layout mode and derived position/size values.
 * All layout-sensitive values (car size, lane position, text placement)
 * should be read from this hook, NOT hard-coded in components.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';

export type LayoutMode = 'desktop' | 'tablet' | 'portrait' | 'landscape-phone';

export interface ViewportLayout {
  mode: LayoutMode;
  /** Viewport width in px. */
  vw: number;
  /** Viewport height in px. */
  vh: number;
  /** Car horizontal screen position (0 = left edge, 1 = right edge). */
  carScreenX: number;
  /** Car vertical screen position (0 = top, 1 = bottom). */
  carScreenY: number;
  /** Car length as a fraction of viewport height. */
  carLengthFraction: number;
  /** Whether text sits to the right of car (desktop/tablet) or below (portrait). */
  textRight: boolean;
  /** Left edge of text block as fraction of viewport width. */
  textLeftFraction: number;
}

const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
} as const;

function computeLayout(vw: number, vh: number): ViewportLayout {
  const isLandscapePhone = vw < BREAKPOINTS.desktop && vw > vh;
  const isPortrait = vw < BREAKPOINTS.tablet && !isLandscapePhone;
  const isTablet = vw >= BREAKPOINTS.tablet && vw < BREAKPOINTS.desktop;
  const isDesktop = vw >= BREAKPOINTS.desktop;

  let mode: LayoutMode;
  let carScreenX: number;
  let carScreenY: number;
  let carLengthFraction: number;
  let textRight: boolean;
  let textLeftFraction: number;

  if (isDesktop) {
    mode = 'desktop';
    carScreenX = 0.5;
    carScreenY = 0.5;
    carLengthFraction = 0.40;
    textRight = true;
    textLeftFraction = 0.60;
  } else if (isTablet) {
    mode = 'tablet';
    carScreenX = 0.5;
    carScreenY = 0.5;
    carLengthFraction = 0.35;
    textRight = true;
    textLeftFraction = 0.58;
  } else if (isPortrait) {
    mode = 'portrait';
    carScreenX = 0.5;
    carScreenY = 0.50;
    carLengthFraction = 0.32;
    textRight = false;
    textLeftFraction = 0.0;
  } else {
    // landscape-phone
    mode = 'landscape-phone';
    carScreenX = 0.38;
    carScreenY = 0.5;
    carLengthFraction = 0.32;
    textRight = true;
    textLeftFraction = 0.55;
  }

  return { mode, vw, vh, carScreenX, carScreenY, carLengthFraction, textRight, textLeftFraction };
}

export function useViewportLayout(): ViewportLayout {
  const [layout, setLayout] = useState<ViewportLayout>(() => {
    if (typeof window === 'undefined') {
      return computeLayout(1440, 900);
    }
    const hero = document.getElementById('hero');
    return computeLayout(
      hero ? hero.clientWidth : window.innerWidth,
      hero ? hero.clientHeight : window.innerHeight
    );
  });

  const handleResize = useCallback(() => {
    const hero = document.getElementById('hero');
    const w = hero ? hero.clientWidth : window.innerWidth;
    const h = hero ? hero.clientHeight : window.innerHeight;
    setLayout(computeLayout(w, h));
  }, []);

  useEffect(() => {
    handleResize();
    const hero = document.getElementById('hero');
    if (!hero) {
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    }
    const ro = new ResizeObserver(() => {
      handleResize();
    });
    ro.observe(hero);
    return () => ro.disconnect();
  }, [handleResize]);

  return layout;
}
