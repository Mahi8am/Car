// PLAN1-LOCKED: do not modify behavior
/**
 * components/scene/CameraRig.tsx
 * ───────────────────────────────
 * Simple top-down camera. Fixed at (0, cameraHeight, worldZ).
 * camera.up = (0, 0, -1). Looks straight down. Z driven by introState.cameraY.
 */

'use client';

import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { introState } from '@/lib/animation/introState';
import carConfig from '@/config/car.config';

export function CameraRig() {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    camera.up.set(0, 0, -1);
    camera.position.set(0, carConfig.cameraHeight, -introState.cameraY);
    camera.lookAt(camera.position.x, 0, camera.position.z);
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(() => {
    camera.position.z = -introState.cameraY;
  });

  return null;
}
