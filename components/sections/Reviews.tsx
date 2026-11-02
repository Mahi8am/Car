/**
 * components/sections/Reviews.tsx
 * ───────────────────────────────
 * Verified Client Reviews & Testimonials section.
 * Redesigned with animated 5-star ratings, Bencho 3D tilt micro-interactions,
 * and editorial glassmorphic card styling.
 */

'use client';

import { Star, ShieldCheck, Quote } from 'lucide-react';
import { reviews } from '@/content/reviews';
import { useInView } from '@/lib/hooks/useInView';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function Reviews() {
  const { ref: headerRef, isInView: headerInView } = useInView<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      style={{
        position: 'relative',
        backgroundColor: 'var(--charcoal)',
        color: '#ffffff',
        padding: '7rem 0 6.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Red accent stripe at top */}
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

      {/* Subtle ambient glow in background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-10vw',
          right: '-10vw',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          backgroundColor: 'rgba(225, 37, 27, 0.035)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 3.5rem)', position: 'relative', zIndex: 1 }}>
        {/* Section Header with Masked Line Reveal */}
        <div ref={headerRef} style={{ marginBottom: '3.5rem', maxWidth: '720px' }}>
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
                fontSize: '0.78rem',
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

          {/* Masked Line Heading Reveal */}
          <div style={{ overflow: 'hidden', paddingBottom: '0.2rem', marginBottom: '0.85rem' }}>
            <h2
              id="reviews-heading"
              style={{
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: 'clamp(2.75rem, 5.5vw, 5.25rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: '#ffffff',
                lineHeight: 0.92,
                margin: 0,
                transform: headerInView || reducedMotion ? 'translateY(0%)' : 'translateY(105%)',
                transition: reducedMotion ? 'none' : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              TRUSTED BY DRIVERS
            </h2>
          </div>

          {/* Supporting line */}
          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              maxWidth: '54ch',
              margin: 0,
              opacity: headerInView || reducedMotion ? 0.9 : 0,
              transform: headerInView || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
              transition: reducedMotion ? 'none' : 'opacity 0.7s ease-out 0.2s, transform 0.7s ease-out 0.2s',
            }}
          >
            Real stories from verified buyers and sellers across Dhaka, Chittagong, Sylhet, and beyond.
          </p>
        </div>

        {/* 3 Redesigned Review Cards with 3D Tilt & Animated Stars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {reviews.map((rev, cardIdx) => (
            <article
              key={rev.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2.25rem 2rem 2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.045)',
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                borderTop: '3px solid var(--red)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.25s ease-out, box-shadow 0.25s ease, border-color 0.25s ease',
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                boxShadow: '0 8px 30px -10px rgba(0,0,0,0.5)',
              }}
              /* Bencho.dev 3D Tilt Physics on Hover */
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
                e.currentTarget.style.boxShadow = '0 20px 48px -12px rgba(0,0,0,0.7)';
                e.currentTarget.style.borderColor = 'rgba(225,37,27,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px -10px rgba(0,0,0,0.5)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              {/* Background Quotation Watermark */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.5rem',
                  fontFamily: 'var(--font-barlow-condensed), sans-serif',
                  fontSize: '7rem',
                  lineHeight: 0.8,
                  fontWeight: 800,
                  color: 'rgba(255, 255, 255, 0.04)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                “
              </div>

              {/* Card Header: Animated 5 Stars + Verification Badge */}
              <div style={{ position: 'relative', zIndex: 1, marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  {/* Animated 5 Stars with Staggered Entrance & Pulsing Glow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <span
                        key={i}
                        className="animated-star"
                        style={{
                          animationDelay: `${cardIdx * 120 + i * 85}ms`,
                          display: 'inline-flex',
                        }}
                      >
                        <Star
                          size={18}
                          fill="var(--red)"
                          color="var(--red)"
                          style={{
                            filter: 'drop-shadow(0 0 6px rgba(225, 37, 27, 0.6))',
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
                      backgroundColor: 'rgba(7, 7, 7, 0.6)',
                      border: '1px solid rgba(225, 37, 27, 0.35)',
                      padding: '0.25rem 0.65rem',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.62rem',
                      fontWeight: 600,
                      color: 'var(--red)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <ShieldCheck size={12} color="var(--red)" />
                    <span>{rev.type}</span>
                  </div>
                </div>

                {/* Review Quote Body */}
                <p
                  style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '1.02rem',
                    lineHeight: 1.68,
                    color: 'rgba(255, 255, 255, 0.92)',
                    margin: 0,
                    fontStyle: 'normal',
                  }}
                >
                  "{rev.review}"
                </p>
              </div>

              {/* Card Footer: Author Profile & Purchased Vehicle Chip */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  paddingTop: '1.35rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  marginTop: 'auto',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    {/* Initials Avatar with Red Border Ring */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
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
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      }}
                    >
                      {rev.avatarInitials}
                    </div>

                    <div>
                      <h4
                        style={{
                          fontFamily: 'var(--font-barlow-condensed), sans-serif',
                          fontSize: '1.35rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          margin: '0 0 0.1rem 0',
                          lineHeight: 1.05,
                          color: '#ffffff',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {rev.author}
                      </h4>
                      <span
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-manrope), sans-serif',
                          fontSize: '0.74rem',
                          color: 'rgba(255, 255, 255, 0.55)',
                        }}
                      >
                        {rev.role} · {rev.location}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Tag Pill */}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.62rem',
                      color: 'rgba(255, 255, 255, 0.65)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '0.3rem 0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {rev.vehicle}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reviews;
