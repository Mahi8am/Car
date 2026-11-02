import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const QA_DIR = path.resolve('_qa');
fs.mkdirSync(QA_DIR, { recursive: true });

const candidates = [
  {
    letter: 'A',
    badge: 'RECOMMENDED',
    name: 'Candidate A: Crimson Silhouette',
    author: 'Samuele Errico',
    desc: 'Dark sports coupe in rain with crimson neon ambient reflections &amp; glowing red brake accents.',
    file: path.resolve('public/images/hero/hero-candidate-a.webp')
  },
  {
    letter: 'B',
    badge: 'RUNNER-UP',
    name: 'Candidate B: Night Lightbar',
    author: 'Campbell',
    desc: 'Aggressive rear three-quarter angle with continuous horizontal crimson LED lightbar signature.',
    file: path.resolve('public/images/hero/hero-candidate-b.webp')
  },
  {
    letter: 'C',
    badge: 'STUDIO MOOD',
    name: 'Candidate C: Dark Studio Apex',
    author: 'Martin Katler',
    desc: 'Sleek black sports car front three-quarter view under high-contrast dark studio edge lighting.',
    file: path.resolve('public/images/hero/hero-candidate-c.webp')
  },
  {
    letter: 'D',
    badge: 'ATMOSPHERIC',
    name: 'Candidate D: Midnight Precision',
    author: 'Stefan Rodriguez',
    desc: 'Modern performance coupe emerging from dark midnight shadows with crisp LED illumination.',
    file: path.resolve('public/images/hero/hero-candidate-d.webp')
  }
];

async function generateContactSheet() {
  console.log('Generating hero candidates contact sheet...');
  const tileW = 920;
  const tileH = 500;
  const padding = 30;
  const headerH = 120;
  const totalW = tileW * 2 + padding * 3;
  const totalH = tileH * 2 + padding * 3 + headerH;

  // Render individual tiles with overlay text
  const compositeItems = [];

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = padding + col * (tileW + padding);
    const y = headerH + padding + row * (tileH + padding);

    // Resize image to fill tile
    const imgBuffer = await sharp(c.file)
      .resize(tileW, tileH, { fit: 'cover', position: 'center' })
      .toBuffer();

    // SVG card overlay with title & description
    const isRec = c.badge === 'RECOMMENDED';
    const badgeBg = isRec ? '#e1251b' : '#303034';
    const badgeColor = '#ffffff';

    const overlaySvg = `
      <svg width="${tileW}" height="${tileH}">
        <!-- Dark gradient bottom overlay -->
        <defs>
          <linearGradient id="grad-${c.letter}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#070707" stop-opacity="0.1"/>
            <stop offset="50%" stop-color="#070707" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#070707" stop-opacity="0.95"/>
          </linearGradient>
        </defs>
        <rect width="${tileW}" height="${tileH}" fill="url(#grad-${c.letter})" />

        <!-- Badge -->
        <rect x="24" y="24" width="${c.badge.length * 10 + 20}" height="28" fill="${badgeBg}" />
        <text x="34" y="42" font-family="monospace" font-size="12" font-weight="bold" fill="${badgeColor}" letter-spacing="1.5">${c.badge}</text>

        <!-- Candidate Title -->
        <text x="24" y="${tileH - 80}" font-family="sans-serif" font-size="26" font-weight="bold" fill="#f5f5f7" text-transform="uppercase" letter-spacing="-0.5">${c.name}</text>

        <!-- Author / Credit -->
        <text x="24" y="${tileH - 52}" font-family="monospace" font-size="14" fill="#e1251b" letter-spacing="1">PHOTO BY ${c.author.toUpperCase()} · UNSPLASH (FREE COMMERCIAL)</text>

        <!-- Description -->
        <text x="24" y="${tileH - 26}" font-family="sans-serif" font-size="14" fill="#a0a0a5">${c.desc}</text>

        <!-- Outer Hairline border -->
        <rect x="0.5" y="0.5" width="${tileW - 1}" height="${tileH - 1}" fill="none" stroke="${isRec ? '#e1251b' : '#303034'}" stroke-width="${isRec ? '2' : '1'}"/>
      </svg>
    `;

    // Composite overlay onto image tile
    const tileWithOverlay = await sharp(imgBuffer)
      .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
      .png()
      .toBuffer();

    compositeItems.push({
      input: tileWithOverlay,
      left: x,
      top: y
    });
  }

  // Header banner SVG
  const headerSvg = `
    <svg width="${totalW}" height="${headerH}">
      <text x="${padding}" y="52" font-family="sans-serif" font-size="34" font-weight="bold" fill="#f5f5f7" letter-spacing="-0.5">GARIR MELA — HERO NEON STAGE CANDIDATES</text>
      <text x="${padding}" y="84" font-family="monospace" font-size="14" fill="#e1251b" letter-spacing="2">P2-M2 IMAGE SOURCING PIPELINE · ALL UNCOMPROMISED 4K ORIGINALS (FREE COMMERCIAL LICENSE)</text>
      <text x="${padding}" y="106" font-family="sans-serif" font-size="14" fill="#a0a0a5">Candidate A is recommended for maximum synergy with the crimson color-block and neon ring ignition.</text>
      <line x1="${padding}" y1="${headerH - 5}" x2="${totalW - padding}" y2="${headerH - 5}" stroke="#303034" stroke-width="1" />
    </svg>
  `;

  compositeItems.push({
    input: Buffer.from(headerSvg),
    left: 0,
    top: 0
  });

  // Base canvas (#070707 dark background)
  const finalCanvas = await sharp({
    create: {
      width: totalW,
      height: totalH,
      channels: 4,
      background: { r: 7, g: 7, b: 7, alpha: 1 }
    }
  })
    .composite(compositeItems)
    .png()
    .toFile(path.join(QA_DIR, 'hero-candidates.png'));

  console.log(`Saved contact sheet: ${path.join(QA_DIR, 'hero-candidates.png')} (${totalW}x${totalH}px)`);
}

generateContactSheet().catch(err => {
  console.error('Contact sheet generation error:', err);
  process.exit(1);
});
