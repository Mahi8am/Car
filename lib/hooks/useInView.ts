/**
 * lib/hooks/useInView.ts
 * ──────────────────────
 * Light-weight IntersectionObserver hook for editorial scroll-reveals.
 * - Triggers once when the element enters viewport (threshold / rootMargin).
 * - Unobserves immediately after first entry (no re-triggering on scroll back).
 * - Respects prefers-reduced-motion: immediately returns true.
 * - SSR-safe (defaults to false until client mounted, or true under reduced motion).
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0.15, rootMargin = '0px 0px -8% 0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setIsInView(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(node);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, reducedMotion]);

  return { ref, isInView: reducedMotion || isInView };
}

export default useInView;
