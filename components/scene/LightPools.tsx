// PLAN1-LOCKED: do not modify behavior
/**
 * components/scene/LightPools.tsx
 * ─────────────────────────────────
 * Faint headlight + taillight glow pools that sit flush on the road.
 *
 * Approach:
 *   Two additive-blended circular gradient meshes (PlaneGeometry) sit just
 *   above the road plane (Y = 0.01). They move with the car every frame.
 *
 *   The gradient is a radial falloff done entirely in the fragment shader —
 *   no texture downloads. The blend mode is THREE.AdditiveBlending so the
 *   light naturally "adds" to whatever is beneath it (road, tracks, etc.),
 *   exactly like real light scattering on asphalt.
 *
 *   - Headlight: warm white (tungsten-forward), projects ~2.5m ahead of car
 *   - Taillight: deep red, projects ~1.5m behind car
 *   - Both fade in with trackOpacity and fade out when car departs
 *
 * Car world convention:
 *   Car faces toward -Z (rotated 90° in Y). 
 *   "Ahead" = car world -Z direction = worldZ of car - offset
 *   "Behind" = car world +Z direction = worldZ of car + offset
 */

'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { introState } from '@/lib/animation/introState';

/* ── Shared pool shader (radial gradient, additive) ─────────────────────── */

const POOL_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const POOL_FRAG = /* glsl */ `
  uniform vec3  uColor;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    /* Radial distance from centre (0 = centre, 1 = edge) */
    vec2 centred = vUv - 0.5;
    float dist   = length(centred * 2.0);
    /* Soft falloff: bright centre, completely transparent at edge */
    float alpha  = (1.0 - smoothstep(0.0, 1.0, dist)) * uOpacity;
    /* Slight elongation toward travel direction (stretches pool forward) */
    float elongation = 1.0 - smoothstep(0.6, 1.0, length(centred * vec2(1.0, 0.7) * 2.0));
    alpha *= elongation;
    gl_FragColor = vec4(uColor * alpha, alpha);
  }
`;

/* ── Single pool mesh ────────────────────────────────────────────────────── */

interface PoolMesh {
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
}

function makePool(color: THREE.Color): PoolMesh {
  const mat = new THREE.ShaderMaterial({
    vertexShader:   POOL_VERT,
    fragmentShader: POOL_FRAG,
    uniforms: {
      uColor:   { value: color },
      uOpacity: { value: 0 },
    },
    transparent:  true,
    blending:     THREE.AdditiveBlending,
    depthWrite:   false,
    side:         THREE.FrontSide,
  });
  const geo  = new THREE.PlaneGeometry(2.4, 3.6); // slightly elongated oval
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2; // lay flat
  return { mesh, mat };
}

/* ── Component ───────────────────────────────────────────────────────────── */

export function LightPools() {
  const groupRef   = useRef<THREE.Group>(null);
  const headRef    = useRef<THREE.Mesh>(null);
  const tailRef    = useRef<THREE.Mesh>(null);

  const headMat = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader:   POOL_VERT,
      fragmentShader: POOL_FRAG,
      uniforms: {
        uColor:   { value: new THREE.Color(1.0, 0.92, 0.72) }, // warm tungsten
        uOpacity: { value: 0 },
      },
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    return mat;
  }, []);

  const tailMat = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader:   POOL_VERT,
      fragmentShader: POOL_FRAG,
      uniforms: {
        uColor:   { value: new THREE.Color(0.9, 0.04, 0.02) }, // deep red
        uOpacity: { value: 0 },
      },
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    return mat;
  }, []);

  useFrame(() => {
    const carWorldZ = -introState.carY;    // worldZ = -screenY
    const opacity   = introState.trackOpacity * (introState.carVisible ? 1 : 0);

    // Pool opacity: much stronger — visible road glow
    const headO = opacity * 0.55;
    const tailO = opacity * 0.40;

    headMat.uniforms.uOpacity.value = headO;
    tailMat.uniforms.uOpacity.value = tailO;

    // Position: headlight ~2.2m ahead (-Z), taillight ~1.5m behind (+Z)
    if (headRef.current) {
      headRef.current.position.set(introState.carX, 0.015, carWorldZ - 2.2);
    }
    if (tailRef.current) {
      tailRef.current.position.set(introState.carX, 0.015, carWorldZ + 1.5);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={headRef}
        rotation={[-Math.PI / 2, 0, 0]}
        material={headMat}
        receiveShadow={false}
        castShadow={false}
      >
        <planeGeometry args={[2.0, 3.2, 1, 1]} />
      </mesh>
      <mesh
        ref={tailRef}
        rotation={[-Math.PI / 2, 0, 0]}
        material={tailMat}
        receiveShadow={false}
        castShadow={false}
      >
        <planeGeometry args={[1.6, 2.0, 1, 1]} />
      </mesh>
    </group>
  );
}
