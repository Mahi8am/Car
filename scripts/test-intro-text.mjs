import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Duxty/.gemini/antigravity-ide/brain/47437a4d-c981-46d8-b452-e53567f75ca2/qa';

async function testIntroText() {
  console.log('Capturing animation at t=5.0s and resolved hero...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  // 1. First-time visit: full intro animation
  await page.goto('http://localhost:3000');
  
  // Wait until t ≈ 4.8s (Scene 4: text reveal is active between t=2.8s and t=6.4s)
  await page.waitForTimeout(4800);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '02-t4.8s-intro-text-revealed.png') });
  console.log('Saved 02-t4.8s-intro-text-revealed.png');

  // 2. Skip to resolved hero to see the enriched right side
  await page.goto('http://localhost:3000/?intro=skip');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '01-desktop-hero-enriched-right.png') });
  console.log('Saved 01-desktop-hero-enriched-right.png');

  await browser.close();
  console.log('Console errors:', errors.length);
}

testIntroText().catch(err => {
  console.error(err);
  process.exit(1);
});
