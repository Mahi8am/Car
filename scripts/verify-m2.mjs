import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('_qa/m2');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function verifyM2() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = {
    desktopPanelsRendered: false,
    desktopImagesLoaded: false,
    mobilePanelsRendered: false,
    mobileImagesLoaded: false,
  };

  try {
    // 1. Desktop Test (1920x1080)
    console.log('Testing Desktop 1920x1080...');
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/?intro=skip', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Scroll to services
    await page.click('#main-nav a[href="#services"]');
    await page.waitForTimeout(1500);

    // Check images inside services
    const desktopImages = await page.$$eval('#services img', imgs =>
      imgs.map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }))
    );
    console.log('Desktop service images found:', desktopImages.length, desktopImages);
    results.desktopPanelsRendered = desktopImages.length >= 4;
    results.desktopImagesLoaded = desktopImages.every(img => img.naturalWidth > 0);

    // Capture desktop services section with Buy panel open
    await page.screenshot({ path: path.join(OUT_DIR, '01-desktop-services-buy-open.png') });

    // Hover on "Sell" panel to test flex-grow expand
    const sellPanel = await page.$('#service-panel-sell');
    if (sellPanel) {
      await sellPanel.hover();
      await page.waitForTimeout(600); // allow flex-grow transition
      await page.screenshot({ path: path.join(OUT_DIR, '02-desktop-services-sell-hover.png') });
    }

    await context.close();

    // 2. Mobile Test (390x844)
    console.log('\nTesting Mobile 390x844...');
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:3000/?intro=skip', { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(1000);

    // Scroll to services
    await mobilePage.evaluate(() => {
      const el = document.getElementById('services');
      if (el) el.scrollIntoView();
    });
    await mobilePage.waitForTimeout(1500);

    const mobileImages = await mobilePage.$$eval('#services img', imgs =>
      imgs.map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
      }))
    );
    console.log('Mobile service images found:', mobileImages.length, mobileImages);
    results.mobilePanelsRendered = mobileImages.length >= 4;
    results.mobileImagesLoaded = mobileImages.every(img => img.naturalWidth > 0);

    await mobilePage.screenshot({ path: path.join(OUT_DIR, '03-mobile-services-stacked.png') });

    await mobileContext.close();

  } catch (err) {
    console.error('M2 verification error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n=== M2 VERIFICATION RESULTS ===');
  console.log(JSON.stringify(results, null, 2));

  const allPassed = Object.values(results).every(v => v === true);
  if (!allPassed) {
    process.exit(1);
  }
}

verifyM2();
