/**
 * components/sections/Services.tsx
 * ────────────────────────────────
 * Editorial Services Section (Buy · Sell — Launch Scope).
 * - Desktop: side-by-side expandable image panels (75–85svh high, default: Buy).
 * - Mobile: full-width stacked panels (aspect ≈ 4:5, bottom-anchored content).
 * - Section heading with masked line reveal (matches Plan1 Scene 4 aesthetic).
 * - Event-driven panel selection (inter-wired with Navbar, Hero Phase 2, and ServiceIndex).
 * - 100% CSS responsive layout to guarantee zero SSR hydration mismatch.
 */

'use client';

import { useState, useEffect } from 'react';
import { servicesContent } from '@/content/services';
import { ServicePanel } from './ServicePanel';
import { useInView } from '@/lib/hooks/useInView';
import { subscribeServicePanel, type ServicePanelId } from '@/lib/serviceEvents';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function Services() {
  const [activePanel, setActivePanel] = useState<ServicePanelId>('buy');
  const { ref: headerRef, isInView: headerInView } = useInView<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });
  const reducedMotion = useReducedMotion();

  // Cross-component communication: opens panel when clicked in Navbar / Hero / Shortcuts
  useEffect(() => {
    const unsubscribe = subscribeServicePanel((panelId) => {
      setActivePanel(panelId);
    });
    return unsubscribe;
  }, []);

  const handlePanelKeyNav = (currentId: ServicePanelId, key: string) => {
    if (key === 'ArrowRight' || key === 'ArrowLeft') {
      const nextId: ServicePanelId = currentId === 'buy' ? 'sell' : 'buy';
      setActivePanel(nextId);
      const targetEl = document.getElementById(`service-panel-${nextId}`);
      targetEl?.focus();
    }
  };

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bone)',
        color: 'var(--ink-950)',
        padding: '7rem 0 5rem',
        overflow: 'hidden',
      }}
    >
      {/* Geometric background disc motif bleeding off top-left edge */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-12vw',
          left: '-12vw',
          width: '42vw',
          height: '42vw',
          borderRadius: '50%',
          backgroundColor: 'rgba(22, 22, 23, 0.04)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        {/* Section Header with Masked Line Reveal */}
        <div ref={headerRef} style={{ marginBottom: '3.5rem', maxWidth: '760px' }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem',
              opacity: headerInView || reducedMotion ? 1 : 0,
              transform: headerInView || reducedMotion ? 'translateY(0)' : 'translateY(12px)',
              transition: reducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.8rem',
                color: 'var(--red)',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              {servicesContent.eyebrow}
            </span>
            <div style={{ width: 28, height: 1, backgroundColor: 'var(--red)' }} />
          </div>

          {/* Masked Line Heading Reveal */}
          <div style={{ overflow: 'hidden', paddingBottom: '0.2rem', marginBottom: '0.85rem' }}>
            <h2
              id="services-heading"
              style={{
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: 'clamp(2.75rem, 5.5vw, 5.25rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: 'var(--ink-950)',
                lineHeight: 0.92,
                margin: 0,
                transform: headerInView || reducedMotion ? 'translateY(0%)' : 'translateY(105%)',
                transition: reducedMotion ? 'none' : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {servicesContent.title}
            </h2>
          </div>

          {/* Supporting Copy */}
          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '1.05rem',
              color: 'var(--charcoal)',
              lineHeight: 1.6,
              maxWidth: '54ch',
              margin: 0,
              opacity: headerInView || reducedMotion ? 0.85 : 0,
              transform: headerInView || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
              transition: reducedMotion ? 'none' : 'opacity 0.7s ease-out 0.2s, transform 0.7s ease-out 0.2s',
            }}
          >
            {servicesContent.supporting}
          </p>
        </div>

        {/* Two Doors Panel Container */}
        <div
          role="tablist"
          aria-label="Services panels"
          className="flex flex-col md:flex-row gap-6 md:gap-0 border-l-0 md:border-l md:border-[rgba(35,35,38,0.15)] relative"
        >
          {servicesContent.panels.map((panel) => (
            <ServicePanel
              key={panel.id}
              panel={panel}
              isOpen={activePanel === panel.id}
              onOpen={() => setActivePanel(panel.id)}
              onKeyNav={(key) => handlePanelKeyNav(panel.id, key)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
