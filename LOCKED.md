# LOCKED.md — Plan1 Frozen Assets & Animations

As specified in **Plan2 Section 0.1 (The Prime Directive)**:
> **The Plan1 animation is LOCKED.**
> Do not change how the Plan1 animation looks, moves, or is timed. Not the car, road, lighting, tire tracks, text intro, departure, track→shape transformation, final shape composition, easing, or durations.

The following files are permanently marked with `// PLAN1-LOCKED: do not modify behavior` and must not have their visual behavior, movement, or timings modified:

### 1. 3D Scene & WebGL Elements (`components/scene/`)
- `components/scene/CarModel.tsx`: 3D GLB model loading, auto-normalization, paint clearcoat shader, tire contact point calculation.
- `components/scene/Road.tsx`: Procedural asphalt GLSL shader with world-space coordinate mapping and speed streak modulation.
- `components/scene/TrackRibbons.tsx`: Dynamic WebGL ribbon geometry generated from rear tire contact points with progressive distance-based draw length.
- `components/scene/CameraRig.tsx`: Orthographic/perspective top-down camera with Z follow and deceleration release.
- `components/scene/Lighting.tsx`: Upper-left key directional light with cast shadows and PMREM room environment.
- `components/scene/LightPools.tsx`: Additive headlight and taillight glow sprites on asphalt surface.
- `components/scene/Bloom.tsx`: Selective bloom pass for headlights and neon accents.

### 2. Geometry & Track Outlines
- `lib/tracks.ts`: Bitwise-deterministic LCG track generator feeding both WebGL ribbons and SVG morph paths.
- `components/transition/shapes.ts`: Tunable geometric color-block composition targets (bone disc, red form, dark stage rings) per layout mode.

### 3. Core Timing & Easing
- `lib/animation/timing.ts`: Single source of truth for all Plan1 scene timings (entry, cruise, text reveal/exit, departure, transform, hero reveal).
- `lib/animation/easing.ts`: Precise physical cubic easings, micro-sway yaw, and body settle roll functions.

### 4. Text Intro
- `components/intro/IntroText.tsx`: Line-by-line masked text introduction reveal and exit choreography (Scene 4).

---

### Verification
All changes are verified against baseline renders in `_qa/baseline/` via visual regression (`scripts/compare-frames.mjs`). Any deviation at `t <= 10.0s` is a hard failure.
