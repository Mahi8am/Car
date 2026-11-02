// PLAN1-LOCKED: do not modify behavior
/**
 * components/scene/CarModel.tsx
 * ──────────────────────────────
 * Loads the optimized GLB and auto-normalises it:
 *   1. Computes bounding box → find centre, length, width
 *   2. Translates to centre horizontally; sits on Y=0
 *   3. Scales so car length = carConfig.realWorldLengthM (metres)
 *   4. Rotation: fixup + introState.carYaw (micro-sway) every frame
 *   5. Position: driven by introState.carY / carX every frame in useFrame
 *   6. carpaint material tinted from CSS --red token
 *   7. Shadow casting on every mesh
 *
 * Group hierarchy (outer → inner):
 *   positionGroup   → world position from introState (animated)
 *   yawGroup        → Y rotation = fixupY + introState.carYaw (animated)
 *   fixupGroup      → X/Z rotation fixup (static) + scale
 *     primitive     → model with centering translation
 *
 * Screen-space Y convention (matches introState):
 *   introState.carY negative = below screen = world +Z
 *   worldZ = -introState.carY
 */

'use client';

import { useMemo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { introState } from '@/lib/animation/introState';
import carConfig from '@/config/car.config';

/* ── Public types ─────────────────────────────────────────────────────────── */

export interface CarDimensions {
  /** Length along world Z axis after normalisation (metres). */
  length: number;
  /** Width along world X axis after normalisation (metres). */
  width: number;
  /** Height (metres). */
  height: number;
  /** Scale factor applied to the original model vertices. */
  scale: number;
  /** World X of left tyre contact centre. */
  leftTyreX: number;
  /** World X of right tyre contact centre. */
  rightTyreX: number;
  /** World Z offset of rear axle from car centre (positive = toward +Z). */
  rearAxleZ: number;
  /** Tyre contact patch half-width (metres). */
  tyreHalfWidth: number;
}

/* ── Auto-normalisation (runs once on model load) ────────────────────────── */

function computeNormalisation(scene: THREE.Group): {
  translation: THREE.Vector3;
  scale: number;
  dims: CarDimensions;
} {
  const bbox = new THREE.Box3().setFromObject(scene);
  const size = bbox.getSize(new THREE.Vector3());
  const center = bbox.getCenter(new THREE.Vector3());

  // Long axis is X in this GLB (confirmed by inspection: X span ≈ 393 units).
  // After the -90° Y rotation, X→Z so car length becomes the Z span.
  const origLength = size.x;  // becomes car length in world Z after rotation
  const origWidth  = size.z;  // becomes car width in world X after rotation
  const scale = carConfig.realWorldLengthM / origLength;

  const carLength = carConfig.realWorldLengthM;
  const carWidth  = origWidth  * scale;
  const carHeight = size.y     * scale;
  const halfLen   = carLength  / 2;

  // Rear axle offset from centre (positive Z = toward screen bottom)
  // rearAxleRatio is from nose: 0 = nose, 1 = tail
  // After -90° Y rotation: nose is at -Z, tail is at +Z
  const rearAxleZ = -halfLen + carConfig.rearAxleRatio * carLength;

  return {
    translation: new THREE.Vector3(-center.x, -bbox.min.y, -center.z),
    scale,
    dims: {
      length:     carLength,
      width:      carWidth,
      height:     carHeight,
      scale,
      leftTyreX:   -(carConfig.halfTrackWidthRatio * carWidth),
      rightTyreX:  +(carConfig.halfTrackWidthRatio * carWidth),
      rearAxleZ,
      tyreHalfWidth: carConfig.tyreContactWidthRatio * carWidth,
    },
  };
}

/* ── Component ───────────────────────────────────────────────────────────── */

interface CarModelProps {
  visible?: boolean;
  onDimensionsReady?: (dims: CarDimensions) => void;
}

export function CarModel({ visible = true, onDimensionsReady }: CarModelProps) {
  // Draco decoder served locally from public/draco/ (avoids blocked CDN)
  const { scene } = useGLTF(carConfig.modelPath, '/draco/');

  const { translation, scale, dims } = useMemo(
    () => computeNormalisation(scene as THREE.Group),
    [scene],
  );

  // Report dimensions once to parent (debug panel, lighting)
  useEffect(() => {
    onDimensionsReady?.(dims);
  }, [dims, onDimensionsReady]);

  // Refs to groups we mutate every frame
  const positionGroupRef = useRef<THREE.Group>(null);
  const yawGroupRef      = useRef<THREE.Group>(null);

  // Pre-compute fixed rotation values
  const [rx, ry, rz] = carConfig.rotationFixupDeg;
  const fixupYRad = THREE.MathUtils.degToRad(ry);
  const fixupXRad = THREE.MathUtils.degToRad(rx);
  const fixupZRad = THREE.MathUtils.degToRad(rz);

  // Shadow + paint material setup (runs once after model ready)
  useEffect(() => {
    /* Read paint colour from --car-paint (darker than UI --red) */
    const accentHex =
      getComputedStyle(document.documentElement).getPropertyValue('--car-paint').trim() ||
      '#A80D08';

    /* ── Step 1: Recompute smooth vertex normals ───────────────────────────────
     * The GLB has hard/split normals at panel crease lines — correct for
     * side-view renders but look like bright "wrinkle" ridges from top-down.
     * computeVertexNormals() averages normals across adjacent faces (Blender's
     * auto-smooth), giving smooth shading regardless of lighting angle.
     * This is the root fix for the wrinkle artifacts.
     * ───────────────────────────────────────────────────────────────────────── */
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        child.geometry.computeVertexNormals();
      }
    });

    /* ── Helper: strip ALL texture maps and set exact PBR values ──────────────
     * Normal maps baked for side-view create white-line artifacts from top-down.
     * Roughness/metalness maps add unwanted variation. Strip them all.
     * ───────────────────────────────────────────────────────────────────────── */
    function setMat(
      m: THREE.MeshStandardMaterial,
      opts: {
        color?: string;
        roughness: number;
        metalness: number;
        envMapIntensity: number;
        transparent?: boolean;
        opacity?: number;
      },
    ) {
      if (opts.color) m.color.set(opts.color);
      m.roughness         = opts.roughness;
      m.metalness         = opts.metalness;
      m.envMapIntensity   = opts.envMapIntensity;
      // Strip all texture maps — eliminates wrinkles, baked bumps, and variation
      m.normalMap         = null;
      m.roughnessMap      = null;
      m.metalnessMap      = null;
      m.aoMap             = null;
      m.emissiveMap       = null;
      if (opts.transparent !== undefined) m.transparent = opts.transparent;
      if (opts.opacity !== undefined)     m.opacity     = opts.opacity;
      // Depth stability — prevents transparent overlays from causing depth-sort
      // artefacts where carpaint appears to render "under" trim/glass meshes.
      m.depthWrite  = true;
      m.depthTest   = true;
      m.side        = THREE.FrontSide;
      m.needsUpdate = true;
    }

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow    = true;
      child.receiveShadow = false;

      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((m) => {
        if (!(m instanceof THREE.MeshStandardMaterial)) return;

        /* ── Kill KHR_materials_clearcoat ────────────────────────────────────
         * Three.js loads clearcoat GLB materials as MeshPhysicalMaterial.
         * MeshPhysicalMaterial extends MeshStandardMaterial, so instanceof
         * passes above. But the non-zero clearcoat value creates a mirror-like
         * top coat that makes chrome appear silver regardless of our colour
         * or roughness overrides. Zero it here before any case runs. */
        if (m instanceof THREE.MeshPhysicalMaterial) {
          m.clearcoat            = 0;
          m.clearcoatRoughness   = 0;
          m.sheen                = 0;
          m.iridescence          = 0;
          m.transmission         = 0;
          m.ior                  = 1.5;
        }

        switch (m.name) {
          // ── Body paint (Matte Red) ───────────────────────────────────────
          case 'carpaint':
            setMat(m, { color: accentHex, roughness: 0.76, metalness: 0.0, envMapIntensity: 0.35 });
            break;

          // ── Interior / cockpit (black from top-down) ──────────────────────
          case 'interior':
            setMat(m, { color: '#060606', roughness: 0.82, metalness: 0.0, envMapIntensity: 0.15 });
            break;

          // ── True black plastic/trim ───────────────────────────────────────
          case 'black':
            setMat(m, { color: '#080808', roughness: 0.75, metalness: 0.0, envMapIntensity: 0.15 });
            break;

          // ── Matte metal (roll bars, brackets) ────────────────────────────
          case 'mattemetal':
            setMat(m, { color: '#0d0d0d', roughness: 0.55, metalness: 0.4, envMapIntensity: 0.5 });
            break;

          // ── Chrome / polished trim ────────────────────────────────────────
          case 'chrome':
            setMat(m, { color: '#1a1a1a', roughness: 0.12, metalness: 0.9, envMapIntensity: 0.8 });
            break;

          // ── Mirrors (dark from above) ─────────────────────────────────────
          case 'mirror':
            setMat(m, { color: '#0d0d0d', roughness: 0.06, metalness: 0.85, envMapIntensity: 0.9 });
            break;

          // ── Tires (matte rubber) ──────────────────────────────────────────
          case 'tire':
            setMat(m, { color: '#0a0a0a', roughness: 0.88, metalness: 0.0, envMapIntensity: 0.05 });
            break;

          // ── Brake discs ───────────────────────────────────────────────────
          case 'brakedisk':
            setMat(m, { color: '#1a1a1a', roughness: 0.5, metalness: 0.6, envMapIntensity: 0.4 });
            break;

          // ── Windshield glass (dark tinted, not emissive) ─────────────────
          case 'windowglass':
            setMat(m, { color: '#060810', roughness: 0.04, metalness: 0.0, envMapIntensity: 0.5, transparent: true, opacity: 0.75 });
            break;

          // ── Headlights (clear glass — neon white/blue) ─────────────────────
          case 'clearglass':
            setMat(m, { color: '#B8D8FF', roughness: 0.0, metalness: 0.0, envMapIntensity: 0.8, transparent: true, opacity: 0.95 });
            m.emissive.set('#80B8FF');   /* cool neon white-blue */
            m.emissiveIntensity = 4.0;
            break;

          // ── Taillights (red glass — neon red) ─────────────────────────────
          case 'redglass':
            setMat(m, { color: '#FF2200', roughness: 0.0, metalness: 0.0, envMapIntensity: 0.5, transparent: true, opacity: 0.95 });
            m.emissive.set('#FF1500');   /* hot neon red */
            m.emissiveIntensity = 5.0;
            break;

          // ── Turn signals (orange glass — neon amber) ───────────────────────
          case 'orangeglass':
            setMat(m, { color: '#FF8800', roughness: 0.0, metalness: 0.0, envMapIntensity: 0.5, transparent: true, opacity: 0.95 });
            m.emissive.set('#FF7000');   /* hot neon amber */
            m.emissiveIntensity = 4.0;
            break;

          // ── License plate (invisible from top-down, make dark) ───────────
          case 'LicPlate_black':
          case 'LicPlate_blue':
          case 'LicPlate_white':
          case 'LicPlate_yellow':
            setMat(m, { color: '#080808', roughness: 0.9, metalness: 0.0, envMapIntensity: 0.05 });
            break;

          // ── Unknown 'material' — dark fallback ───────────────────────────
          case 'material':
          default:
            setMat(m, { color: '#0a0a0a', roughness: 0.7, metalness: 0.0, envMapIntensity: 0.1 });
            break;
        }
      });
    });
  }, [scene]);


  // Every frame: update position and rotation from introState
  useFrame(() => {
    if (positionGroupRef.current) {
      // Screen-Y → world Z: worldZ = -carY
      positionGroupRef.current.position.x = introState.carX;
      positionGroupRef.current.position.z = -introState.carY;
      positionGroupRef.current.visible    = introState.carVisible;
    }
    if (yawGroupRef.current) {
      // fixupY + micro-sway carYaw + body-roll (roll is Z rotation in top-down)
      yawGroupRef.current.rotation.y = fixupYRad + introState.carYaw;
      // Body settle roll: slight lean into/out of turns (visible in side tilt)
      yawGroupRef.current.rotation.z = introState.carRoll;
    }
  });

  return (
    <group ref={positionGroupRef} visible={visible}>
      {/* Y rotation: fixup + micro-sway (animated per-frame) */}
      <group ref={yawGroupRef}>
        {/* X/Z fixup (static) + scale */}
        <group
          rotation={[fixupXRad, 0, fixupZRad]}
          scale={scale}
        >
          <primitive
            object={scene}
            position={[translation.x, translation.y, translation.z]}
          />
        </group>
      </group>
    </group>
  );
}

/* Preload immediately — model is in cache before the canvas mounts */
useGLTF.preload(carConfig.modelPath, '/draco/');
