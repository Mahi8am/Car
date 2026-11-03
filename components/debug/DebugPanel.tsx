/**
 * components/debug/DebugPanel.tsx
 * ────────────────────────────────
 * Only rendered when ?debug is in the URL (zero bundle cost otherwise).
 *
 * M2 provides:
 *   - Tire contact point markers (DOM overlay, positioned in CSS)
 *   - Car bounding box info (text)
 *   - FPS counter (via drei's Stats or manual tracking)
 *   - Camera height / FOV display
 *   - Layout mode name
 *   - Device tier display + override buttons
 *   - Current introState.scene / t display
 *
 * M3 will add: timeline scrubber, play/pause, scene-jump buttons.
 *
 * Contact point positions are projected from 3D world coords to 2D screen
 * coords using the camera's projectionMatrix, then displayed as DOM overlays.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CarDimensions } from '@/components/scene/CarModel';
import type { ViewportLayout } from '@/lib/hooks/useViewportLayout';
import type { DeviceTier } from '@/lib/hooks/useDeviceTier';
import { getMasterTimeline, scrubTo } from '@/lib/animation/masterTimeline';
import { TIMING } from '@/lib/animation/timing';

interface DebugPanelProps {
  carDims: CarDimensions | null;
  layout: ViewportLayout;
  tier: DeviceTier;
  onForceTier: (t: DeviceTier) => void;
}

/* ── Tiny FPS hook ─────────────────────────────────────────────────────────── */
function useFPS() {
  const [fps, setFps] = useState(0);
  const frames = useRef(0);
  const last = useRef(0);

  useEffect(() => {
    last.current = performance.now();
    let raf: number;
    const tick = () => {
      frames.current++;
      const now = performance.now();
      if (now - last.current >= 1000) {
        setFps(frames.current);
        frames.current = 0;
        last.current = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return fps;
}

/* ── Timeline scrubber hook ────────────────────────────────────────────────── */
const SCENE_JUMPS = [
  { label: 'Entrance', t: 0 },
  { label: 'Entry',    t: TIMING.carEntryStart },
  { label: 'Cruise',   t: TIMING.carCruiseAt },
  { label: 'Text',     t: TIMING.textRevealAt },
  { label: 'Depart',   t: TIMING.carDepartureAt },
  { label: 'Transform',t: TIMING.transformAt },
  { label: 'Hero',     t: TIMING.heroRevealAt },
] as const;

function useScrubber() {
  const [isPlaying, setIsPlaying]   = useState(false);
  const [currentT, setCurrentT]     = useState(0);
  const [duration, setDuration]     = useState(TIMING.heroRevealAt + TIMING.heroRevealDuration);

  useEffect(() => {
    const id = setInterval(() => {
      const tl = getMasterTimeline();
      if (!tl) return;
      setIsPlaying(!tl.paused());
      setCurrentT(tl.time());
      setDuration(tl.duration() || duration);
    }, 80);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seek = useCallback((t: number) => {
    scrubTo(t);
    setCurrentT(t);
  }, []);

  const togglePlay = useCallback(() => {
    const tl = getMasterTimeline();
    if (!tl) return;
    if (tl.paused()) { tl.play(); setIsPlaying(true); }
    else             { tl.pause(); setIsPlaying(false); }
  }, []);

  return { isPlaying, currentT, duration, seek, togglePlay };
}

/* ── Component ─────────────────────────────────────────────────────────────── */
export function DebugPanel({ carDims, layout, tier, onForceTier }: DebugPanelProps) {
  const fps = useFPS();
  const { isPlaying, currentT, duration, seek, togglePlay } = useScrubber();

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 10000,
    background: 'rgba(7, 7, 7, 0.92)',
    border: '1px solid #303034',
    borderRadius: 4,
    padding: '10px 14px',
    fontFamily: 'ui-monospace, monospace',
    fontSize: 11,
    color: '#9A9DA2',
    lineHeight: 1.7,
    minWidth: 260,
    backdropFilter: 'blur(8px)',
  };

  const labelStyle: React.CSSProperties = {
    color: '#E1251B',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontSize: 10,
  };

  const valStyle: React.CSSProperties = { color: '#EDE7DC' };

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '2px 8px',
    marginLeft: 4,
    background: active ? '#E1251B' : '#232326',
    color: active ? '#fff' : '#9A9DA2',
    border: 'none',
    borderRadius: 2,
    cursor: 'pointer',
    fontSize: 10,
  });

  const divider = <div style={{ borderTop: '1px solid #303034', margin: '6px 0' }} />;

  return (
    <div style={panelStyle} role="complementary" aria-label="Debug panel">
      <div style={{ ...labelStyle, marginBottom: 4 }}>⬡ DEBUG</div>

      <div><span style={labelStyle}>FPS </span><span style={valStyle}>{fps}</span></div>
      <div><span style={labelStyle}>Mode </span><span style={valStyle}>{layout.mode}</span></div>
      <div><span style={labelStyle}>Tier </span>
        <span style={valStyle}>{tier}</span>
        {(['high', 'medium', 'low'] as DeviceTier[]).map((t) => (
          <button key={t} style={btnStyle(tier === t)} onClick={() => onForceTier(t)}>{t}</button>
        ))}
      </div>

      {/* ── Timeline scrubber ────────────────────────────────────────── */}
      {divider}
      <div style={labelStyle}>Timeline</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '3px 0' }}>
        <button
          id="debug-play-pause"
          style={{ ...btnStyle(isPlaying), padding: '2px 10px', fontSize: 12 }}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <span style={valStyle}>{currentT.toFixed(2)}s</span>
        <span style={{ color: '#555' }}>/ {duration.toFixed(1)}s</span>
      </div>
      <input
        id="debug-scrubber"
        type="range"
        min={0}
        max={duration}
        step={0.05}
        value={currentT}
        onChange={(e) => seek(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: '#E1251B', margin: '2px 0' }}
        aria-label="Timeline scrubber"
      />
      {/* Scene-jump buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
        {SCENE_JUMPS.map(({ label, t }) => (
          <button
            key={label}
            id={`debug-jump-${label.toLowerCase()}`}
            style={btnStyle(Math.abs(currentT - t) < 0.1)}
            onClick={() => seek(t)}
          >
            {label}
          </button>
        ))}
      </div>

      {carDims && (
        <>
          <div style={{ borderTop: '1px solid #303034', margin: '6px 0' }} />
          <div style={labelStyle}>Car Dimensions</div>
          <div>length <span style={valStyle}>{carDims.length.toFixed(2)} m</span></div>
          <div>width  <span style={valStyle}>{carDims.width.toFixed(2)} m</span></div>
          <div>height <span style={valStyle}>{carDims.height.toFixed(2)} m</span></div>
          <div>scale  <span style={valStyle}>{carDims.scale.toFixed(5)}</span></div>

          <div style={{ borderTop: '1px solid #303034', margin: '6px 0' }} />
          <div style={labelStyle}>Tyre Contact Points</div>
          <div>Left X  <span style={valStyle}>{carDims.leftTyreX.toFixed(3)} m</span></div>
          <div>Right X <span style={valStyle}>{carDims.rightTyreX.toFixed(3)} m</span></div>
          <div>Rear Z  <span style={valStyle}>{carDims.rearAxleZ.toFixed(3)} m</span></div>
          <div>Track W <span style={valStyle}>{(carDims.tyreHalfWidth * 2).toFixed(3)} m</span></div>
        </>
      )}

      <div style={{ borderTop: '1px solid #303034', margin: '6px 0' }} />
      <div><span style={labelStyle}>VW </span><span style={valStyle}>{layout.vw}</span></div>
      <div><span style={labelStyle}>VH </span><span style={valStyle}>{layout.vh}</span></div>
    </div>
  );
}

/* ── Tyre contact point overlay (DOM markers) ───────────────────────────── */

interface ContactOverlayProps {
  carDims: CarDimensions;
  /** Camera height in world units */
  cameraHeight: number;
  /** Camera FOV in degrees */
  cameraFov: number;
  vw: number;
  vh: number;
}

export function ContactPointOverlay({ carDims, cameraHeight, cameraFov, vw, vh }: ContactOverlayProps) {
  // Project 3D world position to 2D screen position (top-down camera)
  // For a camera at (0, h, 0) with fov, the visible world height = 2 * h * tan(fov/2)
  const aspect = vw / vh;
  const halfVisH = cameraHeight * Math.tan((cameraFov * Math.PI) / 360);
  const halfVisW = halfVisH * aspect;

  // Convert world (x, z) → screen (px, py) where:
  //   screen centre = (vw/2, vh/2)
  //   world +x → screen +x (right)
  //   world -z → screen -y (up, since camera up=(0,0,-1))
  function worldToScreen(wx: number, wz: number): [number, number] {
    const px = (wx / halfVisW) * (vw / 2) + vw / 2;
    const py = (wz / halfVisH) * (vh / 2) + vh / 2; // −z → up
    return [px, py];
  }

  const [lx, ly] = worldToScreen(carDims.leftTyreX, carDims.rearAxleZ);
  const [rx, ry] = worldToScreen(carDims.rightTyreX, carDims.rearAxleZ);

  const markerStyle = (x: number, y: number): React.CSSProperties => ({
    position: 'fixed',
    left: x - 6,
    top:  y - 6,
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: '2px solid #E1251B',
    background: 'rgba(225, 37, 27, 0.3)',
    pointerEvents: 'none',
    zIndex: 9998,
  });

  const labelStyleC = (x: number, y: number): React.CSSProperties => ({
    position: 'fixed',
    left: x + 10,
    top:  y - 8,
    fontSize: 10,
    color: '#E1251B',
    fontFamily: 'ui-monospace, monospace',
    pointerEvents: 'none',
    zIndex: 9998,
  });

  return (
    <>
      <div style={markerStyle(lx, ly)} aria-hidden="true" />
      <div style={labelStyleC(lx, ly)} aria-hidden="true">L</div>
      <div style={markerStyle(rx, ry)} aria-hidden="true" />
      <div style={labelStyleC(rx, ry)} aria-hidden="true">R</div>
    </>
  );
}
