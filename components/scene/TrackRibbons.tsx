// PLAN1-LOCKED: do not modify behavior
/**
 * components/scene/TrackRibbons.tsx
 * ────────────────────────────────────
 * Renders two tire-track ribbons (left + right) that grow in real time as the
 * car moves. The geometry is rebuilt every frame via a BufferGeometry mutation.
 *
 * Architecture:
 *   - One PlaneGeometry-like BufferGeometry per ribbon (pre-allocated, mutated in-place)
 *   - Vertices are set each frame from buildTrackCentreLine() + buildTrackOutline()
 *   - drawRange is updated to reveal only the portion already laid by the car
 *   - A custom ShaderMaterial gives the ribbon its dark rubber texture + worn edges
 *   - trackOpacity from introState fades the ribbons in during Scene 3
 *   - treadDissolve dissolves the tread detail → flat silhouette for Scene 6→7 handoff
 *
 * Coordinate system:
 *   The car moves in world Z (carY in screen-space → worldZ = -carY).
 *   Track start = worldZ of car entry = -(-20) = +20
 *   Track end   = worldZ of car current position = -introState.carY
 *   We build in world XZ, Y = 0.01 (just above the road plane).
 *
 * Performance:
 *   MAX_SAMPLES vertices are allocated once. Only drawRange changes per frame —
 *   no GC pressure, no re-allocation. Target: < 0.1ms per frame.
 */

'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { introState } from '@/lib/animation/introState';
import { buildTrackCentreLine, buildTrackOutline } from '@/lib/tracks';
import carConfig from '@/config/car.config';

/* ── Shader ──────────────────────────────────────────────────────────────── */

const TRACK_VERT = /* glsl */ `
  varying vec2 vUV;
  varying float vEdge;   /* 0 = centre, 1 = edge */

  void main() {
    vUV  = uv;
    vEdge = abs(uv.x - 0.5) * 2.0;  /* 0 at centre, 1 at both edges */
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const TRACK_FRAG = /* glsl */ `
  uniform float uOpacity;
  uniform float uTreadDissolve;

  varying vec2  vUV;
  varying float vEdge;

  float trackHash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 74.27);
    return fract(p.x * p.y);
  }

  float trackNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(trackHash(i),               trackHash(i + vec2(1.0, 0.0)), u.x),
      mix(trackHash(i + vec2(0.0,1.0)), trackHash(i + vec2(1.0,1.0)), u.x),
      u.y
    );
  }

  void main() {
    /* Racing red base */
    vec3 col = vec3(0.882, 0.145, 0.106);

    /* Very faint tread groove impression (almost flat) */
    float treadU  = fract(vUV.y * 32.0);
    float groove  = smoothstep(0.0, 0.08, treadU) * smoothstep(0.45, 0.30, treadU);
    float grooveD = groove * 0.12 * (1.0 - uTreadDissolve);
    col -= vec3(grooveD * 0.6, grooveD * 0.08, grooveD * 0.06);

    /* Very subtle longitudinal micro-grain (road texture bleeding through) */
    float grain = trackNoise(vUV * vec2(3.0, 80.0)) * 0.018;
    col -= vec3(grain);

    /* Smooth edge fade — anti-aliased, no hard cuts */
    float edgeFade = 1.0 - smoothstep(0.72, 1.0, vEdge);

    /* Opacity: overall level times edge softness */
    float alpha = uOpacity * edgeFade;

    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

/* ── Constants ─────────────────────────────────────────────────────────────── */

/** Maximum number of samples along the track (2× for quad strip). */
const MAX_SAMPLES = 300;
/** Vertices per quad strip sample = 2 (left + right edge point). */
const VERTS_PER_SAMPLE = 2;
/** Total vertex count allocated. */
const MAX_VERTS = MAX_SAMPLES * VERTS_PER_SAMPLE;
/** Total index count (each segment = 2 triangles = 6 indices). */
const MAX_INDICES = (MAX_SAMPLES - 1) * 6;

/** World Y of the track plane — flush against road surface (painted-on look). */
const TRACK_Y = 0.004;
/** World Z where the car entered (screen-bottom, introState.carY = -20 → worldZ = +20). */
const TRACK_START_WORLD_Z = 20;

/* ── Geometry builder ─────────────────────────────────────────────────────── */

/**
 * Build a pre-allocated BufferGeometry for one ribbon.
 * Positions, normals, and UVs are filled once; only position + drawRange mutate.
 */
function buildRibbonGeometry(): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_VERTS * 3), 3));
  geo.setAttribute('uv',       new THREE.BufferAttribute(new Float32Array(MAX_VERTS * 2), 2));
  geo.setAttribute('normal',   new THREE.BufferAttribute(new Float32Array(MAX_VERTS * 3), 3));

  // Static normals — always pointing up
  const normals = geo.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < MAX_VERTS; i++) {
    normals.setXYZ(i, 0, 1, 0);
  }
  normals.needsUpdate = true;

  // Index buffer — triangle strip topology
  const indices = new Uint32Array(MAX_INDICES);
  for (let i = 0; i < MAX_SAMPLES - 1; i++) {
    const v = i * 2;
    const idx = i * 6;
    indices[idx]     = v;
    indices[idx + 1] = v + 1;
    indices[idx + 2] = v + 2;
    indices[idx + 3] = v + 2;
    indices[idx + 4] = v + 1;
    indices[idx + 5] = v + 3;
  }
  geo.setIndex(new THREE.BufferAttribute(indices, 1));
  geo.setDrawRange(0, 0); // start invisible

  return geo;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

function Ribbon({
  trackXWorld,
  halfWidthWorld,
  trackIndex,
}: {
  trackXWorld: number;
  halfWidthWorld: number;
  trackIndex: 0 | 1;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geoRef  = useRef<THREE.BufferGeometry>(buildRibbonGeometry());

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader:   TRACK_VERT,
        fragmentShader: TRACK_FRAG,
        transparent:    true,
        blending:       THREE.AdditiveBlending, // red adds onto dark road — no harsh edge
        depthWrite:     false,
        uniforms: {
          uOpacity:      { value: 0 },
          uTreadDissolve:{ value: 0 },
        },
      }),
    [],
  );

  // Cleanup on unmount
  useEffect(() => {
    const geo = geoRef.current;
    const m   = mat;
    return () => { geo.dispose(); m.dispose(); };
  }, [mat]);

  useFrame(() => {
    // Update uniforms
    mat.uniforms.uOpacity.value       = introState.trackOpacity;
    mat.uniforms.uTreadDissolve.value = introState.treadDissolve;

    const geo = geoRef.current;
    if (!geo) return;

    // How far has the car traveled (in world units along Z)?
    // trackDrawLength is in screen-space units (carY goes -20 → 0 → 40)
    // carY = 0 at centre → worldZ = 0 → car has traveled from +20 to 0 = 20 units
    const drawLength = introState.trackDrawLength; // screen-space units traveled

    if (drawLength <= 0) {
      geo.setDrawRange(0, 0);
      return;
    }

    // Current car world Z = -introState.carY
    const carWorldZ = -introState.carY;
    // Track spans from TRACK_START_WORLD_Z down to current carWorldZ
    const trackEndWorldZ = carWorldZ;

    // Clamp sample count to drawLength (in world units)
    const sampleCount = Math.min(
      Math.ceil((drawLength / 20) * MAX_SAMPLES), // scale to full track
      MAX_SAMPLES,
    );

    if (sampleCount < 2) { geo.setDrawRange(0, 0); return; }

    // Build centre line in screen-space (Y axis, cy convention)
    // startY = -20 (car start), endY = introState.carY (current)
    const centreLine = buildTrackCentreLine(
      trackXWorld,         // X is track world X (static)
      TRACK_START_WORLD_Z, // start world Z (positive = screen bottom)
      trackEndWorldZ,      // end world Z (negative = screen top as car moves up)
      halfWidthWorld,
      sampleCount,
    );

    // Apply worn-edge noise
    const outline = buildTrackOutline(centreLine, 0.06, trackIndex);

    // Write positions + UVs into the pre-allocated buffer
    const positions = geo.attributes.position as THREE.BufferAttribute;
    const uvs       = geo.attributes.uv as THREE.BufferAttribute;

    for (let i = 0; i < sampleCount; i++) {
      const v  = i * 2;
      const t  = i / (sampleCount - 1); // 0 = start, 1 = current car pos

      // Left vertex — note tracks.ts gives cx ± halfWidth in world X
      // but cy is used as world Z here
      const lx = outline.left[i].x;
      const lz = outline.left[i].y;  // cy maps to world Z
      const rx = outline.right[i].x;
      const rz = outline.right[i].y;

      positions.setXYZ(v,     lx, TRACK_Y, lz);
      positions.setXYZ(v + 1, rx, TRACK_Y, rz);

      // UV: U = 0 (left) / 1 (right), V = 0 (start) / 1 (current front)
      uvs.setXY(v,     0, t);
      uvs.setXY(v + 1, 1, t);
    }

    positions.needsUpdate = true;
    uvs.needsUpdate       = true;

    // Update drawRange — only reveal the drawn portion
    geo.setDrawRange(0, (sampleCount - 1) * 6);
    geo.computeBoundingSphere();
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geoRef.current}
      material={mat}
      frustumCulled={false} /* Track extends beyond camera — always render */
    />
  );
}

/* ── Exported component ─────────────────────────────────────────────────────── */

/**
 * Renders both tire-track ribbons (left + right).
 * Reads carConfig for tyre X positions and half-width.
 */
export function TrackRibbons() {
  // Use carConfig ratios to position the tracks correctly
  // These are world-space X positions matching the car's tyre contact centres.
  // The car width is carConfig.realWorldLengthM * (origWidth / origLength),
  // but for simplicity we use a reasonable estimate from the ratios.
  // Exact positions will be confirmed/adjusted from the debug overlay.
  const carWidth        = carConfig.realWorldLengthM * 0.48; // ~1.9m for MX-5
  const halfTrackW      = carConfig.halfTrackWidthRatio * carWidth;
  const tyreHalfWidth   = carConfig.tyreContactWidthRatio * carWidth;

  return (
    <>
      <Ribbon
        trackXWorld={-halfTrackW}
        halfWidthWorld={tyreHalfWidth}
        trackIndex={0}
      />
      <Ribbon
        trackXWorld={+halfTrackW}
        halfWidthWorld={tyreHalfWidth}
        trackIndex={1}
      />
    </>
  );
}
