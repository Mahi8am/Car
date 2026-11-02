/**
 * components/hero/Navbar.tsx
 * ────────────────────────────
 * Navigation bar revealed after the intro completes (heroProgress 0→1).
 * Plan1: non-functional links, logo left, items Buy·Sell·Rent·Collections,
 * Search + User icons right. Mobile: logo + Menu icon.
 *
 * Reveal: introState.heroProgress drives opacity + translateY.
 * Uses a rAF loop — no React state, no re-renders during animation.
 */

'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, User, Menu } from 'lucide-react';
import { introState } from '@/lib/animation/introState';
import siteConfig from '@/config/site.config';
import { useViewportLayout } from '@/lib/hooks/useViewportLayout';

export function Navbar() {
  const wrapperRef = useRef<HTMLElement>(null);
  const layout     = useViewportLayout();
  const isMobile   = layout.mode === 'portrait' || layout.mode === 'landscape-phone';

  useEffect(() => {
    let raf: number;
    function tick() {
      if (wrapperRef.current) {
        const p = introState.heroProgress;
        wrapperRef.current.style.opacity   = String(p);
        wrapperRef.current.style.transform = `translateY(${(1 - p) * -12}px)`;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <nav
      ref={wrapperRef}
      id="main-nav"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2.5rem',
        opacity: 0,
      }}
    >
      {/* Logo */}
      <a href="/" aria-label="Garir Mela home" style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          src="/brand/logo-white.png"
          alt={siteConfig.brandName}
          width={86}
          height={48}
          priority
          style={{ width: 'clamp(64px, 7vw, 86px)', height: 'auto', opacity: 0.92 }}
        />
      </a>

      {/* Desktop nav items */}
      {!isMobile && (
        <ul
          style={{
            display: 'flex',
            gap: '2.5rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
          role="list"
        >
          {siteConfig.navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                style={{
                  fontFamily: 'var(--font-manrope), ui-sans-serif',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--bone)',
                  textDecoration: 'none',
                  opacity: 0.75,
                  transition: 'opacity 0.2s',
                }}
                className="nav-link"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Right icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {!isMobile ? (
          <>
            <button
              aria-label="Search"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--steel)', padding: 4 }}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Account"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--steel)', padding: 4 }}
            >
              <User size={18} strokeWidth={1.5} />
            </button>
          </>
        ) : (
          <button
            aria-label="Open menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bone)', padding: 4 }}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </nav>
  );
}
