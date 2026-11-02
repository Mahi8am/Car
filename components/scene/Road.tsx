// PLAN1-LOCKED: do not modify behavior
/**
 * components/scene/Road.tsx
 * ──────────────────────────
 * Deep matte asphalt road with two built-in red tyre tracks.
 *
 * Tracks are rendered directly in the fragment shader — this is the most
 * reliable approach because:
 *   - They're always in the camera frustum (no geometry culling)
 *   - They scroll correctly with the road UV offset
 *   - No blending mode complexity (tracks are just mixed into the road colour)
 *   - The Z-cutoff keeps marks only behind the car (positive worldZ = screen-bottom)
 *
 * Uniforms updated every frame by useFrame:
 *   uScrollOffset   — road UV scroll (from introState.roadScrollOffset)
 *   uCamZ           — camera world Z (for vignette)
 *   uCarWorldZ      — car's current world Z (track cutoff line)
 *   uTrackOpacity   — overall track visibility (0→1, introState.trackOpacity)
 *   uLeftX          — world X of left tyre contact centre
 *   uRightX         — world X of right tyre contact centre
 *   uTrackHW        — half-width of tyre contact in world units
 */

'use client';

import { useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { introState } from '@/lib/animation/introState';
import carConfig from '@/config/car.config';

/* ── GLSL ─────────────────────────────────────────────────────────────────── */

const VERT = /* glsl */ `
  varying vec2  vWorldXZ;   /* scrolled UV space (for road texture) */
  varying vec2  vRealXZ;    /* true world XZ (for track cutoff) */
  varying float vDist;

  uniform float uScrollOffset;
  uniform float uCamZ;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vRealXZ  = worldPos.xz;                         /* actual world position */
    vWorldXZ = vec2(worldPos.x, worldPos.z - uScrollOffset); /* scrolled for road texture */
    vDist    = length(worldPos.xz - vec2(0.0, uCamZ)) / 14.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  varying vec2  vWorldXZ;
  varying vec2  vRealXZ;
  varying float vDist;

  uniform float uTrackOpacity;
  uniform float uCarWorldZ;
  uniform float uLeftX;
  uniform float uRightX;
  uniform float uTrackHW;   /* tyre half-width in world units */

  float hash2(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 74.27);
    return fract(p.x * p.y);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash2(i),               hash2(i + vec2(1.0, 0.0)), u.x),
      mix(hash2(i + vec2(0.0,1.0)), hash2(i + vec2(1.0,1.0)), u.x),
      u.y
    );
  }

  float surfaceVariation(vec2 p) {
    float v = smoothNoise(p * 1.6) * 0.5;
    v      += smoothNoise(p * 3.5) * 0.25;
    v      += smoothNoise(p * 7.0) * 0.125;
    return v;
  }

  void main() {
    /* ── Base asphalt ───────────────────────────────────────────────────── */
    vec3 col = vec3(0.047, 0.043, 0.039);

    /* Smooth large-scale variation (barely perceptible) */
    float sv = surfaceVariation(vWorldXZ);
    col += vec3(sv) * 0.012;
    col.r += sv * 0.004;

    /* ── Tyre tracks ────────────────────────────────────────────────────── */
    /* Only render behind the car: real world Z > car world Z (screen bottom) */
    if (uTrackOpacity > 0.001 && vRealXZ.y > uCarWorldZ - 0.05) {

      /* Dark maroon — distinct from bright car-body red #E1251B.
         Reads as rubber/carbon scorched into asphalt. */
      vec3 trackBase = vec3(0.368, 0.024, 0.016); /* #5E0604 */

      /* ── Left / right strip masks ─────────────────────────────────────── */
      float dL  = abs(vRealXZ.x - uLeftX);
      float dR  = abs(vRealXZ.x - uRightX);

      /* Sharp centre-line, soft outer feather */
      float mL = 1.0 - smoothstep(uTrackHW * 0.45, uTrackHW, dL);
      float mR = 1.0 - smoothstep(uTrackHW * 0.45, uTrackHW, dR);
      float stripeMask = max(mL, mR);

      /* ── Chevron / herringbone tread pattern ──────────────────────────── */
      /* Along-track coordinate (local Y within the strip) */
      float tz = vRealXZ.y * 14.0;          /* repeat frequency (higher = finer) */
      /* Cross-track fraction for this strip */
      float txL = (vRealXZ.x - uLeftX)  / uTrackHW;   /* -1..+1 across left strip */
      float txR = (vRealXZ.x - uRightX) / uTrackHW;   /* -1..+1 across right strip */
      float tx  = (mL > mR) ? txL : txR;               /* which strip we're in */

      /* Two families of diagonal grooves creating V-shape (herringbone) */
      float groove1 = fract(tz + tx * 2.8);   /* one diagonal direction */
      float groove2 = fract(tz - tx * 2.8);   /* mirror diagonal */

      /* Groove lines: thin dark cuts */
      float g1 = smoothstep(0.88, 1.0, groove1) + smoothstep(0.88, 1.0, 1.0 - groove1);
      float g2 = smoothstep(0.88, 1.0, groove2) + smoothstep(0.88, 1.0, 1.0 - groove2);

      /* Block separator (cross-groove every half repeat) */
      float blockSep = smoothstep(0.90, 1.0, fract(tz * 0.5));

      float treadGroove = min(1.0, (g1 + g2) * 0.55 + blockSep * 0.35);

      /* Groove subtracts from track colour */
      vec3 trackCol = trackBase - vec3(treadGroove * 0.18);

      /* Depth fade: full brightness at car rear, fades toward entry */
      float depthZ   = (vRealXZ.y - uCarWorldZ) / 22.0;  /* 0 at car, 1 at entry */
      float depthFade = 1.0 - clamp(depthZ * 0.6, 0.0, 0.6);

      float trackAlpha = stripeMask * uTrackOpacity * depthFade;
      col = mix(col, trackCol, clamp(trackAlpha, 0.0, 1.0));
    }

    /* ── Vignette ───────────────────────────────────────────────────────── */
    float vig = smoothstep(0.45, 1.1, vDist);
    col = mix(col, vec3(0.018, 0.016, 0.014), vig * 0.75);

    col = clamp(col, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ── Component ───────────────────────────────────────────────────────────── */

export function Road() {
  // Derive tyre X positions from car config (same math as TrackRibbons)
  const carWidth    = carConfig.realWorldLengthM * 0.48; // ~1.9m MX-5
  const halfTrackW  = carConfig.halfTrackWidthRatio  * carWidth;
  const tyreHW      = carConfig.tyreContactWidthRatio * carWidth;

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uScrollOffset:  { value: 0 },
          uCamZ:          { value: 0 },
          uTrackOpacity:  { value: 0 },
          uCarWorldZ:     { value: 20 },  // starts off-screen (car below view)
          uLeftX:         { value: carConfig.carXOffset - halfTrackW },
          uRightX:        { value: carConfig.carXOffset + halfTrackW },
          uTrackHW:       { value: tyreHW },
        },
        side: THREE.FrontSide,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => () => mat.dispose(), [mat]);

  useFrame(() => {
    mat.uniforms.uScrollOffset.value = introState.roadScrollOffset;
    mat.uniforms.uCamZ.value         = -introState.cameraY;
    mat.uniforms.uTrackOpacity.value  = introState.trackOpacity;
    mat.uniforms.uCarWorldZ.value     = -introState.carY;  // worldZ = -screenY
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={mat}>
      <planeGeometry args={[80, 80, 8, 8]} />
    </mesh>
  );
}
