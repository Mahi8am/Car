/**
 * components/intro/IntroCanvas.tsx
 * ────────────────────────────────
 * R3F Canvas wrapper with M7 robustness features:
 *
 *   1. WebGLErrorBoundary — catches React errors during render.
 *   2. WebGL context-loss listener — if the GPU context is lost at runtime,
 *      calls onContextLost() so IntroSequence can fall through to fallback.
 *   3. PerformanceMonitor — if FPS drops below threshold, calls onDegrade()
 *      so IntroSequence can downgrade the tier in real-time.
 *   4. disposeWebGL — when introState.disposeWebGL becomes true, the canvas
 *      ref is polled and the GL context is force-lost to free GPU resources.
 */

'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerformanceMonitor, useGLTF } from '@react-three/drei';
import { MeshoptDecoder } from 'meshoptimizer';
import type { DeviceTier } from '@/lib/hooks/useDeviceTier';
import carConfig from '@/config/car.config';
import { CameraRig } from '@/components/scene/CameraRig';
import { CarModel } from '@/components/scene/CarModel';
import type { CarDimensions } from '@/components/scene/CarModel';
import { Road } from '@/components/scene/Road';
import { Lighting } from '@/components/scene/Lighting';
import { LightPools } from '@/components/scene/LightPools';
import { introState } from '@/lib/animation/introState';

/* Register decoders once at module level */
useGLTF.setDecoderPath('/draco/');
(async () => {
  await MeshoptDecoder.ready;
  (useGLTF as unknown as { setMeshoptDecoder: (d: unknown) => void })
    .setMeshoptDecoder?.(MeshoptDecoder);
})();

/* ── GPU disposal helper (runs inside Canvas context) ─────────────────────── */
function GPUDisposer({ onDispose }: { onDispose: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    let disposed = false;
    const id = setInterval(() => {
      if (disposed || !introState.disposeWebGL) return;
      disposed = true;
      clearInterval(id);
      // Force-lose the context to return GPU memory
      const ext = gl.getContext().getExtension('WEBGL_lose_context');
      ext?.loseContext();
      gl.dispose();
      onDispose();
    }, 200);
    return () => clearInterval(id);
  }, [gl, onDispose]);

  return null;
}

/* ── Error boundary ─────────────────────────────────────────────────────── */
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; onFallback: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: Error) {
    console.warn('[IntroCanvas] WebGL render error:', err.message);
    this.props.onFallback();
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/* ── Main canvas ─────────────────────────────────────────────────────────── */
interface IntroCanvasProps {
  tier:           DeviceTier;
  onReady:        () => void;
  onCarDims?:     (dims: CarDimensions) => void;
  onContextLost?: () => void;
  onDegrade?:     () => void;
  onDispose?:     () => void;
}

export default function IntroCanvas({
  tier,
  onReady,
  onCarDims,
  onContextLost,
  onDegrade,
  onDispose,
}: IntroCanvasProps) {
  const dpr: [number, number] = tier === 'high' ? [1.5, 2] : [1, 1.5];
  const canvasContainerRef    = useRef<HTMLDivElement>(null);

  const onReadyRef        = useRef(onReady);
  const onContextLostRef  = useRef(onContextLost);
  const onDegradeRef      = useRef(onDegrade);
  const onDisposeRef      = useRef(onDispose);
  useEffect(() => { onReadyRef.current       = onReady;       }, [onReady]);
  useEffect(() => { onContextLostRef.current = onContextLost; }, [onContextLost]);
  useEffect(() => { onDegradeRef.current     = onDegrade;     }, [onDegrade]);
  useEffect(() => { onDisposeRef.current     = onDispose;     }, [onDispose]);

  /* ── WebGL context-loss listener (GPU killed by OS/browser) ──────────────
   * Attach to the actual <canvas> element via a MutationObserver since
   * the canvas is created by R3F, not by us. */
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const attach = (canvas: HTMLCanvasElement) => {
      canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        console.warn('[IntroCanvas] WebGL context lost — switching to fallback');
        onContextLostRef.current?.();
      });
    };

    // Canvas may not be in DOM yet — observe until it appears
    const existing = container.querySelector<HTMLCanvasElement>('canvas');
    if (existing) {
      attach(existing);
    } else {
      const mo = new MutationObserver(() => {
        const c = container.querySelector<HTMLCanvasElement>('canvas');
        if (c) { mo.disconnect(); attach(c); }
      });
      mo.observe(container, { childList: true, subtree: true });
      return () => mo.disconnect();
    }
  }, []);

  /* Simple timer — call onReady 800ms after Canvas mounts */
  useEffect(() => {
    const id = setTimeout(() => onReadyRef.current(), 800);
    return () => clearTimeout(id);
  }, []);

  const handleFallback = () => onReadyRef.current();
  const handleDispose  = () => onDisposeRef.current?.();

  return (
    <div ref={canvasContainerRef} style={{ width: '100%', height: '100%' }}>
      <WebGLErrorBoundary onFallback={handleFallback}>
        <Canvas
          shadows
          dpr={dpr}
          camera={{
            position: [0, carConfig.cameraHeight, 0] as [number, number, number],
            fov:      carConfig.cameraFov,
            near:     0.1,
            far:      60,
          }}
          gl={{
            antialias:       true,
            powerPreference: 'high-performance',
          }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* PerformanceMonitor — degrades tier if FPS < 40 on medium, < 50 on high */}
          <PerformanceMonitor
            factor={0.9}
            threshold={tier === 'high' ? 0.85 : 0.75}
            flipflops={3}
            onDecline={() => {
              console.info('[IntroCanvas] Performance degraded — downgrading tier');
              onDegradeRef.current?.();
            }}
          />

          <GPUDisposer onDispose={handleDispose} />

          <Suspense fallback={null}>
            <CameraRig />
            <Road />
            <Lighting />
            <LightPools />
            <CarModel onDimensionsReady={onCarDims} />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
