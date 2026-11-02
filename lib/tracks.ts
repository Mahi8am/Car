// PLAN1-LOCKED: do not modify behavior
/**
 * lib/tracks.ts
 * ──────────────
 * SHARED pure function that generates the outline of a single tire track
 * ribbon. This same function feeds:
 *   1. The WebGL TrackRibbons (Three.js BufferGeometry)
 *   2. The SVG overlay paths in TrackMorphLayer
 *
 * The handoff at Scene 6 is pixel-identical because both consumers
 * call the same math. Do NOT duplicate this geometry in either consumer.
 */

export interface TrackPoint {
  /** Centre X of the ribbon at this sample. */
  cx: number;
  /** Centre Y of the ribbon at this sample. */
  cy: number;
  /** Half-width of the ribbon at this sample (may vary for worn edges). */
  halfWidth: number;
}

export interface TrackOutline {
  /** Left edge vertices (same length as right). */
  left: Array<{ x: number; y: number }>;
  /** Right edge vertices (same length as left). */
  right: Array<{ x: number; y: number }>;
}

/**
 * Generate the outline of one tire track ribbon.
 *
 * @param centreLine   Array of {cx, cy, halfWidth} defining the ribbon spine
 * @param edgeNoise    Amplitude of worn-edge irregularity (0 = perfectly straight)
 * @param seed         Deterministic seed for the edge noise (use track index: 0 or 1)
 * @returns            {left, right} edge vertex arrays
 *
 * NOTE: edge noise uses a deterministic pseudo-random so the WebGL and SVG
 * consumers produce identical outlines for the same inputs.
 */
export function buildTrackOutline(
  centreLine: TrackPoint[],
  edgeNoise = 0.06,
  seed = 0,
): TrackOutline {
  const left: Array<{ x: number; y: number }> = [];
  const right: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < centreLine.length; i++) {
    const { cx, cy, halfWidth } = centreLine[i];

    // Deterministic noise — LCG seeded per sample
    const n = lcg(seed * 1000 + i);
    const noiseL = (n * 2 - 1) * edgeNoise * halfWidth;
    const noiseR = (lcg(seed * 1000 + i + 500) * 2 - 1) * edgeNoise * halfWidth;

    left.push({ x: cx - halfWidth + noiseL, y: cy });
    right.push({ x: cx + halfWidth + noiseR, y: cy });
  }

  return { left, right };
}

/**
 * Build the centre-line samples for one track ribbon.
 *
 * NOTE: despite the Y naming, startY/endY and cy in the output represent
 * world-space Z (the axis along which the car travels). The caller maps
 * `outline.left[i].y` → THREE position Z. This is intentional for
 * compatibility with the SVG consumer which works in 2D screen-space.
 *
 * @param trackX    World X of the tyre centre line (left or right track)
 * @param startY    World Z where the track starts (entry point = +20)
 * @param endY      World Z where the track currently ends (current car world Z)
 * @param halfWidth Half-width of the ribbon in world units
 * @param samples   Sample count along the ribbon
 */
export function buildTrackCentreLine(
  trackX: number,
  startY: number,
  endY: number,
  halfWidth: number,
  samples = 200,
): TrackPoint[] {
  const points: TrackPoint[] = [];
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const cy = startY + (endY - startY) * t;
    points.push({ cx: trackX, cy, halfWidth });
  }
  return points;
}


/**
 * Convert a TrackOutline to an SVG path string (a closed loop).
 */
export function trackOutlineToSVGPath(outline: TrackOutline): string {
  if (!outline.left.length) return '';

  const { left, right } = outline;
  const parts: string[] = [];

  // Left edge — top to bottom
  parts.push(`M ${left[0].x} ${left[0].y}`);
  for (let i = 1; i < left.length; i++) {
    parts.push(`L ${left[i].x} ${left[i].y}`);
  }

  // Right edge — bottom to top
  for (let i = right.length - 1; i >= 0; i--) {
    parts.push(`L ${right[i].x} ${right[i].y}`);
  }

  parts.push('Z');
  return parts.join(' ');
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Linear congruential generator — deterministic, cheap pseudo-random.
 * Returns a float in [0, 1).
 */
function lcg(seed: number): number {
  const a = 1664525;
  const c = 1013904223;
  const m = 2 ** 32;
  return ((a * Math.floor(seed) + c) % m) / m;
}
