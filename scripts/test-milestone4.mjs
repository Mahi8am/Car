import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Duxty/.gemini/antigravity-ide/brain/47437a4d-c981-46d8-b452-e53567f75ca2/qa';
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function runM4Tests() {
  console.log('--- Starting Milestone 4 (Services: Two Doors) Automated QA ---');
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

  // Scroll to #services section
  await page.evaluate(() => {
    const el = document.getElementById('services');
    el?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  // Check Buy panel is default open
  const buyPanel = await page.$('#service-panel-buy');
  const sellPanel = await page.$('#service-panel-sell');

  if (!buyPanel || !sellPanel) {
    throw new Error('Desktop service panels not found in DOM');
  }

  const buyAriaSelected = await buyPanel.getAttribute('aria-selected');
  const sellAriaSelected = await sellPanel.getAttribute('aria-selected');
  console.log(`Default open state -> Buy: ${buyAriaSelected}, Sell: ${sellAriaSelected}`);

  if (buyAriaSelected !== 'true' || sellAriaSelected !== 'false') {
    throw new Error(`Expected Buy to be open and Sell to be closed, got Buy=${buyAriaSelected}, Sell=${sellAriaSelected}`);
  }

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'm4_01-desktop-services-buy-open.png'),
  });
  console.log('Saved m4_01-desktop-services-buy-open.png');

  // Hover over Sell panel
  console.log('Hovering over Sell panel...');
  await sellPanel.hover();
  await page.waitForTimeout(800);

  const buyAfterHover = await buyPanel.getAttribute('aria-selected');
  const sellAfterHover = await sellPanel.getAttribute('aria-selected');
  console.log(`After hover Sell -> Buy: ${buyAfterHover}, Sell: ${sellAfterHover}`);

  if (sellAfterHover !== 'true') {
    throw new Error('Sell panel did not expand on hover');
  }

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'm4_02-desktop-services-sell-open.png'),
  });
  console.log('Saved m4_02-desktop-services-sell-open.png');

  // Test Keyboard ArrowLeft navigation
  console.log('Testing keyboard navigation (ArrowLeft)...');
  await sellPanel.focus();
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(800);

  const buyAfterKey = await buyPanel.getAttribute('aria-selected');
  console.log(`After ArrowLeft -> Buy: ${buyAfterKey}`);
  if (buyAfterKey !== 'true') {
    throw new Error('Buy panel did not activate on ArrowLeft');
  }

  // 2. Test Cross-Component Wiring from Hero
  console.log('\n[2/3] Testing Inter-Wiring: Clicking SELL in ServiceIndex...');
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(500);

  // Click SELL in visible desktop shortcuts or hero CTA
  const sellShortcut = await page.$('.hidden.md\\:flex a:has-text("02")') || await page.$('a:has-text("SELL YOUR CAR")');
  if (sellShortcut) {
    await sellShortcut.click();
    await page.waitForTimeout(1500);
    const sellAfterShortcut = await sellPanel.getAttribute('aria-selected');
    console.log(`After clicking SELL shortcut/CTA -> Sell panel aria-selected: ${sellAfterShortcut}`);
    if (sellAfterShortcut !== 'true') {
      throw new Error('Sell panel did not expand when clicking SELL shortcut/CTA');
    }
  } else {
    console.warn('SELL shortcut not found');
  }

  // 3. Mobile Test (390x844)
  console.log('\n[3/3] Testing Mobile Portrait (390x844)...');
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

  // Scroll to services
  await mobilePage.evaluate(() => {
    const el = document.getElementById('services');
    el?.scrollIntoView({ behavior: 'instant' });
  });
  await mobilePage.waitForTimeout(1000);

  const mobileBuy = await mobilePage.$('#service-panel-mobile-buy');
  const mobileSell = await mobilePage.$('#service-panel-mobile-sell');

  if (!mobileBuy || !mobileSell) {
    throw new Error('Mobile service panels not found in DOM');
  }

  await mobilePage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'm4_03-mobile-services-stacked.png'),
    fullPage: false,
  });
  console.log('Saved m4_03-mobile-services-stacked.png');

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

runM4Tests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
