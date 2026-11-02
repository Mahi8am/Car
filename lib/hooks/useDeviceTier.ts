/**
 * lib/hooks/useDeviceTier.ts
 * ───────────────────────────
 * Classify the device into High / Medium / Low rendering tier.
 *
 * Tier decision (heuristics only — cheap, synchronous):
 *  High   → desktop, hardwareConcurrency ≥ 8, WebGL supported, no Save-Data
 *  Medium → capable phone/tablet, WebGL supported
 *  Low    → WebGL unavailable, Save-Data header, very weak device, or SSR
 *
 * The PerformanceMonitor in R3F can further downgrade Medium → Low
 * at runtime based on real FPS measurements.
 */

'use client';

import { useEffect, useState } from 'react';

export type DeviceTier = 'high' | 'medium' | 'low';

function detectTier(): DeviceTier {
  // SSR guard
  if (typeof window === 'undefined') return 'low';

  // Save-Data header
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return 'low';

  // WebGL support check
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return 'low';
  } catch {
    return 'low';
  }

  const cores = navigator.hardwareConcurrency ?? 2;
  const memory = nav.deviceMemory ?? 2; // in GB; undefined on non-Chrome
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const isSmallScreen = window.innerWidth < 768;

  if (cores >= 8 && memory >= 6 && !isCoarsePointer) return 'high';
  if (cores >= 4 && memory >= 3 && !isSmallScreen) return 'high';
  if (cores >= 2 && !isSmallScreen) return 'medium';
  if (isCoarsePointer && cores < 4) return 'low';

  return 'medium';
}

interface DeviceTierState {
  tier: DeviceTier;
  /** Call this to downgrade at runtime (e.g. from PerformanceMonitor). */
  downgrade: () => void;
}

export function useDeviceTier(): DeviceTierState {
  const [tier, setTier] = useState<DeviceTier>('high'); // optimistic until hydrated

  useEffect(() => {
    setTier(detectTier());
  }, []);

  const downgrade = () => {
    setTier((prev) => {
      if (prev === 'high') return 'medium';
      if (prev === 'medium') return 'low';
      return prev;
    });
  };

  return { tier, downgrade };
}
