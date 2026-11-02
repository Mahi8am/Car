/**
 * lib/animation/masterTimeline.ts
 * ────────────────────────────────
 * Single deterministic GSAP master timeline that drives the entire intro.
 *
 * Coordination model:
 *   GSAP tweens write into `introState` (plain mutable object).
 *   R3F reads `introState` in useFrame — no React state, no re-renders.
 *   This design makes the timeline fully scrubbable and skippable.
 *
 * Screen-space Y convention (matches introState comments):
 *   negative carY = below screen = world +Z
 *   positive carY = above screen = world -Z
 *   0             = screen center
 *
 * Camera follows car during entry → cruise at (0,0,0), then releases.
 * Car shoots off screen (carY → +40) while camera stays at 0.
 *
 * NOT started here — IntroSequence.tsx calls tl.play() after canvas ready.
 */

import gsap from 'gsap';
import { introState } from './introState';
import { TIMING } from './timing';
import { EASE, microSwayYaw, bodySettleRoll } from './easing';
import carConfig from '@/config/car.config';

let masterTl: gsap.core.Timeline | null = null;

/** Car starts this many world-units below screen centre (off-screen, below frustum). */
const CAR_START_Y = -20;
/**
 * Camera starts at world-Z=0 (screen centre) throughout.
 * With FOV=28°, camera height=20, the frustum half-height = tan(14°)*20 ≈ 5 units.
 * Car at worldZ=20 is 20 units below camera, 15 units below the bottom frustum edge
 * → completely off-screen at t=0. Enters bottom edge at ~t=1.2s.
 */
const CAMERA_START_Y = 0;

export function buildMasterTimeline(force = false): gsap.core.Timeline {
  if (masterTl && !force) return masterTl;
  if (masterTl) {
    masterTl.kill();
    masterTl = null;
  }

  // Reset introState to initial values for replay safety
  introState.t             = 0;
  introState.carY          = CAR_START_Y;    // off-screen below
  introState.carX          = carConfig.carXOffset;   // left of screen centre
  introState.carYaw        = 0;
  introState.carRoll       = 0;
  introState.carVisible    = true;
  introState.cameraY       = CAMERA_START_Y; // fixed at screen-centre
  introState.roadScrollOffset = 0;
  introState.trackDrawLength  = 0;
  introState.trackOpacity     = 0;
  introState.treadDissolve    = 0;
  introState.textProgress     = 0;
  introState.scene            = 0;
  introState.transformProgress = 0;
  introState.heroProgress     = 0;
  introState.introComplete    = false;
  introState.disposeWebGL     = false;
  introState.heroMode         = false;
  introState.heroCameraAngle  = 0;

  const tl = gsap.timeline({
    paused: true,
    onUpdate() {
      const t = tl.time();
      introState.t = t;

      // ── Micro-sway: pure function of time, no tween needed ────────────
      // Only during entry + cruise (scenes 1–4)
      if (introState.scene >= 1 && introState.scene <= 4) {
        introState.carYaw = microSwayYaw(t);
      } else {
        introState.carYaw = 0;
      }

      // ── Track draw length: total world-distance the car has traveled ──
      // Grows from 0 as car moves from CAR_START_Y toward screen top.
      // Used by TrackRibbons (M4) to clip the ribbon.
      const traveledY = introState.carY - CAR_START_Y; // positive as car moves up
      introState.trackDrawLength = Math.max(0, traveledY);
    },
  });

  // ── Scene 0: dark entrance (black screen fades in, Scene 1 timing) ────────
  tl.set(introState, { scene: 0 }, 0);
  // 0.4 s dark hold before car appears (handled by LoadingScreen fade + dark Canvas)

  // ── Scene 1–2: car entry ──────────────────────────────────────────────────
  // Camera stays fixed at worldZ=0 (screen centre).
  // Car travels from carY=-20 (off-screen below) → carY=0 (centre).
  // Because camera doesn't move, the road does NOT scroll during entry —
  // the car visually enters from the bottom of the screen.
  // Road UV scroll (cruise) kicks in separately at carCruiseAt.
  tl.set(introState, { scene: 1 }, TIMING.carEntryStart);
  tl.to(
    introState,
    {
      carY: 0,
      // cameraY stays at 0 — camera is fixed, car physically enters the frame
      duration: TIMING.carEntryDuration,
      ease: EASE.carEntry,
    },
    TIMING.carEntryStart,
  );

  // Body-settle roll during the last 30% of entry (peaks then decays)
  // Computed in onUpdate as a pure function; we just need a dummy tween to
  // trigger onUpdate reliably at the right phase.
  tl.to(
    introState,
    {
      carRoll: 0,                // target 0 — actual value set in onUpdate
      duration: TIMING.carEntryDuration,
      ease: 'none',
      onUpdate() {
        const elapsed = tl.time() - TIMING.carEntryStart;
        const norm = Math.max(0, Math.min(elapsed / TIMING.carEntryDuration, 1));
        introState.carRoll = bodySettleRoll(norm);
      },
    },
    TIMING.carEntryStart,
  );

  // ── Scene 2: cruise (car + camera hold at 0) ──────────────────────────────
  // Both carY and cameraY are already at 0 from the entry tween.
  // No tweens needed; car, camera, and tracks just hold position.
  tl.set(introState, { scene: 2 }, TIMING.carCruiseAt);

  // ── Entry road scroll ─────────────────────────────────────────────────────
  // Camera is FIXED at worldZ=0 during entry — the car moves toward camera.
  // Without UV scroll the road looks static while the car glides over it.
  // Add a scroll that matches the car's entry distance so road looks alive.
  {
    const entryScroll = 18; // ≈ car travel distance (20 units, slightly less for visual feel)
    tl.to(
      introState,
      {
        roadScrollOffset: entryScroll,
        duration: TIMING.carEntryDuration,
        ease: EASE.carEntry,   // same power2.inOut as the car — road and car feel linked
      },
      TIMING.carEntryStart,
    );
  }

  // ── Cruise road scroll ────────────────────────────────────────────────────
  // Entry ended at scrollOffset=18. Cruise continues from 18 → 18+22 = 40.
  {
    const cruiseDuration = TIMING.carDepartureAt - TIMING.carCruiseAt;
    const cruiseEnd      = 18 + cruiseDuration * 5.5; // 18 + 22 = 40
    tl.to(
      introState,
      {
        roadScrollOffset: cruiseEnd,
        duration: cruiseDuration,
        ease: 'none',   // linear — constant cruise speed
      },
      TIMING.carCruiseAt,
    );
  }


  tl.to(
    introState,
    {
      trackOpacity: 1,
      duration: TIMING.tracksFadeInDuration,
      ease: EASE.trackFadeIn,
    },
    TIMING.tracksStartAt,
  );

  // ── Scene 4: text reveal ─────────────────────────────────────────────────
  tl.set(introState, { scene: 3 }, TIMING.textRevealAt);
  tl.to(
    introState,
    {
      textProgress: 1,
      duration: 0.8,
      ease: EASE.textReveal,
    },
    TIMING.textRevealAt,
  );

  tl.set(introState, { scene: 4 }, TIMING.textRevealAt + 0.8);

  // ── Scene 5: text exit ────────────────────────────────────────────────────
  tl.set(introState, { scene: 5 }, TIMING.textExitAt);
  tl.to(
    introState,
    {
      textProgress: 0,
      duration: TIMING.textExitDuration,
      ease: EASE.textExit,
    },
    TIMING.textExitAt,
  );

  // ── Scene 6: car departure ────────────────────────────────────────────────
  // Car accelerates off-screen top (carY → +40 = world Z -40 = off screen).
  // Camera stays at 0 (already there from cruise) — camera "releases" the car.
  tl.set(introState, { scene: 6 }, TIMING.carDepartureAt);

  tl.to(
    introState,
    {
      carY: 60,                      // far off-screen for a longer, explosive exit
      duration: TIMING.carDepartureDuration,
      ease: EASE.carDeparture,       // expo.in: barely moves then ROCKETS off screen
    },
    TIMING.carDepartureAt,
  );

  // cameraY stays at 0; no tween needed. The difference between cameraY and carY
  // produces the "car shoots away from a static camera" effect.

  // Tread detail dissolves to flat silhouette as car departs
  tl.to(
    introState,
    {
      treadDissolve: 1,
      duration: TIMING.treadDissolveDuration,
      ease: EASE.smooth,
    },
    TIMING.carDepartureAt + 0.2,
  );

  // Car invisible once fully off screen
  tl.set(
    introState,
    { carVisible: false },
    TIMING.carDepartureAt + TIMING.carDepartureDuration,
  );

  // Road keeps scrolling during departure — matches the car's expo.in acceleration.
  // Cruise ended at scrollDistance (22 units). Departure adds more, exponentially.
  {
    const cruiseDuration   = TIMING.carDepartureAt - TIMING.carCruiseAt; // 4.0 s
    const cruiseEnd        = cruiseDuration * 5.5;                        // 22 units
    const departureScroll  = 48; // additional scroll during the 1.1 s departure
    tl.to(
      introState,
      {
        roadScrollOffset: cruiseEnd + departureScroll,
        duration: TIMING.carDepartureDuration,
        ease: EASE.carDeparture, // same expo.in — road accelerates with the car
      },
      TIMING.carDepartureAt,
    );
  }

  // ── Scene 7: track → shape transformation ────────────────────────────────
  tl.set(introState, { scene: 7 }, TIMING.transformAt);
  tl.to(
    introState,
    {
      transformProgress: 1,
      duration: TIMING.transformDuration,
      ease: EASE.shapeExpand,
    },
    TIMING.transformAt,
  );

  // ── Scene 8: resolved hero reveal ────────────────────────────────────────
  tl.set(introState, { scene: 8 }, TIMING.heroRevealAt);
  tl.to(
    introState,
    {
      heroProgress: 1,
      duration: TIMING.heroRevealDuration,
      ease: EASE.heroReveal,
    },
    TIMING.heroRevealAt,
  );

  // Canvas disposes shortly after hero reveal completes — no 3D side-view.
  tl.set(
    introState,
    { introComplete: true, disposeWebGL: true },
    TIMING.heroRevealAt + TIMING.heroRevealDuration + 0.5,
  );

  masterTl = tl;
  return tl;
}

/** Seek the timeline to a specific time without playing. */
export function scrubTo(t: number) {
  if (!masterTl) return;
  masterTl.pause();
  masterTl.seek(t, false);
}

/** Get the current master timeline (null if not built yet). */
export function getMasterTimeline(): gsap.core.Timeline | null {
  return masterTl;
}

/** Kill and clear the master timeline (for unmount / replay reset). */
export function killMasterTimeline() {
  masterTl?.kill();
  masterTl = null;
}
