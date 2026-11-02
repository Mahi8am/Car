// PLAN1-LOCKED: do not modify behavior
/**
 * components/transition/shapes.ts
 * ─────────────────────────────────
 * Target composition definitions per layout mode.
 * These are the art-directed final shapes the tire tracks morph into.
 * All values are tunable here without touching the morph logic.
 *
 * Coordinates are in SVG viewBox space (0 0 100 100 units, scaled to viewport).
 */

import type { LayoutMode } from '@/lib/hooks/useViewportLayout';

export interface ShapeLayer {
  /** SVG path data or primitive descriptor (parsed in TrackMorphLayer). */
  type: 'circle' | 'rect' | 'path';
  /** CSS color token (e.g. 'var(--bone)'). */
  color: string;
  /** 0–1: layer order stagger delay as fraction of total transform duration. */
  delay: number;
  /** 0–1: this layer's fraction of the total transform duration. */
  duration: number;

  // For 'circle':
  cx?: number;
  cy?: number;
  r?: number;

  // For 'rect':
  x?: number;
  y?: number;
  width?: number;
  height?: number;

  // For 'path':
  d?: string;
}

export interface CompositionSpec {
  /** Background fill for the overall hero canvas. */
  background: string;
  /** Ordered layers (painted bottom to top). */
  layers: ShapeLayer[];
  /** Radius of the central "stage" circle. */
  stageRadius: number;
  /** Center of the stage circle (0–100 units). */
  stageCx: number;
  stageCy: number;
}

const DESKTOP_COMPOSITION: CompositionSpec = {
  background: 'var(--charcoal)',
  stageRadius: 28,
  stageCx: 50,
  stageCy: 50,
  layers: [
    // Large bone disc — left track expands into semicircle anchored low-left
    {
      type: 'circle',
      color: 'var(--bone)',
      cx: -10,
      cy: 115,
      r: 62,
      delay: 0.0,
      duration: 0.7,
    },
    // Large red quarter-disc — right track expands upper-right
    {
      type: 'circle',
      color: 'var(--red)',
      cx: 110,
      cy: -10,
      r: 55,
      delay: 0.18,
      duration: 0.7,
    },
    // Graphite fill — background negative space regions
    {
      type: 'rect',
      color: 'var(--graphite)',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      delay: 0.05,
      duration: 0.4,
    },
  ],
};

const PORTRAIT_COMPOSITION: CompositionSpec = {
  background: 'var(--charcoal)',
  stageRadius: 22,
  stageCx: 50,
  stageCy: 50,
  layers: [
    // Bone disc — top, large
    {
      type: 'circle',
      color: 'var(--bone)',
      cx: 50,
      cy: -15,
      r: 55,
      delay: 0.0,
      duration: 0.7,
    },
    // Red disc — bottom-right
    {
      type: 'circle',
      color: 'var(--red)',
      cx: 110,
      cy: 110,
      r: 48,
      delay: 0.18,
      duration: 0.7,
    },
    {
      type: 'rect',
      color: 'var(--graphite)',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      delay: 0.05,
      duration: 0.4,
    },
  ],
};

const TABLET_COMPOSITION: CompositionSpec = {
  ...DESKTOP_COMPOSITION,
  stageRadius: 26,
};

const LANDSCAPE_PHONE_COMPOSITION: CompositionSpec = {
  ...DESKTOP_COMPOSITION,
  stageRadius: 24,
  stageCx: 38,
};

export function getComposition(mode: LayoutMode): CompositionSpec {
  switch (mode) {
    case 'desktop':
      return DESKTOP_COMPOSITION;
    case 'tablet':
      return TABLET_COMPOSITION;
    case 'portrait':
      return PORTRAIT_COMPOSITION;
    case 'landscape-phone':
      return LANDSCAPE_PHONE_COMPOSITION;
  }
}
