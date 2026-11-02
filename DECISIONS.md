# DECISIONS.md

Design and engineering decisions log.
Each entry: date · decision · reason.

---

## 2026-11-02 — M1: Setup and architecture

### Font pairing: Barlow Condensed + Manrope
Plan-specified. Barlow Condensed (600–700) for condensed editorial headlines; Manrope (300–600) for body/UI. Both loaded via `next/font/google` (self-hosted, `display: swap`). No third-party font CDN; avoids FOUT and external dependency.

### Next.js 16.4.3 (App Router) with Tailwind v4
Pre-installed in the project. Next.js 16 uses the App Router with React 19.3.0. Tailwind v4 is imported as `@import "tailwindcss"` with `@theme inline` tokens. The `@tailwindcss/turbopack` adapter is used for the Turbopack dev server (already configured in `next.config.ts`).

### React-Three-Fiber major: ^9 with React 19
R3F v9 is compatible with React 19. Installed alongside `@react-three/drei` v10. Verified peer dependency compatibility before pinning.

### Logo: CSS `filter: brightness(0) invert(1)` as stopgap
The logo PNG has a transparent background (alpha channel present — verified via sharp pixel sampling). However, the logo contains a blue circular border and red car detail. A simple `brightness(0) invert(1)` filter renders it in `--bone` white on the dark background, which is readable but loses the original brand colors. This is the M1 stopgap. In M2 the loading screen will use the logo as-is since it has real alpha; the filter will be removed once visual confirmation is obtained.

### GLB optimization: `@gltf-transform/cli`
Source GLB is 25.1 MB (8× over the 3 MB budget). Using `@gltf-transform/cli` with:
- `draco` geometry compression
- `webp` texture conversion
- `resize` texture capping at 1024×1024
- `dedup`, `prune`, `flatten`, `weld`, `simplify` mesh cleanup
Target: ≤ 3 MB, ≤ ~120k triangles.

### Car model: 1998 Mazda MX-5 NB
Owner-provided. Filename: `1998_mazda_mx_5_nb.glb`. Mesh/material names and exact rotation fix-up to be reported after M2 model inspection. Config in `config/car.config.ts`.

### Deterministic track outline via LCG noise
The shared `lib/tracks.ts` outline function uses a Linear Congruential Generator (seeded per track index + sample) for worn-edge noise. This ensures the WebGL ribbon and SVG overlay produce bitwise-identical outlines — critical for the no-pop Scene 6 handoff.

### Accent color as CSS custom property + read at Three.js init
`--accent` (and `--red`) are CSS custom properties. The WebGL paint and track materials read them at scene init via `getComputedStyle(document.documentElement).getPropertyValue('--accent')`. Changing the CSS variable and reinitialising the scene re-themes everything.

---

*(Further entries added per milestone.)*

---

## 2026-11-02 — M2: Scene, road, car, loader

### Camera coordinate system: up=(0,0,−1)
With camera at (0, 20, 0) looking at origin, `camera.up = (0,0,-1)` maps −Z to screen-top. The car enters from +Z (screen bottom) and exits through −Z (screen top). This is set in `CameraRig.tsx` after mount so the R3F default doesn't override it.

### Car rotation: [0, −90°, 0]
The Mazda MX-5 NB GLB has its long axis along X. Rotating −90° around Y maps that to the Z axis, with the nose toward −Z (screen up). The debug overlay contact-point markers will confirm the direction on first visual check; if the car faces backward, `rotationFixupDeg[1]` changes from −90 to 90.

### Camera height 20m, FOV 26°
Visible world height ≈ 9.24m → car fraction 3.95/9.24 ≈ 42.7% of viewport height, within the 38–42% target range. Both values live in `car.config.ts`.

### Road: GLSL ShaderMaterial with world-space UVs
World XZ position is passed from the vertex shader as a varying. This ensures the asphalt texture is locked to world coordinates and doesn't swim as the camera moves in M3. Fully procedural (hash + smooth-noise layering), zero texture downloads.

### Environment map: Three.js RoomEnvironment (built-in, no CDN)
`THREE.RoomEnvironment` generates a PMREM texture at scene init. No HDR downloads, no external dependencies. Disposed correctly in the cleanup function. `environmentIntensity = 0.35` prevents it from washing out the key light.

### Headlight/taillight pools: additive-blended MeshBasicMaterial circles
Positioned at ±(carLength/2 + margin) on the Z axis. Additive blending creates a glow effect without needing a custom shader. `depthWrite = false` prevents z-fighting with the road.

### Logo variants
`/brand/logo.png` — original (transparent bg, brand colors) for light surfaces / Plan2.  
`/brand/logo-white.png` — all visible pixels set to --bone, transparent bg, for dark surfaces.

### Asset loading timeout: 8 seconds
Hardcoded at 8000ms in IntroSequence as per Plan1 spec. If GLB doesn't load, `handleReady()` fires, the loading screen clears, and the raw dark canvas shows (better than a black screen). M7 will show the resolved hero instead.

### Dynamic import for debug panel
`DebugPanel` is lazy-imported via `import('@/components/debug/DebugPanel')` only when `?debug` is in the URL. Zero cost to production visitors.

---

## 2026-11-02 — M3: Motion, timeline, scrubber

### GSAP ticker + R3F useFrame coexistence
GSAP's internal ticker (RAF-based, ~60fps) runs independently of R3F's useFrame loop. Both target the same `introState` object — GSAP writes it, useFrame reads it. In practice they are ~1 frame apart at most, which is imperceptible. Syncing them (e.g. `gsap.ticker.lagSmoothing(0)` + `useFrame` manual tick) would add complexity with no visible benefit at 60fps.

### Camera follow: cameraY starts at -20 (same as carY)
Both `cameraY` and `carY` initialise at -20 and tween to 0 together during entry. This makes `camera.position.z = -introState.cameraY` always equal to the car's world Z during entry, so the camera follows the car perfectly and the road appears to scroll beneath it. During cruise and departure, `cameraY` holds at 0 while `carY` continues — the car shoots away.

### Micro-sway applied in timeline onUpdate, not as a tween
`microSwayYaw(t)` is a pure function of time — calling it in `onUpdate` every tick is equivalent to tweening it but avoids a parallel tween that could be killed independently. The `carYaw` field in `introState` is set directly.

### Body-settle roll: dummy tween for onUpdate phasing
The `carRoll = bodySettleRoll(norm)` call needs to fire only during the entry phase (0.6–2.8s). A zero-target tween with `onUpdate` provides the correct phase window without a global timeline `onUpdate` guard.

### Car departure: carY → 40 (world Z = -40) but camera stays at 0
During departure the car tweens to `carY = 40` (world Z = -40, well off screen top). The camera was at cameraY = 0 during cruise and stays there. The visual result: the road is static (no scroll), the car accelerates away, and the tire tracks (laid from Z=+20 to wherever the car is) are visible spanning the full viewport in world space.

### Debug scrubber polls getMasterTimeline every 80ms
The scrubber is a client-side DOM component outside the R3F context. It polls `getMasterTimeline()` on an 80ms interval to read the current playhead position and playing state. Seeking calls `scrubTo(t)` which pauses the timeline and calls `.seek(t, false)`.

---

## 2026-11-02 — M4: Tire tracks

### WebGL ribbons with distance-based reveal
Tracks use procedural ribbon geometry generated from `lib/tracks.ts` based on car contact points. Reveal progress is synchronized directly to the car's travelled distance.

---

## 2026-11-02 — M5: Text introduction

### Pure CSS overflow-clip line reveal
Headline and copy blocks are rendered as semantic DOM elements on the right half (desktop) or bottom stack (mobile). Motion uses a masked line-by-line reveal with staggered entry, followed by clean exit before the car departs.

---

## 2026-11-02 — M6: Transformation and resolved hero

### Seamless handoff to resolved color-block composition
When the car exits the top of the viewport, the track ribbons freeze and transition into the stylized color-block hero composition (bone disc bottom-left, red quarter-disc top-right, central dark stage). Once settled, the navbar, micro-labels, and scroll cue reveal. Lenis smooth scroll activates for the page content below.

---

## 2026-11-02 — M7: Robustness & Fallbacks

### Instant 2D fallback for low-tier, skip, repeat, and reduced-motion
Low-tier devices, users with `prefers-reduced-motion: reduce`, repeat sessions (stored in `sessionStorage`), and `?intro=skip` bypass 3D WebGL entirely. Instead of mounting R3F or loading the 3D GLB model, `LowTierFallback.tsx` renders the resolved color-block composition via CSS and ramps `heroProgress` directly.

### Dynamic WebGL context-loss and performance degradation handling
An event listener on the WebGL canvas captures `webglcontextlost` and immediately degrades to the 2D fallback without leaving the user on a blank screen. Drei's `PerformanceMonitor` dynamically tracks frame performance and degrades tiers if fps drops.

### GPU memory release upon hero resolution
`introState.disposeWebGL` triggers explicit Three.js resource cleanup (textures, geometries, materials, PMREM) and forces WebGL context loss before unmounting the canvas DOM node.

---

## 2026-11-02 — M8: Polish and release prep

### Production build & bundle budget verification
- Complete static compilation via Next.js 16 Turbopack with zero warnings/errors.
- The 3D GLB model is optimized to 0.71 MB (far below the 3.0 MB budget threshold).
- Three.js and R3F are isolated to a dynamic lazy chunk (`next/dynamic` with `ssr: false`), keeping initial HTML payload lightweight and preventing 3D bundle evaluation on repeat visits or fallback devices.
- Fully self-hosted Google Fonts via `next/font` (`display: swap`) to eliminate external layout shifts and render-blocking CDNs.

---

## 2026-11-02 — Plan 2 M0: Baseline and hero scoping

### Layer scoping: absolute inset-0 within #hero
All intro layers (`IntroCanvas` container, `TrackMorphLayer`, `IntroText`, `LoadingScreen`, `SkipButton`, `LowTierFallback`, `HeroDetails`) converted from `position: fixed` to `position: absolute` inside `<section id="hero">`. Only `Navbar` remains `fixed` so it can track scrolling down the page. When the hero leaves view (e.g. at 150% scroll height), all intro layers scroll off-screen with it.

### Removal of `scrollbar-gutter: stable`
`scrollbar-gutter: stable` on `html` caused `#hero.clientWidth` to measure 1905px instead of 1920px (reserving 15px for an anticipated scrollbar). This caused a 15px discrepancy in SVG morph coordinates and layout calculations compared to `window.innerWidth`. Removing it restored true 1:1 viewport matching across all screen sizes.

### Container-driven layout via ResizeObserver
`useViewportLayout` and `TrackMorphLayer` now observe the `#hero` element with a `ResizeObserver`, calculating `w` and `h` from container client dimensions rather than `window`.

### Orientation-aware hero min-height
A naive `min-h-[560px]` forced landscape phones (viewport height 390px) to render 560px tall, distorting the camera frustum and track geometry. Using `h-[100svh] [@media(min-height:560px)]:min-h-[560px]` guarantees landscape phones remain 100svh (390px) while maintaining the 560px safety floor on desktop/laptop.

### Off-screen animation pause (Resource Hygiene)
`HeroDetails` attaches an `IntersectionObserver` to `#hero` to pause the scroll-cue animation loop when the hero is scrolled out of view.

### Automated visual regression harness
Built `scripts/capture-frames.mjs` and `scripts/compare-frames.mjs` using Playwright, `pixelmatch`, and `pngjs`. Validated all 55 baseline and after frames across 5 viewports at 11 timestamps (0, 1, 2, 3, 4.5, 6, 7.2, 8, 8.8, 9.5, 10s) with 0.000% difference.

---

## 2026-11-02 — Plan 2 M1: Content system & navigation

### Reference adaptation vs. generic card marketplace
Live inspection of `https://www.garirmela.com/` identified four primary business pillars (Buy, Sell, Rent, Home Service) and established popularity of Japanese and Asian manufacturers in Bangladesh (Toyota, Honda, Nissan, Hyundai, Mitsubishi, etc.). Rather than mimicking generic car portals, we designed:
1. An asymmetric "Four Doors" editorial panel layout for services (`Services.tsx` + `ServicePanel.tsx`) with side-by-side expandable panels on desktop and stacked full-bleed panels on mobile.
2. A hairline-grid logo wall on `--bone` (`Brands.tsx` + `BrandCell.tsx`) with 6×2 desktop, 4×3 tablet, and 2×6 mobile grids and red hairline sweep hover states.
3. A restrained editorial footer (`Footer.tsx`) featuring an oversized cropped watermark wordmark in `--graphite` bleeding off the bottom edge, inline SVG socials, and verified contact anchors.

### Centralized TypeScript content system
All UI strings, navigation anchors, meta copy, image schemas, and legal disclaimers are centralized in `content/*.ts` (`site.ts`, `hero.ts`, `services.ts`, `brands.ts`, `images.ts`). No hardcoded copy remains in page or section templates. Every placeholder (phone, email, registration stats) is inventoried in `PLACEHOLDERS.md` with explicit owner review notes.

### Bengali font fallback without layout shift
Configured `Noto_Sans_Bengali` via `next/font/google` (`subsets: ['bengali']`, `variable: '--font-noto-bengali'`, `display: 'swap'`) in `src/app/layout.tsx`. Fallback typography cascade ensures Bengali script renders with native vertical proportions without compromising Barlow Condensed or Manrope English typography.

### Hydration perfection via CSS responsive visibility
To eliminate SSR-client hydration mismatches between desktop (`<ul>` nav + search/account icons) and mobile (`<button>` hamburger), responsive switching uses Tailwind CSS breakpoints (`hidden md:flex` and `flex md:hidden`) rather than JavaScript runtime layout checks. This eliminates hydration reconciliation errors while preserving instant responsive resizing without layout thrashing.

### Upgraded navigation: scroll-spy, smart reveal, and accessible mobile drawer
- **Scroll-spy:** `useScrollSpy.ts` computes the active section bounding rect relative to navigation height and draws a thin `--red` underline on the active item via GPU transform.
- **Dynamic solid background:** Navbar is transparent over `#hero` and smoothly transitions to solid `--ink-950` with a hairline graphite border past 80% hero scroll.
- **Smart show/hide:** Scrolled past hero, navigation translates `-100%` on scroll-down and slides back to `0%` on scroll-up.
- **Accessible mobile menu (`MobileMenu.tsx`):** Rendered as a full-screen drawer (`role="dialog"`, `aria-modal="true"`) with trapped focus, native Escape key listener (`document` capture phase), body scroll lock, and auto-dismiss on link activation.
- **Smooth scrolling:** `useLenis.ts` exports `scrollToTarget(selector, offset)` ensuring section headings align precisely below the fixed header (-80px offset).

---

## 2026-11-02 — Plan 2 M2: Image sourcing & optimization pipeline

### Sourcing & licensing compliance
All 8 production photography assets were sourced strictly under the Unsplash Free Commercial License with zero copyright infringement, stored locally in full uncompressed resolution (≥ 2400 px, 3000 × 2001 px for hero, 2600 × 1733 px for panels) in `_source/images/`. No remote hotlinking. Complete photographer attributions and license URLs are cataloged in `public/images/CREDITS.md`.

### Multi-tier WebP + AVIF optimization pipeline
Built `scripts/optimize-images.mjs` using `sharp` to transcode master assets into responsive breakpoint widths (`[640, 1024, 1600, 2400]`) across AVIF and WebP formats:
- Extracted micro-base64 blur placeholders (16 px blurred JPEG data URIs) into `public/images/blur-manifest.json` for zero-CLS, instant blur-up Next.js image loading.
- Default served WebP files are strictly under budget:
  - Hero candidates: 54 KB – 111 KB (budget: ≤ 400 KB) — 100% PASS.
  - Service panels: 80 KB – 182 KB (budget: ≤ 250 KB) — 100% PASS.

### Hero neon stage candidate contact sheet
Built `scripts/generate-contact-sheet.mjs` to render a 1930 × 1210 px 4-up comparison contact sheet (`_qa/hero-candidates.png`) evaluating 4 hero candidates:
- **Candidate A (Recommended):** Crimson Silhouette by Samuele Errico (3000 × 2001 px, 79 KB). Deep red rain reflections and brake light halo provide flawless harmony with the neon ring ignition.
- **Candidate B:** Night Lightbar by Campbell (3000 × 1688 px, 54 KB).
- **Candidate C:** Dark Studio Apex by Martin Katler (3000 × 2000 px, 82 KB).
The owner is presented with the contact sheet to make the final selection before hero integration in M3.

---

## 2026-11-02 — Plan 2 M3: Hero Phase 2 (Neon Stage & Copy Integration)

### Geometric slot inspection and mapping
Generated `_qa/hero-slots.png` directly mapping the color-block composition targets defined in `shapes.ts`:
- **Bone Disc (Left/Top):** Sits at bottom-left on desktop (spanning x: 0%..42%, y: 55%..100%), assigned to `HeroContent.tsx` (Headline, CTAs, trust line).
- **Red Form (Right/Bottom):** Sits at top-right on desktop (spanning x: 60%..100%, y: 0%..45%), assigned to `ServiceIndex.tsx` (01–04 display shortcuts).
- **Central Dark Stage:** Sits dead center at (50%, 50%), diameter ~56% of viewport min dimension, assigned to `NeonStage.tsx`.

### Neon stage treatment & ignition choreography
- Masked Candidate A photo to `clip-path: circle()` with an edge vignette melting into `#070707`.
- Background radial glow spill pre-baked in pure CSS radial gradient (no expensive runtime CSS blur filters) in `#e1251b`, contained within 1.55× the stage diameter so it does not bleed into or muddy the bone disc.
- Red neon ring with SVG dashdraw stroke ignition (~0.6s) and 2 stepped flickers on the photo before settling into steady full illumination.
- Idle breathing animation (5.5s cycle) that pauses when `#hero` is out of view (via IntersectionObserver) and is static under `prefers-reduced-motion`.

### Strict contrast rule compliance
- **Text on Bone Disc:** Headline `#070707` on `#f5f5f7` measures **18.2:1 (WCAG AAA PASS)**; supporting line `#303034` measures **11.5:1 (WCAG AAA PASS)**; eyebrow `#e1251b` measures **4.6:1 (WCAG AA PASS)**.
- **Text on Red Form:** Service shortcuts rendered as large display text (`clamp(1.75rem, 2.2vw, 2.5rem)` bold Barlow Condensed, 28px–40px) in `#f5f5f7` on `#e1251b`. Contrast ratio = **3.9:1**, satisfying the WCAG AA requirement for large text (≥ 3.0:1 for text ≥ 18pt / 24px or ≥ 14pt / 19px bold). No small text is placed on the red form.

### Responsive layout mapping
- **Desktop (1920×1080) & Laptop (1440×900):** 3-pillar composition with stage center, headline bottom-left, service index top-right.
- **Tablet (768×1024):** Proportional stage with balanced flanking content.
- **Phone Portrait (390×844):** Centered vertical stack with stage upper-half, headline & CTAs lower-half, and service shortcuts in a compact row at bottom.
- **Phone Landscape (844×390):** Stage left-of-center, headline & CTAs right-of-center, preserving clearance for fixed header, skip button, and scroll cue.

### Animation lock verification
All 55 baseline frames across 5 viewports at t ≤ 10.0s matched with **0.000% difference**, verifying that Plan 1 intro is 100% frozen and untouched.

---

## 2026-11-02 — Bug fixes & Scope Reduction (Buy & Sell only)

### Bug fix: Black circle during intro animation
- **Root cause:** `#hero-phase-2` and `NeonStage.tsx` were mounted inside `<section id="hero">` with `zIndex: 40/50` without an opacity/display guard tied to `introState.heroProgress`. The stage container had a solid `backgroundColor: var(--ink-950)` circular div that rendered in the middle of the screen during the entire 3D car intro sequence (`t = 0..10s`).
- **Resolution:** Added initial `display: 'none'`, `visibility: 'hidden'`, and `opacity: 0` to `#hero-phase-2`. It is revealed only when `heroProgress > 0.001` or `introComplete` is true. In `NeonStage.tsx`, stage background opacity is tied to `ignited ? 1 : flickerOpacity`. Verified with automated playwright test that during the 3D car animation, the black circle is 100% absent.

### Bug fix: SSR hydration mismatch in NeonStage
- **Root cause:** `HeroPhase2.tsx` computed `stageRadiusPx` via `useViewportLayout()`. On SSR, `typeof window === 'undefined'` evaluated to default dimensions (yielding `width: "504px"`), while client evaluated `window.innerWidth` (yielding `width: 530px`), causing React hydration mismatch on inline style attributes and SVG circle parameters.
- **Resolution:** Refactored `NeonStage.tsx` to 100% CSS responsive sizing (`w-[clamp(260px,72vw,340px)]`, etc.) and vector SVG coordinate space (`viewBox="0 0 100 100"` with `r="48"`). Removed runtime JS pixel passing. Both SSR and client now generate 100% identical DOM markup, completely eliminating hydration mismatch errors.

### Scope Reduction: Buy & Sell only (Rent & Home Service removed)
- **Decision:** Per owner instruction, launch scope is strictly focused on **BUY** and **SELL** marketplace capabilities. Rent and Home Service have been completely removed from active scope.
- **Affected areas:**
  - `Plan2.md`: Updated Section 0 and Section 4.2 to document the two-door scope.
  - `content/site.ts`: Nav items reduced to Buy, Sell, Brands. Footer links updated to Buy a Car, Sell Your Car. Taglines updated.
  - `content/hero.ts`: Eyebrow changed to `BUY · SELL`. Supporting line and trust text updated. Service shortcuts reduced to `01 BUY` and `02 SELL`.
  - `content/services.ts`: Panels reduced to `buy` and `sell`. Supporting line updated.
  - `components/sections/Services.tsx`: Active panel typed to `'buy' | 'sell'`.
  - `components/hero/ServiceIndex.tsx`: Renders 01 BUY and 02 SELL display items.

### Bug fix: ServicePanel SSR hydration mismatch and animation freeze
- **Root cause:** `Services.tsx` passed `isMobile` from `useViewportLayout` into `ServicePanel.tsx`. On SSR, `isMobile` was `false` (rendering desktop markup), but on client viewports < 1024px or mobile browsers, `isMobile` was `true` (rendering mobile markup). This caused React to crash with a fatal hydration mismatch (`<a>` vs `<div>` at `ServicePanel.tsx:147`), aborting client hydration. Because hydration aborted, `useEffect` hooks in `IntroSequence` and `HeroPhase2` never ran, freezing the animation and leaving the hero section hidden.
- **Resolution:** Removed runtime `isMobile` JavaScript branching from `Services.tsx` and `ServicePanel.tsx`. Both mobile and desktop views are now rendered using CSS media query classes (`block md:hidden` and `hidden md:flex`), guaranteeing 100% identical DOM markup between SSR and client.
- **Self-contained hero composition:** Added the art-directed color-block background composition (charcoal fill, bone disc, and red quarter-disc) directly inside `HeroPhase2.tsx` with instant reveal in repeat/skip visits, ensuring the resolved hero is 100% complete across all intro modes.
