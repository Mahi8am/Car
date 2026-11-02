/**
 * src/app/buy/page.tsx
 * ────────────────────
 * Garir Mela — Vehicle Marketplace (Premium Redesign)
 * Premium editorial marketplace UI with dark header, bone cards, and polished filter system.
 */

'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  X,
  Phone,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  MapPin,
  ArrowUpRight,
  SlidersHorizontal,
  ChevronDown,
  Star,
} from 'lucide-react';
import { marketplaceListings, marketplaceBrands, type CarListing } from '@/content/listings';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/sections/Footer';

function BuyMarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandParam = searchParams.get('brand');
  const carParam = searchParams.get('car');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedBodyType, setSelectedBodyType] = useState('All');
  const [selectedFuelType, setSelectedFuelType] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc'>('featured');
  const [activeContactModalCar, setActiveContactModalCar] = useState<CarListing | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sync with brand query param if present
  useEffect(() => {
    if (brandParam) {
      const match = marketplaceBrands.find((b) => b.toLowerCase() === brandParam.toLowerCase());
      if (match) {
        setSelectedBrand(match);
      } else {
        setSelectedBrand(brandParam);
      }
    }
  }, [brandParam]);

  // Sync with car query param if present
  useEffect(() => {
    if (carParam) {
      const match = marketplaceListings.find((c) => c.id === carParam);
      if (match) {
        setActiveContactModalCar(match);
      }
    }
  }, [carParam]);

  // Unconditionally unlock body scroll for the marketplace
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const filteredListings = useMemo(() => {
    return marketplaceListings
      .filter((car) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (!car.name.toLowerCase().includes(q) && !car.brand.toLowerCase().includes(q) && !car.model.toLowerCase().includes(q) && !car.location.toLowerCase().includes(q)) return false;
        }
        if (selectedBrand !== 'All Brands' && car.brand !== selectedBrand) return false;
        if (selectedBodyType !== 'All' && car.bodyType !== selectedBodyType) return false;
        if (selectedFuelType !== 'All' && car.fuelType !== selectedFuelType) return false;
        if (selectedCondition !== 'All' && car.condition !== selectedCondition) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceLakh - b.priceLakh;
        if (sortBy === 'price-desc') return b.priceLakh - a.priceLakh;
        if (sortBy === 'year-desc') return b.year - a.year;
        if (sortBy === 'mileage-asc') return a.mileageKm - b.mileageKm;
        return 0;
      });
  }, [searchQuery, selectedBrand, selectedBodyType, selectedFuelType, selectedCondition, sortBy]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedBrand('All Brands');
    setSelectedBodyType('All');
    setSelectedFuelType('All');
    setSelectedCondition('All');
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedBrand !== 'All Brands' ||
    selectedBodyType !== 'All' ||
    selectedFuelType !== 'All' ||
    selectedCondition !== 'All' ||
    sortBy !== 'featured';

  const selectStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'rgba(237, 231, 220, 0.9)',
    border: '1.5px solid rgba(35, 35, 38, 0.2)',
    color: 'var(--ink-950)',
    fontFamily: 'var(--font-manrope), sans-serif',
    fontSize: '0.8rem',
    fontWeight: 600,
    padding: '0.65rem 0.9rem',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    borderRadius: 0,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bone)',
        color: 'var(--ink-950)',
      }}
    >
      <Navbar />

      {/* ── Premium Dark Header ──────────────────────────────────────────────── */}
      <header
        style={{
          backgroundColor: 'var(--ink-950)',
          color: '#ffffff',
          paddingTop: '8rem',
          paddingBottom: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background: subtle car image */}
        <img
          src="/images/cars/hero-car-editorial.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            opacity: 0.12,
            display: 'block',
          }}
        />
        {/* Red stripe bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(to right, var(--red) 0%, rgba(225,37,27,0.15) 70%, transparent 100%)',
          }}
        />
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 clamp(2.5rem, 6vw, 5.5rem)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
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
              LIVE MARKETPLACE · BANGLADESH
            </span>
            <div style={{ width: 28, height: 1.5, backgroundColor: 'var(--red)' }} />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-barlow-condensed), sans-serif',
              fontSize: 'clamp(2.75rem, 5.5vw, 5.5rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.025em',
              lineHeight: 0.9,
              color: '#ffffff',
              margin: '0 0 1.15rem 0',
            }}
          >
            BROWSE VERIFIED CARS
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.6,
              maxWidth: '58ch',
              margin: '0 0 2.5rem 0',
            }}
          >
            Inspected vehicles with genuine auction documents, authentic odometer history, and direct seller negotiations across all 64 districts.
          </p>

          {/* Quick Stats */}
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { value: `${marketplaceListings.length}`, label: 'Verified Vehicles' },
              { value: '64', label: 'Districts' },
              { value: '100%', label: 'Certified', red: true },
            ].map((stat) => (
              <div key={stat.label} style={{ borderLeft: '2px solid var(--red)', paddingLeft: '0.85rem' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-barlow-condensed), sans-serif',
                    fontSize: '1.85rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: stat.red ? 'var(--red)' : '#ffffff',
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Search + Filter Bar (sticky) ────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--bone)',
          borderBottom: '1px solid rgba(35, 35, 38, 0.12)',
          position: 'sticky',
          top: 72,
          zIndex: 50,
          boxShadow: '0 4px 24px -4px rgba(7,7,7,0.1)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '1rem clamp(2.5rem, 6vw, 5.5rem)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search input */}
            <div
              style={{
                flex: 1,
                minWidth: 240,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#ffffff',
                border: '1.5px solid rgba(35,35,38,0.2)',
                padding: '0.65rem 1rem',
              }}
            >
              <Search size={18} color="var(--red)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search brand, model, engine…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '0.88rem',
                  color: 'var(--ink-950)',
                }}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--charcoal)', display: 'flex' }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <div style={{ position: 'relative', minWidth: 190 }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={selectStyle}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="year-desc">Year: Newest</option>
                <option value="mileage-asc">Mileage: Lowest</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--charcoal)' }} />
            </div>

            {/* Toggle advanced filters */}
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                backgroundColor: filtersOpen ? 'var(--ink-950)' : 'transparent',
                color: filtersOpen ? '#ffffff' : 'var(--ink-950)',
                border: `1.5px solid ${filtersOpen ? 'var(--ink-950)' : 'rgba(35,35,38,0.2)'}`,
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <SlidersHorizontal size={15} />
              <span>FILTERS</span>
              {hasActiveFilters && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'var(--red)',
                    display: 'inline-block',
                    marginLeft: 2,
                  }}
                />
              )}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1rem',
                  backgroundColor: 'transparent',
                  color: 'var(--red)',
                  border: '1.5px solid rgba(225, 37, 27, 0.3)',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                <X size={13} />
                CLEAR ALL
              </button>
            )}
          </div>

          {/* Advanced Filter Panel */}
          {filtersOpen && (
            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(35,35,38,0.1)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {[
                {
                  label: 'Body Type',
                  value: selectedBodyType,
                  onChange: setSelectedBodyType,
                  options: [
                    { value: 'All', label: 'All Body Types' },
                    { value: 'SUV', label: 'SUV' },
                    { value: 'Sedan', label: 'Sedan' },
                    { value: 'Crossover', label: 'Crossover' },
                    { value: 'Hatchback', label: 'Hatchback' },
                  ],
                },
                {
                  label: 'Fuel Type',
                  value: selectedFuelType,
                  onChange: setSelectedFuelType,
                  options: [
                    { value: 'All', label: 'All Fuel Types' },
                    { value: 'Hybrid', label: 'Hybrid' },
                    { value: 'Octane', label: 'Octane / Petrol' },
                    { value: 'Diesel', label: 'Diesel' },
                    { value: 'Electric', label: 'Electric' },
                  ],
                },
                {
                  label: 'Condition',
                  value: selectedCondition,
                  onChange: setSelectedCondition,
                  options: [
                    { value: 'All', label: 'All Conditions' },
                    { value: 'Reconditioned', label: 'Reconditioned (Japan)' },
                    { value: 'Used', label: 'Used (Local BD)' },
                    { value: 'Brand New', label: 'Brand New' },
                  ],
                },
              ].map(({ label, value, onChange, options }) => (
                <div key={label}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.65rem',
                      color: 'var(--charcoal)',
                      opacity: 0.75,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {label}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
                      {options.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--charcoal)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Brand Pill Strip ────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--bone)',
          borderBottom: '1px solid rgba(35,35,38,0.1)',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0.85rem clamp(2.5rem, 6vw, 5.5rem)',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            flexWrap: 'nowrap',
            minWidth: 'max-content',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.65rem',
              color: 'var(--charcoal)',
              opacity: 0.65,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              marginRight: '0.5rem',
              flexShrink: 0,
            }}
          >
            BRAND
          </span>
          {marketplaceBrands.map((brand) => {
            const isSelected = selectedBrand === brand;
            return (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                style={{
                  padding: '0.45rem 1.15rem',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: `1.5px solid ${isSelected ? 'var(--ink-950)' : 'rgba(35,35,38,0.2)'}`,
                  backgroundColor: isSelected ? 'var(--ink-950)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--ink-950)',
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap',
                  borderRadius: 0,
                }}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results Count & Main Listings ────────────────────────────────────── */}
      <main
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '2.5rem clamp(2.5rem, 6vw, 5.5rem) 6rem',
        }}
      >
        {/* Results Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(35,35,38,0.1)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-barlow-condensed), sans-serif',
              fontSize: '1.45rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--ink-950)',
            }}
          >
            <span style={{ color: 'var(--red)' }}>{filteredListings.length}</span> VEHICLES FOUND
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.72rem',
              color: 'var(--charcoal)',
              opacity: 0.7,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            DIRECT SELLER CONTACT · CERTIFIED INSPECTIONS
          </span>
        </div>

        {filteredListings.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '2rem',
            }}
          >
            {filteredListings.map((car) => (
              <article
                key={car.id}
                id={`car-card-${car.id}`}
                onClick={() => router.push(`/buy/${car.id}`)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid rgba(35,35,38,0.14)',
                  overflow: 'hidden',
                  transition: 'transform 0.22s ease-out, box-shadow 0.25s ease, border-color 0.2s ease',
                  cursor: 'pointer',
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 2px 12px rgba(7,7,7,0.06)',
                }}
                /* Bencho.dev 3D Tilt Card Interactive Physics */
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
                  const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
                  e.currentTarget.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-5px)`;
                  e.currentTarget.style.boxShadow = '0 16px 40px -10px rgba(7,7,7,0.18)';
                  e.currentTarget.style.borderColor = 'rgba(225,37,27,0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(7,7,7,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(35,35,38,0.14)';
                }}
              >
                {/* Car Image */}
                <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', backgroundColor: '#f5f3ef' }}>
                  <img
                    src={car.image}
                    alt={car.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.45s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />

                  {/* Badge */}
                  {car.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.85rem',
                        left: '0.85rem',
                        backgroundColor: 'rgba(7, 7, 7, 0.88)',
                        backdropFilter: 'blur(8px)',
                        color: '#ffffff',
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '0.3rem 0.7rem',
                        borderLeft: '2.5px solid var(--red)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}
                    >
                      {car.badge}
                    </span>
                  )}

                  {/* Auction Grade */}
                  {car.auctionGrade && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '0.85rem',
                        right: '0.85rem',
                        backgroundColor: 'var(--red)',
                        color: '#ffffff',
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.28rem 0.65rem',
                        letterSpacing: '0.08em',
                        boxShadow: '0 4px 12px rgba(225,37,27,0.35)',
                      }}
                    >
                      GRADE {car.auctionGrade}
                    </span>
                  )}

                  {/* Seller type chip */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.85rem',
                      right: '0.85rem',
                      backgroundColor: car.sellerType === 'Certified Dealer' ? 'rgba(7,7,7,0.88)' : 'rgba(237,231,220,0.92)',
                      backdropFilter: 'blur(6px)',
                      color: car.sellerType === 'Certified Dealer' ? '#ffffff' : 'var(--ink-950)',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.58rem',
                      fontWeight: 600,
                      padding: '0.28rem 0.65rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      border: car.sellerType === 'Certified Dealer' ? 'none' : '1px solid rgba(35,35,38,0.2)',
                    }}
                  >
                    {car.sellerType === 'Certified Dealer' ? '★ DEALER' : 'PRIVATE'}
                  </span>
                </div>

                {/* Card Content with Generous Internal Padding */}
                <div
                  style={{
                    padding: '1.75rem 2rem 1.85rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    gap: '0',
                  }}
                >
                  {/* Brand + Condition row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
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
                    <span
                      style={{
                        fontFamily: 'var(--font-manrope), sans-serif',
                        fontSize: '0.72rem',
                        color: 'var(--charcoal)',
                        opacity: 0.75,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {car.condition}
                    </span>
                  </div>

                  {/* Car Name */}
                  <h2
                    style={{
                      fontFamily: 'var(--font-barlow-condensed), sans-serif',
                      fontSize: '1.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.1,
                      color: 'var(--ink-950)',
                      margin: '0 0 1.25rem 0',
                    }}
                  >
                    {car.name}
                  </h2>

                  {/* Specs Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.85rem',
                      paddingBottom: '1.25rem',
                      marginBottom: '1.25rem',
                      borderBottom: '1px solid rgba(35,35,38,0.1)',
                    }}
                  >
                    {[
                      { Icon: Calendar, label: `${car.year} Model` },
                      { Icon: Gauge, label: car.mileageFormatted },
                      { Icon: Fuel, label: car.engine },
                      { Icon: MapPin, label: car.location.split(',')[0] },
                    ].map(({ Icon, label }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Icon size={13} color="var(--red)" style={{ flexShrink: 0 }} />
                        <span
                          style={{
                            fontFamily: 'var(--font-manrope), sans-serif',
                            fontSize: '0.8rem',
                            color: 'var(--charcoal)',
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

                  {/* Price + CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <div>
                      <span
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-mono), monospace',
                          fontSize: '0.62rem',
                          color: 'var(--charcoal)',
                          opacity: 0.65,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          marginBottom: '0.15rem',
                        }}
                      >
                        ASKING PRICE
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-barlow-condensed), sans-serif',
                          fontSize: '1.7rem',
                          fontWeight: 700,
                          color: 'var(--ink-950)',
                          lineHeight: 1,
                        }}
                      >
                        {car.priceFormatted}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveContactModalCar(car);
                        }}
                        aria-label={`Quick contact for ${car.name}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.75rem',
                          backgroundColor: 'rgba(35,35,38,0.06)',
                          border: '1px solid rgba(35,35,38,0.18)',
                          color: 'var(--ink-950)',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(35,35,38,0.14)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(35,35,38,0.06)'; }}
                      >
                        <Phone size={14} />
                      </button>

                      <Link
                        href={`/buy/${car.id}`}
                        className="bencho-sweep-button"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.75rem 1.25rem',
                          backgroundColor: 'var(--ink-950)',
                          color: '#ffffff',
                          fontFamily: 'var(--font-manrope), sans-serif',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(7,7,7,0.12)',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.backgroundColor = 'var(--red)';
                          el.style.boxShadow = '0 6px 20px rgba(225,37,27,0.35)';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.backgroundColor = 'var(--ink-950)';
                          el.style.boxShadow = '0 4px 14px rgba(7,7,7,0.12)';
                        }}
                      >
                        <span>VIEW DETAILS</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            style={{
              textAlign: 'center',
              padding: '6rem 2rem',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(35,35,38,0.12)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: '4rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--ink-950)',
                opacity: 0.08,
                lineHeight: 1,
                marginBottom: '1rem',
              }}
            >
              0
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: '2rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--ink-950)',
                marginBottom: '0.5rem',
              }}
            >
              NO VEHICLES MATCH
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.95rem',
                color: 'var(--charcoal)',
                opacity: 0.75,
                maxWidth: '40ch',
                margin: '0 auto 2rem',
              }}
            >
              Try clearing some filters or broadening your search.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              style={{
                padding: '0.85rem 2rem',
                backgroundColor: 'var(--red)',
                color: '#ffffff',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
      </main>

      {/* ── Contact Modal ─────────────────────────────────────────────────────── */}
      {activeContactModalCar && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Contact seller for ${activeContactModalCar.name}`}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(7,7,7,0.72)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setActiveContactModalCar(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--bone)',
              color: 'var(--ink-950)',
              maxWidth: '500px',
              width: '100%',
              padding: '2.25rem',
              border: '1px solid rgba(35,35,38,0.18)',
              boxShadow: '0 32px 80px -16px rgba(7,7,7,0.5)',
              position: 'relative',
              borderTop: '3px solid var(--red)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setActiveContactModalCar(null)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '1.1rem',
                right: '1.1rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--charcoal)',
                display: 'flex',
                padding: 4,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--red)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--charcoal)')}
            >
              <X size={22} />
            </button>

            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.72rem',
                color: 'var(--red)',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '0.85rem',
              }}
            >
              <ShieldCheck size={15} />
              <span>GARIR MELA VERIFIED LISTING</span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-barlow-condensed), sans-serif',
                fontSize: '2rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1.0,
                margin: '0 0 0.4rem 0',
                color: 'var(--ink-950)',
              }}
            >
              {activeContactModalCar.name}
            </h3>

            <p
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '0.88rem',
                color: 'var(--charcoal)',
                opacity: 0.8,
                marginBottom: '1.5rem',
              }}
            >
              Listed at{' '}
              <strong style={{ color: 'var(--ink-950)' }}>{activeContactModalCar.priceFormatted}</strong>
              {' · '}
              {activeContactModalCar.location}
            </p>

            {/* Seller Info */}
            <div
              style={{
                padding: '1rem 1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(35,35,38,0.14)',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.62rem',
                  color: 'var(--red)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  display: 'block',
                  marginBottom: '0.35rem',
                }}
              >
                {activeContactModalCar.sellerType}
              </span>
              <h4
                style={{
                  fontFamily: 'var(--font-barlow-condensed), sans-serif',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  margin: '0 0 0.25rem 0',
                  color: 'var(--ink-950)',
                }}
              >
                {activeContactModalCar.sellerName}
              </h4>
              <p
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '0.8rem',
                  color: 'var(--charcoal)',
                  opacity: 0.75,
                  margin: '0 0 0.85rem 0',
                }}
              >
                Authorized showroom & certified inspection partner
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  backgroundColor: 'var(--bone)',
                  padding: '0.6rem 0.85rem',
                  border: '1px solid rgba(35,35,38,0.1)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--ink-950)',
                }}
              >
                <Phone size={14} color="var(--red)" />
                {activeContactModalCar.sellerPhone}
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <a
                href={`tel:${activeContactModalCar.sellerPhone.replace(/[^0-9+]/g, '')}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.95rem 1.5rem',
                  backgroundColor: 'var(--ink-950)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--red)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--ink-950)')}
              >
                <Phone size={15} />
                DIRECT CALL
              </a>

              <a
                href={`https://wa.me/8801711234567?text=Hello,%20I%20am%20inquiring%20about%20the%20${encodeURIComponent(activeContactModalCar.name)}%20listed%20on%20Garir%20Mela`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.95rem 1.5rem',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1EBE5D')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#25D366')}
              >
                <MessageSquare size={15} />
                WHATSAPP CHAT
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function BuyMarketplacePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--bone)' }} />}>
      <BuyMarketplaceContent />
    </Suspense>
  );
}
