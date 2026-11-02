/**
 * app/page.tsx
 * ─────────────
 * Root landing page. Composes the scoped hero section + subsequent sections.
 *
 * Architecture (Plan2 §1.2):
 *   - Navbar: fixed, revealed after intro completes
 *   - #hero: relative h-[100svh] min-h-[560px] overflow-hidden isolate
 *     contains IntroSequence, TrackMorphLayer, HeroDetails
 *   - #services: Services section stub (real content in P2-M4)
 *   - #brands: Popular brands section stub (real content in P2-M5)
 *   - footer: Footer stub (real content in P2-M5)
 *   - HeroClient: unlocks scroll & activates Lenis once intro completes
 */

import IntroSequence from '@/components/intro/IntroSequence';
import { TrackMorphLayer } from '@/components/transition/TrackMorphLayer';
import { Navbar } from '@/components/nav/Navbar';
import { HeroDetails } from '@/components/hero/HeroDetails';
import { HeroPhase2 } from '@/components/hero/HeroPhase2';
import HeroClient from '@/components/hero/HeroClient';
import { Services } from '@/components/sections/Services';
import { FeaturedCars } from '@/components/sections/FeaturedCars';
import { Brands } from '@/components/sections/Brands';
import { Reviews } from '@/components/sections/Reviews';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="relative bg-[var(--bone)] text-[var(--ink-950)]">
      {/* Navigation — fixed, revealed by heroProgress with scroll-spy & mobile drawer */}
      <Navbar />

      {/* Hero section — scoped container for the entire cinematic intro */}
      <section
        id="hero"
        className="relative h-[100svh] overflow-hidden isolate [@media(min-height:560px)]:min-h-[560px] bg-[var(--ink-950)]"
        style={{ height: '100svh' }}
      >
        {/* Cinematic intro (Scenes 1–6 + loading screen + text + skip) */}
        <IntroSequence />

        {/* SVG transformation overlay (Scene 6→7) */}
        <TrackMorphLayer />

        {/* Hero Phase 2 resolved content (Light mode, featured SUV, red metrics) */}
        <HeroPhase2 />

        {/* Vertical micro-label + scroll cue */}
        <HeroDetails />
      </section>

      {/* Lenis activation + scroll lock */}
      <HeroClient />

      {/* Two Doors Editorial Services Section (EVERYTHING YOUR CAR NEEDS) */}
      <Services />

      {/* 4 Curated Featured Cars Section */}
      <FeaturedCars />

      {/* Popular in Bangladesh Brand Wall (on --bone) */}
      <Brands />

      {/* Verified Client Reviews & Testimonials */}
      <Reviews />

      {/* Restrained Editorial Footer */}
      <Footer />
    </main>
  );
}
