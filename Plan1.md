# Plan1 — Cinematic Hero Introduction
### Premium Automotive Marketplace · Frontend only · Hero section only

> **Read this entire document before touching anything.**
> You are the lead creative developer, 3D/animation engineer, and UI designer on this project. The project owner is **not** an experienced developer: make sound engineering decisions yourself, explain things in plain language, and only ask a question when you are genuinely blocked.

---

## 0. How to work

1. **Milestone-gated.** Section 9 defines milestones. Finish one, verify it, then **stop and report**. Do not start the next milestone until the owner replies "approved" (or gives feedback to apply).
2. **Verify visually, always.** Run the dev server and use your browser tooling to look at the real output. Never say something works without seeing it. Take screenshots at the viewports and timestamps listed in Section 10 and attach them to your report.
3. **Decide, then document.** Log every non-trivial decision (library choice, technique, deviation from this plan) as one or two lines in `DECISIONS.md`. Ask the owner only when blocked.
4. **Don't rewrite working code** when adding features. Extend, don't churn.
5. **Keep dependencies minimal.** The approved list is in Section 8. Justify anything extra in `DECISIONS.md`.
6. **Report format** after every milestone (plain language, no jargon dumps):
   - What is done and what the owner should now see
   - Exact steps to see it (commands, URL, query params)
   - Screenshots
   - Known issues or things you are unsure about
   - What the next milestone will do
7. **Quality bar:** the owner will show this to a client to demonstrate what they are capable of. It must feel *art-directed*, not template-generated. Restraint, precise timing, and craft matter more than the number of effects.

---

## 1. Scope

### In scope (Plan1)
- Project scaffold (Next.js App Router + TypeScript + Tailwind), Netlify-ready
- On-brand loading screen
- The full cinematic intro (Scenes 1–6 in Section 4)
- Transformation of the tire tracks into a geometric color-block composition, ending in a **resolved hero state** (Section 4, Scene 7)
- Minimal navigation bar with the owner's logo, shown only after the intro
- A **blank placeholder section** below the hero (proves smooth scroll works; real sections come in Plan2)
- Skip control, once-per-session logic, reduced-motion support, device tiers, fallbacks
- A debug/scrub tool for art direction (Section 11)
- `README.md` for a non-developer

### Out of scope (do NOT build)
- Any marketplace sections (discovery, featured cars, buy/sell/rent, brands, footer)
- Listing data, search, auth, backend, CMS, real photos
- **Wheel rotation.** The camera is top-down and wheels are not visible. Do not animate wheels.
- Actually deploying to Netlify (only make the project ready for it)

---

## 2. Assets and where they live

The owner will place these files before you start:

```
project-root/
├─ Plan1.md                                   ← this file
└─ _source/
   ├─ car.glb                                 ← 3D car model (original, unoptimized)
   ├─ logo.png                                ← site logo
   └─ reference/
      ├─ watch-reference.jpg                  ← color-blocking inspiration
      └─ car-topdown-reference.png            ← target camera angle + lighting look
```

**Your job with them:**

- Scaffold the Next.js app **in the project root** (keep `_source/` and `Plan1.md` untouched there; add `_source/` to `.gitignore` only if the GLB is larger than ~20 MB, otherwise keep it committed).
- **Car model:** inspect it first (node/mesh names, materials, scale, orientation, triangle count, textures). Then produce an optimized copy at `public/models/car.glb` (Draco or Meshopt via `npx @gltf-transform/cli`, resized/compressed textures, unused data stripped). **Target ≤ 3 MB and ≤ ~120k triangles** for the shipped file. Report the before/after numbers. Keep the original in `_source/`.
- **Logo:** inspect it (size, transparency, color, light/dark). Produce `public/brand/logo.png` (and an appropriately sized favicon / `app/icon.png`). If it has an opaque background or is unreadable on dark, tell the owner plainly and propose a fix; you may create a light/monochrome variant with CSS (`filter`/mask) as a stopgap.
- **References:** open both reference images and study them (see Section 3). Do not copy the watch layout; adopt its *principle*.
- **The owner will swap the car model and may change the accent color later.** Therefore:
  - All model-specific values live in one file: `config/car.config.ts` (model path, rotation fix-up, target size, paint material name/color, rear-axle/track-width ratios for tire contact points, shadow settings).
  - The model must be **auto-normalized on load**: compute the bounding box, center it, scale it to the configured real-world length, and rotate it so the nose points toward +Y (screen up). Do not hard-code magic numbers elsewhere.
  - A debug overlay (Section 11) shows the computed tire-contact points so the owner/you can verify them after any model swap.
  - The accent color is a **single token** used by both the DOM (CSS variable) and WebGL (read at init). Changing one value must re-theme everything: tracks, shapes, CTA, accents.

---

## 3. Design language

### 3.1 Intent
Premium, cinematic, editorial, minimal but impactful. Think the digital presence of a high-end automotive manufacturer: slow confident motion, large typography, strong negative space, precise alignment.

### 3.2 Reference takeaways
**`watch-reference.jpg` (principle, not layout):** large geometric forms (semicircles, discs, rings) divide a dark textured background into distinct color regions and are *built around the product*. A central disc and a thin accent ring frame the object; secondary tan/orange regions balance the dark mass; the surface has a tactile concrete grain; typography mixes light and bold weights; a thin vertical accent rule anchors the copy. Apply the same philosophy to the car/road world. Do not reproduce its layout, wording, UI chrome, or ghost-text literally.

**`car-topdown-reference.png` (camera and lighting target):** exactly top-down camera (no tilt); a single key light from the **upper-left** casting a long, soft-edged shadow to the **lower-right**; warm near-black ground with a gentle vignette; glossy red paint with crisp highlights along hood, roof and fenders. Match this look. The exact car will differ.

### 3.3 Color tokens (single source of truth; refine only with a stated reason)

| Token | Value | Use |
|---|---|---|
| `--ink-950` | `#070707` | deepest background, near-black |
| `--ink-900` | `#0C0B0A` | road base (warm near-black) |
| `--charcoal` | `#161617` | primary dark surface |
| `--graphite` | `#232326` | secondary dark surface |
| `--graphite-2` | `#303034` | tertiary dark / borders |
| `--steel` | `#9A9DA2` | subtle metallic details, thin rings |
| `--muted` | `#7A7773` | secondary text |
| `--bone` | `#EDE7DC` | warm off-white: text and large light shapes |
| `--red` | `#E1251B` | **racing red accent** |
| `--red-deep` | `#A8140E` | shadowed red / hover states |

Red is the only saturated color. Use it deliberately: tire tracks, one large shape, CTA, tiny details. **No gradients as decoration.** Depth comes from flat color regions, grain, lighting and shadow.

### 3.4 Typography (via `next/font`, self-hosted, `display: swap`)
- **Statement/headline:** *Barlow Condensed* (600–700), uppercase, tight leading (≈0.88–0.92), slight negative tracking. Fluid size roughly `clamp(3.25rem, 7.2vw, 8rem)`.
- **Body/UI:** *Manrope* (300–600), body at ~17–19 px, weight 300–400, max ~34ch, color `--bone` at ~72% opacity.
- Micro-labels: Manrope 500, uppercase, tracking ≈ 0.18em, 11–13 px.
- You may propose a better pairing in `DECISIONS.md`, but keep the logic: condensed bold for statements, light geometric sans for reading.
- Strong hierarchy. **No gradient text, no oversized glow text.**

### 3.5 Surface and texture
- A fine, static **grain/noise layer** over the final color-block composition (low opacity, like the concrete texture in the watch reference). Keep it tiny (< 50 KB) or procedural.
- Subtle vignette on the intro scene.

### 3.6 Avoid (hard rules)
Generic gradient backgrounds · glassmorphism · random floating circles · repetitive rounded cards · three-column feature grids · decorative shadows/borders · emoji icons · template-looking hero · unnecessary animation. **Buttons and shapes use sharp corners** unless a circle is the design intent. Icons: `lucide-react` only. Every element needs a visual or functional purpose.

---

## 4. The experience (timeline spec)

All timings are for desktop and **tunable in one file** (`lib/animation/timing.ts`). Total time from first frame to an interactive hero should be **≈ 11 s or less**.

| Time (s) | Scene |
|---|---|
| 0.0–0.8 | **1.** Dark entrance |
| 0.6–2.8 | **2.** Car enters, reaches cruise |
| 0.8→ | **3.** Tire tracks laid behind the car (continuous) |
| 2.8–4.0 | **4.** Text reveal (right side) |
| 4.0–6.4 | Hold: car cruising, text readable (≥ 2.4 s) |
| 6.4–6.9 | Text exits |
| 6.8–8.4 | **5.** Car departure |
| 8.2–10.4 | **6.** Track transformation |
| 10.0–11.2 | **7.** Resolved hero reveal (nav, details) |

### Scene 1 — Dark entrance
Full viewport. Almost black (`--ink-900` / `--ink-950`), a *very* subtle asphalt grain barely perceptible, soft vignette. No navigation, no UI except the small **Skip** control (appears after ~1.2 s). The loading screen (logo + thin red progress line on black) must hand off to this scene seamlessly, with no flash or color jump.

### Scene 2 — The car enters
- Real 3D car (the owner's GLB), **exactly top-down** perspective camera (narrow FOV ≈ 24–30°, camera straight above, **0° tilt**; pure top-down keeps the ground plane mapped uniformly to the screen, which the transition in Scene 6 relies on).
- The car enters from beneath the bottom edge and travels to the lane position near screen center, then stays there while the **road scrolls beneath it** (the camera follows the car). Smooth acceleration on entry, easing into cruise.
- Lane position: horizontally **50% on mobile, and a tunable `carScreenX` on desktop (default 0.5)**; vertically near center (≈ 0.5 desktop, ≈ 0.38 portrait mobile so text fits below).
- Car size is defined relative to viewport height (desktop ≈ 38–42% of viewport height for the car's length; mobile portrait ≈ 26–30%), tunable.
- Lighting per the reference: key light from upper-left, soft contact + cast shadow lower-right, glossy clearcoat paint, subtle environment reflections (use a generated or small HDR-like environment; no large HDR downloads), gentle highlights.
- **Headlights:** a soft, baked additive light pool on the asphalt ahead of the car (a sprite/texture, *not* real spotlights), revealing the asphalt grain just in front of it. Subtle taillight glow behind. This sells the cinematic feel cheaply.
- Micro-life: extremely subtle sway/yaw (< 0.4°) and body settle on acceleration. Nothing theatrical. **No wheel animation.**
- **Road:** procedural near-black asphalt (generated at runtime, tileable, **zero texture downloads**): fine aggregate, occasional hairline cracks and patch seams, sparse and subtle so that speed is *readable* without clutter. Computed from world position so it never swims relative to the tracks. At higher speeds add a light directional streak/blur in the road shader (high tier only).

### Scene 3 — Tire tracks
- Two tracks laid at the car's actual rear tire contact points (from `car.config.ts` ratios plus bounding box), consistent spacing, following the car's tiny yaw sway.
- They begin as the car enters, **fade up gradually** (opacity/contrast ramps over the first ~1.5 car lengths), and **persist** after the car leaves. They must still cover the full viewport height when the road stops (see Scene 5).
- Not plain lines: stylized **tread marks** (e.g. herringbone/groove pattern) in `--red`, with slightly worn, broken edges. Subtle warm glow near the taillights, none further back.
- **Implementation requirement:** build each track as a ribbon whose outline is generated by a shared pure function in `lib/tracks.ts` (width, edge irregularity as a function of distance). The same function must feed the WebGL ribbon *and* the SVG path used in Scene 6, so the handoff is pixel-identical.

### Scene 4 — Text introduction
Right side of the screen (desktop). Real DOM text (not WebGL), editorial composition, carefully balanced against the car.

```
[eyebrow]  PREMIUM AUTOMOTIVE MARKETPLACE      (micro-label, optional, keep short)

YOUR NEXT DRIVE
STARTS HERE.                                    ← the final "." in --red

Discover exceptional vehicles. Find your next car,
sell your own, or experience something different.

[ EXPLORE COLLECTION  → ]
```

- Headline in Barlow Condensed (see 3.4). A thin vertical `--red` rule may anchor the copy block (the principle, echoing the reference, not a clone).
- Reveal: **masked line-by-line** reveal (each line slides up from inside an overflow mask) with a slight horizontal drift and tight stagger; description and CTA follow with a short fade + 12–16 px rise. Use **GSAP SplitText** (it is free in current GSAP) or an equivalent mask technique.
- CTA: sharp-cornered, 1 px border in `--bone` @ ~30%, uppercase micro-label with `ArrowUpRight` (lucide); hover sweeps a `--red` fill from the left. Click → completes the intro (quick transition) and scrolls to the blank section below.
- Must be keyboard accessible with visible focus states. The headline is a real `<h1>`.
- Do **not** compete with the car: restrained motion, no bounces.

### Scene 5 — Departure
1. Text exits first (short mask-out, ~0.5 s).
2. The car **accelerates forward and exits through the top of the screen** with believable physics: ease-in acceleration, no opacity fade, light road streaking while it still moves.
3. **Camera release (this is how the tracks stay behind):** the camera, which had been following the car, **decelerates to a stop** while the car keeps accelerating ahead. The road therefore stops scrolling, the car shoots out of frame, and the tracks, laid continuously, end up **frozen on screen spanning the full viewport height (bottom to top)** with margin on all aspect ratios (including tall portrait phones).
4. Vignette and light pools fade as the car leaves.

### Scene 6 — Tire track transformation (the signature moment)
This must feel like a considered cinematic transition, not a wipe or a crossfade.

**Handoff.** Because the camera is exactly top-down, the frozen tracks are straight parallel vertical bands at analytically known screen positions. Hand off from WebGL to an **SVG overlay layer** whose paths are generated from the shared `lib/tracks.ts` outline function. First let the tread detail resolve to flat solid red bands inside WebGL (≈ 0.3–0.5 s, starting as the car is leaving), then swap to the SVG layer in a single frame with **no visible pop**. If you find a more robust technique (e.g. full-screen SDF fragment shader in the same canvas), you may use it, but record why in `DECISIONS.md`.

**Motion.** Begin within ~0.3 s of the car leaving the frame, so it reads as one continuous gesture. Sequence (tune the details by eye):
1. The expansion front travels **upward along the tracks, following the car's path** (slight vertical stagger), so the shapes appear to be "released" by the car.
2. Each narrow band **widens horizontally and lengthens vertically**, with irregular worn edges smoothing as it grows, morphing (GSAP MorphSVGPlugin is free; or point-matched paths you author) from a long strip into a large rounded geometric form, then into the target composition below.
3. **Layered passes**: 2–3 stacked layers with different easings and slight delays (e.g. graphite, then red, then bone) so color regions *arrive* in sequence and overlap; edges of one layer reveal the next. The near-black road shrinks to the remaining regions.
4. The corridor *between* the two tracks (where the car drove) must read as a deliberate region: it becomes the central dark "stage" described below.
5. Easing: long ease-out settles, slight overshoot only if it improves the feel. No bounce.

**Target composition (desktop, 16:9). This is art direction; refine by eye and keep it tunable in `components/transition/shapes.ts`:**
- Base: `--charcoal` with grain.
- **Left track → large `--bone` disc/semicircle** anchored low-left, bleeding off the left and bottom edges (radius ≈ 55–65% of viewport height).
- **Right track → large `--red` form** (quarter-disc or crescent) anchored upper-right, bleeding off the edges.
- **Center corridor → near-black circular "stage"** (≈ 30% of viewport height in radius) at the car's lane, with a **thin `--steel` ring** and a slightly offset thin `--red` ring (the principle of the central disc + accent ring in the watch reference). This is the reserved spot where a featured car will sit in Plan2; leave it empty and elegant.
- Graphite secondary regions fill the remaining negative space. Overlaps are deliberate and aligned to a simple underlying grid.
- **Mobile/portrait:** the same idea rotated into a vertical stack (large forms at top and bottom, stage in the middle).
- Contrast: nav and text overlay areas must meet WCAG AA against whatever region they sit on.

### Scene 7 — Resolved hero state
After the shapes settle, reveal (short, staggered, restrained):
- **Navigation bar:** logo (left), items `Buy · Sell · Rent · Collections` (placeholder, non-functional `href="#"`), `Search` and `User` lucide icons (right). Mobile: logo + `Menu` icon (non-functional is fine for Plan1).
- A small vertical micro-label (e.g. `PREMIUM AUTOMOTIVE MARKETPLACE`) with a short `--red` rule, and a **scroll cue** (thin animated line, not a cartoon mouse).
- Nothing else. The composition itself is the hero. Leave a clearly commented slot for Plan2 content.
- Below the hero: one **blank full-height section** (solid `--charcoal`) so scrolling can be tested. Lenis smooth scroll becomes active only now.

### Intro control rules
- **Never trap the visitor.** A visible, keyboard-accessible **Skip** control appears after ~1.2 s. Skip performs a short (≤ 0.8 s) cross-dissolve straight to the resolved hero, not a hard cut.
- **Play once per session** (`sessionStorage`). On repeat visits in the same session, show only a brief (~0.8 s) reveal of the resolved hero and **do not download the GLB or mount WebGL at all**.
- Query overrides: `?intro=replay` forces the full intro; `?intro=skip` jumps to the resolved state.
- Scroll is locked only while the intro plays; unlock on completion or skip.
- If WebGL fails, the context is lost, or assets are not ready within **8 s**, go straight to the resolved state. **Never leave the user on a black screen.**
- Dispose all Three.js resources and unmount the Canvas as soon as the transformation hands off, to release the GPU.

---

## 5. Architecture

### 5.1 Principles
1. **Deterministic, scrubbable animation.** Everything visual is a pure function of the master timeline's time `t`: car distance, camera distance, speed, track reveal length, text progress, shape morph progress. **No accumulated per-frame state** (no `position += speed * dt`). This makes skip, replay, resize, and the debug scrubber reliable. Tracks are drawn as a pre-built ribbon with a reveal limit driven by the car's current distance (uniform / draw range).
2. **One master GSAP timeline** (`lib/animation/masterTimeline.ts`) built from per-scene modules. It writes into a shared mutable object (`introState`) that R3F reads inside `useFrame` via refs. **Do not drive per-frame animation with React state.**
3. **Client-only canvas.** Load the R3F canvas with `next/dynamic` (`ssr: false`) inside a client component. Wrap in an error boundary and `<Suspense>`.
4. Use `useGSAP` / `gsap.context()` so cleanup is correct under React Strict Mode (no doubled timelines).
5. World-space road: the road plane follows the camera and derives UVs from world position (infinite road without huge geometry). Light and shadow stay consistent while the car appears to drive.
6. Responsive via a single `useViewportLayout()` hook that returns layout mode (desktop / tablet / portrait / landscape-phone) and drives car size, lane position, text placement, and shape configs.

### 5.2 Folder structure

```
app/
  layout.tsx            fonts, metadata, theme color, global grain
  page.tsx              <IntroSequence/> + <Hero/> + <PlaceholderSection/>
  globals.css           Tailwind v4 @theme tokens, base styles
components/
  intro/
    IntroSequence.tsx   orchestrates tiers, session logic, timeline, skip
    LoadingScreen.tsx
    IntroText.tsx       headline, body, CTA (+ mask reveal)
    SkipButton.tsx
    IntroCanvas.tsx     dynamic R3F canvas + error boundary
  scene/
    CarModel.tsx        GLB loading, auto-normalization, paint material
    Road.tsx            procedural asphalt shader
    TrackRibbons.tsx    WebGL tire tracks (shared outline function)
    Lighting.tsx        key light, env, shadows, headlight pools
    CameraRig.tsx       top-down camera + follow/release logic
  transition/
    TrackMorphLayer.tsx SVG overlay, morph + layered passes
    shapes.ts           target composition per layout mode (tunable)
  hero/
    Navbar.tsx
    HeroDetails.tsx     vertical label, scroll cue
    PlaceholderSection.tsx
  debug/
    DebugPanel.tsx      scrubber, overlays, FPS (only with ?debug)
config/
  car.config.ts         everything model-specific
  site.config.ts        brand name (placeholder), copy, nav items
lib/
  tracks.ts             shared pure outline function
  animation/
    timing.ts           ALL durations/delays in one place
    masterTimeline.ts
    scenes/             entry.ts, cruise.ts, text.ts, departure.ts, transform.ts, resolve.ts
    introState.ts       shared mutable state read by useFrame
    easing.ts
  hooks/
    useReducedMotion.ts
    useDeviceTier.ts
    useViewportLayout.ts
    useIntroGate.ts     session logic and query overrides
public/
  models/car.glb        (optimized)
  brand/logo.png
  fallback/car-topdown.webp   (generated in M7, transparent, for the low tier)
DECISIONS.md
README.md
netlify.toml
```

---

## 6. Performance, tiers, accessibility

### 6.1 Device tiers (`useDeviceTier`)
Decide with cheap heuristics (`hardwareConcurrency`, `deviceMemory` where available, viewport size, coarse pointer, `Save-Data`, WebGL support) **plus** a runtime check (drei `PerformanceMonitor`) that degrades on the fly.

| Tier | Who | Rendering |
|---|---|---|
| **High** | Desktop, strong GPU | DPR ≤ 2, 2048 shadow map, road streak shader, full effects |
| **Medium** | Tablets, capable phones | DPR ≤ 1.5, 1024 shadow map, no road streaking, simpler road shader |
| **Low** | Weak devices, no WebGL, `Save-Data` | **No WebGL.** 2D version using `public/fallback/car-topdown.webp`, CSS/GSAP transforms, an SVG road/tracks. Same timeline, same text, same shape transformation, same identity |

### 6.2 Budgets
- 60 fps on desktop; ≥ 30 fps (aim 60) on a mid-range phone in the Medium tier.
- Shipped GLB ≤ 3 MB; no downloaded textures except the tiny grain (< 50 KB); 3D code (three/R3F) in a separate lazy chunk that is **not** loaded on repeat visits or the Low tier.
- Draw calls: keep under ~60. Cap pixel ratio. Stop the render loop completely after handoff.
- Compile shaders / warm up before the intro starts (avoid first-frames hitching).
- Avoid layout shift. Fonts via `next/font`. No post-processing library; vignette and grain are done in-shader or via DOM overlay.

### 6.3 Reduced motion and accessibility
- `prefers-reduced-motion: reduce` → **skip the cinematic entirely**; show the resolved hero with a simple opacity fade (no transforms, no parallax, no scroll smoothing).
- Canvas and decorative SVG are `aria-hidden`. The `<h1>` and CTA are real DOM and keyboard reachable. Visible focus rings. Skip button is the first focusable element during the intro.
- Text contrast ≥ WCAG AA on every region it sits on.
- Page `<title>`, meta description, `theme-color` (`--ink-950`), favicon from the logo, basic Open Graph placeholders.

---

## 7. Responsive layout spec

| Mode | Car | Text | Shapes |
|---|---|---|---|
| **Desktop ≥ 1024 px** | lane at `carScreenX` (0.5), length ≈ 40% of viewport height | right side, left edge at ≈ 60% of viewport width, vertically centered | composition per 4/Scene 6 |
| **Tablet 768–1023 px** | same lane, slightly smaller | right side, tighter, smaller headline | scaled composition |
| **Portrait phone** | lane 50%, vertical center ≈ 0.38, length ≈ 28% of viewport height | stacked **below** the car in the lower ~38% of the screen, left aligned with comfortable side margins | vertical-stack composition |
| **Landscape phone** | smaller car, lane ≈ 0.38 | right side, compact; headline reduced, description hidden if it does not fit | scaled composition |

The tracks must span the full viewport height in **every** mode and during window resize (recompute camera framing and ribbon length from the layout, not from constants).

---

## 8. Stack and setup

- **Next.js (latest stable, App Router), React, TypeScript (strict), Tailwind CSS (v4, `@theme` tokens).**
- **three, @react-three/fiber, @react-three/drei** (use drei sparingly: `PerformanceMonitor`, `useGLTF`/loaders, helpers only where it saves real effort).
- **gsap** (+ **@gsap/react**) with ScrollTrigger / SplitText / MorphSVGPlugin as needed (all included in the free package).
- **lenis** (activated after the intro only).
- **lucide-react** for icons.
- Dev: ESLint, Prettier.
- **Do not add:** Framer Motion, state libraries, post-processing libraries, UI kits. If something seems necessary, justify it in `DECISIONS.md`.
- Verify current versions; React 19 requires a compatible R3F major. Record the versions you pinned in `README.md`.
- **Netlify-ready:** `next build` must pass with zero errors; avoid anything needing a custom server; add a minimal `netlify.toml` (Node version, build command). Do not deploy. Document the Netlify steps in `README.md` in plain language (connect repo, build command, publish settings).
- Package manager: `npm`.

---

## 9. Milestones

For each: build it, verify it in the browser, report, then wait for "approved".

### M1 — Setup and architecture
Scaffold the app, tokens, fonts, folder structure, `config/` files, `DECISIONS.md`, `README.md` skeleton, lint/format, asset pipeline (optimize GLB and logo, report numbers).
**Owner sees:** a clean dark page with the correct fonts/colors, the logo on the loading screen, and a short report on the model (triangles, size, orientation).

### M2 — Scene, road, car, loader
Top-down camera, asphalt road shader, lighting and shadows matching the reference, the car auto-normalized and centered, headlight pool, loading screen → scene handoff, error boundary and 8 s timeout fallback, `?debug` panel with contact-point overlay.
**Owner sees:** a static, beautiful top-down shot that resembles `car-topdown-reference.png` in mood, on a near-black asphalt surface.

### M3 — Motion: entry, cruise, departure
Master timeline skeleton, deterministic `introState`, car entry and cruise with scrolling road, camera follow → release, departure through the top. Scrubber works.
**Owner sees:** the car driving in from below, cruising at the lane, then accelerating out of the top; the road stops after it leaves.

### M4 — Tire tracks
Shared outline function, WebGL ribbons, gradual fade-in, persistence, full-viewport coverage on all aspect ratios.
**Owner sees:** red tread marks following the rear tires and remaining after the car leaves, covering the screen top to bottom.

### M5 — Text introduction
`IntroText`, masked line-by-line reveal, CTA, responsive placements, text exit, Skip button.
**Owner sees:** the headline composition appearing on the right (or below the car on mobile) in sync with the drive, then leaving cleanly before departure.

### M6 — Transformation and resolved hero
SVG handoff, expansion and morph, layered color passes, final composition, grain, navbar with logo, vertical label, scroll cue, blank placeholder section, Lenis. **Expect to iterate**: be ready to present 2 variations of the shape choreography if the first doesn't feel cinematic.
**Owner sees:** the full intro from first frame to resolved hero, as one continuous gesture.

### M7 — Robustness
Device tiers, Low-tier 2D version (generate `fallback/car-topdown.webp` from the GLB with a small dev-only capture page or script), reduced motion, once-per-session logic, query overrides, WebGL context loss, resize behavior, GPU disposal.
**Owner sees:** the same experience on weaker devices, instant resolved state when reduced motion is on, and no black screens on failure.

### M8 — Polish and release prep
Timing and easing pass (frame by frame with the scrubber), contrast and a11y audit, performance profiling (report fps and bundle sizes), cross-browser checks (Chromium, Safari/WebKit if available, Firefox), README finalization, `next build` verified clean.
**Owner sees:** a refined, demo-ready build and a README explaining how to run it, swap the car/logo/accent, tune timing, and deploy to Netlify.

---

## 10. Verification procedure and acceptance checklist

### Screenshot protocol (attach to each relevant report)
Viewports: **1920×1080, 1440×900, 768×1024, 390×844 (portrait phone), 844×390 (landscape phone)**.
Timestamps (use the scrubber): **0, 1, 2, 3, 4.5, 6, 7.2, 8, 8.8, 9.5, 10.5, 11.5 s**.

### Acceptance checklist (all must pass before M8 is approved)
- [ ] Scene order and timings match Section 4; total ≤ ~11–12 s to interactive hero
- [ ] Camera is exactly top-down; the car is a real 3D model; lighting and shadow resemble the reference
- [ ] Car enters from below, stays near the lane, road scrolls smoothly; acceleration and deceleration feel physical
- [ ] No wheel animation anywhere
- [ ] Tracks begin at the rear tire contact points, have constant spacing, tread detail, and persist after the car leaves
- [ ] Tracks span the full viewport height at the moment the road stops, in all five viewports
- [ ] Car exits through the top by moving (not by fading); camera release behaves as in Scene 5
- [ ] Track → SVG handoff has no visible pop
- [ ] Shapes visibly originate from the tracks; not a wipe, not a fade; layered, art-directed final composition
- [ ] Final composition is balanced, legible, grain applied, nav and labels meet contrast
- [ ] Skip works (mouse and keyboard); repeat visit in the same session shows no 3D load; `?intro=replay` and `?intro=skip` work
- [ ] Reduced motion → resolved hero immediately, no cinematic
- [ ] Failure paths: blocked WebGL, slow asset (8 s timeout), context loss → resolved hero, never a black screen
- [ ] WebGL resources are disposed after handoff (verify in the debug panel)
- [ ] Changing the accent token re-themes tracks, shapes, CTA; swapping `car.glb` + editing `car.config.ts` works without touching other files
- [ ] Zero console errors/warnings in production build; `next build` passes
- [ ] Nothing from the "Avoid" list in 3.6 is present

---

## 11. Debug tooling (required; shown only with `?debug`)

- **Timeline scrubber** with play/pause, step ±1 frame, and jump-to-scene buttons; displays the current `t`.
- Toggle overlays: tire contact points, car bounding box, safe areas, layout mode name, track coverage rectangle.
- FPS, draw calls, triangles, GPU memory estimate, current device tier (and a control to force a tier).
- A control to override layout mode and `carScreenX`.
- None of this ships to normal visitors (no debug UI and no bundle weight without `?debug` where practical).

---

## 12. Things I (the owner) will provide later or may change
- A different car model (drop-in via `config/car.config.ts`)
- Accent color (single token)
- Brand name (use a clearly marked placeholder `brandName` in `config/site.config.ts` for now; read the logo for hints, but do not invent a name in the UI beyond that placeholder)
- Real listing photos and marketplace content (Plan2)

**Start with Milestone 1. Before you begin, briefly confirm you've read this plan by listing the three riskiest parts of it and how you intend to handle them, then proceed with M1.**
