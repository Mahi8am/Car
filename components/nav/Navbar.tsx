/**
 * components/nav/Navbar.tsx
 * ────────────────────────────
 * Upgraded Navigation Bar (Plan2 Milestone 1):
 *   - Items: Buy · Sell · Rent · Home Service · Brands
 *   - Scroll-spy: active item highlighted with a thin --red underline
 *   - Solid on scroll: transparent over hero, solid --ink-950 past 80% scroll
 *   - Smart reveal: hides on scroll-down, reveals on scroll-up
 *   - Working accessible full-screen mobile menu overlay
 *   - Smooth scrolling via Lenis with fixed-nav offset
 *   - Plan1 reveal: introState.heroProgress drives initial fade-in (untouched)
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, Menu } from 'lucide-react';
import { introState } from '@/lib/animation/introState';
import { siteConfig } from '@/content/site';
import { useViewportLayout } from '@/lib/hooks/useViewportLayout';
import { useScrollSpy } from './useScrollSpy';
import { MobileMenu } from './MobileMenu';
import { scrollToTarget } from '@/lib/hooks/useLenis';
import { openServicePanel } from '@/lib/serviceEvents';

export function Navbar() {
  const wrapperRef = useRef<HTMLElement>(null);
  const layout = useViewportLayout();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeId, isSolid } = useScrollSpy([
    'hero',
    'services',
    'brands',
    'footer',
  ]);

  // Permanently sticky navbar:
  // On non-home pages (e.g. /buy), instantly visible at 100% opacity.
  // On home page, smoothly reveals with heroProgress and stays permanently fixed at top: 0.
  useEffect(() => {
    if (!isHome) {
      if (wrapperRef.current) {
        wrapperRef.current.style.opacity = '1';
        wrapperRef.current.style.transform = 'translateY(0%)';
      }
      return;
    }

    let raf: number;
    function tick() {
      if (wrapperRef.current) {
        const p = introState.heroProgress;
        const isComplete = introState.introComplete;
        if (isComplete || p >= 0.99) {
          wrapperRef.current.style.opacity = '1';
          wrapperRef.current.style.transform = 'translateY(0%)';
          wrapperRef.current.style.pointerEvents = 'auto';
        } else {
          wrapperRef.current.style.opacity = String(p);
          wrapperRef.current.style.transform = `translateY(${(1 - p) * -10}px)`;
          wrapperRef.current.style.pointerEvents = p > 0.5 ? 'auto' : 'none';
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isHome]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    panelKey?: 'buy' | 'sell'
  ) => {
    if (href === '/') {
      if (isHome) {
        e.preventDefault();
        scrollToTarget('#hero', -80);
      }
      return;
    }

    if (href.startsWith('#')) {
      e.preventDefault();
      if (panelKey) {
        openServicePanel(panelKey);
      }
      scrollToTarget(href, -80);
    } else if (href.startsWith('/#')) {
      if (isHome) {
        e.preventDefault();
        const target = href.replace('/', '');
        if (panelKey) {
          openServicePanel(panelKey);
        }
        scrollToTarget(target, -80);
      }
    }
  };

  return (
    <>
      <nav
        ref={wrapperRef}
        id="main-nav"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '72px',
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(1.5rem, 4vw, 2.5rem)',
          backgroundColor: 'rgba(237, 231, 220, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(35, 35, 38, 0.12)',
          transform: 'translateY(0%)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
          opacity: isHome ? 0 : 1, // On home waits for intro, on /buy immediately visible
          pointerEvents: isHome ? 'none' : 'auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => handleNavClick(e, '/')}
          aria-label="Garir Mela home"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Image
            src="/brand/logo.png"
            alt={siteConfig.brandName}
            width={86}
            height={48}
            priority
            style={{ width: 'clamp(64px, 7vw, 86px)', height: 'auto' }}
          />
        </Link>

        {/* Desktop Nav Items with Permanent Home · Buy · Sell buttons */}
        <ul
          className="hidden md:flex"
          style={{
            gap: '2.5rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            alignItems: 'center',
          }}
          role="list"
        >
          {siteConfig.navItems.map((item) => {
            let isActive = false;
            if (item.id === 'nav-home') isActive = isHome;
            else if (item.id === 'nav-buy') isActive = pathname.startsWith('/buy');
            else if (item.id === 'nav-sell') isActive = pathname.startsWith('/sell');

            return (
              <li key={item.id} style={{ position: 'relative', padding: '0.25rem 0' }}>
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.panelKey)}
                  className="nav-link"
                  style={{
                    fontFamily: 'var(--font-manrope), ui-sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-950)',
                    textDecoration: 'none',
                    opacity: isActive ? 1 : 0.72,
                    transition: 'opacity 0.2s ease, color 0.2s ease',
                    position: 'relative',
                    display: 'inline-block',
                    paddingBottom: '4px',
                  }}
                >
                  {item.label}
                  {/* Active Indicator Underline */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      width: '100%',
                      height: 2.5,
                      backgroundColor: 'var(--red)',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Controls: Desktop Search/User or Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Desktop Search & Account */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/buy"
              aria-label="Search marketplace"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--ink-950)',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s',
              }}
              className="hover:text-[var(--red)]"
            >
              <Search size={18} strokeWidth={1.5} />
            </Link>
            <button
              type="button"
              aria-label="Account"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--ink-950)',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s',
              }}
            >
              <User size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="flex md:hidden"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink-950)',
              padding: 4,
              alignItems: 'center',
            }}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeId={activeId}
      />
    </>
  );
}

export default Navbar;
