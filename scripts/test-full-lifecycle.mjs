import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('_qa/lifecycle');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function testLifecycle() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  console.log('Visiting http://localhost:3000 as first-time visitor...');
  await page.goto('http://localhost:3000');

  // t = 2.5s: 3D car driving
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT_DIR, '01-t2.5s-car-entry.png') });
  console.log('Captured t=2.5s');

  // t = 6.0s: IntroText visible
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(OUT_DIR, '02-t6.0s-intro-text.png') });
  console.log('Captured t=6.0s');

  // t = 13.5s: Intro completes, hero resolves
  await page.waitForTimeout(7500);
  await page.screenshot({ path: path.join(OUT_DIR, '03-t13.5s-resolved-hero.png') });
  console.log('Captured t=13.5s');

  // Scroll down to Services
  console.log('Scrolling down to #services...');
  await page.evaluate(() => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '04-services-two-doors.png') });
  console.log('Captured services');

  console.log('Total console errors:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }

  await ctx.close();
  await browser.close();
}

testLifecycle();
