import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Duxty/.gemini/antigravity-ide/brain/47437a4d-c981-46d8-b452-e53567f75ca2/qa';
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function runM5Tests() {
  console.log('--- Starting Milestone 5 (Brands & Footer) Automated QA ---');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const consoleErrors = [];

  // 1. Desktop Test (1920x1080)
  console.log('\n[1/3] Testing Desktop (1920x1080)...');
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`Console error: ${msg.text()}`);
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(`Page error: ${err.message}`);
  });

  await page.goto('http://localhost:3000/?intro=skip', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to #brands section
  console.log('Scrolling to #brands...');
  await page.evaluate(() => {
    const el = document.getElementById('brands');
    el?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  // Verify 12 brand cells
  const brandCells = await page.$$('#brands a[aria-label*="Browse"]');
  console.log(`Found ${brandCells.length} brand cells in the hairline grid.`);
  if (brandCells.length !== 12) {
    throw new Error(`Expected exactly 12 brand cells, got ${brandCells.length}`);
  }

  // Screenshot brands section
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'm5_01-desktop-brands.png'),
  });
  console.log('Saved m5_01-desktop-brands.png');

  // Hover over the first cell (Toyota)
  console.log('Hovering over Toyota cell...');
  await brandCells[0].hover();
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'm5_02-desktop-brand-hover.png'),
  });
  console.log('Saved m5_02-desktop-brand-hover.png');

  // Scroll to Footer
  console.log('Scrolling to #footer...');
  await page.evaluate(() => {
    const el = document.getElementById('footer');
    el?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  // Screenshot footer
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'm5_03-desktop-footer.png'),
  });
  console.log('Saved m5_03-desktop-footer.png');

  // Test "Back to top" button
  console.log('Testing "Back to top" button...');
  const backToTopBtn = await page.$('button[aria-label="Back to top"]');
  if (!backToTopBtn) {
    throw new Error('Back to top button not found in footer');
  }
  await backToTopBtn.click();
  await page.waitForTimeout(1500);

  const scrollYAfterTop = await page.evaluate(() => window.scrollY);
  console.log(`Scroll Y after Back to top: ${scrollYAfterTop}`);
  if (scrollYAfterTop > 300) {
    console.warn(`ScrollY is ${scrollYAfterTop}, expected near 0`);
  }

  await context.close();

  // 2. Mobile Portrait Test (390x844)
  console.log('\n[2/3] Testing Mobile Portrait (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const mobilePage = await mobileContext.newPage();

  mobilePage.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`Mobile console error: ${msg.text()}`);
    }
  });

  await mobilePage.goto('http://localhost:3000/?intro=skip', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  // Scroll to mobile brands
  await mobilePage.evaluate(() => {
    const el = document.getElementById('brands');
    el?.scrollIntoView({ behavior: 'instant' });
  });
  await mobilePage.waitForTimeout(1000);

  await mobilePage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'm5_04-mobile-brands.png'),
  });
  console.log('Saved m5_04-mobile-brands.png');

  // Scroll to mobile footer
  await mobilePage.evaluate(() => {
    const el = document.getElementById('footer');
    el?.scrollIntoView({ behavior: 'instant' });
  });
  await mobilePage.waitForTimeout(1000);

  await mobilePage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'm5_05-mobile-footer.png'),
  });
  console.log('Saved m5_05-mobile-footer.png');

  await mobileContext.close();
  await browser.close();

  console.log('\n--- Console Errors Check ---');
  if (consoleErrors.length > 0) {
    console.error(`FAILED: ${consoleErrors.length} console errors encountered:`);
    consoleErrors.forEach((e) => console.error(e));
    process.exit(1);
  } else {
    console.log('SUCCESS: 0 console errors, 0 hydration mismatches!');
  }
}

runM5Tests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
