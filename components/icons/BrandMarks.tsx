/**
 * components/icons/BrandMarks.tsx
 * ───────────────────────────────
 * Clean monochrome vector SVG emblems for the 12 popular automotive marques in Bangladesh.
 * All marks use `fill="currentColor"` or `stroke="currentColor"` to inherit text color
 * (ink-950 by default on --bone, turning bone on red hover sweep).
 *
 * Source: Pure geometric vector paths based on public domain automotive insignia.
 * Trademark Note: All logos are registered trademarks of their respective owners
 * and are used strictly for brand identification.
 */

import React from 'react';

interface BrandMarkProps {
  id: string;
  className?: string;
  size?: number;
}

export function BrandMark({ id, className, size = 48 }: BrandMarkProps) {
  switch (id) {
    case 'toyota':
      return (
        <svg
          width={size}
          height={size * 0.7}
          viewBox="0 0 100 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
          className={className}
          aria-hidden="true"
        >
          {/* Outer ellipse */}
          <ellipse cx="50" cy="35" rx="46" ry="31" />
          {/* Inner vertical ellipse */}
          <ellipse cx="50" cy="32" rx="16" ry="24" strokeWidth="4.5" />
          {/* Inner horizontal ellipse */}
          <ellipse cx="50" cy="22" rx="33" ry="12" strokeWidth="4.5" />
        </svg>
      );

    case 'honda':
      return (
        <svg
          width={size}
          height={size * 0.8}
          viewBox="0 0 100 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className={className}
          aria-hidden="true"
        >
          {/* Outer rounded trapezoid */}
          <path
            d="M 12 12 L 88 12 C 94 12 96 16 94 24 L 84 70 C 82 76 76 78 70 78 L 30 78 C 24 78 18 76 16 70 L 6 24 C 4 16 6 12 12 12 Z"
            strokeWidth="4.5"
          />
          {/* Stylized 'H' */}
          <path
            d="M 28 20 L 34 68 M 72 20 L 66 68 M 31 44 L 69 44"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'nissan':
      return (
        <svg
          width={size}
          height={size * 0.85}
          viewBox="0 0 100 85"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
          className={className}
          aria-hidden="true"
        >
          {/* Outer circle split by horizontal bar */}
          <path d="M 16 34 A 40 40 0 1 1 84 34" strokeWidth="5" />
          <path d="M 84 51 A 40 40 0 1 1 16 51" strokeWidth="5" />
          {/* Center horizontal bar with brand typographic impression */}
          <rect x="6" y="34" width="88" height="17" rx="2" strokeWidth="4" />
          <text
            x="50"
            y="46.5"
            fill="currentColor"
            stroke="none"
            fontFamily="sans-serif"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="0.22em"
            textAnchor="middle"
          >
            NISSAN
          </text>
        </svg>
      );

    case 'mitsubishi':
      return (
        <svg
          width={size}
          height={size * 0.85}
          viewBox="0 0 100 85"
          fill="currentColor"
          className={className}
          aria-hidden="true"
        >
          {/* Top rhombus */}
          <polygon points="50,6 64,30 50,54 36,30" />
          {/* Bottom left rhombus */}
          <polygon points="36,30 50,54 28,66 14,42" />
          {/* Bottom right rhombus */}
          <polygon points="64,30 86,42 72,66 50,54" />
        </svg>
      );

    case 'suzuki':
      return (
        <svg
          width={size * 0.85}
          height={size * 0.85}
          viewBox="0 0 100 100"
          fill="currentColor"
          className={className}
          aria-hidden="true"
        >
          {/* Iconic faceted Suzuki 'S' */}
          <polygon points="86,8 32,8 14,24 58,24 24,56 14,56 14,72 68,92 86,76 42,76 76,44 86,44" />
        </svg>
      );

    case 'hyundai':
      return (
        <svg
          width={size}
          height={size * 0.7}
          viewBox="0 0 100 70"
          fill="none"
          stroke="currentColor"
          className={className}
          aria-hidden="true"
        >
          {/* Tilted outer oval */}
          <ellipse
            cx="50"
            cy="35"
            rx="45"
            ry="29"
            strokeWidth="4.5"
            transform="rotate(-8 50 35)"
          />
          {/* Slanted stylized H */}
          <path
            d="M 33 22 C 34 32 37 42 39 48 M 67 22 C 65 32 62 42 60 48 M 35 34 C 44 32 54 35 64 36"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'kia':
      return (
        <svg
          width={size * 1.1}
          height={size * 0.6}
          viewBox="0 0 110 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Modern continuous KIA strokes */}
          <path d="M 12 48 L 12 12 M 12 30 L 32 12 M 22 21 L 34 48" />
          <path d="M 44 48 L 44 12" />
          <path d="M 64 48 L 78 12 L 98 48 M 68 34 L 92 34" />
        </svg>
      );

    case 'mazda':
      return (
        <svg
          width={size}
          height={size * 0.75}
          viewBox="0 0 100 75"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
          className={className}
          aria-hidden="true"
        >
          {/* Outer oval */}
          <ellipse cx="50" cy="37.5" rx="46" ry="32" strokeWidth="4.5" />
          {/* Soaring M / bird wings */}
          <path
            d="M 22 28 C 34 44 44 49 50 36 C 56 49 66 44 78 28"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'subaru':
      return (
        <svg
          width={size}
          height={size * 0.7}
          viewBox="0 0 100 70"
          fill="currentColor"
          stroke="currentColor"
          className={className}
          aria-hidden="true"
        >
          {/* Outer ring */}
          <ellipse cx="50" cy="35" rx="46" ry="30" fill="none" strokeWidth="4.5" />
          {/* Primary large 4-point star */}
          <polygon points="34,22 36,30 44,32 36,34 34,42 32,34 24,32 32,30" />
          {/* 5 secondary stars */}
          <polygon points="56,22 57,26 61,27 57,28 56,32 55,28 51,27 55,26" />
          <polygon points="68,28 69,32 73,33 69,34 68,38 67,34 63,33 67,32" />
          <polygon points="54,36 55,40 59,41 55,42 54,46 53,42 49,41 53,40" />
          <polygon points="66,42 67,46 71,47 67,48 66,52 65,48 61,47 65,46" />
          <polygon points="78,40 79,43 82,44 79,45 78,48 77,45 74,44 77,43" />
        </svg>
      );

    case 'lexus':
      return (
        <svg
          width={size}
          height={size * 0.75}
          viewBox="0 0 100 75"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
          className={className}
          aria-hidden="true"
        >
          {/* Outer oval */}
          <ellipse cx="50" cy="37.5" rx="46" ry="32" strokeWidth="4.5" />
          {/* Stylized L inside */}
          <path
            d="M 68 18 L 36 54 L 66 54"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'bmw':
      return (
        <svg
          width={size * 0.9}
          height={size * 0.9}
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className={className}
          aria-hidden="true"
        >
          {/* Outer concentric rings */}
          <circle cx="50" cy="50" r="46" strokeWidth="4" />
          <circle cx="50" cy="50" r="30" strokeWidth="3" />
          {/* Inner quadrants (top-left & bottom-right filled) */}
          <path d="M 50 20 A 30 30 0 0 0 20 50 L 50 50 Z" fill="currentColor" stroke="none" />
          <path d="M 50 80 A 30 30 0 0 0 80 50 L 50 50 Z" fill="currentColor" stroke="none" />
          {/* Inner dividing cross */}
          <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="2.5" />
          <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );

    case 'mercedes-benz':
      return (
        <svg
          width={size * 0.9}
          height={size * 0.9}
          viewBox="0 0 100 100"
          fill="currentColor"
          stroke="currentColor"
          className={className}
          aria-hidden="true"
        >
          {/* Outer ring */}
          <circle cx="50" cy="50" r="46" fill="none" strokeWidth="4.5" />
          {/* Three pointed star radiating from center (0, 120, 240 deg) */}
          {/* North arm */}
          <polygon points="50,8 46,50 50,47 54,50" />
          {/* South-East arm (120 deg: cos(30)=0.866, sin(30)=0.5 -> 50+42*0.866=86.4, 50+42*0.5=71) */}
          <polygon points="86,71 49,46 51,49 46,53" />
          {/* South-West arm (240 deg: 50-42*0.866=13.6, 50+42*0.5=71) */}
          <polygon points="14,71 54,53 49,49 51,46" />
        </svg>
      );

    default:
      return null;
  }
}

export default BrandMark;
