import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('_qa/modes');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function testAllModes() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  try {
    // ── Test 1: Desktop Skip Visit ──────────────────────────────────────────
    console.log('Testing 1: Desktop ?intro=skip...');
    const ctx1 = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page1 = await ctx1.newPage();
    const errors1 = [];
    page1.on('console', msg => { if (msg.type() === 'error') errors1.push(msg.text()); });
    await page1.goto('http://localhost:3000/?intro=skip');
    await page1.waitForTimeout(1500);
    await page1.screenshot({ path: path.join(OUT_DIR, '01-desktop-skip.png') });
    console.log('Test 1 console errors:', errors1.length);
    await ctx1.close();

    // ── Test 2: Repeat Visit (sessionStorage gm_intro_played = 1) ───────────
    console.log('Testing 2: Repeat Visit...');
    const ctx2 = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page2 = await ctx2.newPage();
    const errors2 = [];
    page2.on('console', msg => { if (msg.type() === 'error') errors2.push(msg.text()); });
    await page2.addInitScript(() => {
      sessionStorage.setItem('gm_intro_played', '1');
    });
    await page2.goto('http://localhost:3000');
    await page2.waitForTimeout(1500);
    await page2.screenshot({ path: path.join(OUT_DIR, '02-desktop-repeat.png') });
    console.log('Test 2 console errors:', errors2.length);
    await ctx2.close();

    // ── Test 3: Mobile Portrait Visit (390x844) ─────────────────────────────
    console.log('Testing 3: Mobile Portrait (390x844)...');
    const ctx3 = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page3 = await ctx3.newPage();
    const errors3 = [];
    page3.on('console', msg => { if (msg.type() === 'error') errors3.push(msg.text()); });
    await page3.goto('http://localhost:3000/?intro=skip');
    await page3.waitForTimeout(1500);
    await page3.screenshot({ path: path.join(OUT_DIR, '03-mobile-skip.png') });
    console.log('Test 3 console errors:', errors3.length);
    await ctx3.close();

    // ── Test 4: Full 3D Intro at t=2.5s (Zero black circle) ────────────────
    console.log('Testing 4: Full Intro at t=2.5s...');
    const ctx4 = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page4 = await ctx4.newPage();
    const errors4 = [];
    page4.on('console', msg => { if (msg.type() === 'error') errors4.push(msg.text()); });
    await page4.goto('http://localhost:3000/?intro=replay');
    await page4.waitForTimeout(2500);
    await page4.screenshot({ path: path.join(OUT_DIR, '04-full-intro-animation.png') });
    const heroStateAtT2 = await page4.evaluate(() => {
      const el = document.getElementById('hero-phase-2');
      return el ? window.getComputedStyle(el).display : 'none';
    });
    console.log('Test 4 hero-phase-2 display at t=2.5s:', heroStateAtT2);
    console.log('Test 4 console errors:', errors4.length);
    await ctx4.close();

    console.log('\n=== ALL TESTS COMPLETE ===');
  } catch (err) {
    console.error('Mode test error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testAllModes();
