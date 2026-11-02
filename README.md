# Garir Mela — Premium Automotive Marketplace

A cinematic, editorial car marketplace experience built with **Next.js 16**, **Three.js / React Three Fiber**, and **GSAP**.

---

## 1. Stack & Technologies

| Layer | Package / Specification |
|---|---|
| Framework | **Next.js 16.4.3** (App Router, Turbopack) |
| Core | **React 19.3.0**, **TypeScript 5** |
| Styling | **Tailwind CSS v4** (`@theme` tokens, zero runtime CSS overhead) |
| 3D Canvas | **Three.js**, **@react-three/fiber v9**, **@react-three/drei v10** |
| Animation | **GSAP 3** (`masterTimeline`, `useGSAP`), **Lenis v1** smooth scrolling |
| Typography | **Barlow Condensed** (Headings), **Manrope** (Body copy), **Geist Mono** (Accents) |
| Image Pipeline | **Sharp** (local AVIF & WebP multi-density generation) |

---

## 2. Running Locally

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. How to Edit Copy & Content

All content across the website is decoupled from UI components into the `content/` directory. No hard-coded text exists inside components, making it Bangla-ready and easy to localize:

| Content Area | File Path | What to Edit |
|---|---|---|
| **Global Site & Nav** | `content/site.ts` | Brand name, tagline, nav links, footer contact, socials |
| **Hero Phase 2** | `content/hero.ts` | Eyebrow, headline, supporting copy, CTAs, trust line, shortcuts |
| **Services Section** | `content/services.ts` | "Two Doors" copy (Buy & Sell), value points, CTAs |
| **Brands Section** | `content/brands.ts` | 12 popular automotive marques, origins, disclaimer |
| **Image Manifest** | `content/images.ts` | Image metadata, alt text, photographer credits, focal points |

---

## 4. How to Swap Images

All images are served locally as optimized **AVIF** and **WebP** formats with blur-up placeholders. Zero external image hotlinking.

1. Drop new master images into `_source/images/`:
   - Hero Candidate: `_source/images/hero-candidate-a.jpg`
   - Buy Panel: `_source/images/service-buy.jpg`
   - Sell Panel: `_source/images/service-sell.jpg`
2. Run the optimization pipeline:
   ```bash
   node scripts/optimize-images.mjs
   ```
3. Update [CREDITS.md](public/images/CREDITS.md) and [content/images.ts](content/images.ts) with the photo credits, licensing details, and focal points.

---

## 5. How to Swap Brand Logos

Brand marks are rendered as lightweight, responsive monochrome SVGs that take `currentColor` (crisp on high-DPI displays, ink-950 by default, bone on red hover sweep):
- Open `components/icons/BrandMarks.tsx` to add or edit any brand mark's SVG geometry.
- Update `content/brands.ts` to change brand names, ordering, or links.

---

## 6. How to Change the Accent Color

Open `src/app/globals.css` and modify the CSS variables:

```css
:root {
  --accent: #E1251B;  /* Crimson red accent */
  --red:    #E1251B;  /* Kept in sync */
  --bone:   #EDE7DC;  /* Warm editorial bone */
}
```

This globally re-themes the neon car ring, tire tracks, geometric forms, CTA buttons, and hover sweeps.

---

## 7. URL Query Parameters & Testing Modes

| Parameter | Purpose |
|---|---|
| `?intro=replay` | Force full 3D cinematic intro playback (ignores session storage) |
| `?intro=skip` | Jump directly to the resolved hero state |
| `?debug` | Toggle 3D scene debug panel (camera coordinates, FPS, tire contact points) |

---

## 8. Automated QA Test Scripts

The repository includes end-to-end automated Playwright test suites:

```bash
# Verify build integrity
npm run build

# Verify all 4 visitor modes (skip, repeat visit, mobile, 3D intro)
node scripts/test-all-modes.mjs

# Verify full 13.5s lifecycle and smooth scroll to services
node scripts/test-full-lifecycle.mjs

# Verify Milestone 4 (Two Doors Services: Buy & Sell, keyboard & hover states)
node scripts/test-milestone4.mjs

# Verify Milestone 5 (Brands hairline grid & Editorial footer)
node scripts/test-milestone5.mjs
```

---

## 9. Deploying to Netlify / Vercel

```bash
# Build the production bundle
npm run build
```

The app is built as a static/hybrid Next.js application. Set the build command to `npm run build` and output directory to `.next`.
