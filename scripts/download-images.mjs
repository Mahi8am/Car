import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve('_source/images');
fs.mkdirSync(SOURCE_DIR, { recursive: true });

// Selected curated Unsplash images (Unsplash License: free for commercial and non-commercial use, no permission/attribution required)
const IMAGES = [
  // ── 4 Hero Neon Car Candidates ─────────────────────────────────────────────
  {
    key: 'hero-candidate-a',
    filename: 'hero-candidate-a.jpg',
    url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=3000&q=95',
    title: 'Candidate A: Crimson Silhouette',
    author: 'Samuele Errico',
    authorUrl: 'https://unsplash.com/@samueleerrico',
    sourceUrl: 'https://unsplash.com/photos/1617788138017-80ad40651399',
    description: 'Dark sports coupe in rain with vivid crimson neon ambient reflection and glowing red brake accents.'
  },
  {
    key: 'hero-candidate-b',
    filename: 'hero-candidate-b.jpg',
    url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=3000&q=95',
    title: 'Candidate B: Night Lightbar',
    author: 'Campbell',
    authorUrl: 'https://unsplash.com/@campbell33',
    sourceUrl: 'https://unsplash.com/photos/1542282088-72c9c27ed0cd',
    description: 'Aggressive sports car rear angle with continuous red LED lightbar signature slicing through darkness.'
  },
  {
    key: 'hero-candidate-c',
    filename: 'hero-candidate-c.jpg',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=3000&q=95',
    title: 'Candidate C: Dark Studio Apex',
    author: 'Martin Katler',
    authorUrl: 'https://unsplash.com/@mkatler',
    sourceUrl: 'https://unsplash.com/photos/1503376780353-7e6692767b70',
    description: 'Sleek black sports car front three-quarter view under high-contrast moody edge lighting.'
  },
  {
    key: 'hero-candidate-d',
    filename: 'hero-candidate-d.jpg',
    url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=3000&q=95',
    title: 'Candidate D: Midnight Precision',
    author: 'Stefan Rodriguez',
    authorUrl: 'https://unsplash.com/@stefan_rodriguez',
    sourceUrl: 'https://unsplash.com/photos/1618843479313-40f8afb4b4d8',
    description: 'Precision luxury performance vehicle emerging from atmospheric midnight shadows with crisp LED illumination.'
  },

  // ── 4 Service Panels ───────────────────────────────────────────────────────
  {
    key: 'service-buy',
    filename: 'service-buy.jpg',
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=2600&q=95',
    title: 'Buy: Dynamic Highway Motion',
    author: 'Stefan Rodriguez',
    authorUrl: 'https://unsplash.com/@stefan_rodriguez',
    sourceUrl: 'https://unsplash.com/photos/1552519507-da3b142c6e3d',
    description: 'Low-slung modern performance car on asphalt with headlights and sleek dark metallic finish.'
  },
  {
    key: 'service-sell',
    filename: 'service-sell.jpg',
    url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=2600&q=95',
    title: 'Sell: Handover & Key Exchange',
    author: 'Erik Mclean',
    authorUrl: 'https://unsplash.com/@introspectivedsgn',
    sourceUrl: 'https://unsplash.com/photos/1568605117036-5fe5e7bab0b7',
    description: 'Car key fob in hand beside driver door handle, crisp lighting, no identifiable faces.'
  },
  {
    key: 'service-rent',
    filename: 'service-rent.jpg',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2600&q=95',
    title: 'Rent: Open Mountain Highway',
    author: 'Luca Bravo',
    authorUrl: 'https://unsplash.com/@lucabravo',
    sourceUrl: 'https://unsplash.com/photos/1469854523086-cc02fe5d8800',
    description: 'Vehicle driving along an expansive open desert mountain road at dusk, embodying freedom of travel.'
  },
  {
    key: 'service-home-service',
    filename: 'service-home-service.jpg',
    url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=2600&q=95',
    title: 'Home Service: Precision Detailing',
    author: 'Jan Kopřiva',
    authorUrl: 'https://unsplash.com/@jankopriva',
    sourceUrl: 'https://unsplash.com/photos/1607860108855-64acf2078ed9',
    description: 'Detailing specialist hands machine-polishing high-gloss automotive clearcoat with compound, no faces visible.'
  }
];

async function downloadAll() {
  console.log(`Starting download of ${IMAGES.length} master images into ${SOURCE_DIR}...`);
  const metaReport = [];

  for (const img of IMAGES) {
    const destPath = path.join(SOURCE_DIR, img.filename);
    console.log(`Fetching: ${img.key} (${img.title})...`);

    try {
      const res = await fetch(img.url);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);

      // Inspect dimensions with sharp
      const meta = await sharp(buffer).metadata();
      console.log(`  -> Saved ${img.filename}: ${meta.width}x${meta.height}px (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);

      metaReport.push({
        ...img,
        width: meta.width,
        height: meta.height,
        sizeMb: (buffer.length / 1024 / 1024).toFixed(2),
        passRes: Math.max(meta.width, meta.height) >= 2400
      });
    } catch (err) {
      console.error(`  -> ERROR downloading ${img.key}:`, err.message);
    }
  }

  // Save metadata json in _source/images/manifest.json
  fs.writeFileSync(path.join(SOURCE_DIR, 'manifest.json'), JSON.stringify(metaReport, null, 2));
  console.log('Download complete. Manifest saved.');
}

downloadAll();
