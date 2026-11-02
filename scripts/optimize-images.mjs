import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve('_source/images');
const PUBLIC_DIR = path.resolve('public/images');
const WIDTHS = [640, 1024, 1600, 2400];

fs.mkdirSync(path.join(PUBLIC_DIR, 'hero'), { recursive: true });
fs.mkdirSync(path.join(PUBLIC_DIR, 'services'), { recursive: true });

async function optimizeImages() {
  const manifestPath = path.join(SOURCE_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('Manifest not found. Run download-images.mjs first.');
  }

  const images = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  console.log(`Starting image optimization pipeline for ${images.length} images...`);

  const blurManifest = {};
  const statsTable = [];

  for (const img of images) {
    const srcFile = path.join(SOURCE_DIR, img.filename);
    const isHero = img.key.startsWith('hero-');
    const outSubdir = isHero ? 'hero' : 'services';
    const baseName = img.filename.replace(/\.[^/.]+$/, '');

    console.log(`\nProcessing: ${img.key} (${img.filename})...`);

    // 1. Generate 16px blur placeholder base64 data URI
    const blurBuffer = await sharp(srcFile)
      .resize(16, Math.round(16 * (img.height / img.width)), { fit: 'inside' })
      .jpeg({ quality: 60 })
      .toBuffer();
    const blurDataURL = `data:image/jpeg;base64,${blurBuffer.toString('base64')}`;
    blurManifest[img.key] = blurDataURL;

    // 2. Generate standard AVIF & WebP variants at target widths
    const generatedVariants = [];

    for (const width of WIDTHS) {
      if (width > img.width) continue; // don't upscale

      const avifName = `${baseName}-${width}.avif`;
      const webpName = `${baseName}-${width}.webp`;
      const avifPath = path.join(PUBLIC_DIR, outSubdir, avifName);
      const webpPath = path.join(PUBLIC_DIR, outSubdir, webpName);

      // AVIF
      await sharp(srcFile)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: 75, effort: 4 })
        .toFile(avifPath);
      const avifStat = fs.statSync(avifPath);

      // WebP
      await sharp(srcFile)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toFile(webpPath);
      const webpStat = fs.statSync(webpPath);

      generatedVariants.push({
        width,
        avifKb: Math.round(avifStat.size / 1024),
        webpKb: Math.round(webpStat.size / 1024)
      });
    }

    // 3. Generate primary default file for default src
    // Hero: 1600px (budget <= 400 KB); Panels: 1200px (budget <= 250 KB)
    const defaultWidth = isHero ? 1600 : 1200;
    const defaultQuality = isHero ? 82 : 78;
    const defaultWebpPath = path.join(PUBLIC_DIR, outSubdir, `${baseName}.webp`);
    await sharp(srcFile)
      .resize({ width: defaultWidth, withoutEnlargement: true })
      .webp({ quality: defaultQuality, effort: 4 })
      .toFile(defaultWebpPath);
    const defaultStat = fs.statSync(defaultWebpPath);
    const defaultKb = Math.round(defaultStat.size / 1024);

    const budgetLimitKb = isHero ? 400 : 250;
    const isUnderBudget = defaultKb <= budgetLimitKb;

    console.log(`  -> Default 1600px WebP: ${defaultKb} KB (Budget: <= ${budgetLimitKb} KB) [${isUnderBudget ? 'PASS' : 'WARN'}]`);

    statsTable.push({
      key: img.key,
      file: `${outSubdir}/${baseName}.webp`,
      defaultKb,
      budgetLimitKb,
      status: isUnderBudget ? 'PASS' : 'WARN',
      variants: generatedVariants
    });
  }

  // Write blur manifest
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'blur-manifest.json'),
    JSON.stringify(blurManifest, null, 2)
  );

  console.log('\n=== OPTIMIZATION SUMMARY ===');
  console.table(statsTable.map(s => ({
    Image: s.key,
    DefaultPath: s.file,
    Size: `${s.defaultKb} KB`,
    Budget: `${s.budgetLimitKb} KB`,
    Status: s.status
  })));

  // Write stats report
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'optimization-report.json'),
    JSON.stringify(statsTable, null, 2)
  );
}

optimizeImages().catch(err => {
  console.error('Optimization error:', err);
  process.exit(1);
});
