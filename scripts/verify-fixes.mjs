import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('_qa/fixes');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function verifyFixes() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const consoleErrors = [];

  try {
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    console.log('Navigating to http://localhost:3000 (normal full intro)...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

    // Wait 2.5s into the 3D car intro animation
    await page.waitForTimeout(2500);

    // Check visibility and display of #hero-phase-2
    const phase2StateAtT2 = await page.evaluate(() => {
      const el = document.getElementById('hero-phase-2');
      if (!el) return { exists: false };
      const style = window.getComputedStyle(el);
      return {
        exists: true,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
      };
    });
    console.log('HeroPhase2 state at t=2.5s (during 3D car intro):', phase2StateAtT2);

    // Capture screenshot during 3D car animation
    await page.screenshot({ path: path.join(OUT_DIR, '01-during-intro-animation.png') });

    // Wait until intro completes (master timeline is ~11.3s + ~1.5s load = ~13s)
    console.log('Waiting for intro to complete (up to 14s)...');
    await page.waitForTimeout(14000);

    const phase2StateAtEnd = await page.evaluate(() => {
      const el = document.getElementById('hero-phase-2');
      if (!el) return { exists: false };
      const style = window.getComputedStyle(el);
      return {
        exists: true,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
      };
    });
    console.log('HeroPhase2 state after intro completes:', phase2StateAtEnd);

    // Capture screenshot of resolved hero phase 2
    await page.screenshot({ path: path.join(OUT_DIR, '02-resolved-hero-phase2.png') });

    // Check service shortcuts (must only contain BUY and SELL)
    const heroShortcuts = await page.$$eval('#hero-phase-2 a', els =>
      els.map(el => el.textContent.trim()).filter(txt => txt.includes('BUY') || txt.includes('SELL') || txt.includes('RENT') || txt.includes('SERVICE'))
    );
    console.log('Hero shortcuts detected:', heroShortcuts);

    // Check services section panels
    const servicePanels = await page.$$eval('#services [id^="service-panel-"]', els =>
      els.map(el => el.id)
    );
    console.log('Services section panels detected:', servicePanels);

    // Check footer marketplace links
    const footerLinks = await page.$$eval('#footer a', els =>
      els.map(el => el.textContent.trim())
    );
    console.log('Footer links sample:', footerLinks.slice(0, 8));

    console.log('\n--- CONSOLE ERRORS DETECTED ---');
    console.log(consoleErrors.length === 0 ? 'ZERO console errors!' : consoleErrors);

    const passed =
      phase2StateAtT2.display === 'none' &&
      phase2StateAtEnd.display === 'block' &&
      consoleErrors.filter(e => e.includes('hydration') || e.includes('Hydration')).length === 0 &&
      servicePanels.length === 2 &&
      servicePanels.includes('service-panel-buy') &&
      servicePanels.includes('service-panel-sell') &&
      !servicePanels.includes('service-panel-rent') &&
      !servicePanels.includes('service-panel-home-service');

    console.log('\nVERIFICATION PASSED:', passed);
    if (!passed) {
      process.exit(1);
    }

    await context.close();
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verifyFixes();
