/**
 * components/nav/MobileMenu.tsx
 * ─────────────────────────────
 * Full-screen mobile navigation overlay:
 *   - Editorial Barlow Condensed stacked links
 *   - Red accent details and hairline rules
 *   - Focus trap and Esc key support for accessibility
 *   - Body scroll locking while open
 *   - Smooth scroll to section on link click
 */

'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/content/site';
import { scrollToTarget } from '@/lib/hooks/useLenis';
import { openServicePanel } from '@/lib/serviceEvents';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeId: string;
}

export function MobileMenu({ isOpen, onClose, activeId }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Lock body scroll and trap focus while open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the close button upon opening
    firstFocusableRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    panelKey?: 'buy' | 'sell'
  ) => {
    onClose();
    if (href === '/buy' || href === '/sell') {
      // Normal route navigation to marketplace or sell page
      return;
    }
    if (href === '/') {
      if (isHome) {
        e.preventDefault();
        scrollToTarget('#hero', 0);
      }
      return;
    }
    if (href.startsWith('#')) {
      e.preventDefault();
      if (panelKey) {
        openServicePanel(panelKey);
      }
      const target = panelKey === 'sell' && typeof window !== 'undefined' && window.innerWidth < 768
        ? '#service-panel-mobile-sell'
        : href;
      scrollToTarget(target, -70);
    } else if (href.startsWith('/#')) {
      if (isHome) {
        e.preventDefault();
        if (panelKey) {
          openServicePanel(panelKey);
        }
        const target = panelKey === 'sell' && typeof window !== 'undefined' && window.innerWidth < 768
          ? '#service-panel-mobile-sell'
          : href.replace('/', '');
        scrollToTarget(target, -70);
      }
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'var(--bone)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem 1.75rem',
      }}
    >
      {/* Top bar: Brand + Close */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(35, 35, 38, 0.15)',
          paddingBottom: '1.25rem',
        }}
      >
        <Image
          src="/brand/logo.png"
          alt={siteConfig.brandName}
          width={76}
          height={40}
          style={{ width: 76, height: 'auto' }}
        />
        <button
          ref={firstFocusableRef}
          onClick={onClose}
          aria-label="Close menu"
          style={{
            background: 'none',
            border: '1px solid rgba(35, 35, 38, 0.18)',
            borderRadius: 0,
            padding: '0.5rem',
            color: 'var(--ink-950)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Main stacked links */}
      <nav style={{ margin: 'auto 0', padding: '2rem 0' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {siteConfig.navItems.map((item, index) => {
            let isActive = false;
            if (item.id === 'nav-home') isActive = isHome;
            else if (item.id === 'nav-buy') isActive = pathname.startsWith('/buy');
            else if (item.id === 'nav-sell') isActive = pathname.startsWith('/sell');

            const num = String(index + 1).padStart(2, '0');

            return (
              <li key={item.id} style={{ borderBottom: '1px solid rgba(35, 35, 38, 0.12)', paddingBottom: '1rem' }}>
                <Link
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href, item.panelKey)}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    color: 'var(--ink-950)',
                    opacity: isActive ? 1 : 0.75,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '0.75rem',
                        color: 'var(--red)',
                        fontWeight: 600,
                      }}
                    >
                      {num}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-barlow-condensed), sans-serif',
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <ArrowUpRight size={20} color="var(--red)" style={{ opacity: isActive ? 1 : 0.4 }} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom details */}
      <div style={{ borderTop: '1px solid rgba(35, 35, 38, 0.15)', paddingTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '0.75rem',
              color: 'var(--charcoal)',
              opacity: 0.8,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              margin: 0,
            }}
          >
            Dhaka · Bangladesh
          </p>
          <div style={{ width: 24, height: 2, backgroundColor: 'var(--red)' }} />
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
