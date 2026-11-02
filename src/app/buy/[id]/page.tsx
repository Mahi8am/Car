/**
 * src/app/buy/[id]/page.tsx
 * ─────────────────────────
 * Garir Mela — Comprehensive Vehicle Display Page
 * Dedicated product detail view with photo gallery, 160-point inspection,
 * complete specs, seller contact, EMI calculator, and related listings.
 */

'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Calendar,
  Gauge,
  Fuel,
  MapPin,
  ShieldCheck,
  Phone,
  MessageSquare,
  Award,
  CheckCircle2,
  Share2,
  Heart,
  Calculator,
  AlertTriangle,
  ArrowUpRight,
  Car,
  FileCheck,
} from 'lucide-react';
import { marketplaceListings, type CarListing } from '@/content/listings';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/sections/Footer';

function CarDisplayContent() {
  const params = useParams();
  const rawId = params?.id as string;

  // Match by id (e.g. car-01, car-13) or slug
  const car: CarListing | undefined = useMemo(() => {
    if (!rawId) return marketplaceListings[0];
    return (
      marketplaceListings.find((c) => c.id.toLowerCase() === rawId.toLowerCase()) ||
      marketplaceListings.find((c) => c.name.toLowerCase().replace(/\s+/g, '-').includes(rawId.toLowerCase())) ||
      marketplaceListings[0]
    );
  }, [rawId]);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // EMI Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const interestRateAnnual = 9.5; // typical auto loan rate in BD

  // Modals
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState(car ? String(car.priceLakh) : '50');
  const [formSubmittedMsg, setFormSubmittedMsg] = useState<string | null>(null);

  // Simulated photo gallery (main image + alternate angles)
  const photos = useMemo(() => {
    if (!car) return [];
    return [
      car.image,
      '/images/cars/hero-car-editorial.jpg',
      '/images/services/service-buy.webp',
      '/images/cars/mitsubishi-pajero.jpg',
    ];
  }, [car]);

  // Monthly EMI Calculation
  const emiCalculation = useMemo(() => {
    if (!car) return { downPaymentBDT: 0, loanAmountBDT: 0, monthlyEMI: 0 };
    const totalBDT = car.priceLakh * 100000;
    const downPaymentBDT = (totalBDT * downPaymentPercent) / 100;
    const loanAmountBDT = totalBDT - downPaymentBDT;
    const monthlyRate = interestRateAnnual / (12 * 100);
    const months = loanTenureYears * 12;
    const emi =
      (loanAmountBDT * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return {
      downPaymentBDT: Math.round(downPaymentBDT),
      loanAmountBDT: Math.round(loanAmountBDT),
      monthlyEMI: Math.round(emi),
    };
  }, [car, downPaymentPercent, loanTenureYears]);

  // Related cars from same brand or similar price
  const relatedCars = useMemo(() => {
    if (!car) return [];
    return marketplaceListings
      .filter((c) => c.id !== car.id)
      .filter((c) => c.brand === car.brand || Math.abs(c.priceLakh - car.priceLakh) < 30)
      .slice(0, 3);
  }, [car]);

  if (!car) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bone)', color: 'var(--ink-950)' }}>
        <Navbar />
        <div style={{ paddingTop: '8rem', textAlign: 'center', paddingBottom: '5rem' }}>
          <h2>Vehicle Not Found</h2>
          <Link href="/buy" style={{ color: 'var(--red)', fontWeight: 700 }}>
            ← Return to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleTestDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmittedMsg('Test drive request sent to seller! They will call you within 15 minutes.');
    setTimeout(() => {
      setTestDriveModalOpen(false);
      setFormSubmittedMsg(null);
    }, 2800);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmittedMsg(`Offer of ৳ ${offerAmount} Lakh submitted to seller!`);
    setTimeout(() => {
      setOfferModalOpen(false);
      setFormSubmittedMsg(null);
    }, 2800);
  };

  return (
    <main id="car-display-root" style={{ minHeight: '100vh', backgroundColor: 'var(--bone)', color: 'var(--ink-950)' }}>
      <Navbar />

      {/* ── Breadcrumb Bar (Below 72px Navbar) ───────────────────────────────── */}
      <div
        style={{
          paddingTop: '5rem',
          backgroundColor: 'var(--ink-950)',
          color: '#ffffff',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '1.25rem clamp(1.5rem, 4vw, 3rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
              }}
              className="hover:text-white"
            >
              Home
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>/</span>
            <Link
              href="/buy"
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
              }}
              className="hover:text-white"
            >
              Marketplace
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>/</span>
            <Link
              href={`/buy?brand=${car.brand}`}
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.78rem',
                color: 'var(--red)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {car.brand}
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>/</span>
            <span
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.78rem',
                color: '#ffffff',
                fontWeight: 600,
                maxWidth: '280px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {car.model}
            </span>
          </nav>

          {/* Quick Share & Save */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.18)',
                padding: '0.45rem 0.9rem',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Share2 size={13} />
              <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: isSaved ? 'var(--red)' : 'rgba(255,255,255,0.08)',
                color: '#ffffff',
                border: isSaved ? '1px solid var(--red)' : '1px solid rgba(255,255,255,0.18)',
                padding: '0.45rem 0.9rem',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              <Heart size={13} fill={isSaved ? '#ffffff' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Vehicle Hero Header ─────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: 'var(--ink-950)',
          color: '#ffffff',
          paddingBottom: '3.5rem',
          borderBottom: '2px solid var(--red)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '2rem clamp(1.5rem, 4vw, 3rem) 0',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              {/* Badges row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: 'var(--red)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '0.3rem 0.75rem',
                  }}
                >
                  {car.condition}
                </span>

                {car.auctionGrade && (
                  <span
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      padding: '0.3rem 0.75rem',
                      border: '1px solid rgba(255,255,255,0.25)',
                    }}
                  >
                    AUCTION GRADE {car.auctionGrade}
                  </span>
                )}

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#4ade80',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    padding: '0.3rem 0.75rem',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                  }}
                >
                  <ShieldCheck size={12} />
                  <span>160-POINT INSPECTED</span>
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: 'var(--font-barlow-condensed), sans-serif',
                  fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  lineHeight: 0.95,
                  margin: '0 0 0.85rem 0',
                }}
              >
                {car.name}
              </h1>

              {/* Location & Seller info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} color="var(--red)" />
                  {car.location} ({car.district})
                </span>
                <span>•</span>
                <span>Listed by <strong>{car.sellerName}</strong> ({car.sellerType})</span>
              </div>
            </div>

            {/* Price Box */}
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderLeft: '4px solid var(--red)',
                padding: '1.25rem 2rem',
                minWidth: '240px',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.68rem',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                }}
              >
                ASKING PRICE (BDT)
              </span>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-barlow-condensed), sans-serif',
                  fontSize: 'clamp(2.25rem, 3.5vw, 3rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1,
                  marginBottom: '0.35rem',
                }}
              >
                {car.priceFormatted}
              </span>
              <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', color: 'var(--red)', fontWeight: 600 }}>
                NEGOTIABLE · DIRECT OWNER TRANSFER
              </span>
            </div>
          </div>

          {/* ── Photo Gallery Showcase ─────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {/* Main Stage Image */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '16/9',
                maxHeight: '560px',
                backgroundColor: '#111112',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <img
                src={photos[activePhotoIdx]}
                alt={`${car.name} view ${activePhotoIdx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'opacity 0.3s ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  backgroundColor: 'rgba(7,7,7,0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.72rem',
                  padding: '0.35rem 0.85rem',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                Photo {activePhotoIdx + 1} of {photos.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {photos.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  style={{
                    position: 'relative',
                    width: '120px',
                    height: '75px',
                    flexShrink: 0,
                    border: idx === activePhotoIdx ? '2px solid var(--red)' : '1px solid rgba(255,255,255,0.2)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    padding: 0,
                    opacity: idx === activePhotoIdx ? 1 : 0.65,
                    transition: 'opacity 0.2s, border-color 0.2s',
                  }}
                >
                  <img src={src} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Spec Ribbon ──────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(35, 35, 38, 0.14)',
          boxShadow: '0 4px 20px -5px rgba(7,7,7,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '1.5rem clamp(1.5rem, 4vw, 3rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { label: 'MODEL YEAR', val: `${car.year}`, Icon: Calendar },
            { label: 'ODOMETER', val: car.mileageFormatted, Icon: Gauge },
            { label: 'ENGINE DISPLACEMENT', val: car.engine, Icon: Fuel },
            { label: 'TRANSMISSION', val: car.transmission, Icon: Car },
            { label: 'BODY STYLE', val: car.bodyType, Icon: Award },
            { label: 'LOCATION', val: car.district, Icon: MapPin },
          ].map(({ label, val, Icon }) => (
            <div key={label} style={{ borderLeft: '2px solid var(--red)', paddingLeft: '0.85rem' }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.62rem',
                  color: 'var(--charcoal)',
                  opacity: 0.65,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.2rem',
                }}
              >
                <Icon size={11} color="var(--red)" />
                {label}
              </span>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-barlow-condensed), sans-serif',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: 'var(--ink-950)',
                  lineHeight: 1.1,
                }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Two-Column Content ──────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '3.5rem clamp(1.5rem, 4vw, 3rem) 5rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* ── Left Column (Specs, Inspection, Details) ──────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* 160-Point Inspection Report Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid rgba(35, 35, 38, 0.12)',
                borderTop: '3px solid #22c55e',
                padding: '2rem 2.25rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: 'rgba(34, 197, 94, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#22c55e',
                    }}
                  >
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-barlow-condensed), sans-serif',
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        margin: 0,
                        color: 'var(--ink-950)',
                      }}
                    >
                      160-POINT CERTIFIED INSPECTION
                    </h2>
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', color: '#16a34a', fontWeight: 600 }}>
                      OVERALL SCORE: 98/100 · PASSED WITH ZERO MECHANICAL FAULTS
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    backgroundColor: '#f0fdf4',
                    color: '#15803d',
                    border: '1px solid #bbf7d0',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.4rem 0.85rem',
                  }}
                >
                  AUDIT ID: GM-2026-{car.id.toUpperCase()}
                </span>
              </div>

              {/* Inspection Scores Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.75rem',
                }}
              >
                {[
                  { section: 'Engine & Turbocharger', score: '99%', notes: 'Smooth idle, zero oil leaks, authentic compression' },
                  { section: 'Transmission & Gearbox', score: '98%', notes: 'No slippage, smooth shift points verified' },
                  { section: 'Chassis & Frame', score: '100%', notes: 'Original factory welds, zero accident damage' },
                  { section: 'Brakes & Suspension', score: '96%', notes: 'Brake pads 85% life remaining, shocks tested' },
                  { section: 'Electrical & AC System', score: '99%', notes: 'Chilling AC, all electronic sensors verified' },
                  { section: 'Document Legitimacy', score: '100%', notes: 'BRTA smart card & tax tokens authenticated' },
                ].map(({ section, score, notes }) => (
                  <div
                    key={section}
                    style={{
                      padding: '1rem',
                      backgroundColor: 'rgba(237, 231, 220, 0.45)',
                      border: '1px solid rgba(35, 35, 38, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.82rem', fontWeight: 700 }}>
                        {section}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.78rem', color: '#16a34a', fontWeight: 700 }}>
                        {score}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.72rem', color: 'var(--charcoal)', opacity: 0.75 }}>
                      {notes}
                    </p>
                  </div>
                ))}
              </div>

              {/* Documentation guarantee */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.15rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <FileCheck size={18} color="var(--red)" />
                <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.78rem', color: 'var(--charcoal)' }}>
                  <strong>Verified Papers:</strong> BRTA Registration Smart Card, Fitness Token & Tax Token are valid and cleared for instant transfer.
                </span>
              </div>
            </div>

            {/* Detailed Vehicle Specifications Table */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid rgba(35, 35, 38, 0.12)',
                padding: '2rem 2.25rem',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-barlow-condensed), sans-serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  margin: '0 0 1.5rem 0',
                  color: 'var(--ink-950)',
                  borderBottom: '1.5px solid rgba(35, 35, 38, 0.1)',
                  paddingBottom: '0.75rem',
                }}
              >
                DETAILED SPECIFICATIONS
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '0.85rem',
                }}
              >
                {[
                  { label: 'Make & Model', val: `${car.brand} ${car.model}` },
                  { label: 'Manufacturing Year', val: `${car.year}` },
                  { label: 'Odometer Mileage', val: car.mileageFormatted },
                  { label: 'Engine Capacity', val: car.engine },
                  { label: 'Fuel Type', val: car.fuelType },
                  { label: 'Transmission', val: car.transmission },
                  { label: 'Vehicle Type / Body', val: car.bodyType },
                  { label: 'Import Condition', val: car.condition },
                  { label: 'Auction Grade', val: car.auctionGrade ? `Grade ${car.auctionGrade}` : 'Local Used' },
                  { label: 'Registration Division', val: `${car.district} Metro` },
                  { label: 'Seating Capacity', val: car.bodyType === 'SUV' ? '5 - 7 Persons' : '5 Persons' },
                  { label: 'Color & Paint', val: 'Showroom Original Factory Finish' },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.5rem',
                      borderBottom: '1px solid rgba(35,35,38,0.07)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.74rem', color: 'var(--charcoal)', opacity: 0.7 }}>
                      {label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-950)' }}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard Equipment & Factory Options */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid rgba(35, 35, 38, 0.12)',
                padding: '2rem 2.25rem',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-barlow-condensed), sans-serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  margin: '0 0 1.25rem 0',
                  color: 'var(--ink-950)',
                }}
              >
                FEATURED HIGHLIGHTS
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                {[
                  'Push Start & Keyless Entry',
                  'Dual-Zone Automatic Climate Control',
                  'Apple CarPlay & Android Auto',
                  '360-Degree Panoramic Camera',
                  'Adaptive Cruise Control',
                  'Lane Keep Assist & Pre-Crash Safety',
                  'LED Projector Headlamps with DRL',
                  'Leather Power Adjustable Seats',
                  'Alloy Wheels & All-Season Tires',
                  'Electronic Parking Brake with Auto-Hold',
                ].map((feat) => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={15} color="var(--red)" style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.78rem', color: 'var(--ink-950)', fontWeight: 600 }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive EMI Loan Calculator */}
            <div
              style={{
                backgroundColor: 'var(--charcoal)',
                color: '#ffffff',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                padding: '2rem 2.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Calculator size={22} color="var(--red)" />
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-barlow-condensed), sans-serif',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    ESTIMATED AUTO LOAN EMI CALCULATOR
                  </h2>
                  <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
                    Standard bank auto loan financing in Bangladesh @ {interestRateAnnual}% interest
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
                {/* Down Payment Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>
                      DOWN PAYMENT: {downPaymentPercent}%
                    </span>
                    <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.78rem', fontWeight: 700, color: 'var(--red)' }}>
                      ৳ {emiCalculation.downPaymentBDT.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--red)', cursor: 'pointer' }}
                  />
                </div>

                {/* Tenure Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>
                      LOAN TENURE
                    </span>
                    <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                      {loanTenureYears} Years ({loanTenureYears * 12} Months)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--red)', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Monthly EMI Result banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.75rem',
                  backgroundColor: 'rgba(7,7,7,0.75)',
                  border: '1.5px solid var(--red)',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <span style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>
                    ESTIMATED MONTHLY INSTALLMENT
                  </span>
                  <span style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '2.5rem', fontWeight: 700, color: '#ffffff' }}>
                    ৳ {emiCalculation.monthlyEMI.toLocaleString()} <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>/ month</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setOfferModalOpen(true)}
                  className="bencho-sweep-button"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--red)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  APPLY FOR FINANCING
                </button>
              </div>
            </div>
          </div>

          {/* ── Right Column (Sticky Seller Contact Card & Safety Guide) ───────── */}
          <div style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Direct Contact Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid rgba(35, 35, 38, 0.15)',
                borderTop: '4px solid var(--red)',
                padding: '2rem 1.75rem',
                boxShadow: '0 8px 30px rgba(7,7,7,0.08)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.68rem',
                  color: 'var(--red)',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem',
                }}
              >
                DIRECT SELLER INFORMATION
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-barlow-condensed), sans-serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ink-950)',
                  margin: '0 0 0.35rem 0',
                }}
              >
                {car.sellerName}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span
                  style={{
                    backgroundColor: car.sellerType === 'Certified Dealer' ? 'var(--ink-950)' : 'var(--bone)',
                    color: car.sellerType === 'Certified Dealer' ? '#ffffff' : 'var(--ink-950)',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    border: '1px solid rgba(35,35,38,0.2)',
                  }}
                >
                  {car.sellerType === 'Certified Dealer' ? '★ VERIFIED DEALER' : 'PRIVATE OWNER'}
                </span>
                <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                  ● Typically replies in 10 mins
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {/* Call Seller */}
                <a
                  href={`tel:${car.sellerPhone.replace(/[\s-]/g, '')}`}
                  className="bencho-sweep-button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.65rem',
                    padding: '0.95rem 1.25rem',
                    backgroundColor: 'var(--red)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    boxShadow: '0 4px 18px rgba(225,37,27,0.3)',
                    cursor: 'pointer',
                  }}
                >
                  <Phone size={16} />
                  <span>CALL {car.sellerPhone}</span>
                </a>

                {/* WhatsApp Chat */}
                <a
                  href={`https://wa.me/${car.sellerPhone.replace(/[^0-9]/g, '')}?text=Hello%2C+I+am+interested+in+the+${encodeURIComponent(car.name)}+listed+on+Garir+Mela.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bencho-sweep-button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.65rem',
                    padding: '0.85rem 1.25rem',
                    backgroundColor: '#1f2937',
                    color: '#ffffff',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <MessageSquare size={16} color="#4ade80" />
                  <span>CHAT ON WHATSAPP</span>
                </a>

                {/* Schedule Test Drive Button */}
                <button
                  type="button"
                  onClick={() => setTestDriveModalOpen(true)}
                  style={{
                    padding: '0.8rem 1.25rem',
                    backgroundColor: 'transparent',
                    border: '1.5px solid var(--ink-950)',
                    color: 'var(--ink-950)',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  SCHEDULE TEST DRIVE
                </button>

                {/* Make Offer Button */}
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(true)}
                  style={{
                    padding: '0.8rem 1.25rem',
                    backgroundColor: 'transparent',
                    border: '1.5px solid rgba(35,35,38,0.25)',
                    color: 'var(--charcoal)',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  MAKE AN OFFER
                </button>
              </div>

              {/* Showroom location address */}
              <div style={{ borderTop: '1px solid rgba(35,35,38,0.1)', paddingTop: '1rem' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.65rem', color: 'var(--charcoal)', opacity: 0.65, marginBottom: '0.2rem' }}>
                  SHOWROOM / INSPECTION ADDRESS
                </span>
                <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-950)' }}>
                  {car.location}, Bangladesh
                </span>
              </div>
            </div>

            {/* Buyer Safety Notice Card */}
            <div
              style={{
                backgroundColor: 'rgba(237, 231, 220, 0.7)',
                border: '1px solid rgba(35, 35, 38, 0.15)',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <AlertTriangle size={16} color="var(--red)" />
                <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  BUYER PROTECTION TIPS
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.75rem', color: 'var(--charcoal)', lineHeight: 1.6 }}>
                <li>Inspect vehicle in person before wiring any deposit.</li>
                <li>Cross-verify chassis number on BRTA Portal.</li>
                <li>Transfer registration directly at BRTA within 30 days.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Similar Vehicles Section ───────────────────────────────────────── */}
        {relatedCars.length > 0 && (
          <section style={{ marginTop: '5.5rem', borderTop: '1.5px solid rgba(35, 35, 38, 0.12)', paddingTop: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.75rem', color: 'var(--red)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  EXPLORE ALTERNATIVES
                </span>
                <h2 style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '2.5rem', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                  SIMILAR VERIFIED VEHICLES
                </h2>
              </div>
              <Link
                href="/buy"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--ink-950)',
                  textDecoration: 'none',
                  borderBottom: '1.5px solid var(--red)',
                  paddingBottom: 2,
                }}
              >
                <span>VIEW ALL IN MARKETPLACE</span>
                <ArrowUpRight size={14} color="var(--red)" />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {relatedCars.map((relCar) => (
                <Link
                  key={relCar.id}
                  href={`/buy/${relCar.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid rgba(35, 35, 38, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  className="hover:-translate-y-1 hover:shadow-lg"
                >
                  <div style={{ aspectRatio: '16/10', overflow: 'hidden', backgroundColor: '#eae6dd' }}>
                    <img src={relCar.image} alt={relCar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1 }}>
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', color: 'var(--red)', fontWeight: 700 }}>
                      {relCar.brand}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '1.45rem', fontWeight: 700, margin: 0 }}>
                      {relCar.name}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(35,35,38,0.08)' }}>
                      <span style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink-950)' }}>
                        {relCar.priceFormatted}
                      </span>
                      <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.72rem', color: 'var(--red)', fontWeight: 700 }}>
                        VIEW DETAILS →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Test Drive Modal ─────────────────────────────────────────────────── */}
      {testDriveModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(7, 7, 7, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setTestDriveModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              maxWidth: '480px',
              width: '100%',
              padding: '2.5rem',
              border: '2px solid var(--ink-950)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              SCHEDULE TEST DRIVE
            </h3>
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.82rem', color: 'var(--charcoal)', marginBottom: '1.5rem' }}>
              Book an appointment to inspect and test drive the <strong>{car.name}</strong> at {car.location}.
            </p>

            {formSubmittedMsg ? (
              <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', color: '#16a34a', fontWeight: 600, fontSize: '0.85rem' }}>
                {formSubmittedMsg}
              </div>
            ) : (
              <form onSubmit={handleTestDriveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', marginBottom: '0.3rem' }}>YOUR FULL NAME</label>
                  <input required type="text" placeholder="e.g. Arif Rahman" style={{ width: '100%', padding: '0.75rem', border: '1px solid rgba(35,35,38,0.25)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', marginBottom: '0.3rem' }}>PHONE NUMBER</label>
                  <input required type="tel" placeholder="+880 1711-XXXXXX" style={{ width: '100%', padding: '0.75rem', border: '1px solid rgba(35,35,38,0.25)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', marginBottom: '0.3rem' }}>PREFERRED DATE</label>
                  <input required type="date" style={{ width: '100%', padding: '0.75rem', border: '1px solid rgba(35,35,38,0.25)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="submit" style={{ flex: 1, padding: '0.85rem', backgroundColor: 'var(--red)', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    CONFIRM BOOKING
                  </button>
                  <button type="button" onClick={() => setTestDriveModalOpen(false)} style={{ padding: '0.85rem 1.25rem', backgroundColor: 'transparent', border: '1px solid #ccc', cursor: 'pointer' }}>
                    CANCEL
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Make an Offer Modal ──────────────────────────────────────────────── */}
      {offerModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(7, 7, 7, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setOfferModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              maxWidth: '480px',
              width: '100%',
              padding: '2.5rem',
              border: '2px solid var(--ink-950)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              MAKE A PRICE OFFER
            </h3>
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.82rem', color: 'var(--charcoal)', marginBottom: '1.5rem' }}>
              Current asking price: <strong>{car.priceFormatted}</strong> (৳ {car.priceLakh} Lakh). Direct sellers will review fair offers.
            </p>

            {formSubmittedMsg ? (
              <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', color: '#16a34a', fontWeight: 600, fontSize: '0.85rem' }}>
                {formSubmittedMsg}
              </div>
            ) : (
              <form onSubmit={handleOfferSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', marginBottom: '0.3rem' }}>YOUR OFFER (IN LAKH BDT)</label>
                  <input
                    required
                    type="number"
                    step="0.5"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid rgba(35,35,38,0.25)', outline: 'none', fontWeight: 700, fontSize: '1.1rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', marginBottom: '0.3rem' }}>YOUR MOBILE NUMBER</label>
                  <input required type="tel" placeholder="+880 1711-XXXXXX" style={{ width: '100%', padding: '0.75rem', border: '1px solid rgba(35,35,38,0.25)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="submit" style={{ flex: 1, padding: '0.85rem', backgroundColor: 'var(--red)', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    SUBMIT OFFER
                  </button>
                  <button type="button" onClick={() => setOfferModalOpen(false)} style={{ padding: '0.85rem 1.25rem', backgroundColor: 'transparent', border: '1px solid #ccc', cursor: 'pointer' }}>
                    CANCEL
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

export default function CarDisplayPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--bone)' }} />}>
      <CarDisplayContent />
    </Suspense>
  );
}
