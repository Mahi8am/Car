// PLAN1-LOCKED: do not modify behavior
/**
 * lib/animation/timing.ts
 * ────────────────────────
 * Single source of truth for ALL animation durations and delays (in seconds).
 * Edit here to tune the entire intro without touching any scene modules.
 *
 * Total target: ≈ 11 s to interactive hero (desktop).
 */

export const TIMING = {
  // ── Scene 1 — Dark entrance ─────────────────────────────────────────────
  /** When the Skip button first appears. */
  skipAppearAt: 1.2,

  // ── Scene 2 — Car entry ─────────────────────────────────────────────────
  /** Car starts entering (from bottom edge). */
  carEntryStart: 0.6,
  /** Car reaches cruise position. */
  carCruiseAt: 2.8,
  /** Entry acceleration curve duration. */
  carEntryDuration: 2.2,

  // ── Scene 3 — Tire tracks begin ─────────────────────────────────────────
  /** Tracks start appearing (same as car entry). */
  tracksStartAt: 0.8,
  /** Duration for tracks to fully fade up (opacity ramp). */
  tracksFadeInDuration: 1.5,

  // ── Scene 4 — Text reveal ───────────────────────────────────────────────
  /** Text starts revealing. */
  textRevealAt: 2.8,
  /** Each line's stagger interval. */
  textLineStagger: 0.12,
  /** Text hold minimum (readable time). */
  textHoldDuration: 2.4,
  /** Text reveal animation duration per line. */
  textRevealLineDuration: 0.55,
  /** Description + CTA fade-in after headline. */
  textBodyDelay: 0.35,
  textBodyDuration: 0.5,

  // ── Scene 4 → 5 — Text exit ─────────────────────────────────────────────
  /** Text starts exiting. */
  textExitAt: 6.4,
  /** Text exit duration. */
  textExitDuration: 0.5,

  // ── Scene 5 — Car departure ─────────────────────────────────────────────
  /** Car starts accelerating for departure. */
  carDepartureAt: 6.8,
  /** Duration of departure acceleration to off-screen. */
  carDepartureDuration: 1.1,    // shorter = explosive. expo.in does the heavy lifting.
  /** Camera deceleration — how long after departure start until road stops. */
  cameraReleaseDuration: 1.0,

  // ── Scene 6 — Track transformation ─────────────────────────────────────
  /** Transformation begins (slightly before car fully exits). */
  transformAt: 8.0,
  /** Total morph animation duration — streamlined and crisp. */
  transformDuration: 1.0,
  /** Delay between each layered color pass. */
  transformLayerStagger: 0.15,
  /** Duration for tread detail → flat solid (WebGL dissolve). */
  treadDissolveDuration: 0.35,

  // ── Scene 7 — Resolved hero reveal ─────────────────────────────────────
  /** Resolved hero starts revealing — seamless and immediate. */
  heroRevealAt: 8.8,
  /** Nav + details stagger duration. */
  heroRevealDuration: 0.9,
  /** Nav appears first, then details stagger in. */
  heroNavDelay: 0.0,
  heroDetailsDelay: 0.3,

  // ── Skip / once-per-session ─────────────────────────────────────────────
  /** Duration of skip cross-dissolve. */
  skipDuration: 0.8,
  /** Duration of repeat-visit (once-per-session) reveal. */
  repeatVisitRevealDuration: 0.8,

  // ── Loading screen ──────────────────────────────────────────────────────
  /** Minimum loading screen display time (to avoid a flash). */
  loadingMinDuration: 0.6,
  /** Progress bar animation speed factor. */
  loadingProgressSpeed: 1.0,
} as const;

export type TimingConfig = typeof TIMING;
