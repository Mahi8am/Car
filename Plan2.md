# Plan2 — Landing Page Completion
### Premium Automotive Marketplace · Frontend only · Builds on Plan1

> **Read this entire document before touching anything.**
> You are the same lead creative developer and UI designer who built Plan1. The owner is **not** an experienced developer: decide things yourself, explain in plain language, and ask a question only when genuinely blocked.
> Everything in **Plan1.md** (design language, tokens, typography, "Avoid" list, performance budgets, accessibility rules, working rules, report format) **still applies** unless this document explicitly says otherwise. Re-read Plan1 Sections 0, 3, 6 and 8 first.

---

## 0. What Plan2 delivers

1. **Scope the cinematic to the hero only.** The intro animation currently behaves as if it owns the whole page. After Plan2 it lives inside the first section only, and the rest of the page scrolls normally below it.
2. **Fill the hero's text space** (the resolved hero after the transformation) with a **neon, glow-in-the-dark car image** and proper hero copy.
3. **Build the rest of the landing page**, in order below the hero:
   - **Services (Two Doors):** Buy · Sell, each with a full editorial picture (Scope note: Rent and Home Service are removed from current scope per owner decision)
   - **Popular car brands in Bangladesh**
   - **Footer**
4. Upgrade the nav (anchors, scroll-spy, working mobile menu, solid state on scroll).

### 0.1 The prime directive: the Plan1 animation is LOCKED
**Do not change how the Plan1 animation looks, moves, or is timed.** Not the car, road, lighting, tire tracks, text intro, departure, track→shape transformation, final shape composition, easing, or durations. The owner is happy with it.

You may only:
- Change **where it is mounted** (container/sizing), so it is confined to the hero section (Section 1).
- **Add** new content into the resolved-hero slot that Plan1 reserved (Section 2), using *additive* tweens that start after the existing Scene 7 tweens have been scheduled.
- Re-point the CTA target (see 1.5).

**Mark locked files** with a `// PLAN1-LOCKED: do not modify behavior` header comment and list them in `LOCKED.md`. At minimum: everything in `components/scene/`, `lib/tracks.ts`, `lib/animation/timing.ts` (existing values), `lib/animation/scenes/{entry,cruise,text,departure,transform}.ts`, `components/transition/shapes.ts` (existing geometry), and `components/intro/IntroText.tsx`.

**Proof it is untouched (required):** before changing anything, capture a **baseline** of the intro with the `?debug` scrubber using the Plan1 screenshot protocol (viewports 1920×1080, 1440×900, 768×1024, 390×844, 844×390; timestamps 0, 1, 2, 3, 4.5, 6, 7.2, 8, 8.8, 9.5, 10 s) into `_qa/baseline/`. After your refactor, capture the same frames into `_qa/after/` and compare them (a small script using `pixelmatch`/Playwright screenshots, as dev-only dependencies). **Frames at t ≤ 10.0 s must match the baseline** (tiny anti-aliasing differences are fine). Frames after t = 10 s may differ only by the new Plan2 hero content. Include the comparison result in your report.

---

## 1. Milestone work: scope the animation to the hero section

### 1.1 Audit first (report before fixing)
Find out *why* the animation takes over the whole page. Typical causes to check: intro layers (`canvas`, SVG morph layer, text layer, grain, vignette) using `position: fixed` or a full-window `100vh` wrapper; `body`/`html` overflow lock never being fully released; layout hooks (`useViewportLayout`) reading `window` instead of the hero container; the placeholder section being unreachable; leftover fixed layers after the intro finishes. Write what you found in two or three plain sentences in your report.

### 1.2 Target structure
```tsx
<main>
  <Navbar/>                     // fixed, appears after intro (see Section 5)
  <section id="hero" class="relative h-[100svh] min-h-[560px] overflow-hidden isolate">
     <IntroSequence/>           // canvas, SVG layer, text, skip, loader: all `absolute inset-0`
     <HeroContent/>             // Plan2 resolved-hero content (Section 2)
  </section>
  <Services id="services"/>
  <Brands id="brands"/>
  <Footer/>
</main>
```
- Every intro layer is `absolute` inside `#hero`. **No intro layer may remain `fixed`** (the Skip button and loader are `absolute` within the hero as well).
- Use `100svh` (with a `100vh` fallback) so mobile browser toolbars do not resize the hero mid-intro. The hero height must stay **stable during the intro** (don't re-run layout or restart the timeline when the mobile URL bar collapses).
- Replace any `window`-based measurement with a `ResizeObserver` on the hero container (`useViewportLayout` should read the container size). On desktop this equals the viewport, so the animation must come out identical.
- The hero scrolls away like any section. After the intro completes or is skipped: unlock scroll, start Lenis, and **verify no intro layer remains pinned to the viewport**. Scrolling to 150% of the viewport height must show only the sections below, with the hero fully out of view.
- Scroll is still locked **only while the intro plays** (Plan1 behavior).

### 1.3 Resource hygiene when the hero leaves view
After handoff, the WebGL canvas is already disposed (Plan1). Additionally pause any remaining hero-only animation (neon breathing, scroll cue) with an `IntersectionObserver` when the hero is off-screen, and resume when it returns.

### 1.4 Repeat visits, skip, reduced motion
All three paths (repeat visit in the same session, Skip, `prefers-reduced-motion`) must land on the **fully populated** resolved hero (including the neon image and copy), not on an empty composition.

### 1.5 CTA target
The Plan1 intro CTA "EXPLORE COLLECTION" now completes the intro (as before) and smooth-scrolls to `#services` instead of the old blank section. Remove the blank placeholder section.

---

## 2. The resolved hero (Phase 2): neon car and copy

This is the state right after the track→shape transformation settles (Plan1 Scene 7). Fill the space Plan1 reserved. **Do not change the shapes**; read their positions from `shapes.ts` and anchor content to them so layout stays correct at every viewport.

### 2.1 Inspect before designing
Open the finished Plan1 composition at all five viewports and identify the actual free regions: the bone disc (left), the red form (right), the central dark stage with its rings, and the margins. Put your findings in `_qa/hero-slots.png` (annotated screenshot) and design to those real regions, not to the descriptions in Plan1.

### 2.2 Content map (desktop; adapt per layout mode)

| Region | Content |
|---|---|
| **Central stage** (dark circle with steel + red rings) | The **neon car image** (2.3), the visual hero. |
| **Bone disc (left)** | Eyebrow, **headline**, supporting line, two CTAs. Text color `--charcoal`/`--ink-950` on bone. |
| **Red form (right)** | A compact **index of services**: `01 BUY · 02 SELL` in large condensed type (`--bone`), each linking (smooth-scroll) to its panel in `#services`. A functional in-hero shortcut, not decoration. |
| **Bottom edge** | The Plan1 scroll cue and vertical micro-label stay as they are. |

**Contrast rule (important):** `--bone` on `--red` measures only ≈ 3.8:1. So **only large display text (≥ 24 px, or ≥ 19 px bold)** may sit on the red form. Any small text must sit on bone, charcoal, or graphite. Measure every text/background pair and record results in your report.

### 2.3 The neon, glow-in-the-dark car image
**Look:** a low-key night image. Near-black surroundings, the car lit only by **red neon light** (rim light along the body lines, red reflections on dark glossy/wet ground), maybe a thin hot-white core in the brightest highlights. Cinematic and quiet, not cyberpunk: **no purple, cyan or blue neon**, no busy city bokeh, no visible license plates, no people's faces.

**Source it:** follow the image rules in Section 6. Find 4 to 6 candidates, grade them to the palette (shadows → `--ink-950`, neon → `--red`; use `sharp` tinting/curves or an SVG color matrix, not a blanket `hue-rotate`), and produce a **contact sheet** `_qa/hero-candidates.png` (labelled 1 to N, with source and license). In your M3 report, recommend one and let the owner choose. If the owner doesn't reply, use your recommendation.

**Treatment (baseline, no cutout needed):**
1. The photo is masked to the stage circle (`clip-path: circle()`), with an edge vignette that melts into the stage's near-black fill so the circle edge reads cleanly.
2. The existing steel/red rings stay; the **red ring becomes the neon tube**: a thin crisp stroke with a tight inner glow and a wider soft falloff.
3. **Glow spill:** a pre-baked radial glow image (not runtime CSS blur) sits behind the stage, extends past it onto the dark graphite areas, and is brightest at the ring, falling off within about 0.6× the stage radius. It must read as light *emitted by the ring/car*, not a generic drop-shadow, and must not muddy the bone disc or the red form.
4. *Optional enhancement:* if you can produce a **clean cutout** of the car, let its nose/tail break out of the circle slightly for depth. Only do this if the cutout quality is flawless; otherwise keep the circle mask.

**Motion (restrained, GSAP, DOM only; WebGL is already gone):**
- **Ignition:** the ring "strikes on" (stroke draws around, ~0.6 s), the photo rises out of darkness with **two or three hard flickers** (stepped opacity, not a smooth fade, ~0.5 s total), then holds steady.
- **Idle:** a very slow breathing of the glow (opacity ≈ 0.85↔1, 5 to 6 s, eased). Pauses off-screen and under reduced motion (static, fully lit).
- Total ignition ≤ ~1.2 s, **appended after the existing Scene 7 tweens**. The hero becomes interactive no later than ~1.2 s after Plan1's original resolve time. Don't alter any existing tween.
- Preload and `decode()` the hero image **during the intro** (idle priority) so there is no pop at reveal. On repeat visits it is the primary image: use `next/image` with `priority`.

### 2.4 Hero copy (placeholder-quality, owner will refine; keep in `content/hero.ts`)
- **Eyebrow:** `BUY · SELL`
- **Headline** (Barlow Condensed, uppercase, two or three short lines, on the bone disc): `FIND IT. DRIVE IT. OWN IT.`
- **Supporting line** (Manrope 300, ≤ 2 lines): `Verified pre-owned and reconditioned cars from trusted sellers across Bangladesh. Buy or sell with complete transparency.`
- **Primary CTA:** `BROWSE CARS` (red fill, sharp corners) → `#services`
- **Secondary CTA:** `SELL YOUR CAR` (outlined, sharp corners) → `#services`
- **Trust micro-line** (small, under CTAs): `Verified sellers · Transparent pricing · Direct contact` (marked placeholder, see 6.4)
- **Do not invent statistics** (no "10,000+ listings", ratings, etc.).

Reveal order after ignition: eyebrow → headline (masked line reveal, same language as Plan1 Scene 4) → supporting line → CTAs → red-form index (stagger) → nav. Keep it quick and calm.

### 2.5 Responsive behavior
- **Portrait phone:** stage with the neon car at the center of the stack, headline + CTAs below it (on the bone region), the four-service index as a compact horizontal row of large labels at the bottom (or hidden if it cannot be set at ≥ 24 px; don't shrink it below the contrast rule).
- **Landscape phone:** neon car + headline only; hide the supporting line/trust line if they do not fit. Nothing may overlap the Skip button, nav, or scroll cue.
- Nothing may overlap or crop incorrectly at any size between 320 and 2560 px wide.

---

## 3. Services section (Buy & Sell — Launch Scope)

> **Scope Decision (2026-11-02):** For now, Garir Mela will strictly focus on **BUY** and **SELL** marketplace operations. Renting and Home Service are removed from the launch scope to maintain absolute operational focus on core vehicle transactions.

### 3.1 Concept: "Two Doors" Editorial Panels
The brief forbids repetitive rounded cards and generic 3-column feature grids. We build an **editorial, image-led panel set**:

- **Desktop:** two tall, full-height **sharp-cornered image panels side by side** (about 75–85 svh high). One panel is active/open (flex-grow), with smooth transitions on hover/focus. Each panel displays: index number (`01 BUY` / `02 SELL`), title, description, key value points, and a bold CTA with high-resolution dark moody photography. Default open panel on load: **Buy**.
- **Tablet/mobile:** vertical stack of two full-width panels (aspect ≈ 4:5 on phones), with text anchored bottom-left over a dark scrim. Each panel is fully readable without interaction.
- **Visual language:** images graded consistently (slightly desaturated, warm-dark, contrast lifted, `--ink-950` multiply at the bottom for legibility). Numbers and accents in `--red`.
- Section heading (masked line reveal): eyebrow `WHAT WE DO`, H2 `EVERYTHING YOUR CAR NEEDS.` (Barlow Condensed), supporting line `From discovering verified pre-owned cars to selling directly to serious buyers across Bangladesh.`

### 3.2 Copy (keep in `content/services.ts`)

| # | Title | Line | Points | CTA |
|---|---|---|---|---|
| 01 | **BUY** | Browse new and reconditioned cars from trusted sellers across Bangladesh. | Filter by brand, budget and year · Clear, honest pricing · Contact sellers directly | `BROWSE CARS` |
| 02 | **SELL** | List your car in minutes and reach serious buyers. | Quick listing · Photo guidance · Enquiries in one place | `SELL YOUR CAR` |

CTAs link to `#` / section placeholders.

### 3.3 Images (see Section 6)
- **Buy:** a premium car, front three-quarter, clean and moody (`service-buy.webp`)
- **Sell:** keys/handover close-up or car detail, no identifiable faces (`service-sell.webp`)

---

## 4. Brands section and footer

### 4.1 Popular brands in Bangladesh
Eyebrow `POPULAR IN BANGLADESH`, H2 `SHOP BY BRAND.`, supporting line `From everyday Japanese favourites to European luxury.`

**Brand list (12, in this order; keep in `content/brands.ts`, easy to edit):**
Toyota · Honda · Nissan · Mitsubishi · Suzuki · Hyundai · Kia · Mazda · Subaru · Lexus · BMW · Mercedes-Benz
(The Japanese marques dominate the Bangladeshi market, largely through reconditioned imports; Toyota, Honda, Nissan, Kia and Mitsubishi are the ones most commonly listed. Keep that ordering weight.)

**Layout: a hairline-grid logo wall, not cards.** Desktop 6×2, tablet 4×3, phone 3×4. Cells are separated by 1 px `--graphite-2` rules (no rounded corners, no shadows, no filled boxes). Each cell: the brand mark centered, the brand name in a small uppercase micro-label beneath. **Hover/focus:** a `--red` fill sweeps in from the left, the mark turns `--bone`, and a small `ArrowUpRight` appears. Each cell is a real link (`href="#"` for now). Below the wall: a quiet text link `VIEW ALL BRANDS →`.

**Section color:** put this section on `--bone` (warm off-white) with `--ink-950` text, so the page rhythm goes dark (services) → light (brands) → dark (footer), echoing the bone disc in the hero. Add a single large `--charcoal` or `--red` geometric form bleeding off an edge, deliberately placed, not floating.

**Logos:** use **monochrome SVG marks**, rendered via CSS mask or inline SVG so they take the text color. Source them only from legitimately usable sources (e.g. Wikimedia Commons or an icon set whose license you've checked), record each in `CREDITS.md`, and note that brand logos are trademarks of their owners and are shown only to identify the brands. If a clean mark isn't available for a brand, fall back to a **typographic wordmark** (Barlow Condensed, uppercase) for that cell, and make all cells visually consistent in size and optical weight. Do not use blurry raster logos. The owner may later drop in their own logo set under `_source/brands/`; make swapping easy.

### 4.2 Footer
Restrained and editorial, on `--ink-950`:
- Logo + one-line tagline; link columns (Marketplace: Buy, Sell · Company: About, Contact · Support: Help, Terms, Privacy), all `href="#"`.
- Contact block with **clearly marked placeholders** (email, phone, `Dhaka, Bangladesh`).
- Social links as **inline SVG** icons (Facebook, Instagram, YouTube). Lucide has dropped brand icons, so don't use it for these.
- A very large, cropped brand wordmark in `--graphite` bleeding off the bottom edge as the closing gesture (type only; no gradients).
- Copyright line and a "Back to top" control (smooth-scroll).

---

## 5. Navigation upgrade

- Items: `Buy · Sell · Brands` (anchors to `#services` panels and `#brands`; the nav's `Buy / Sell` scroll to `#services` and open the matching panel). `Search` and `User` icons stay (non-functional).
- **Scroll-spy:** the active item gets a thin `--red` underline.
- **Solid on scroll:** transparent over the hero; once the user scrolls past ~80% of the hero, it becomes solid `--ink-950` (no glassmorphism/blur). Optionally hide on scroll down and show on scroll up.
- **Mobile menu:** implement the real menu: full-screen `--ink-950` overlay, large Barlow Condensed links stacked, `--red` rule, close button, focus trap, `Esc` to close, body scroll locked while open.
- The nav appears only after the intro, exactly as in Plan1; this must not affect the intro.
- Smooth scroll between sections via Lenis `scrollTo` with consistent offset for the fixed nav.

---

## 6. Images: sourcing, licensing, pipeline

The owner said to use pictures from the internet. Do it **properly**:

### 6.1 Where to source
Only from sources whose license allows free commercial use without attribution: **Unsplash, Pexels, Pixabay** (and, where license-compatible, Wikimedia Commons). **Do not** lift images from Google Images, other car marketplaces, manufacturers, or stock sites that require payment. **Never hotlink**: every image is downloaded and stored locally.

### 6.2 What to look for
- High resolution (≥ 2400 px on the long side for hero/panels), sharp, well exposed.
- Dark, moody, or easily gradable to dark; consistent with the palette.
- Cars: avoid readable license plates, avoid recognizable people. Prefer cars/models plausible for the Bangladesh market where possible (Toyota, Honda, Nissan, Mitsubishi, Suzuki-type vehicles), but visual quality comes first.
- Consistent perspective and mood across the four service panels.

### 6.3 Pipeline
1. Download to `_source/images/` (keep originals; record the URL, author, and license page for each).
2. Optimize with `sharp` into `public/images/` as **AVIF + WebP** at needed widths (e.g. 640/1024/1600/2400), generate blur placeholders; keep each served image sensible (panels ≲ 250 KB, hero ≲ 400 KB).
3. Serve with `next/image` (`sizes` set correctly, `priority` only for the hero image on the repeat-visit path, lazy for everything else). All images are local, so no `remotePatterns` and no external requests.
4. Write `public/images/CREDITS.md` and a `content/images.ts` manifest: file, alt text, author, source URL, license, crop focal point.
5. Alt text is meaningful (`"Red sports car lit by neon light on a dark road"`), not "image1". Decorative images get `alt=""`.

### 6.4 If downloading is blocked
If your environment cannot download images, **don't stop and don't fake it**: build the layout with clearly labelled dark placeholder blocks, then give the owner an **exact shot list** (search phrases, orientation, size) and the target filenames so they can drop images into `_source/images/` and you can run the pipeline.

### 6.5 Placeholders register
Create `PLACEHOLDERS.md` listing every piece of demo content the owner must confirm or replace before going live: brand name, tagline, trust line, service claims, contact details, social URLs, brand logos, any image whose license or suitability you are unsure about. Keep all editable copy in `content/*.ts` (Bangla-ready: plain string objects, no hard-coded text inside components). Do **not** build a language toggle in Plan2. Add a Bengali-capable fallback to the font stack (e.g. `Noto Sans Bengali`) so adding Bangla later doesn't break rendering.

---

## 7. Using the garirmela.com reference

Open **https://www.garirmela.com/** in your browser tool (it is rendered client-side, so a plain text fetch returns almost nothing). Study and write short notes in `REFERENCE_NOTES.md`:
- How it presents Buy / Sell / Rent / Service entry points and in what order
- How it presents popular brands (grid, count, labels, filters)
- Information hierarchy, section order, and any patterns that suit the Bangladesh market (currency, location, brand mix, mobile-first behavior)

**Adopt the structure and market logic, not the look.** Do not copy its layout pixel-for-pixel, copy, imagery, logos, or branding. Our visual identity (Plan1 design language) stays. List in the notes what you adopted and what you deliberately did differently.

---

## 8. Architecture additions

```
app/
  page.tsx                 sections composed here
components/
  hero/
    HeroContent.tsx        Plan2 resolved-hero content
    NeonStage.tsx          image mask, neon ring, glow, ignition
    ServiceIndex.tsx       the 01–04 index on the red form
  sections/
    Services.tsx           + ServicePanel.tsx
    Brands.tsx             + BrandCell.tsx
    Footer.tsx
  nav/
    Navbar.tsx             (upgraded)  MobileMenu.tsx  useScrollSpy.ts
content/
  hero.ts  services.ts  brands.ts  images.ts  site.ts
lib/
  animation/scenes/heroReveal.ts   additive tweens appended after Scene 7
  hooks/useInView.ts
public/
  images/                  optimized AVIF/WebP + CREDITS.md
  brands/                  SVG marks
scripts/
  optimize-images.mjs      (sharp)
  compare-frames.mjs       (visual regression, dev only)
_qa/ baseline/ after/ hero-candidates.png hero-slots.png
LOCKED.md  PLACEHOLDERS.md  REFERENCE_NOTES.md
```

**Dependencies:** none new for runtime. Dev-only: `sharp` (if not already present through Next), `pixelmatch` + `pngjs` (or Playwright) for the frame comparison. Anything else must be justified in `DECISIONS.md`. Keep Lenis ↔ ScrollTrigger in sync, use `useGSAP`/`gsap.context()` for cleanup, drive scroll-reveals with ScrollTrigger (one batch per section), no per-frame React state.

---

## 9. Motion rules for the new sections
- Same vocabulary as Plan1: **masked line reveals** for headings, short fade-and-rise for supporting text, `ease-out` settles, no bounce.
- Reveal once per element as it enters (no re-triggering on scroll back).
- Section images: parallax ≤ 6%, desktop only. Panel expand: flex-grow, no layout thrash (animate with `transform`/`flex` carefully; verify no jank).
- Respect `prefers-reduced-motion`: no parallax, no flicker, no panel animation; static end states.
- Nothing animates forever except the slow neon breathing, which stops when off-screen.

---

## 10. Milestones

Same rule as Plan1: build, verify in the browser, report, **stop**, wait for "approved".

### P2-M0 — Baseline and hero scoping
Capture the baseline frames; audit and refactor the mounting (Section 1); lock files; scroll and layout verification; remove the blank placeholder section (temporary stub sections allowed for scroll testing).
**Owner sees:** the identical intro, now confined to the first screen; once it finishes, the page scrolls normally and the hero scrolls away. Frame-comparison result included.

### P2-M1 — Content system and navigation
`content/*.ts`, section scaffolding with real headings, upgraded nav (anchors, scroll-spy, solid on scroll, working mobile menu), Lenis/ScrollTrigger wiring, CTA re-pointed to `#services`.
**Owner sees:** a navigable page skeleton with working menus and smooth scrolling between titled sections.

### P2-M2 — Image sourcing and pipeline
Shot list resolved, images downloaded with licenses recorded, optimized pipeline running, `CREDITS.md`, `PLACEHOLDERS.md`, hero candidate contact sheet.
**Owner sees:** the contact sheet of neon-car candidates with a recommendation, plus a table of all chosen images and their licenses. **Owner picks the hero image here.**

### P2-M3 — Hero Phase 2
Slot inspection (`hero-slots.png`), neon stage, ring + glow, copy, service index on the red form, ignition choreography appended to the timeline, all fallback paths populated, responsive layouts.
**Owner sees:** the full intro, then the transformation, then the neon car igniting in the stage with the headline on the bone disc and the service index on the red form, at all five viewports. Frame comparison confirms t ≤ 10 s is unchanged.

### P2-M4 — Services
Panels, hover/focus/keyboard behavior, mobile stack, grading, parallax, reveals.
**Owner sees:** the four-door Services section working on desktop and mobile.

### P2-M5 — Brands and footer
Logo wall (with hover), wordmark fallbacks, light section, footer, back-to-top.
**Owner sees:** the full page from hero to footer.

### P2-M6 — Polish and release prep
Timing/rhythm pass between sections, a11y audit (contrast table, keyboard-only walkthrough, screen-reader landmarks, focus order), performance (Lighthouse mobile run; report LCP/CLS/TBT and bundle sizes), image weight audit, cross-browser check, final regression comparison, README update (how to edit copy, swap images/logos/accent/car, run QA scripts, deploy to Netlify), `next build` clean.
**Owner sees:** a demo-ready site and a README they can follow.

---

## 11. Acceptance checklist (all must pass before P2-M6 is approved)

**Animation lock**
- [ ] Frames at t ≤ 10.0 s match the Plan1 baseline at all five viewports
- [ ] No locked file's behavior changed; `LOCKED.md` exists
- [ ] Timeline total grew by ≤ ~1.2 s, only via appended tweens

**Hero scoping**
- [ ] The intro lives entirely inside `#hero`; **no intro layer is `position: fixed`** after mount
- [ ] After intro/skip/repeat-visit/reduced-motion the page scrolls; at 150% scroll no hero layer is visible
- [ ] Mobile URL-bar collapse does not restart or resize the intro

**Hero Phase 2**
- [ ] Neon car is clearly the visual focus; red neon only (no purple/cyan/blue), tasteful glow, no muddy bone disc
- [ ] Ignition plays once, then holds; breathing pauses off-screen; static under reduced motion
- [ ] Headline, copy, CTAs, and the 01–04 index all fit at 320 to 2560 px without overlap; contrast table recorded; small text never on red
- [ ] No invented statistics anywhere

**Sections**
- [ ] Services: four image panels, sharp corners, hover/focus/keyboard open on desktop, readable stack on mobile
- [ ] Brands: 12 brands in a hairline grid, hover works, consistent mark sizing, light-section rhythm, trademark note recorded
- [ ] Footer complete, socials are inline SVG, back-to-top works
- [ ] Nav: scroll-spy, solid on scroll, mobile menu with focus trap and `Esc`

**Images and content**
- [ ] Every image is local, optimized (AVIF/WebP), has real alt text, and has a recorded license
- [ ] `PLACEHOLDERS.md` and `CREDITS.md` are complete; all copy lives in `content/*.ts`

**Quality**
- [ ] Nothing from Plan1's "Avoid" list appears (no gradient decoration, glassmorphism, rounded-card grids, 3-column feature rows, emoji icons)
- [ ] Zero console errors/warnings in the production build; `next build` passes
- [ ] Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95 on the home page (report actual numbers; explain any shortfall)
- [ ] Works in Chromium, Firefox, and WebKit/Safari (as available)

---

## 12. What I (the owner) may provide later
- Brand name, tagline, and final copy (edit `content/*.ts`)
- My own photos, brand logo set (`_source/brands/`), and real listings (a later plan)
- A different car model or accent color (same single-config swap as Plan1; the neon treatment must follow the accent token)

**Start with P2-M0. Before you begin, confirm you've read this plan and the Plan1 lock rules by listing the three riskiest parts and how you'll handle them. Then capture the baseline and proceed.**
