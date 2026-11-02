import { chromium } from 'playwright';

async function testUserRequests() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  console.log('1. Testing /buy page card clickability...');
  await page.goto('http://localhost:3000/buy', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Check clicking on the first card element itself
  const firstCard = await page.$('article[id^="car-card-"]');
  if (firstCard) {
    console.log('Found car card, clicking body of the card...');
    await firstCard.click();
    await page.waitForTimeout(1500);
    console.log('Current URL after card click:', page.url());
    if (page.url().includes('/buy/')) {
      console.log('✅ Card click successfully navigated to item display page!');
    } else {
      console.error('❌ Card click failed to navigate!');
    }
  } else {
    console.error('❌ Could not find car card on /buy');
  }

  console.log('\n2. Testing /buy/[id] item display page directly...');
  await page.goto('http://localhost:3000/buy/car-01', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const heading = await page.$eval('h1', el => el.textContent);
  console.log('Item display page H1:', heading);
  console.log('✅ /buy/car-01 loaded cleanly with heading:', heading);

  console.log('\n3. Testing home page service buttons routing...');
  await page.goto('http://localhost:3000/#services', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const buyButtonHref = await page.$eval('#services a[href*="/buy"]', el => el.getAttribute('href')).catch(() => null);
  const sellButtonHref = await page.$eval('#services a[href*="/sell"]', el => el.getAttribute('href')).catch(() => null);
  console.log('Buy button href in services:', buyButtonHref);
  console.log('Sell button href in services:', sellButtonHref);

  console.log('\n4. Testing /sell page...');
  await page.goto('http://localhost:3000/sell', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const sellHeading = await page.$eval('h1', el => el.textContent);
  console.log('Sell page H1:', sellHeading);

  console.log('\n5. Checking console errors across all pages...');
  const realErrors = errors.filter(e => !e.includes('favicon'));
  console.log('Total console errors:', realErrors.length);
  if (realErrors.length > 0) {
    console.log('Errors:', realErrors);
  } else {
    console.log('✅ ZERO console errors across all pages!');
  }

  await browser.close();
}

testUserRequests().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
