/**
 * components/sections/FeaturedCars.tsx
 * ────────────────────────────────────
 * Featured Cars Showcase — Compact editorial slideshow.
 * Side-by-side layout: Image on the LEFT, car details & description on the RIGHT.
 * Reduced section height, smooth slideshow navigation, and Bencho micro-interactions.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Gauge, Calendar, Fuel, MapPin, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { featuredCars } from '@/content/cars';
import { useInView } from '@/lib/hooks/useInView';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function FeaturedCars() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const reducedMotion = useReducedMotion();
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });

  const goTo = useCallback((index: number, dir: 'next' | 'prev' = 'next') => {
    if (animating) return;
    setSlideDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setActiveIndex(index);
      setTimeout(() => setAnimating(false), 380);
    }, 180);
  }, [animating]);

  const handleManualPrev = () => {
    setHasUserInteracted(true);
    goTo((activeIndex - 1 + featuredCars.length) % featuredCars.length, 'prev');
  };

  const handleManualNext = () => {
    setHasUserInteracted(true);
    goTo((activeIndex + 1) % featuredCars.length, 'next');
  };

  const handleManualGoTo = (index: number) => {
    setHasUserInteracted(true);
    goTo(index, index > activeIndex ? 'next' : 'prev');
  };

  // Auto-advance slideshow smoothly every 5.5s UNLESS user has manually changed them
  useEffect(() => {
    if (reducedMotion || hasUserInteracted) return;
    const timer = setInterval(() => {
      goTo((activeIndex + 1) % featuredCars.length, 'next');
    }, 5500);
    return () => clearInterval(timer);
  }, [reducedMotion, hasUserInteracted, activeIndex, goTo]);

  const car = featuredCars[activeIndex];

  // Dynamic description for each car
  const descriptions: Record<string, string> = {
    'toyota-prado-2022': 'Flawless condition Land Cruiser Prado TX-L with premium leather interior, sunroof, and 4WD capability ready for all 64 districts of Bangladesh.',
    'honda-civic-2023': 'Aggressive styling with 1.5L VTEC turbo powertrain, dual exhausts, paddle shifters, and pristine showroom maintenance record in Dhaka.',
    'suzuki-swift-2024': 'Ultra-efficient Dualjet Hybrid city runner with Japanese safety suite, 360-degree cameras, and zero-registration hassle.',
    'mitsubishi-pajero-2021': 'Rugged flagship 4x4 with Super Select II system, high ground clearance, rock-solid suspension, and full dealer service history.',
  };

  const carDescription = descriptions[car.id] || 'Verified inspection passed with 160-point mechanical certification, direct seller transfer, and transparent pricing in BDT.';

  return (
    <section
      id="featured-cars"
      ref={sectionRef}
      aria-labelledby="featured-cars-heading"
      style={{
        position: 'relative',
        backgroundColor: 'var(--ink-950)',
        color: '#ffffff',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* ── Subtle Ambient Backdrop ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(225,37,27,0.06) 0%, transparent 60%)',
        }}
      />

      {/* ── Auto-Advance Glowing Progress Bar ────────────────────────────── */}
      {!hasUserInteracted && !reducedMotion && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2.5px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            zIndex: 35,
            overflow: 'hidden',
          }}
        >
          <div
            key={`slide-progress-${activeIndex}`}
            className="featured-slide-progress"
            style={{
              height: '100%',
              backgroundColor: 'var(--red)',
              boxShadow: '0 0 10px rgba(225, 37, 27, 0.9)',
            }}
          />
        </div>
      )}

      {/* ── Content Container (Compact Height) ──────────────────────────────── */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: 'clamp(2.5rem, 5vh, 3.75rem) clamp(1.5rem, 5vw, 4rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Section Header (Compact) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            flexWrap: 'wrap',
            gap: '1rem',
            opacity: isInView || reducedMotion ? 1 : 0,
            transform: isInView || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
            transition: reducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.72rem',
                  color: 'var(--red)',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                CURATED SELECTION
              </span>
              <div style={{ width: 20, height: 1.5, backgroundColor: 'var(--red)' }} />
            </div>
            <h2
              id="featured-cars-heading"
              style={{
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: '#ffffff',
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              FEATURED VEHICLES
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Quick Link to Marketplace */}
            <Link
              href="/buy"
              className="bencho-sweep-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#ffffff',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.22)',
                padding: '0.55rem 1.15rem',
                backgroundColor: 'rgba(255,255,255,0.04)',
                cursor: 'pointer',
              }}
            >
              <span>EXPLORE ALL ({featuredCars.length})</span>
              <ArrowUpRight size={13} color="var(--red)" />
            </Link>
          </div>
        </div>

        {/* ── Side-by-Side Layout: Left = Image, Right = Text ───────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(1.5rem, 3.5vw, 3rem)',
            alignItems: 'stretch',
          }}
        >
          {/* ── LEFT: Car Image + Overlay Controls ───────────────────────────── */}
          <div
            style={{
              position: 'relative',
              borderRadius: '2px',
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.12)',
              minHeight: '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Featured Car Photo with smooth cross-fade */}
            <img
              key={`featured-${car.id}`}
              src={car.image}
              alt={car.name}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '440px',
                objectFit: 'cover',
                display: 'block',
                opacity: animating ? 0.08 : 1,
                transform: animating
                  ? slideDir === 'next'
                    ? 'translateX(28px) scale(0.96)'
                    : 'translateX(-28px) scale(0.96)'
                  : 'translateX(0) scale(1)',
                transition: reducedMotion
                  ? 'none'
                  : 'opacity 0.35s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />

            {/* Subtle Gradient vignette over image */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(7,7,7,0.7) 0%, transparent 45%, rgba(7,7,7,0.3) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Badge overlay (Top Left) */}
            {car.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  backgroundColor: 'rgba(7, 7, 7, 0.88)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '0.3rem 0.75rem',
                  borderLeft: '2.5px solid var(--red)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
              >
                {car.badge}
              </span>
            )}

            {/* Slide Index Counter (Bottom Left) */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(7,7,7,0.8)',
                backdropFilter: 'blur(8px)',
                padding: '0.3rem 0.65rem',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.72rem',
                  color: 'var(--red)',
                  fontWeight: 700,
                }}
              >
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>/</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                {String(featuredCars.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* ── RIGHT: Car Details & Description ─────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'clamp(1.5rem, 2.5vw, 2.25rem)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              opacity: animating ? 0.15 : 1,
              transform: animating
                ? slideDir === 'next'
                  ? 'translateY(12px)'
                  : 'translateY(-12px)'
                : 'translateY(0)',
              transition: reducedMotion ? 'none' : 'opacity 0.35s ease, transform 0.38s ease',
            }}
          >
            <div>
              {/* Brand & Condition Eyebrow */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.72rem',
                      color: 'var(--red)',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {car.brand}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>·</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.68rem',
                      color: 'rgba(255,255,255,0.55)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {car.condition}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={13} color="var(--red)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.65rem',
                      color: 'rgba(255,255,255,0.7)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    INSPECTED
                  </span>
                </div>
              </div>

              {/* Headline / Car Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-barlow-condensed), sans-serif',
                  fontSize: 'clamp(2rem, 3.2vw, 2.85rem)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  lineHeight: 0.95,
                  color: '#ffffff',
                  margin: '0 0 1rem 0',
                }}
              >
                {car.name}
              </h3>

              {/* Description Snippet */}
              <p
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '0.88rem',
                  color: 'rgba(255,255,255,0.78)',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem',
                }}
              >
                {carDescription}
              </p>

              {/* 2x2 Specs Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {[
                  { Icon: Calendar, label: `${car.year} Model` },
                  { Icon: Gauge, label: car.mileage },
                  { Icon: Fuel, label: car.engine },
                  { Icon: MapPin, label: car.location.split(',')[0] },
                ].map(({ Icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon size={13} color="var(--red)" style={{ flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: 'var(--font-manrope), sans-serif',
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.75)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & CTA Row */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: '1.15rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.62rem',
                      color: 'rgba(255,255,255,0.45)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: '0.15rem',
                    }}
                  >
                    ASKING PRICE
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-barlow-condensed), sans-serif',
                      fontSize: 'clamp(1.85rem, 2.5vw, 2.35rem)',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1,
                    }}
                  >
                    {car.price}
                  </span>
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.68rem',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  BDT · NEGOTIABLE
                </span>
              </div>

              {/* Action Button & Dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  href={`/buy/${car.id}`}
                  className="bencho-sweep-button"
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 1.4rem',
                    backgroundColor: 'var(--red)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(225,37,27,0.3)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.backgroundColor = 'var(--red-deep)';
                    el.style.boxShadow = '0 8px 24px -2px rgba(225,37,27,0.55)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.backgroundColor = 'var(--red)';
                    el.style.boxShadow = '0 4px 16px rgba(225,37,27,0.3)';
                  }}
                >
                  <span>VIEW DETAILS</span>
                  <ArrowUpRight size={14} />
                </Link>

                {/* Slideshow Dots */}
                <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                  {featuredCars.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleManualGoTo(i)}
                      aria-label={`Go to car ${i + 1}`}
                      style={{
                        width: i === activeIndex ? 22 : 7,
                        height: 7,
                        borderRadius: i === activeIndex ? '4px' : '50%',
                        backgroundColor: i === activeIndex ? 'var(--red)' : 'rgba(255,255,255,0.22)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: reducedMotion ? 'none' : 'width 0.25s ease, background-color 0.25s ease',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Left Edge Previous Button ────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleManualPrev}
        aria-label="Previous car"
        className="bencho-sweep-button"
        style={{
          position: 'absolute',
          left: 'clamp(0.6rem, 1.8vw, 1.75rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 25,
          backgroundColor: 'rgba(12, 11, 10, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(255, 255, 255, 0.22)',
          color: '#ffffff',
          width: 'clamp(42px, 3.5vw, 50px)',
          height: 'clamp(42px, 3.5vw, 50px)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.backgroundColor = 'var(--red)';
          btn.style.borderColor = 'var(--red)';
          btn.style.boxShadow = '0 0 24px rgba(225, 37, 27, 0.7)';
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.backgroundColor = 'rgba(12, 11, 10, 0.88)';
          btn.style.borderColor = 'rgba(255, 255, 255, 0.22)';
          btn.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
        }}
      >
        <ChevronLeft size={22} />
      </button>

      {/* ── Right Edge Next Button ───────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleManualNext}
        aria-label="Next car"
        className="bencho-sweep-button"
        style={{
          position: 'absolute',
          right: 'clamp(0.6rem, 1.8vw, 1.75rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 25,
          backgroundColor: 'rgba(12, 11, 10, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(255, 255, 255, 0.22)',
          color: '#ffffff',
          width: 'clamp(42px, 3.5vw, 50px)',
          height: 'clamp(42px, 3.5vw, 50px)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.backgroundColor = 'var(--red)';
          btn.style.borderColor = 'var(--red)';
          btn.style.boxShadow = '0 0 24px rgba(225, 37, 27, 0.7)';
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.backgroundColor = 'rgba(12, 11, 10, 0.88)';
          btn.style.borderColor = 'rgba(255, 255, 255, 0.22)';
          btn.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
        }}
      >
        <ChevronRight size={22} />
      </button>
    </section>
  );
}

export default FeaturedCars;
