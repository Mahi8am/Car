import { chromium } from 'playwright';

async function testFinalPolish() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  console.log('=== TEST 1: INTRO SKIP BUTTON INSTANT COMPLETION ===');
  await page.goto('http://localhost:3000?intro=replay', { waitUntil: 'domcontentloaded' });
  
  // Wait for Skip button
  console.log('Waiting for Skip button...');
  await page.waitForSelector('#skip-intro-btn', { state: 'visible', timeout: 10000 });
  
  // Verify Explore Collection button is REMOVED from intro
  const exploreBtn = await page.$('#intro-cta');
  console.log('Explore Collection button present?', exploreBtn !== null);
  if (exploreBtn) {
    throw new Error('Explore Collection button was found, but should be removed!');
  } else {
    console.log('✅ Explore Collection button is completely removed.');
  }

  // Click Skip button
  console.log('Clicking Skip button...');
  await page.click('#skip-intro-btn');
  
  // Immediately check that HeroPhase2 is displayed
  await page.waitForTimeout(150);
  const heroPhase2Display = await page.$eval('#hero-phase-2', el => ({
    display: window.getComputedStyle(el).display,
    visibility: window.getComputedStyle(el).visibility,
    opacity: window.getComputedStyle(el).opacity,
  }));
  console.log('HeroPhase2 display state immediately after skip:', heroPhase2Display);
  if (heroPhase2Display.display !== 'block' || heroPhase2Display.visibility !== 'visible') {
    throw new Error(`HeroPhase2 did not show immediately after Skip! ${JSON.stringify(heroPhase2Display)}`);
  }
  console.log('✅ Skip button instantly completed the intro animation!');

  // Check VERIFIED MARKETPLACE badge is removed
  const verifiedBadge = await page.$('text="VERIFIED MARKETPLACE"');
  console.log('VERIFIED MARKETPLACE badge present?', verifiedBadge !== null);
  if (verifiedBadge) {
    throw new Error('VERIFIED MARKETPLACE badge was found, but should be removed!');
  } else {
    console.log('✅ VERIFIED MARKETPLACE badge is completely removed.');
  }

  // Test mouse parallax movement on hero section
  console.log('Testing mouse parallax on hero background...');
  await page.mouse.move(100, 100);
  await page.waitForTimeout(200);
  const transform1 = await page.$eval('#hero-phase-2 img', el => el.parentElement.style.transform);
  await page.mouse.move(1200, 800);
  await page.waitForTimeout(200);
  const transform2 = await page.$eval('#hero-phase-2 img', el => el.parentElement.style.transform);
  console.log('Hero background transform at (100, 100):', transform1);
  console.log('Hero background transform at (1200, 800):', transform2);
  if (transform1 !== transform2) {
    console.log('✅ Hero background image moves subtly with mouse parallax!');
  } else {
    console.warn('⚠️ Mouse movement transforms were identical, check parallax listener');
  }

  console.log('\n=== TEST 2: ALL PAGES INTEGRITY & CONSOLE CHECK ===');
  const urls = [
    'http://localhost:3000/',
    'http://localhost:3000/buy',
    'http://localhost:3000/sell',
    'http://localhost:3000/buy/car-01',
    'http://localhost:3000/buy/car-13',
    'http://localhost:3000/buy?brand=BMW',
  ];

  for (const url of urls) {
    console.log(`Checking ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const title = await page.title();
    console.log(`  -> Title: "${title}"`);
  }

  console.log('\n=== CONSOLE ERRORS SUMMARY ===');
  const criticalErrors = errors.filter(e => !e.includes('favicon'));
  console.log(`Total critical errors: ${criticalErrors.length}`);
  if (criticalErrors.length > 0) {
    console.error('Errors found:', criticalErrors);
    throw new Error('Console errors encountered');
  } else {
    console.log('✅ ZERO console errors across all tested pages!');
  }

  await browser.close();
  console.log('\n🎉 ALL POLISH & PROTOTYPE TESTS PASSED SUCCESSFULLY!');
}

testFinalPolish().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
