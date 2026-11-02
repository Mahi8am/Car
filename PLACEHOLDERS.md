# PLACEHOLDERS.md — Demo Content Register

This register catalogues every piece of placeholder or demonstrative content across the site that the project owner should review, confirm, or replace with production assets before going live.

All copy is centralized in `content/*.ts` (Bangla-ready, plain strings, no hard-coded JSX strings).

---

## 1. Brand Identity & Copy
| Item | Current Value | Location | Owner Action Needed |
|---|---|---|---|
| **Brand Name** | `"Garir Mela"` | `content/site.ts` | Confirm spelling and trademark. |
| **Site Tagline** | `"Premium Automotive Marketplace"` | `content/site.ts` | Confirm marketing tagline. |
| **Hero Headline** | `"FIND IT. DRIVE IT. OWN IT."` | `content/hero.ts` | Refine or approve copy. |
| **Hero Supporting Line** | `"Verified cars from trusted sellers across Bangladesh..."` | `content/hero.ts` | Confirm marketplace value proposition. |
| **Trust Micro-line** | `"Verified sellers · Transparent pricing · Doorstep service"` | `content/hero.ts` | Confirm initial operational features. |
| **Statistics** | *None included* (Plan 2 explicitly forbids invented stats) | — | Provide verified inventory counts if desired later. |

---

## 2. Services Copy (The Four Doors)
| Item | Current Value | Location | Owner Action Needed |
|---|---|---|---|
| **01 Buy Description** | `"Browse new and reconditioned cars from trusted sellers..."` | `content/services.ts` | Review points and CTA label. |
| **02 Sell Description** | `"List your car in minutes and reach serious buyers."` | `content/services.ts` | Review listing claims. |
| **03 Rent Description** | `"Self-drive or with a driver, by the day, week or month."` | `content/services.ts` | Confirm rental model (self-drive vs driver). |
| **04 Home Service Scope** | `"Washing, detailing and maintenance, delivered to your doorstep."` | `content/services.ts` | Confirm doorstep service capabilities. |

---

## 3. Contact & Legal
| Item | Current Value | Location | Owner Action Needed |
|---|---|---|---|
| **Contact Email** | `hello@garirmela.com` | `content/site.ts` | Provide official corporate email address. |
| **Contact Phone** | `+880 1700-000000` | `content/site.ts` | Provide customer service / hotline number. |
| **Physical Address** | `Dhaka, Bangladesh` | `content/site.ts` | Provide office address (e.g. Gulshan/Baridhara/Tejgaon). |
| **Social Links** | Facebook, Instagram, YouTube (`#`) | `content/site.ts` | Provide active social page URLs. |
| **Legal Pages** | Terms & Conditions, Privacy Policy (`#`) | `content/site.ts` | Link to published legal policies when ready. |

---

## 4. Visual Assets & Trademarks
| Item | Status / Source | Location | Owner Action Needed |
|---|---|---|---|
| **Hero Neon Car** | 4 candidates evaluated (`_qa/hero-candidates.png`) | `public/images/hero/` | **Pick preferred candidate (Candidate A recommended)** for M3 Neon Stage. |
| **01 Buy Image** | Stefan Rodriguez (Unsplash Commercial, 80 KB WebP) | `public/images/services/service-buy.webp` | Review or supply proprietary marketplace photography. |
| **02 Sell Image** | Erik Mclean (Unsplash Commercial, 138 KB WebP) | `public/images/services/service-sell.webp` | Review or supply proprietary handover photography. |
| **03 Rent Image** | Luca Bravo (Unsplash Commercial, 182 KB WebP) | `public/images/services/service-rent.webp` | Review or supply proprietary rental photography. |
| **04 Home Service Image** | Jan Kopřiva (Unsplash Commercial, 150 KB WebP) | `public/images/services/service-home-service.webp` | Review or supply proprietary detailing photography. |
| **Brand Logos (12)** | Monochrome vector marks | `public/brands/` | Drop in custom logo assets to `_source/brands/` if preferred. |
| **Trademark Notice** | Documented in Section 4.1 | `content/brands.ts` | Retain disclaimer for fair-use identification. |
