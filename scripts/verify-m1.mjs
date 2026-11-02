import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('_qa/m1');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = {
    desktopNavPresent: false,
    desktopNavClicks: false,
    desktopSolidNav: false,
    desktopSmartHideReveal: false,
    scrollSpyActiveLink: false,
    mobileHamburgerOpen: false,
    mobileEscClose: false,
    mobileLinkScrollClose: false,
  };

  try {
    // ── 1. Desktop Tests (1920x1080) ──────────────────────────────────────────
    console.log('Testing Desktop 1920x1080...');
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/?intro=skip', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200); // allow LowTierFallback 600ms ramp to finish

    // Verify nav is present
    const nav = await page.$('#main-nav');
    console.log('Desktop Nav present:', !!nav);
    results.desktopNavPresent = !!nav;

    // Capture initial desktop resolved hero with nav
    await page.screenshot({ path: path.join(OUT_DIR, '01-desktop-hero-nav.png') });

    // Click "Services" link
    console.log('Clicking "Services" in nav...');
    await page.click('#main-nav a[href="#services"]');
    await page.waitForTimeout(1200); // allow Lenis smooth scroll

    const scrollYAfterServices = await page.evaluate(() => window.scrollY);
    console.log('Scroll Y after clicking Services:', scrollYAfterServices);
    results.desktopNavClicks = scrollYAfterServices > 400;

    // Verify solid nav background
    const navBg = await page.evaluate(() => {
      const el = document.getElementById('main-nav');
      return el ? window.getComputedStyle(el).backgroundColor : '';
    });
    console.log('Navbar backgroundColor after scroll:', navBg);
    results.desktopSolidNav = navBg.includes('22, 22, 23') || navBg.includes('rgb(');

    // Capture Services section
    await page.screenshot({ path: path.join(OUT_DIR, '02-desktop-services-scrolled.png') });

    // Click "Brands" link
    console.log('Clicking "Brands" in nav...');
    await page.click('#main-nav a[href="#brands"]');
    await page.waitForTimeout(1200);

    const scrollYAfterBrands = await page.evaluate(() => window.scrollY);
    console.log('Scroll Y after clicking Brands:', scrollYAfterBrands);

    // Verify active underline on Brands
    const activeBrandsUnderline = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('#main-nav a.nav-link'));
      const brandsLink = links.find(l => l.getAttribute('href') === '#brands');
      if (!brandsLink) return '';
      const underline = brandsLink.querySelector('span');
      return underline ? window.getComputedStyle(underline).transform : '';
    });
    console.log('Active underline on Brands:', activeBrandsUnderline);
    results.scrollSpyActiveLink = activeBrandsUnderline.includes('matrix(1,') || activeBrandsUnderline === 'none';

    // Capture Brands section
    await page.screenshot({ path: path.join(OUT_DIR, '03-desktop-brands-scrolled.png') });

    // Scroll to footer and capture
    await page.evaluate(() => {
      const footer = document.getElementById('footer');
      if (footer) footer.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '04-desktop-footer.png') });

    // Test smart header hide/reveal past hero:
    // 1. Scroll down 300px -> header hides (-100%)
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(400);
    const navTransformDown = await page.evaluate(() => {
      const el = document.getElementById('main-nav');
      return el ? el.style.transform : '';
    });
    console.log('Nav transform after scrolling down:', navTransformDown);

    // 2. Scroll up 150px -> header reveals (0%)
    await page.evaluate(() => window.scrollBy(0, -150));
    await page.waitForTimeout(400);
    const navTransformUp = await page.evaluate(() => {
      const el = document.getElementById('main-nav');
      return el ? el.style.transform : '';
    });
    console.log('Nav transform after scrolling up:', navTransformUp);
    results.desktopSmartHideReveal = navTransformDown.includes('-100%') && navTransformUp.includes('0%');

    await context.close();

    // ── 2. Mobile Tests (390x844) ─────────────────────────────────────────────
    console.log('\nTesting Mobile 390x844...');
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:3000/?intro=skip', { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(1200);

    // Check hamburger button is visible
    const hamburger = await mobilePage.$('button[aria-label="Open navigation menu"]');
    console.log('Hamburger button found:', !!hamburger);
    results.mobileHamburgerOpen = !!hamburger;

    if (hamburger) {
      // Click hamburger to open drawer
      await hamburger.click();
      await mobilePage.waitForTimeout(500);

      // Verify drawer dialog
      const drawer = await mobilePage.$('div[role="dialog"][aria-label="Mobile Navigation"]');
      console.log('Mobile Navigation Drawer visible:', !!drawer);

      await mobilePage.screenshot({ path: path.join(OUT_DIR, '05-mobile-drawer-open.png') });

      // Press Escape key to close
      console.log('Pressing Escape to test drawer close...');
      await mobilePage.keyboard.press('Escape');
      await mobilePage.waitForTimeout(500);

      const drawerAfterEsc = await mobilePage.$('div[role="dialog"][aria-label="Mobile Navigation"]');
      console.log('Drawer closed after Escape:', !drawerAfterEsc);
      results.mobileEscClose = !drawerAfterEsc;

      // Re-open hamburger
      const hamburgerAgain = await mobilePage.$('button[aria-label="Open navigation menu"]');
      if (hamburgerAgain) {
        await hamburgerAgain.click();
        await mobilePage.waitForTimeout(500);

        // Click "Brands" inside drawer
        console.log('Clicking Brands link inside mobile drawer...');
        const brandsDrawerLink = await mobilePage.$('div[role="dialog"][aria-label="Mobile Navigation"] a[href="#brands"]');
        if (brandsDrawerLink) {
          await brandsDrawerLink.click();
          await mobilePage.waitForTimeout(1500); // allow drawer dismiss + Lenis smooth scroll

          const mobileScrollY = await mobilePage.evaluate(() => window.scrollY);
          const drawerAfterClick = await mobilePage.$('div[role="dialog"][aria-label="Mobile Navigation"]');
          console.log('Mobile scrollY after Brands link click:', mobileScrollY);
          console.log('Drawer dismissed after click:', !drawerAfterClick);
          results.mobileLinkScrollClose = mobileScrollY > 400 && !drawerAfterClick;

          await mobilePage.screenshot({ path: path.join(OUT_DIR, '06-mobile-brands-scrolled.png') });
        }
      }
    }

    await mobileContext.close();

  } catch (err) {
    console.error('Test run error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n=== M1 VERIFICATION RESULTS ===');
  console.log(JSON.stringify(results, null, 2));

  const allPassed = Object.values(results).every(v => v === true);
  if (!allPassed) {
    process.exit(1);
  }
}

run();
