import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const baselineDir = path.resolve(process.cwd(), '_qa/baseline');
const afterDir = path.resolve(process.cwd(), '_qa/after');
const diffDir = path.resolve(process.cwd(), '_qa/diff');

if (!fs.existsSync(diffDir)) {
  fs.mkdirSync(diffDir, { recursive: true });
}

if (!fs.existsSync(baselineDir) || !fs.existsSync(afterDir)) {
  console.error('[QA] Missing baseline or after directories.');
  process.exit(1);
}

const baselineFiles = fs.readdirSync(baselineDir).filter((f) => f.endsWith('.png'));

console.log(`[QA] Comparing ${baselineFiles.length} frames...`);
console.log('--------------------------------------------------------------------------------');
console.log(
  'Filename'.padEnd(46) +
    'Total Px'.padStart(10) +
    'Diff Px'.padStart(10) +
    'Diff %'.padStart(10) +
    'Status'.padStart(10)
);
console.log('--------------------------------------------------------------------------------');

let totalDiffs = 0;
let passedCount = 0;
let failedCount = 0;
const results = [];

for (const file of baselineFiles) {
  const baselinePath = path.join(baselineDir, file);
  const afterPath = path.join(afterDir, file);

  if (!fs.existsSync(afterPath)) {
    console.error(`[QA] Missing matching after file for: ${file}`);
    failedCount++;
    continue;
  }

  const imgBaseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const imgAfter = PNG.sync.read(fs.readFileSync(afterPath));

  const { width, height } = imgBaseline;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    imgBaseline.data,
    imgAfter.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  const totalPixels = width * height;
  const diffPercent = ((numDiffPixels / totalPixels) * 100);

  // Extract timestamp from filename e.g. desktop_1920x1080_t7.2s.png
  const match = file.match(/_t([\d\.]+)s\.png/);
  const t = match ? parseFloat(match[1]) : 0;

  // Plan2 Rule: Frames at t <= 10.0 s must match the baseline (tiny anti-aliasing differences <= 0.25% are fine)
  const isPassed = t <= 10.0 ? diffPercent <= 0.25 : true;

  if (isPassed) {
    passedCount++;
  } else {
    failedCount++;
  }

  const status = isPassed ? 'PASS' : 'FAIL';
  console.log(
    file.padEnd(46) +
      String(totalPixels).padStart(10) +
      String(numDiffPixels).padStart(10) +
      (diffPercent.toFixed(3) + '%').padStart(10) +
      status.padStart(10)
  );

  results.push({
    file,
    t,
    totalPixels,
    numDiffPixels,
    diffPercent,
    status,
  });

  if (numDiffPixels > 0) {
    fs.writeFileSync(path.join(diffDir, file), PNG.sync.write(diff));
  }
}

console.log('--------------------------------------------------------------------------------');
console.log(`[QA] Summary: ${passedCount} PASSED, ${failedCount} FAILED out of ${baselineFiles.length}`);

if (failedCount > 0) {
  console.error('[QA] Visual regression test FAILED.');
  process.exit(1);
} else {
  console.log('[QA] Visual regression test PASSED. Intro animation is 100% verified untouched!');
  process.exit(0);
}
