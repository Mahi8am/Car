'use client';

import { useRef, useEffect, useState } from 'react';
import { introState } from '@/lib/animation/introState';

/* ── Easing helpers ──────────────────────────────────────────────────────── */
function easeOut3(t: number) { return 1 - (1 - Math.max(0, Math.min(t, 1))) ** 3; }
function norm(v: number, a: number, b: number) { return Math.max(0, Math.min((v - a) / (b - a), 1)); }

/* Screen-space wheel positions (carXOffset=-2.2m, FOV=26°, h=20)
 * leftTrack=-2.91m → 0.185 | rightTrack=-1.49m → 0.339 */
const LEFT_PCT    = 0.185;
const RIGHT_PCT   = 0.339;
const INIT_HW_PCT = 0.008; // refined hairline tracks

const TRACK_FILL = '#E1251B';

export function TrackMorphLayer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef  = useRef<SVGSVGElement>(null);
  const [vp, setVp] = useState({ w: 1920, h: 1080 });

  useEffect(() => {
    const heroEl = document.getElementById('hero');
    const update = () => {
      const el = heroEl || document.documentElement;
      setVp({ w: el.clientWidth, h: el.clientHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(heroEl || document.documentElement);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const { w, h } = vp;
    let raf: number;

    function tick() {
      const tp = introState.transformProgress;

      /* heroProgress fades the whole overlay out so hero content shows */
      const heroFade = 1.0 - Math.max(0, Math.min(introState.heroProgress, 1));

      if (wrapRef.current) {
        if (tp > 0.001 && heroFade > 0.01 && !introState.introComplete) {
          wrapRef.current.style.display = 'block';
          wrapRef.current.style.opacity = String(heroFade);
        } else {
          wrapRef.current.style.display = 'none';
          wrapRef.current.style.opacity = '0';
        }
      }
      if (!svgRef.current) { raf = requestAnimationFrame(tick); return; }
      const el = svgRef.current;
      el.setAttribute('viewBox', `0 0 ${w} ${h}`);

      /* Subtle, elegant hairline track glow dissolve instead of overwhelming flood */
      const isPortrait = w < 768 || w < h;
      const leftCX  = (isPortrait ? (0.5 - 0.16) : LEFT_PCT)  * w;
      const rightCX = (isPortrait ? (0.5 + 0.16) : RIGHT_PCT) * w;
      const initHW  = INIT_HW_PCT * w;

      const expandProg = easeOut3(norm(tp, 0.0, 0.6));
      const expandL = initHW + expandProg * (w * 0.04);
      const expandR = initHW + expandProg * (w * 0.04);

      const lx = Math.max(0, leftCX  - expandL);
      const lw = Math.min(w, leftCX  + expandL) - lx;
      const rx = Math.max(0, rightCX - expandR);
      const rw = Math.min(w, rightCX + expandR) - rx;

      const trackOpacity = Math.max(0, 1 - norm(tp, 0.2, 0.85)) * heroFade * 0.6;

      const leftRect  = el.querySelector<SVGRectElement>('#tr-left');
      const rightRect = el.querySelector<SVGRectElement>('#tr-right');
      if (leftRect) {
        leftRect.setAttribute('x',       String(lx));
        leftRect.setAttribute('width',   String(Math.max(0, lw)));
        leftRect.setAttribute('opacity', String(trackOpacity));
      }
      if (rightRect) {
        rightRect.setAttribute('x',       String(rx));
        rightRect.setAttribute('width',   String(Math.max(0, rw)));
        rightRect.setAttribute('opacity', String(trackOpacity));
      }

      /* Soft warm luminous crossfade veil */
      const veilEl = el.querySelector<SVGRectElement>('#tr-veil');
      if (veilEl) {
        const veilO = easeOut3(norm(tp, 0.3, 0.9)) * 0.85 * heroFade;
        veilEl.setAttribute('opacity', String(veilO));
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [vp]);

  const { w, h } = vp;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 35,
        display: 'none',
        pointerEvents: 'none',
        transition: 'opacity 0.4s ease-out'
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {/* Soft elegant warm dissolve veil */}
        <rect id="tr-veil" x={0} y={0} width={w} height={h} fill="var(--bone)" opacity={0} />
        <rect id="tr-left"  x={LEFT_PCT * w - INIT_HW_PCT * w}  y={0} width={INIT_HW_PCT * w * 2} height={h} fill={TRACK_FILL} opacity={0} />
        <rect id="tr-right" x={RIGHT_PCT * w - INIT_HW_PCT * w} y={0} width={INIT_HW_PCT * w * 2} height={h} fill={TRACK_FILL} opacity={0} />
      </svg>
    </div>
  );
}

