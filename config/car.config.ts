/**
 * car.config.ts
 * ─────────────
 * Single source of truth for everything model-specific.
 * Swap the car by editing this file only; no other file should
 * contain hard-coded model values or magic numbers.
 *
 * All ratios are 0–1 fractions of the auto-normalised bounding box.
 * The loader reads these at runtime and computes world-space positions.
 */

const carConfig = {
  // ── Asset ──────────────────────────────────────────────────────────────────
  /** Path inside /public — car-raw.glb: full-quality, no silver artifact confirmed by user. Clearcoat zeroed at runtime in CarModel.tsx. */
  modelPath: '/models/car-raw.glb',

  // ── Normalisation ──────────────────────────────────────────────────────────
  /** Real-world length of the car in metres (used to set world scale). */
  realWorldLengthM: 3.95,

  /**
   * Euler rotation in degrees applied after auto-normalisation.
   * Goal: car nose points toward −Z (screen-up in the top-down view).
   *
   * 1998 Mazda MX-5 NB: long axis is X in the GLB.
   * +90° around Y → long axis becomes Z, nose → −Z (screen up). [✓ confirmed]
   */
  rotationFixupDeg: [0, 90, 0] as [number, number, number],

  // ── Paint material ─────────────────────────────────────────────────────────
  /**
   * Partial name match for the mesh/material that should receive the accent
   * colour. Case-insensitive substring match.
   */
  /** Exact material name from the GLB (verified via gltf-transform inspect). */
  paintMaterialName: 'carpaint',
  /** Default paint colour — overridden by the CSS accent token at runtime. */
  paintColorHex: '#E1251B',

  // ── Tyre contact points ────────────────────────────────────────────────────
  /**
   * Rear axle longitudinal position as a fraction of car length.
   * 0 = nose, 1 = tail. Typically 0.65–0.80 for most cars.
   */
  rearAxleRatio: 0.72,

  /**
   * Half-track width (centre-line → tyre centre) as a fraction of car width.
   * Typically 0.38–0.45.
   */
  halfTrackWidthRatio: 0.42,

  /**
   * Tyre contact width as a fraction of car width.
   * Drives the WebGL ribbon width and the SVG track width.
   */
  tyreContactWidthRatio: 0.085,

  // ── Shadow ─────────────────────────────────────────────────────────────────
  /** Shadow map size — overridden per device tier. */
  shadowMapSize: 2048,
  /** Shadow camera near/far in world units. */
  shadowNear: 0.1,
  shadowFar: 30,
  /** Shadow camera frustum half-size. */
  shadowFrustumHalf: 5,
  /** Shadow darkness (0 = no shadow, 1 = full black). */
  shadowOpacity: 0.55,

  // ── Camera ─────────────────────────────────────────────────────────────────
  /** Vertical FOV in degrees — keep narrow for top-down editorial look. */
  cameraFov: 26,
  /** Camera height above the ground plane in world units.
   *  At h=20, FOV=26°: visible height = 2*20*tan(13°) ≈ 9.24m → car fraction ≈ 3.95/9.24 ≈ 42.7% ✓ */
  cameraHeight: 20,

  // ── Car sizing on screen ───────────────────────────────────────────────────
  /** Car length as a fraction of viewport height on desktop. */
  carLengthFractionDesktop: 0.40,
  /** Car length as a fraction of viewport height on portrait mobile. */
  carLengthFractionPortrait: 0.28,

  // ── Layout offset ──────────────────────────────────────────────────────────
  /**
   * Car world-X offset (metres). Negative = screen-left.
   * At FOV=26°, h=20: screen half-width = tan(13°)×20 ≈ 4.62m.
   * -2.2m puts car centre at 26% from left → text lives in right 55%+.
   */
  carXOffset: -2.2,
} as const;

export type CarConfig = typeof carConfig;
export default carConfig;
