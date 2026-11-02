/**
 * components/intro/IntroSequence.tsx
 * ────────────────────────────────────
 * Master orchestrator for the cinematic intro. M7-complete.
 *
 * Mode routing:
 *   'full'   → first visit — full cinematic with WebGL
 *   'replay' → ?intro=replay — forces full cinematic
 *   'repeat' → same session, intro already played → LowTierFallback (brief 0.3s delay)
 *   'skip'   → ?intro=skip → LowTierFallback (instant)
 *   reducedMotion → LowTierFallback (instant, no transforms)
 *   tier=low  → LowTierFallback (no WebGL, 2D shapes)
 *
 * Failure paths (all go to LowTierFallback):
 *   - 10 s asset timeout
 *   - WebGL context loss at runtime
 *   - React render error in WebGLErrorBoundary
 *   - PerformanceMonitor-driven downgrade to 'low'
 *
 * GPU disposal:
 *   introState.disposeWebGL is set by the master timeline after hero reveal.
 *   GPUDisposer (inside IntroCanvas) polls this flag and force-loses the GL
 *   context. When done, it calls onDispose → we unmount the canvas div.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from './LoadingScreen';
import { IntroText } from './IntroText';
import { SkipButton } from './SkipButton';
import { LowTierFallback } from './LowTierFallback';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIntroGate, markIntroDone } from '@/lib/hooks/useIntroGate';
import { useDeviceTier, type DeviceTier } from '@/lib/hooks/useDeviceTier';
import { useViewportLayout } from '@/lib/hooks/useViewportLayout';
import type { CarDimensions } from '@/components/scene/CarModel';
import carConfig from '@/config/car.config';
import {
  buildMasterTimeline,
  killMasterTimeline,
  getMasterTimeline,
} from '@/lib/animation/masterTimeline';
import { TIMING } from '@/lib/animation/timing';
import { introState } from '@/lib/animation/introState';

/* ── Dynamic canvas (never SSR, separate lazy chunk) ─────────────────────── */
const IntroCanvas = dynamic(() => import('./IntroCanvas'), { ssr: false });

/* ── Conditional debug panel ─────────────────────────────────────────────── */
let DebugPanelMod: typeof import('@/components/debug/DebugPanel') | null = null;

/* ── Constants ───────────────────────────────────────────────────────────── */
const TIMEOUT_MS    = 10_000;
const MIN_LOAD_MS   = 500;

/* ── Component ───────────────────────────────────────────────────────────── */
export default function IntroSequence() {
  const reducedMotion = useReducedMotion();
  const introMode     = useIntroGate(reducedMotion);
  const { tier, downgrade } = useDeviceTier();
  const layout        = useViewportLayout();

  const [loadProgress, setLoadProgress]   = useState(0);
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [textVisible, setTextVisible]       = useState(false);
  const [carDims, setCarDims]               = useState<CarDimensions | null>(null);
  const [forcedTier, setForcedTier]         = useState<DeviceTier | null>(null);
  const [debugReady, setDebugReady]         = useState(false);
  const [isDebugMode, setIsDebugMode]       = useState(false);
  const [canvasDisposed, setCanvasDisposed] = useState(false);
  const [useFallback, setUseFallback]       = useState(false);

  const readyCalledRef = useRef(false);
  const timeoutRef     = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tickerRef      = useRef<ReturnType<typeof setInterval>>(undefined);
  const introModeRef   = useRef(introMode);
  useEffect(() => { introModeRef.current = introMode; }, [introMode]);

  const effectiveTier = forcedTier ?? tier;

  /* ── Determine if we should show 3D at all ───────────────────────────────
   * Low tier, reduced motion, skip, or repeat → show 2D fallback only.  */
  const use3D = !reducedMotion &&
                introMode !== 'skip' &&
                introMode !== 'repeat' &&
                effectiveTier !== 'low' &&
                !useFallback;

  /* ── Fake progress ticker ────────────────────────────────────────────── */
  useEffect(() => {
    if (!use3D) return;  // don't run ticker if not showing loading screen
    let v = 2;
    tickerRef.current = setInterval(() => {
      v = Math.min(v + Math.random() * 9 + 3, 88);
      setLoadProgress((p) => Math.max(p, v));
    }, 280);
    return () => clearInterval(tickerRef.current);
  }, [use3D]);

  /* ── Debug mode ──────────────────────────────────────────────────────── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsDebugMode(params.has('debug'));
    if (params.has('debug')) {
      import('@/components/debug/DebugPanel').then((mod) => {
        DebugPanelMod = mod;
        setDebugReady(true);
      });
    }
  }, []);

  /* ── Pre-build timeline (paused) — only when running 3D ─────────────── */
  useEffect(() => {
    if (!use3D) return;
    buildMasterTimeline();
    return () => { killMasterTimeline(); };
  }, [use3D]);

  /* ── Hard timeout (FAILURE path) ─────────────────────────────────────── */
  useEffect(() => {
    if (!use3D) return;
    timeoutRef.current = setTimeout(() => {
      if (readyCalledRef.current) return;
      console.warn('[IntroSequence] Asset timeout — falling back to 2D hero');
      readyCalledRef.current = true;
      clearInterval(tickerRef.current);
      setUseFallback(true);
      setLoadingVisible(false);
    }, TIMEOUT_MS);
    return () => clearTimeout(timeoutRef.current);
  }, [use3D]);

  /* ── Stable handleReady ref ──────────────────────────────────────────── */
  const handleReady = useRef(() => {
    if (readyCalledRef.current) return;
    readyCalledRef.current = true;
    clearTimeout(timeoutRef.current);
    clearInterval(tickerRef.current);
    setLoadProgress(100);

    setTimeout(() => {
      setLoadingVisible(false);
      setTextVisible(true);
      const mode = introModeRef.current;
      if (mode === 'full' || mode === 'replay') {
        markIntroDone();
      }
      buildMasterTimeline().play(0);
    }, MIN_LOAD_MS);
  });

  /* ── Context loss / render error → fallback ──────────────────────────── */
  const handleContextLost = () => {
    console.warn('[IntroSequence] Context lost — switching to 2D fallback');
    clearTimeout(timeoutRef.current);
    clearInterval(tickerRef.current);
    setUseFallback(true);
    setLoadingVisible(false);
    killMasterTimeline();
  };

  /* ── PerformanceMonitor degrade ──────────────────────────────────────── */
  const handleDegrade = () => {
    downgrade(); // high→medium or medium→low (low triggers fallback via use3D)
  };

  /* ── GPU disposal complete → unmount canvas div ──────────────────────── */
  const handleDispose = () => {
    setCanvasDisposed(true);
  };

  /* ── Skip intro ───────────────────────────────────────────────────────── */
  const handleSkip = () => {
    readyCalledRef.current = true;
    clearTimeout(timeoutRef.current);
    clearInterval(tickerRef.current);
    setLoadingVisible(false);
    setTextVisible(false);

    const mode = introModeRef.current;
    if (mode === 'full' || mode === 'replay') {
      markIntroDone();
    }

    const tl = getMasterTimeline();
    if (tl) {
      tl.progress(1);
      tl.pause();
    }

    introState.scene = 8;
    introState.carVisible = false;
    introState.transformProgress = 1;
    introState.heroProgress = 1;
    introState.textProgress = 0;
    introState.introComplete = true;
    introState.disposeWebGL = true;
    setCanvasDisposed(true);

    const heroEl = document.getElementById('hero-phase-2');
    if (heroEl) {
      heroEl.style.display = 'block';
      heroEl.style.visibility = 'visible';
      heroEl.style.opacity = '1';
    }
  };

  /* ── 2D fallback path (low tier / reduced motion / repeat / skip / fail) ─ */
  if (!use3D) {
    // 'skip' mode: show the fallback resolution page instantly
    // 'repeat' mode: brief 300ms dark hold before hero appears
    // 'low' tier: same as skip
    // reducedMotion: no animation at all — just snap to resolved
    const delay = introMode === 'repeat' ? 400 : 0;
    return <LowTierFallback delayMs={delay} />;
  }

  /* ── 3D path ──────────────────────────────────────────────────────────── */
  return (
    <>
      {/* Loading screen */}
      <LoadingScreen
        progress={loadProgress / 100}
        complete={!loadingVisible}
      />

      {/* R3F Canvas — unmounted after GPU disposal complete */}
      {!canvasDisposed && (
        <div
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        >
          <IntroCanvas
            tier={effectiveTier}
            onReady={handleReady.current}
            onCarDims={setCarDims}
            onContextLost={handleContextLost}
            onDegrade={handleDegrade}
            onDispose={handleDispose}
          />
        </div>
      )}

      {/* Skip button */}
      {!canvasDisposed && <SkipButton onSkip={handleSkip} />}

      {/* Intro text */}
      {textVisible && <IntroText />}

      {/* Debug panel */}
      {isDebugMode && debugReady && DebugPanelMod && (
        <>
          <DebugPanelMod.DebugPanel
            carDims={carDims}
            layout={layout}
            tier={effectiveTier}
            onForceTier={setForcedTier}
          />
          {carDims && (
            <DebugPanelMod.ContactPointOverlay
              carDims={carDims}
              cameraHeight={carConfig.cameraHeight}
              cameraFov={carConfig.cameraFov}
              vw={layout.vw}
              vh={layout.vh}
            />
          )}
        </>
      )}
    </>
  );
}
