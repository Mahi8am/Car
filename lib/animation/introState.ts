/**
 * lib/animation/introState.ts
 * ────────────────────────────
 * Shared mutable state object written by the GSAP master timeline
 * and read inside R3F useFrame via refs.
 *
 * IMPORTANT: This is a plain mutable object — NOT React state.
 * Reads happen inside useFrame; no setState calls allowed here.
 * Every field is a pure function of the master timeline's current time t.
 */

export interface IntroState {
  // ── Master time ────────────────────────────────────────────────────────────
  /** Master timeline position in seconds. */
  t: number;

  // ── Car ────────────────────────────────────────────────────────────────────
  /** Car position along the Y axis (world units; 0 = center, negative = below screen). */
  carY: number;
  /** Car horizontal world position. */
  carX: number;
  /** Micro-sway yaw angle in radians. */
  carYaw: number;
  /** Body roll angle in radians (settle effect). */
  carRoll: number;
  /** 0–1: how much the car is visible (for fade-free departure, stays 1). */
  carVisible: boolean;

  // ── Camera ─────────────────────────────────────────────────────────────────
  /** Camera Y world position (follows car, then decelerates to stop). */
  cameraY: number;
  /** Road scroll offset in world units (derived from cameraY). */
  roadScrollOffset: number;

  // ── Tracks ─────────────────────────────────────────────────────────────────
  /** Maximum drawn length of each track ribbon (world units). Grows as car moves. */
  trackDrawLength: number;
  /** Track opacity multiplier (0→1 during fade-in). */
  trackOpacity: number;
  /** 0–1: dissolve tread detail to flat solid (for WebGL→SVG handoff). */
  treadDissolve: number;

  // ── Text ───────────────────────────────────────────────────────────────────
  /** 0 = hidden, 1 = fully revealed, then back toward 0 on exit. */
  textProgress: number;

  // ── Scene phase ────────────────────────────────────────────────────────────
  /**
   * Discrete scene index:
   * 0 = entrance, 1 = carEntry, 2 = cruise, 3 = textReveal,
   * 4 = textHold, 5 = textExit, 6 = departure, 7 = transform, 8 = hero
   */
  scene: number;

  // ── Transform / SVG ────────────────────────────────────────────────────────
  /** 0–1: how far the track→shape transformation has progressed. */
  transformProgress: number;

  // ── Resolved hero ──────────────────────────────────────────────────────────
  /** 0–1: hero overlay (nav, details) reveal progress. */
  heroProgress: number;

  // ── Lifecycle flags ────────────────────────────────────────────────────────
  /** True once the intro is fully done and Lenis should activate. */
  introComplete: boolean;
  /** True when WebGL canvas should be disposed. */
  disposeWebGL: boolean;
  /** True when the 3D scene should switch to side-view hero camera. */
  heroMode: boolean;
  /** Camera orbit angle for the hero side-view (radians, 0 = right side of car). */
  heroCameraAngle: number;
}

/** Mutable singleton — mutated by GSAP timeline ticks, read by R3F. */
export const introState: IntroState = {
  t: 0,
  carY: -20,          // below screen; screen-Y convention: −=below, +=above
  carX: 0,
  carYaw: 0,
  carRoll: 0,
  carVisible: true,   // car is "present" from start; only position is below screen
  cameraY: 0,              // fixed at screen centre; car enters from below
  roadScrollOffset: 0,
  trackDrawLength: 0,
  trackOpacity: 0,
  treadDissolve: 0,
  textProgress: 0,
  scene: 0,
  transformProgress: 0,
  heroProgress: 0,
  introComplete: false,
  disposeWebGL: false,
  heroMode: false,
  heroCameraAngle: 0,
};
