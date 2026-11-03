/**
 * components/sections/BrandCell.tsx
 * ─────────────────────────────────
 * Hairline-grid logo cell for the Brands section.
 * - Default: ink-950 monochrome vector SVG mark + uppercase micro-label on --bone.
 * - Hover / Focus: bold red fill sweeps in from the left, mark & text turn --bone,
 *   ArrowUpRight indicator glides in top-right.
 * - Sharp corners, zero card rounding, 1px hairline rules.
 * - Real <a> link, fully accessible with screen reader label and visible focus ring.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { BrandItem } from '@/content/brands';
import { BrandMark } from '@/components/icons/BrandMarks';

interface BrandCellProps {
  brand: BrandItem;
}

export function BrandCell({ brand }: BrandCellProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={brand.href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={`Browse ${brand.name} listings in Bangladesh`}
      className="group outline-none"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 3.5vw, 3rem) 1rem',
        textDecoration: 'none',
        overflow: 'hidden',
        borderRight: '1px solid rgba(35, 35, 38, 0.15)',
        borderBottom: '1px solid rgba(35, 35, 38, 0.15)',
        backgroundColor: 'var(--bone)',
        transition: 'color 0.25s ease',
        minHeight: '150px',
        cursor: 'pointer',
      }}
    >
      {/* Red hover sweep from left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--red)',
          transform: isHovered ? 'translateX(0%)' : 'translateX(-101%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 1,
        }}
      />

      {/* Content Block */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.9rem',
          color: isHovered ? 'var(--bone)' : 'var(--ink-950)',
          transition: 'color 0.25s ease, transform 0.25s ease',
          transform: isHovered ? 'scale(1.04)' : 'scale(1)',
        }}
      >
        {/* Monochrome SVG Brand Mark */}
        <div
          style={{
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'inherit',
          }}
        >
          <BrandMark id={brand.id} size={46} />
        </div>

        {/* Small uppercase micro-label */}
        <span
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'inherit',
            opacity: isHovered ? 1 : 0.85,
            transition: 'opacity 0.2s ease',
            lineHeight: 1,
          }}
        >
          {brand.name}
        </span>
      </div>

      {/* Hover ArrowUpRight indicator in top-right corner */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          zIndex: 2,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translate(0, 0)' : 'translate(-4px, 4px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          color: 'var(--bone)',
        }}
      >
        <ArrowUpRight size={15} />
      </div>
    </Link>
  );
}

export default BrandCell;
