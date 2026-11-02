import { chromium } from 'playwright';

async function debugIntro() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

  await page.goto('http://localhost:3000?intro=replay', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const html = await page.evaluate(() => {
    const skipBtn = document.getElementById('skip-intro-btn');
    const heroP2 = document.getElementById('hero-phase-2');
    const canvas = document.querySelector('canvas');
    return {
      hasSkipBtn: !!skipBtn,
      skipBtnStyle: skipBtn ? skipBtn.getAttribute('style') : null,
      hasHeroP2: !!heroP2,
      heroP2Display: heroP2 ? heroP2.style.display : null,
      hasCanvas: !!canvas,
    };
  });

  console.log('DOM Evaluation:', html);
  await browser.close();
}

debugIntro();
