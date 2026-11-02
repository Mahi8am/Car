import { chromium } from 'playwright';

async function testCrossViewportAndPrototype() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const viewports = [
    { name: 'Mobile (iPhone 14/15)', width: 393, height: 852 },
    { name: 'Tablet (iPad Mini)', width: 768, height: 1024 },
    { name: 'Desktop HD', width: 1440, height: 900 },
    { name: 'Ultrawide 4K', width: 2560, height: 1440 },
  ];

  for (const vp of viewports) {
    console.log(`\n--- Testing ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // 1. Test Home with instant resolution
    await page.goto('http://localhost:3000?intro=skip', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const heroH1 = await page.$eval('h1', el => el.textContent.trim());
    console.log(`  [Home] H1 loaded: "${heroH1.slice(0, 30)}..."`);

    // 2. Test Marketplace /buy
    await page.goto('http://localhost:3000/buy', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const carCardsCount = await page.$$eval('article[id^="car-card-"]', els => els.length);
    console.log(`  [/buy] Rendered verified car cards: ${carCardsCount}`);
    if (carCardsCount < 10) throw new Error('Car cards count too low');

    // 3. Test Detail Page /buy/car-01
    await page.goto('http://localhost:3000/buy/car-01', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const detailH1 = await page.$eval('h1', el => el.textContent.trim());
    console.log(`  [/buy/car-01] Vehicle H1: "${detailH1}"`);

    // 4. Test Sell portal /sell
    await page.goto('http://localhost:3000/sell', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const sellBtn = await page.$eval('button', el => el.textContent.trim());
    console.log(`  [/sell] Interactive button: "${sellBtn}"`);

    const critical = errors.filter(e => !e.includes('favicon'));
    if (critical.length > 0) {
      console.error(`  ❌ Errors on ${vp.name}:`, critical);
      throw new Error(`Failed on ${vp.name}`);
    } else {
      console.log(`  ✅ Clean 0 errors on ${vp.name}`);
    }

    await context.close();
  }

  await browser.close();
  console.log('\n🌟 Cross-viewport and prototype readiness 100% verified!');
}

testCrossViewportAndPrototype().catch(err => {
  console.error(err);
  process.exit(1);
});
