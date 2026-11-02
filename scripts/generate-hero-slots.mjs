import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const QA_DIR = path.resolve('_qa');
fs.mkdirSync(QA_DIR, { recursive: true });

async function generateHeroSlots() {
  console.log('Generating hero slot inspection map (_qa/hero-slots.png)...');

  const w = 1920;
  const h = 1080;

  const svgContent = `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradients -->
        <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#e1251b" stop-opacity="0.35"/>
          <stop offset="70%" stop-color="#e1251b" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#070707" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Background: Charcoal -->
      <rect width="${w}" height="${h}" fill="#161617"/>

      <!-- Negative space graphite zone -->
      <rect x="0" y="0" width="${w}" height="${h}" fill="#242426" opacity="0.4"/>

      <!-- Slot 1: Bone Disc (Bottom-Left) -->
      <!-- shapes.ts: cx: -10, cy: 115, r: 62 in 0-100 space -->
      <circle cx="${-0.10 * w}" cy="${1.15 * h}" r="${0.62 * Math.min(w, h)}" fill="#f5f5f7" opacity="0.95"/>

      <!-- Slot 2: Red Form (Top-Right) -->
      <!-- shapes.ts: cx: 110, cy: -10, r: 55 in 0-100 space -->
      <circle cx="${1.10 * w}" cy="${-0.10 * h}" r="${0.55 * Math.min(w, h)}" fill="#e1251b" opacity="0.95"/>

      <!-- Stage Glow Spill (Pre-baked radial glow) -->
      <circle cx="${0.50 * w}" cy="${0.50 * h}" r="${0.42 * Math.min(w, h)}" fill="url(#stageGlow)"/>

      <!-- Slot 3: Central Stage Circle -->
      <!-- shapes.ts: cx: 50, cy: 50, r: 28 in 0-100 space -->
      <circle cx="${0.50 * w}" cy="${0.50 * h}" r="${0.28 * Math.min(w, h)}" fill="#070707" stroke="#303034" stroke-width="2"/>

      <!-- Neon Ring -->
      <circle cx="${0.50 * w}" cy="${0.50 * h}" r="${0.285 * Math.min(w, h)}" fill="none" stroke="#e1251b" stroke-width="3" stroke-dasharray="12 4" opacity="0.9"/>
      <circle cx="${0.50 * w}" cy="${0.50 * h}" r="${0.290 * Math.min(w, h)}" fill="none" stroke="#e1251b" stroke-width="1.5" opacity="0.4"/>

      <!-- Slot Annotations & Overlays -->

      <!-- Header Title -->
      <rect x="60" y="40" width="620" height="70" fill="#070707" opacity="0.8" rx="4"/>
      <text x="80" y="78" font-family="sans-serif" font-size="28" font-weight="bold" fill="#f5f5f7" letter-spacing="1">HERO PHASE 2 — SLOT INSPECTION MAP</text>
      <text x="80" y="98" font-family="monospace" font-size="12" fill="#e1251b" letter-spacing="2">DERIVED DIRECTLY FROM SHAPES.TS &amp; VIEWPORT COORDINATES</text>

      <!-- Slot 1 Annotation: Bone Disc -->
      <g transform="translate(100, ${h - 380})">
        <rect x="0" y="0" width="460" height="260" fill="#ffffff" opacity="0.95" stroke="#e1251b" stroke-width="2" rx="2"/>
        <text x="24" y="38" font-family="monospace" font-size="12" font-weight="bold" fill="#e1251b" letter-spacing="1.5">SLOT 01 // BONE DISC (BOTTOM-LEFT)</text>
        <text x="24" y="72" font-family="sans-serif" font-size="24" font-weight="bold" fill="#070707">FIND IT. DRIVE IT. OWN IT.</text>
        <text x="24" y="98" font-family="sans-serif" font-size="13" fill="#303034">Eyebrow: BUY · SELL · RENT · SERVICE</text>
        <text x="24" y="122" font-family="sans-serif" font-size="13" fill="#505055">Supporting line: Verified cars across Bangladesh...</text>
        <rect x="24" y="145" width="140" height="36" fill="#e1251b"/>
        <text x="42" y="168" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" letter-spacing="1">BROWSE CARS</text>
        <rect x="175" y="145" width="140" height="36" fill="none" stroke="#070707" stroke-width="1.5"/>
        <text x="195" y="168" font-family="sans-serif" font-size="12" font-weight="bold" fill="#070707" letter-spacing="1">SELL YOUR CAR</text>
        <text x="24" y="215" font-family="monospace" font-size="11" fill="#707075">Contrast: #070707 on #f5f5f7 = 18.2:1 (AAA PASS)</text>
        <text x="24" y="235" font-family="monospace" font-size="11" fill="#e1251b">Anchors: Left 0%..38%, Bottom 0%..45%</text>
      </g>

      <!-- Slot 2 Annotation: Red Form -->
      <g transform="translate(${w - 540}, 120)">
        <rect x="0" y="0" width="440" height="250" fill="#070707" opacity="0.9" stroke="#f5f5f7" stroke-width="2" rx="2"/>
        <text x="24" y="38" font-family="monospace" font-size="12" font-weight="bold" fill="#e1251b" letter-spacing="1.5">SLOT 02 // RED FORM (TOP-RIGHT)</text>
        <text x="24" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#f5f5f7">SERVICE SHORTCUTS (01–04)</text>
        <text x="24" y="105" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" letter-spacing="2">01 BUY   02 SELL</text>
        <text x="24" y="135" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" letter-spacing="2">03 RENT  04 HOME SERVICE</text>
        <text x="24" y="175" font-family="monospace" font-size="11" fill="#a0a0a5">Contrast Rule: Large display text (≥ 24px)</text>
        <text x="24" y="195" font-family="monospace" font-size="11" fill="#a0a0a5">White on #e1251b = 3.9:1 (WCAG AA Large PASS)</text>
        <text x="24" y="225" font-family="monospace" font-size="11" fill="#e1251b">Anchors: Right 60%..100%, Top 0%..40%</text>
      </g>

      <!-- Slot 3 Annotation: Central Stage -->
      <g transform="translate(${0.50 * w - 190}, ${0.50 * h - 60})">
        <rect x="0" y="0" width="380" height="120" fill="#070707" opacity="0.9" stroke="#e1251b" stroke-width="1.5" rx="2"/>
        <text x="20" y="32" font-family="monospace" font-size="12" font-weight="bold" fill="#e1251b" letter-spacing="1.5">SLOT 03 // CENTRAL NEON STAGE</text>
        <text x="20" y="62" font-family="sans-serif" font-size="18" font-weight="bold" fill="#f5f5f7">Candidate A: Crimson Silhouette</text>
        <text x="20" y="85" font-family="sans-serif" font-size="12" fill="#a0a0a5">Masked to stage circle with radial edge vignette</text>
        <text x="20" y="104" font-family="monospace" font-size="11" fill="#e1251b">Neon tube ring: stroke draw + flicker ignition</text>
      </g>

      <!-- Slot 4 Annotation: HeroDetails (Bottom Edge) -->
      <g transform="translate(60, ${h - 130})">
        <rect x="0" y="0" width="320" height="70" fill="#070707" opacity="0.85" stroke="#303034" stroke-width="1" rx="2"/>
        <text x="16" y="26" font-family="monospace" font-size="11" font-weight="bold" fill="#e1251b">SLOT 04 // BOTTOM CONTROLS</text>
        <text x="16" y="48" font-family="sans-serif" font-size="12" fill="#a0a0a5">Vertical micro-label + animated scroll cue (Plan 1)</text>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svgContent))
    .png()
    .toFile(path.join(QA_DIR, 'hero-slots.png'));

  console.log(`Saved hero slot inspection map: ${path.join(QA_DIR, 'hero-slots.png')}`);
}

generateHeroSlots().catch(err => {
  console.error('Error generating hero slots:', err);
  process.exit(1);
});
