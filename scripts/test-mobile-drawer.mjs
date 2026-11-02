import { chromium } from 'playwright';

async function testMobile() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:3000/?intro=skip', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const hamburger = await page.$('button[aria-label="Open navigation menu"]');
  console.log('Hamburger found:', !!hamburger);
  if (!hamburger) {
    const allButtons = await page.$$eval('button', els => els.map(b => b.outerHTML));
    console.log('All buttons on page:', allButtons);
    await browser.close();
    return;
  }

  await hamburger.click();
  await page.waitForTimeout(500);

  const drawer1 = await page.$('div[role="dialog"][aria-label="Mobile Navigation"]');
  console.log('Mobile Navigation Drawer open:', !!drawer1);

  // Press Escape
  console.log('Pressing Escape...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  const drawerAfterEsc = await page.$('div[role="dialog"][aria-label="Mobile Navigation"]');
  console.log('Drawer closed after Escape:', !drawerAfterEsc);

  // Re-open hamburger
  const hamburger2 = await page.$('button[aria-label="Open navigation menu"]');
  if (hamburger2) {
    await hamburger2.click();
    await page.waitForTimeout(500);
    const closeBtn = await page.$('button[aria-label="Close menu"]');
    console.log('Close button found on reopen:', !!closeBtn);
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(500);
      const drawerAfterBtn = await page.$('div[role="dialog"][aria-label="Mobile Navigation"]');
      console.log('Drawer closed after close button click:', !drawerAfterBtn);
    }
  }

  await browser.close();
}

testMobile().catch(e => console.error('FATAL:', e));
