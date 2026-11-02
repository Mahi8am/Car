/**
 * src/app/sell/page.tsx
 * ─────────────────────
 * Garir Mela — Sell Your Car Portal
 * Comprehensive direct seller listing wizard with smart valuation estimator,
 * interactive photo dropzone, live card preview, and zero commission guarantee.
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  DollarSign,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MessageSquare,
  HelpCircle,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  FileCheck,
  Check,
} from 'lucide-react';
import { marketplaceBrands } from '@/content/listings';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/sections/Footer';

const BRAND_OPTIONS = marketplaceBrands.filter((b) => b !== 'All Brands');

const DISTRICT_OPTIONS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
  'Comilla',
  'Gazipur',
  'Narayanganj',
];

export default function SellCarPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [brand, setBrand] = useState('Toyota');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2022');
  const [regYear, setRegYear] = useState('2023');
  const [condition, setCondition] = useState<'Reconditioned' | 'Used' | 'Brand New'>('Reconditioned');
  const [fuelType, setFuelType] = useState('Hybrid');
  const [transmission, setTransmission] = useState('Automatic');
  const [engineCc, setEngineCc] = useState('1800');
  const [mileageKm, setMileageKm] = useState('15000');
  const [color, setColor] = useState('Pearl White');

  // Pricing & Location
  const [priceLakh, setPriceLakh] = useState('42.5');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('Gulshan');

  // Features Checklist
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Push Start & Smart Key',
    'Dual-Zone AC',
    '360-Degree Camera',
    'Alloy Wheels',
  ]);
  const [description, setDescription] = useState(
    'Showroom condition vehicle with authentic Japanese auction sheet, single-owner driven in Dhaka, pristine interior and zero accident history.'
  );

  // Photos simulation
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    '/images/cars/hero-car-editorial.jpg',
    '/images/cars/toyota-land-cruiser.jpg',
  ]);

  // Seller Details
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerType, setSellerType] = useState<'Private Owner' | 'Certified Dealer'>('Private Owner');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Success State
  const [isPublished, setIsPublished] = useState(false);
  const [publishedListingId, setPublishedListingId] = useState('');

  // Unconditionally unlock body scroll
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.overflowY = 'auto';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Smart Estimated Valuation Calculation
  const estimatedValuation = useMemo(() => {
    const yr = Number(year) || 2020;
    const basePrices: Record<string, number> = {
      Toyota: 38,
      Honda: 36,
      Nissan: 32,
      Mitsubishi: 45,
      Suzuki: 20,
      Hyundai: 35,
      Kia: 44,
      Mazda: 42,
      Subaru: 40,
      Lexus: 110,
      BMW: 125,
      'Mercedes-Benz': 130,
    };
    const base = basePrices[brand] || 35;
    const ageFactor = Math.max(0.6, 1 - (2026 - yr) * 0.05);
    const low = Math.round(base * ageFactor * 0.92 * 10) / 10;
    const high = Math.round(base * ageFactor * 1.15 * 10) / 10;
    return { low, high };
  }, [brand, year]);

  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `GM-SELL-${Math.floor(100000 + Math.random() * 900000)}`;
    setPublishedListingId(id);
    setIsPublished(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.8rem 1rem',
    backgroundColor: '#ffffff',
    border: '1.5px solid rgba(35, 35, 38, 0.2)',
    fontFamily: 'var(--font-manrope), sans-serif',
    fontSize: '0.85rem',
    color: 'var(--ink-950)',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bone)', color: 'var(--ink-950)' }}>
      <Navbar />

      {/* ── Premium Editorial Dark Header ────────────────────────────────────── */}
      <header
        style={{
          backgroundColor: 'var(--ink-950)',
          color: '#ffffff',
          paddingTop: '8rem',
          paddingBottom: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '2px solid var(--red)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50vw',
            height: '100%',
            background: 'radial-gradient(circle at 80% 30%, rgba(225,37,27,0.12) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 5vw, 4rem)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
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
              DIRECT SELLER PORTAL · ZERO COMMISSIONS
            </span>
            <div style={{ width: 28, height: 1.5, backgroundColor: 'var(--red)' }} />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-barlow-condensed), sans-serif',
              fontSize: 'clamp(2.75rem, 5.5vw, 5.25rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.92,
              margin: '0 0 1.25rem 0',
            }}
          >
            SELL YOUR CAR IN BANGLADESH
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.6,
              maxWidth: '62ch',
              margin: '0 0 2.5rem 0',
            }}
          >
            Connect directly with 50,000+ verified, serious car buyers across all 64 districts. 100% free listing with zero broker fees and direct WhatsApp inquiries.
          </p>

          {/* 4 Value Prop Badges */}
          <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
            {[
              { val: '100% FREE', desc: 'No Commission or Listing Fees' },
              { val: '50,000+', desc: 'Verified Active Car Buyers' },
              { val: 'DIRECT CALLS', desc: 'Buyers Contact You on WhatsApp' },
              { val: 'BRTA ASSIST', desc: 'Free Ownership Transfer Help' },
            ].map((badge) => (
              <div key={badge.val} style={{ borderLeft: '2px solid var(--red)', paddingLeft: '0.85rem' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-barlow-condensed), sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: '#ffffff',
                  }}
                >
                  {badge.val}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {badge.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Stepper Navigation ────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(35, 35, 38, 0.12)',
          position: 'sticky',
          top: 72,
          zIndex: 40,
          boxShadow: '0 4px 20px -5px rgba(7,7,7,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 5vw, 4rem)',
            display: 'flex',
            overflowX: 'auto',
          }}
        >
          {[
            { step: 1, title: '01. VEHICLE DETAILS' },
            { step: 2, title: '02. PRICE & LOCATION' },
            { step: 3, title: '03. PHOTOS & FEATURES' },
            { step: 4, title: '04. CONTACT & PUBLISH' },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => setCurrentStep(item.step)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '1.25rem 1rem',
                background: 'none',
                border: 'none',
                borderBottom: currentStep === item.step ? '3px solid var(--red)' : '3px solid transparent',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.8rem',
                fontWeight: currentStep === item.step ? 700 : 500,
                color: currentStep === item.step ? 'var(--red)' : 'var(--charcoal)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Form Section ────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '3.5rem clamp(1.5rem, 5vw, 4rem) 6rem',
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
          {/* ── Left: Wizard Inputs ───────────────────────────────────────────── */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid rgba(35, 35, 38, 0.12)',
              padding: '2.5rem clamp(1.5rem, 3.5vw, 2.75rem)',
              boxShadow: '0 4px 24px rgba(7,7,7,0.04)',
            }}
          >
            {/* Step 1: Vehicle Information */}
            {currentStep === 1 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '2rem', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>
                  STEP 1: VEHICLE INFORMATION
                </h2>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.82rem', color: 'var(--charcoal)', opacity: 0.8, marginBottom: '2rem' }}>
                  Provide accurate vehicle specifications matching your BRTA registration certificate.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {/* Brand */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      CAR BRAND *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select value={brand} onChange={(e) => setBrand(e.target.value)} style={selectStyle}>
                        {BRAND_OPTIONS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Model */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      MODEL / TRIM *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Prado TX-L, Civic RS, Allion A15"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>

                  {/* Manufacturing Year */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      MANUFACTURE YEAR *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select value={year} onChange={(e) => setYear(e.target.value)} style={selectStyle}>
                        {Array.from({ length: 27 }, (_, i) => 2026 - i).map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Registration Year */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      REGISTRATION YEAR *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select value={regYear} onChange={(e) => setRegYear(e.target.value)} style={selectStyle}>
                        {Array.from({ length: 27 }, (_, i) => 2026 - i).map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      CONDITION *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select value={condition} onChange={(e) => setCondition(e.target.value as any)} style={selectStyle}>
                        <option value="Reconditioned">Reconditioned (Japan Import)</option>
                        <option value="Used">Used (Local BD Driven)</option>
                        <option value="Brand New">Brand New</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      FUEL TYPE *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} style={selectStyle}>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Octane">Octane / Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric (EV)</option>
                        <option value="CNG">CNG / Octane</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      TRANSMISSION *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select value={transmission} onChange={(e) => setTransmission(e.target.value)} style={selectStyle}>
                        <option value="Automatic">Automatic</option>
                        <option value="CVT">CVT</option>
                        <option value="Manual">Manual</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Mileage */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      ODOMETER (KM) *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 18500"
                      value={mileageKm}
                      onChange={(e) => setMileageKm(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bencho-sweep-button"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem 1.85rem',
                      backgroundColor: 'var(--red)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span>NEXT: PRICE & LOCATION</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Location */}
            {currentStep === 2 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '2rem', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>
                  STEP 2: PRICING & LOCATION
                </h2>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.82rem', color: 'var(--charcoal)', opacity: 0.8, marginBottom: '1.75rem' }}>
                  Set a realistic market asking price. Our smart valuation engine provides recommended pricing bands.
                </p>

                {/* Smart Valuation Banner */}
                <div
                  style={{
                    backgroundColor: 'rgba(237, 231, 220, 0.75)',
                    border: '1.5px solid rgba(225, 37, 27, 0.35)',
                    borderLeft: '4px solid var(--red)',
                    padding: '1.25rem 1.5rem',
                    marginBottom: '2rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <Sparkles size={16} color="var(--red)" />
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--red)' }}>
                      ESTIMATED BANGLADESH MARKET VALUATION
                    </span>
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.82rem', color: 'var(--ink-950)' }}>
                    For a <strong>{year} {brand} {model || 'Vehicle'}</strong> in {condition} condition:
                  </p>
                  <span style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-950)' }}>
                    ৳ {estimatedValuation.low} Lakh – ৳ {estimatedValuation.high} Lakh BDT
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {/* Asking Price */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      ASKING PRICE (IN LAKH BDT) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 42.5"
                      value={priceLakh}
                      onChange={(e) => setPriceLakh(e.target.value)}
                      style={{ ...inputStyle, fontSize: '1.15rem', fontWeight: 700 }}
                      required
                    />
                    <span style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.65rem', color: 'var(--charcoal)', opacity: 0.65, marginTop: '0.25rem' }}>
                      {Number(priceLakh) >= 100
                        ? `Equivalent to ৳ ${(Number(priceLakh) / 100).toFixed(2)} Crore BDT`
                        : `৳ ${(Number(priceLakh) * 100000).toLocaleString()} BDT`}
                    </span>
                  </div>

                  {/* Negotiable Toggle */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', marginTop: '1rem' }}>
                      <input
                        type="checkbox"
                        checked={isNegotiable}
                        onChange={(e) => setIsNegotiable(e.target.checked)}
                        style={{ width: 18, height: 18, accentColor: 'var(--red)', cursor: 'pointer' }}
                      />
                      <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.82rem', fontWeight: 600 }}>
                        Price is negotiable with serious buyers
                      </span>
                    </label>
                  </div>

                  {/* Division / District */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      REGISTRATION DIVISION *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select value={district} onChange={(e) => setDistrict(e.target.value)} style={selectStyle}>
                        {DISTRICT_OPTIONS.map((d) => (
                          <option key={d} value={d}>{d} Metro</option>
                        ))}
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Specific Area */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      AREA / NEIGHBORHOOD *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gulshan 2, Dhanmondi, Agrabad"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem 1.5rem',
                      backgroundColor: 'transparent',
                      color: 'var(--ink-950)',
                      border: '1.5px solid rgba(35,35,38,0.25)',
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={14} />
                    <span>PREVIOUS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="bencho-sweep-button"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem 1.85rem',
                      backgroundColor: 'var(--red)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span>NEXT: PHOTOS & FEATURES</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Photos & Features */}
            {currentStep === 3 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '2rem', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>
                  STEP 3: PHOTOS & VEHICLE FEATURES
                </h2>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.82rem', color: 'var(--charcoal)', opacity: 0.8, marginBottom: '1.75rem' }}>
                  Listings with clean high-resolution photos receive 4x more direct calls and sell in under 10 days.
                </p>

                {/* Simulated Photo Upload Area */}
                <div
                  style={{
                    border: '2px dashed rgba(35, 35, 38, 0.25)',
                    padding: '2.5rem 2rem',
                    textAlign: 'center',
                    backgroundColor: 'rgba(237, 231, 220, 0.35)',
                    marginBottom: '1.75rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => alert('Photo upload simulated! Your vehicle photos have been attached.')}
                >
                  <Upload size={32} color="var(--red)" style={{ margin: '0 auto 0.75rem' }} />
                  <h3 style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '1.35rem', margin: '0 0 0.25rem 0' }}>
                    DRAG & DROP VEHICLE PHOTOS OR CLICK TO BROWSE
                  </h3>
                  <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.75rem', color: 'var(--charcoal)', opacity: 0.7 }}>
                    Supports JPG, PNG, WEBP up to 15MB each. Recommended: Exterior Front, Rear, Interior, Odometer.
                  </span>
                </div>

                {/* Uploaded Thumbnails */}
                <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '2rem' }}>
                  {uploadedPhotos.map((src, i) => (
                    <div key={i} style={{ width: '100px', height: '65px', position: 'relative', border: '1.5px solid rgba(35,35,38,0.2)' }}>
                      <img src={src} alt="Uploaded vehicle angle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', bottom: 2, right: 2, backgroundColor: '#000', color: '#fff', fontSize: '0.55rem', padding: '1px 3px' }}>
                        ANGLE {i + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Features Checklist */}
                <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  KEY HIGHLIGHTS & FACTORY OPTIONS
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem', marginBottom: '2rem' }}>
                  {[
                    'Push Start & Smart Key',
                    'Panoramic Sunroof',
                    'Leather Seats',
                    'Dual-Zone AC',
                    '360-Degree Camera',
                    'Apple CarPlay / Android Auto',
                    'Alloy Wheels',
                    'Cruise Control',
                    'LED Projector Headlights',
                    'Pre-Crash Safety System',
                  ].map((feat) => {
                    const checked = selectedFeatures.includes(feat);
                    return (
                      <div
                        key={feat}
                        onClick={() => toggleFeature(feat)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.6rem 0.85rem',
                          backgroundColor: checked ? 'rgba(225, 37, 27, 0.08)' : '#ffffff',
                          border: checked ? '1.5px solid var(--red)' : '1px solid rgba(35, 35, 38, 0.15)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 2,
                            border: checked ? '1.5px solid var(--red)' : '1px solid #999',
                            backgroundColor: checked ? 'var(--red)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                          }}
                        >
                          {checked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.78rem', fontWeight: checked ? 700 : 500 }}>
                          {feat}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Seller Description */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    SELLER NOTES / DESCRIPTION
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    placeholder="Describe maintenance history, ownership, auction sheet rating, paper validity..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem 1.5rem',
                      backgroundColor: 'transparent',
                      color: 'var(--ink-950)',
                      border: '1.5px solid rgba(35,35,38,0.25)',
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={14} />
                    <span>PREVIOUS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="bencho-sweep-button"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem 1.85rem',
                      backgroundColor: 'var(--red)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span>NEXT: CONTACT & PUBLISH</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Contact & Publish */}
            {currentStep === 4 && (
              <form onSubmit={handlePublishListing}>
                <h2 style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '2rem', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>
                  STEP 4: SELLER CONTACT & PUBLISH
                </h2>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.82rem', color: 'var(--charcoal)', opacity: 0.8, marginBottom: '2rem' }}>
                  Your phone number will be displayed to serious buyers so they can call or WhatsApp you directly.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      YOUR FULL NAME *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tanvir Chowdhury"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      PHONE / WHATSAPP NUMBER *
                    </label>
                    <input
                      type="tel"
                      placeholder="+880 1711-XXXXXX"
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>

                  {/* Seller Type */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      SELLER TYPE *
                    </label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {[
                        { type: 'Private Owner', label: 'Private Car Owner (Selling My Own Car)' },
                        { type: 'Certified Dealer', label: 'Registered Automobile Dealer / Showroom' },
                      ].map((t) => (
                        <label
                          key={t.type}
                          style={{
                            flex: 1,
                            padding: '1rem',
                            border: sellerType === t.type ? '2px solid var(--red)' : '1px solid rgba(35,35,38,0.2)',
                            backgroundColor: sellerType === t.type ? 'rgba(225,37,27,0.05)' : '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                          }}
                        >
                          <input
                            type="radio"
                            name="sellerType"
                            checked={sellerType === t.type}
                            onChange={() => setSellerType(t.type as any)}
                            style={{ accentColor: 'var(--red)' }}
                          />
                          <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.82rem', fontWeight: 600 }}>
                            {t.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--red)', marginTop: 2 }}
                      required
                    />
                    <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.78rem', color: 'var(--charcoal)', lineHeight: 1.5 }}>
                      I certify that the vehicle documents are authentic and I am legally authorized to sell this car in Bangladesh. I agree to Garir Mela's Seller Terms of Service.
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem 1.5rem',
                      backgroundColor: 'transparent',
                      color: 'var(--ink-950)',
                      border: '1.5px solid rgba(35,35,38,0.25)',
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={14} />
                    <span>PREVIOUS</span>
                  </button>

                  <button
                    type="submit"
                    className="bencho-sweep-button"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2.5rem',
                      backgroundColor: 'var(--red)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 6px 25px rgba(225, 37, 27, 0.4)',
                    }}
                  >
                    <span>PUBLISH FREE LISTING</span>
                    <CheckCircle2 size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── Right: Live Dynamic Marketplace Card Preview ─────────────────── */}
          <div style={{ position: 'sticky', top: '140px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.68rem',
                  color: 'var(--red)',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                LIVE MARKETPLACE PREVIEW
              </span>
              <p style={{ margin: '0 0 1rem 0', fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.78rem', color: 'var(--charcoal)', opacity: 0.75 }}>
                This is how buyers will see your vehicle card on the Garir Mela marketplace.
              </p>

              {/* Preview Card */}
              <article
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid rgba(35,35,38,0.14)',
                  overflow: 'hidden',
                  boxShadow: '0 12px 36px rgba(7,7,7,0.08)',
                }}
              >
                <div style={{ aspectRatio: '16/10', overflow: 'hidden', position: 'relative', backgroundColor: '#e5e1d8' }}>
                  <img
                    src={uploadedPhotos[0] || '/images/cars/hero-car-editorial.jpg'}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      backgroundColor: 'rgba(7,7,7,0.85)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderLeft: '2px solid var(--red)',
                    }}
                  >
                    {condition.toUpperCase()}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      backgroundColor: 'var(--red)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.58rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.55rem',
                    }}
                  >
                    NEW LISTING
                  </span>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.72rem', color: 'var(--red)', fontWeight: 700 }}>
                      {brand}
                    </span>
                    <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.72rem', color: 'var(--charcoal)', opacity: 0.7 }}>
                      {district} Metro
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '1.6rem', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 1rem 0' }}>
                    {brand} {model || 'Model Name'} {year}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(35,35,38,0.08)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                      <Calendar size={13} color="var(--red)" />
                      <span>{year} Model</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                      <Gauge size={13} color="var(--red)" />
                      <span>{Number(mileageKm || 0).toLocaleString()} km</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                      <Fuel size={13} color="var(--red)" />
                      <span>{fuelType}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                      <MapPin size={13} color="var(--red)" />
                      <span>{area || district}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <span style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '0.62rem', color: 'var(--charcoal)', opacity: 0.65 }}>
                        ASKING PRICE
                      </span>
                      <span style={{ fontFamily: 'var(--font-barlow-condensed), sans-serif', fontSize: '1.75rem', fontWeight: 700, color: 'var(--ink-950)' }}>
                        ৳ {priceLakh ? `${priceLakh} Lakh` : 'Call for Price'}
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.65rem', color: 'var(--red)', fontWeight: 600 }}>
                      {isNegotiable ? 'NEGOTIABLE' : 'FIXED PRICE'}
                    </span>
                  </div>
                </div>
              </article>
            </div>

            {/* Seller Guarantee */}
            <div
              style={{
                backgroundColor: 'rgba(237,231,220,0.6)',
                border: '1px solid rgba(35,35,38,0.15)',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--red)" />
                <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  GARIR MELA SELLER ASSURANCE
                </span>
              </div>
              <p style={{ margin: 0, fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.75rem', color: 'var(--charcoal)', lineHeight: 1.5 }}>
                No listing fees, no hidden cuts. Your contact information is protected against scrapers, and buyers connect with you directly.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Success Published Modal ──────────────────────────────────────────── */}
      {isPublished && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(7,7,7,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              maxWidth: '520px',
              width: '100%',
              padding: '2.75rem 2.25rem',
              textAlign: 'center',
              border: '3px solid var(--red)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'rgba(34,197,94,0.12)',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#f0fdf4',
                color: '#15803d',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.35rem 0.85rem',
                marginBottom: '1rem',
              }}
            >
              LISTING ID: {publishedListingId}
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: '2.5rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                margin: '0 0 0.75rem 0',
              }}
            >
              CAR LISTED SUCCESSFULLY!
            </h2>

            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '0.88rem', color: 'var(--charcoal)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Your <strong>{brand} {model} ({year})</strong> is now live on the Garir Mela marketplace. Interested buyers will call or WhatsApp you directly at <strong>{sellerPhone}</strong>.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link
                href="/buy"
                className="bencho-sweep-button"
                style={{
                  padding: '0.95rem 1.85rem',
                  backgroundColor: 'var(--red)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                VIEW MARKETPLACE
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsPublished(false);
                  setCurrentStep(1);
                  setModel('');
                }}
                style={{
                  padding: '0.95rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: '1.5px solid var(--ink-950)',
                  color: 'var(--ink-950)',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                LIST ANOTHER CAR
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
