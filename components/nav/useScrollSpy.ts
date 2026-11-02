/**
 * components/nav/useScrollSpy.ts
 * ──────────────────────────────
 * Scroll position watcher for navigation:
 *   1. Identifies the active section for scroll-spy indication.
 *   2. Determines when user has scrolled past 80% of hero to solidify nav.
 *   3. Smart show/hide: hides on scroll down (past hero), reveals on scroll up.
 */

'use client';

import { useState, useEffect } from 'react';

export interface ScrollSpyState {
  activeId: string;
  isSolid: boolean;
  isNavVisible: boolean;
}

export function useScrollSpy(
  sectionIds: string[] = ['hero', 'services', 'brands', 'footer']
): ScrollSpyState {
  const [activeId, setActiveId] = useState('hero');
  const [isSolid, setIsSolid] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const hero = document.getElementById('hero');
      const heroH = hero ? hero.clientHeight : window.innerHeight;

      // Solid nav threshold: 80% of hero height
      const shouldBeSolid = scrollY > heroH * 0.8;
      setIsSolid(shouldBeSolid);

      // Smart show/hide (only once scrolled past hero)
      if (scrollY > heroH) {
        if (scrollY > lastScrollY + 8) {
          setIsNavVisible(false); // scrolling down
        } else if (scrollY < lastScrollY - 8) {
          setIsNavVisible(true);  // scrolling up
        }
      } else {
        setIsNavVisible(true);
      }
      lastScrollY = scrollY;

      // Active section calculation using navbar offset
      const navOffset = 120;
      let current = sectionIds[0] || 'hero';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navOffset && rect.bottom > navOffset) {
            current = id;
            break;
          }
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return { activeId, isSolid, isNavVisible };
}

export default useScrollSpy;
