/**
 * components/sections/Reviews.tsx
 * ───────────────────────────────
 * Verified Client Reviews & Testimonials section.
 * Rebuilt as a high-end horizontal slideshow in light mode (PC & Mobile)
 * matching the Featured Cars showcase:
 *   - Light mode theme: warm bone-light (#FAF7F2) backdrop with crisp white cards
 *   - Full horizontal slideshow with slide animations and auto-advance
 *   - Touch swipe left/right gesture support on mobile
 *   - Previous / Next buttons on sides and bottom thumb-controls
 *   - Animated 5-star ratings, 3D tilt hover physics, and verified badges
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Star, ShieldCheck, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';
import { reviews } from '@/content/reviews';
import { useInView } from '@/lib/hooks/useInView';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const reducedMotion = useReducedMotion();
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

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
    goTo((activeIndex - 1 + reviews.length) % reviews.length, 'prev');
  };

  const handleManualNext = () => {
    setHasUserInteracted(true);
    goTo((activeIndex + 1) % reviews.length, 'next');
  };

  const handleManualGoTo = (index: number) => {
    setHasUserInteracted(true);
    goTo(index, index > activeIndex ? 'next' : 'prev');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - (touchStartY.current ?? touchEndY);

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        handleManualNext();
      } else {
        handleManualPrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Auto-advance slideshow smoothly every 6s unless user interacts
  useEffect(() => {
    if (reducedMotion || hasUserInteracted) return;
    const timer = setInterval(() => {
      goTo((activeIndex + 1) % reviews.length, 'next');
    }, 6000);
    return () => clearInterval(timer);
  }, [reducedMotion, hasUserInteracted, activeIndex, goTo]);

  const rev = reviews[activeIndex];

  return (
    <section
      id="reviews"
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-labelledby="reviews-heading"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bone-light, #FAF7F2)',
        color: 'var(--ink-950)',
        padding: 'clamp(4.5rem, 8vh, 6.5rem) 0',
        overflow: 'hidden',
        borderTop: '1px solid rgba(35, 35, 38, 0.12)',
        borderBottom: '1px solid rgba(35, 35, 38, 0.12)',
      }}
    >
      {/* Red accent line at top */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(to right, var(--red) 0%, rgba(225,37,27,0.3) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle ambient light glow in background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-10vw',
          right: '-10vw',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          backgroundColor: 'rgba(225, 37, 27, 0.03)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 5vw, 3.5rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Section Header with Section Title and Slide Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid rgba(35, 35, 38, 0.12)',
            flexWrap: 'wrap',
            gap: '1.25rem',
            opacity: isInView || reducedMotion ? 1 : 0,
            transform: isInView || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
            transition: reducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          <div style={{ maxWidth: '720px' }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.75rem',
                  color: 'var(--red)',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                CLIENT EXPERIENCES
              </span>
              <div style={{ width: 28, height: 1.5, backgroundColor: 'var(--red)' }} />
            </div>

            {/* Heading */}
            <h2
              id="reviews-heading"
              style={{
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: 'clamp(2.35rem, 5vw, 4.25rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: 'var(--ink-950)',
                lineHeight: 0.95,
                margin: '0 0 0.5rem 0',
              }}
            >
              TRUSTED BY DRIVERS
            </h2>

            {/* Supporting line */}
            <p
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '1rem',
                color: 'rgba(22, 22, 23, 0.75)',
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              Real stories from verified buyers and sellers across Dhaka, Chittagong, Sylhet, and beyond.
            </p>
          </div>

          {/* Top-Right Slide Indicators (Shown on narrow screens, hidden on desktop where all 3 cards show in row) */}
          <div className="hidden sm:flex md:hidden items-center gap-4">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#ffffff',
                padding: '0.35rem 0.75rem',
                border: '1px solid rgba(35, 35, 38, 0.15)',
                borderRadius: '2px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.75rem',
                  color: 'var(--red)',
                  fontWeight: 700,
                }}
              >
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span style={{ color: 'rgba(35, 35, 38, 0.3)', fontSize: '0.7rem' }}>/</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.75rem',
                  color: 'rgba(22, 22, 23, 0.5)',
                }}
              >
                {String(reviews.length).padStart(2, '0')}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleManualPrev}
                aria-label="Previous review"
                className="bencho-sweep-button"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(35, 35, 38, 0.2)',
                  color: 'var(--ink-950)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={handleManualNext}
                aria-label="Next review"
                className="bencho-sweep-button"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(35, 35, 38, 0.2)',
                  color: 'var(--ink-950)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop Grid: All 3 Reviews in a Row ──────────────────────────── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {reviews.map((r, i) => (
            <article
              key={`desktop-review-${r.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2.25rem 2rem 2rem',
                backgroundColor: '#ffffff',
                border: '1.5px solid rgba(35, 35, 38, 0.12)',
                borderTop: '3.5px solid var(--red)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 32px -8px rgba(35, 35, 38, 0.08)',
                transition: 'transform 0.25s ease-out, box-shadow 0.25s ease, border-color 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 40px -10px rgba(35, 35, 38, 0.14)';
                e.currentTarget.style.borderColor = 'rgba(225,37,27,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 32px -8px rgba(35, 35, 38, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(35, 35, 38, 0.12)';
              }}
            >
              {/* Quotation Watermark */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '1.25rem',
                  fontFamily: 'var(--font-barlow-condensed), sans-serif',
                  fontSize: '6.5rem',
                  lineHeight: 0.8,
                  fontWeight: 800,
                  color: 'rgba(22, 22, 23, 0.04)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                “
              </div>

              {/* Card Header: 5 Stars + Verified Badge */}
              <div style={{ position: 'relative', zIndex: 1, marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {[...Array(r.rating)].map((_, si) => (
                      <span key={si} className="animated-star" style={{ animationDelay: `${i * 120 + si * 75}ms` }}>
                        <Star size={17} fill="var(--red)" color="var(--red)" style={{ filter: 'drop-shadow(0 0 4px rgba(225, 37, 27, 0.5))' }} />
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      backgroundColor: 'rgba(225, 37, 27, 0.08)',
                      border: '1px solid rgba(225, 37, 27, 0.25)',
                      padding: '0.25rem 0.65rem',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      color: 'var(--red)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <ShieldCheck size={12} color="var(--red)" />
                    <span>{r.type}</span>
                  </div>
                </div>

                {/* Review Text */}
                <p
                  style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '1rem',
                    lineHeight: 1.65,
                    color: 'var(--ink-950)',
                    margin: 0,
                  }}
                >
                  "{r.review}"
                </p>
              </div>

              {/* Card Footer: Author Profile & Vehicle Tag */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  paddingTop: '1.35rem',
                  borderTop: '1px solid rgba(35, 35, 38, 0.1)',
                  marginTop: 'auto',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        backgroundColor: 'var(--ink-950)',
                        border: '1.5px solid var(--red)',
                        color: '#ffffff',
                        fontFamily: 'var(--font-barlow-condensed), sans-serif',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {r.avatarInitials}
                    </div>

                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-barlow-condensed), sans-serif',
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          margin: '0 0 0.1rem 0',
                          lineHeight: 1.05,
                          color: 'var(--ink-950)',
                        }}
                      >
                        {r.author}
                      </h3>
                      <span
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-manrope), sans-serif',
                          fontSize: '0.74rem',
                          color: 'rgba(22, 22, 23, 0.65)',
                        }}
                      >
                        {r.role} · {r.location}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.62rem',
                      color: 'var(--ink-950)',
                      backgroundColor: 'rgba(35, 35, 38, 0.05)',
                      border: '1px solid rgba(35, 35, 38, 0.12)',
                      padding: '0.3rem 0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                      fontWeight: 600,
                    }}
                  >
                    {r.vehicle}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Mobile Slideshow (Narrow Screens Only) ────────────────────────── */}
        <div className="block md:hidden" style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: '0 auto' }}>
          <article
            key={`mobile-review-slide-${rev.id}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'clamp(1.75rem, 5vw, 2.5rem)',
              backgroundColor: '#ffffff',
              border: '1.5px solid rgba(35, 35, 38, 0.12)',
              borderTop: '3.5px solid var(--red)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 36px -8px rgba(35, 35, 38, 0.08)',
              opacity: animating ? 0.12 : 1,
              transform: animating
                ? slideDir === 'next'
                  ? 'translateX(24px) scale(0.98)'
                  : 'translateX(-24px) scale(0.98)'
                : 'translateX(0) scale(1)',
              transition: reducedMotion
                ? 'none'
                : 'opacity 0.35s ease, transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Background Quotation Watermark */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '1.25rem',
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: '8rem',
                lineHeight: 0.8,
                fontWeight: 800,
                color: 'rgba(22, 22, 23, 0.04)',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              “
            </div>

            {/* Card Header: 5 Stars + Verified Badge + Date */}
            <div style={{ position: 'relative', zIndex: 1, marginBottom: '1.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                {/* 5 Stars with Pulsing Glow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <span
                      key={i}
                      className="animated-star"
                      style={{
                        animationDelay: `${i * 85}ms`,
                        display: 'inline-flex',
                      }}
                    >
                      <Star
                        size={19}
                        fill="var(--red)"
                        color="var(--red)"
                        style={{
                          filter: 'drop-shadow(0 0 5px rgba(225, 37, 27, 0.5))',
                        }}
                      />
                    </span>
                  ))}
                </div>

                {/* Verified Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(225, 37, 27, 0.08)',
                    border: '1px solid rgba(225, 37, 27, 0.25)',
                    padding: '0.28rem 0.65rem',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: 'var(--red)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  <ShieldCheck size={12} color="var(--red)" />
                  <span>{rev.type}</span>
                </div>
              </div>

              {/* Review Testimonial Quote */}
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
                  lineHeight: 1.68,
                  color: 'var(--ink-950)',
                  fontWeight: 400,
                  fontStyle: 'normal',
                }}
              >
                "{rev.review}"
              </blockquote>
            </div>

            {/* Card Footer: Author Profile & Purchased Vehicle Chip */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(35, 35, 38, 0.1)',
                marginTop: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  {/* Initials Avatar */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: 'var(--ink-950)',
                      border: '1.5px solid var(--red)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-barlow-condensed), sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {rev.avatarInitials}
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-barlow-condensed), sans-serif',
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        margin: '0 0 0.1rem 0',
                        lineHeight: 1.05,
                        color: 'var(--ink-950)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {rev.author}
                    </h3>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-manrope), sans-serif',
                        fontSize: '0.76rem',
                        color: 'rgba(22, 22, 23, 0.65)',
                      }}
                    >
                      {rev.role} · {rev.location}
                    </span>
                  </div>
                </div>

                {/* Vehicle Tag Pill */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.68rem',
                    color: 'var(--ink-950)',
                    backgroundColor: 'rgba(35, 35, 38, 0.05)',
                    border: '1px solid rgba(35, 35, 38, 0.12)',
                    padding: '0.35rem 0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color: 'var(--red)' }}>■</span>
                  <span>{rev.vehicle}</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* ── Bottom Controls: Mobile Nav & Slide Dots (Mobile Only) ────────── */}
        <div
          className="flex md:hidden"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          {/* Mobile Prev Button */}
          <button
            type="button"
            onClick={handleManualPrev}
            aria-label="Previous review"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(35, 35, 38, 0.2)',
              color: 'var(--ink-950)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleManualGoTo(i)}
                aria-label={`Go to review ${i + 1}`}
                style={{
                  width: i === activeIndex ? 26 : 8,
                  height: 8,
                  borderRadius: i === activeIndex ? '4px' : '50%',
                  backgroundColor: i === activeIndex ? 'var(--red)' : 'rgba(35, 35, 38, 0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: reducedMotion ? 'none' : 'width 0.25s ease, background-color 0.25s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Mobile Next Button */}
          <button
            type="button"
            onClick={handleManualNext}
            aria-label="Next review"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(35, 35, 38, 0.2)',
              color: 'var(--ink-950)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Reviews;
