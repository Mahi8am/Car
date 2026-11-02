// PLAN1-LOCKED: do not modify behavior
/**
 * components/scene/Lighting.tsx
 * ──────────────────────────────
 * Automotive studio lighting — same as original working setup.
 * Wrinkles are fixed in CarModel.tsx (smooth normals), not lighting.
 */

'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import carConfig from '@/config/car.config';

function SceneEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    let envTexture: THREE.Texture | null = null;
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileCubemapShader();

    import('three/addons/environments/RoomEnvironment.js').then(({ RoomEnvironment }) => {
      const roomEnv = new RoomEnvironment();
      envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
      scene.environment = envTexture;
      scene.environmentIntensity = 0.45;
      pmremGenerator.dispose();
      roomEnv.dispose();
    });

    return () => {
      scene.environment = null;
      envTexture?.dispose();
    };
  }, [gl, scene]);

  return null;
}

export function Lighting() {
  const shadowRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    const light = shadowRef.current;
    if (!light) return;
    const cam = light.shadow.camera as THREE.OrthographicCamera;
    cam.left   = -6;
    cam.right  =  6;
    cam.top    =  6;
    cam.bottom = -6;
    cam.near   =  5;
    cam.far    = 40;
    cam.updateProjectionMatrix();
    light.shadow.mapSize.setScalar(carConfig.shadowMapSize);
    light.shadow.radius     = 8;
    light.shadow.normalBias = 0.02;
    light.shadow.bias       = -0.0005;
  }, []);

  return (
    <>
      <SceneEnvironment />

      {/* Near-zero ambient — key light does the work */}
      <ambientLight intensity={0.015} color="#1a1208" />

      {/* Key: upper-left, warm tungsten — original working setup */}
      <directionalLight
        ref={shadowRef}
        castShadow
        position={[-7, 18, -5]}
        intensity={4.5}
        color="#FFF0D0"
      />

      {/* Cool fill: opposite side */}
      <directionalLight
        position={[5, 10, 6]}
        intensity={0.08}
        color="#B8C4D8"
      />

      {/* Rim: above-rear, thin roof highlight */}
      <directionalLight
        position={[0, 14, 8]}
        intensity={0.14}
        color="#E8E0F0"
      />
    </>
  );
}
