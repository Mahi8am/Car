import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('_qa/m3');
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080, file: '01-desktop-hero-phase2.png' },
  { name: 'laptop', width: 1440, height: 900, file: '02-laptop-hero-phase2.png' },
  { name: 'tablet', width: 768, height: 1024, file: '03-tablet-hero-phase2.png' },
  { name: 'phone-portrait', width: 390, height: 844, file: '04-phone-portrait-hero-phase2.png' },
  { name: 'phone-landscape', width: 844, height: 390, file: '05-phone-landscape-hero-phase2.png' },
];

async function verifyM3() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = {
    desktopResolvedRendered: false,
    heroImageLoaded: false,
    primaryCtaScrolls: false,
    viewportsTested: 0,
  };

  try {
    for (const vp of VIEWPORTS) {
      console.log(`Testing ${vp.name} (${vp.width}x${vp.height})...`);
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();

      await page.goto('http://localhost:3000/?intro=skip', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1400); // allow LowTierFallback ramp & HeroPhase2 entrance

      // Verify HeroPhase2 container exists
      const heroPhase2 = await page.$('#hero-phase-2');
      if (heroPhase2) {
        results.desktopResolvedRendered = true;
      }

      // Check hero car image
      const heroImg = await page.$('#hero-phase-2 img');
      if (heroImg) {
        const isComplete = await heroImg.evaluate(img => img.complete && img.naturalWidth > 0);
        if (isComplete) {
          results.heroImageLoaded = true;
        }
      }

      // Screenshot the resolved hero phase 2
      await page.screenshot({ path: path.join(OUT_DIR, vp.file) });
      results.viewportsTested++;

      // On desktop, test primary CTA click
      if (vp.name === 'desktop') {
        console.log('Testing "BROWSE CARS" CTA click on desktop...');
        const browseCta = await page.$('#hero-phase-2 a.primary-cta');
        if (browseCta) {
          await browseCta.click();
          await page.waitForTimeout(1400); // allow smooth scroll
          const scrollY = await page.evaluate(() => window.scrollY);
          console.log('ScrollY after clicking Browse Cars:', scrollY);
          results.primaryCtaScrolls = scrollY > 400;
        }
      }

      await context.close();
    }

  } catch (err) {
    console.error('M3 verification error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n=== M3 VERIFICATION RESULTS ===');
  console.log(JSON.stringify(results, null, 2));

  const allPassed =
    results.desktopResolvedRendered &&
    results.heroImageLoaded &&
    results.primaryCtaScrolls &&
    results.viewportsTested === 5;

  if (!allPassed) {
    process.exit(1);
  }
}

verifyM3();
