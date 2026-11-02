/**
 * components/scene/Bloom.tsx
 * ──────────────────────────
 * Selective bloom — ONLY the neon light materials (emissiveIntensity 4–5)
 * exceed the threshold. Road, car body, and background are unaffected.
 *
 * luminanceThreshold: 0.85 — safely above any lit road/body surface (< 0.5)
 * but the neon lights at emissiveIntensity 4.0 render as fully saturated
 * bright pixels well above 0.85.
 */

'use client';

import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function SceneBloom() {
  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        luminanceThreshold={0.85}
        luminanceSmoothing={0.1}
        intensity={1.4}
        mipmapBlur
        blendFunction={BlendFunction.ADD}
      />
    </EffectComposer>
  );
}
