import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/_qa/phase3');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge',
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });

  console.log('Navigating to homepage with intro=skip...');
  await page.goto('http://localhost:3000/?intro=skip', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Take screenshot of hero section
  await page.screenshot({ path: path.join(outDir, '01-light-mode-hero.png') });
  console.log('Saved 01-light-mode-hero.png');

  // Scroll to featured cars
  const featured = page.locator('#featured-cars');
  if (await featured.count() > 0) {
    await featured.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '02-featured-cars.png') });
    console.log('Saved 02-featured-cars.png');
  }

  // Scroll to services
  const services = page.locator('#services');
  if (await services.count() > 0) {
    await services.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '03-services.png') });
    console.log('Saved 03-services.png');
  }

  // Scroll to brands
  const brands = page.locator('#brands');
  if (await brands.count() > 0) {
    await brands.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '04-brands.png') });
    console.log('Saved 04-brands.png');
  }

  // Scroll to reviews
  const reviews = page.locator('#reviews');
  if (await reviews.count() > 0) {
    await reviews.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '05-reviews.png') });
    console.log('Saved 05-reviews.png');
  }

  // Scroll to footer
  const footer = page.locator('#footer');
  if (await footer.count() > 0) {
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '06-footer.png') });
    console.log('Saved 06-footer.png');
  }

  // Test Marketplace /buy page
  console.log('Navigating to /buy marketplace page...');
  await page.goto('http://localhost:3000/buy', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '07-marketplace-page.png') });
  console.log('Saved 07-marketplace-page.png');

  // Test searching "Prado"
  const searchInput = page.locator('input[type="text"]');
  await searchInput.fill('Prado');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, '08-marketplace-search-prado.png') });
  console.log('Saved 08-marketplace-search-prado.png');

  // Test contact modal
  const contactBtn = page.locator('button:has-text("CONTACT VERIFIED SELLER")').first();
  if (await contactBtn.count() > 0) {
    await contactBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, '09-contact-seller-modal.png') });
    console.log('Saved 09-contact-seller-modal.png');
  }

  console.log('\n--- VERIFICATION RESULT ---');
  console.log('Console errors logged:', errors.length);
  if (errors.length > 0) {
    console.error('Errors:', errors);
  } else {
    console.log('Zero console errors! Verification PASS.');
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
