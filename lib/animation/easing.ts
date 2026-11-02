// PLAN1-LOCKED: do not modify behavior
/**
 * lib/animation/easing.ts
 * ────────────────────────
 * Custom easing functions and GSAP ease strings used across the intro.
 * Centralised so timing tweaks don't scatter through scene modules.
 */

/** GSAP ease strings for each scene's character. */
export const EASE = {
  /** Car entry — gentle acceleration from stop. */
  carEntry: 'power2.inOut',
  /** Car departure — builds like an engine, then INSTANT acceleration. */
  carDeparture: 'expo.in',
  /** Camera release — decelerates to a stop, slight overshoot. */
  cameraRelease: 'power2.out',
  /** Text line reveal — slide up and settle. */
  textReveal: 'power3.out',
  /** Text exit — quick mask-out. */
  textExit: 'power2.in',
  /** Shape expansion — long ease-out settle, no bounce. */
  shapeExpand: 'power2.out',
  /** Hero nav/details reveal — restrained fade. */
  heroReveal: 'power1.inOut',
  /** Track opacity ramp. */
  trackFadeIn: 'power1.out',
  /** Loading progress bar. */
  loadingProgress: 'power1.inOut',
  /** Generic smooth. */
  smooth: 'power2.inOut',
} as const;

/**
 * Micro-sway curve — a sine-like oscillation for the car's subtle yaw.
 * Pure function of time, so it is fully deterministic and scrubbable.
 *
 * @param t  Current time in seconds
 * @returns  Yaw offset in radians (magnitude < 0.007)
 */
export function microSwayYaw(t: number): number {
  return Math.sin(t * 0.8) * 0.005 + Math.sin(t * 1.3) * 0.002;
}

/**
 * Body settle roll — tiny roll that eases in as the car accelerates.
 *
 * @param entryProgress  0–1: car entry normalised progress
 * @returns  Roll offset in radians (magnitude < 0.004)
 */
export function bodySettleRoll(entryProgress: number): number {
  // Peaks at ~30% entry then settles
  const x = Math.min(entryProgress * 3.3, 1);
  return Math.sin(x * Math.PI) * 0.004;
}
