import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'laptop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone-portrait', width: 390, height: 844 },
  { name: 'phone-landscape', width: 844, height: 390 },
];

const TIMESTAMPS = [0, 1, 2, 3, 4.5, 6, 7.2, 8, 8.8, 9.5, 10];

const targetDir = process.argv[2] || '_qa/baseline';
const outPath = path.resolve(process.cwd(), targetDir);

if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath, { recursive: true });
}

console.log(`[QA] Capturing frames into ${targetDir}...`);

async function main() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });

    await page.goto('http://localhost:3000/?debug&intro=replay', {
      waitUntil: 'domcontentloaded',
    });

    // Wait for debug scrubber AND IntroText to be mounted and ready
    await page.waitForSelector('#debug-scrubber', { timeout: 25000 });
    await page.waitForSelector('#intro-cta', { timeout: 25000 });
    await page.waitForTimeout(500);

    // Pause the playback immediately
    await page.evaluate(() => {
      const btn = document.getElementById('debug-play-pause');
      if (btn && btn.textContent && btn.textContent.includes('⏸')) {
        btn.click();
      }
      // Hide debug UI elements from screenshots so FPS jitter / scrubber position don't pollute pixel diffs
      const style = document.createElement('style');
      style.id = 'qa-hide-debug';
      style.textContent = `
        [role="complementary"] { opacity: 0 !important; pointer-events: none !important; }
        div[style*="zIndex: 9998"] { opacity: 0 !important; pointer-events: none !important; }
      `;
      document.head.appendChild(style);
    });

    for (const t of TIMESTAMPS) {
      // Seek to t
      await page.evaluate((targetT) => {
        const input = document.getElementById('debug-scrubber');
        if (input) {
          const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
          )?.set;
          if (nativeSetter) {
            nativeSetter.call(input, targetT);
          } else {
            input.value = targetT;
          }
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, t);

      // Wait for RAF and Three.js canvas render to complete
      await page.waitForTimeout(300);

      const filename = `${vp.name}_${vp.width}x${vp.height}_t${t.toFixed(1)}s.png`;
      const filePath = path.join(outPath, filename);
      await page.screenshot({ path: filePath });
      process.stdout.write(`  ✓ t=${t}s -> ${filename}\n`);
    }

    await page.close();
  }

  await browser.close();
  console.log(`\n[QA] Successfully captured all 55 frames into ${targetDir}`);
}

main().catch((err) => {
  console.error('[QA] Error capturing frames:', err);
  process.exit(1);
});
