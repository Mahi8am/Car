# REFERENCE_NOTES.md — Analysis of garirmela.com

Analysis of the live reference platform [garirmela.com](https://www.garirmela.com/) conducted for Plan2 Milestone 1.

---

## 1. Entry Points: Buy / Sell / Rent / Home Service
- **Order & Categorization on garirmela.com**:
  1. **Sell Your Car** (`/dashboard/postads`)
  2. **Buy Dream Car** (`/search`)
  3. **Home Service** (`/carwash` — specifically door-step car wash, detailing, and routine care)
  4. **Rent A Car** (`/rentcar`)
- **Observation**:
  - The live site places equal emphasis on all four pillars under a "What We Do?" section.
  - "Home Service" in Bangladesh primarily addresses doorstep auto-detailing, waterless/foam washing, and periodic technician inspection due to Dhaka's dense traffic where taking cars to garages is time-consuming.
  - "Rent A Car" caters to intra-city and inter-city chauffeurs, wedding/event rentals, and airport pickups.

---

## 2. Popular Brands Presentation
- **Brands on garirmela.com**:
  Toyota, Honda, Nissan, Hyundai, Mercedes-Benz, Kia, Mazda, Mitsubishi.
- **Market Reality**:
  - Japanese reconditioned imports (Toyota, Honda, Nissan, Mitsubishi) account for over 80% of private vehicle transactions in Bangladesh.
  - Toyota is by far the highest volume marque (Corolla, Premio, Allion, Noah, Aqua, CH-R, Prado).
  - European luxury (Mercedes-Benz, BMW, Audi) occupies the high-end tier in Dhaka's Gulshan/Banani hubs.
- **Presentation**:
  - The live site uses standard cards with brand logos linking to filtered search views (`/brand/toyota`, etc.).

---

## 3. Information Hierarchy & Market Logic
1. **Header / Nav**: Clean entry points (Find Your Car, Home Service, Contact, Log In / Sign Up).
2. **Value Statement**: *"An online automotive marketplace designed to revolutionize the car buying, selling, and maintenance experience in Bangladesh."*
3. **Services Pillar**: Direct action shortcuts for Buy, Sell, Rent, and Home Service.
4. **Popular Brands**: Marquee discovery grid.
5. **Featured Listings**: Car showcase with condition, model year, and price.
6. **Footer**: 4-column breakdown (Services, Top Brands, Quick Links, Copyright).

---

## 4. What We Adopted vs. What We Deliberately Did Differently

| Dimension | garirmela.com (Reference) | Our Implementation (Plan 2) | Rationale |
|---|---|---|---|
| **Pillars / Offerings** | Buy, Sell, Rent, Home Service | **01 Buy · 02 Sell · 03 Rent · 04 Home Service** | Exact market fit; standardized in editorial 01–04 sequence. |
| **Home Service Scope** | Doorstep car wash & maintenance | **Wash, detailing, inspection, routine servicing** | Matches real consumer need in urban Bangladesh. |
| **Visual Architecture** | Generic white cards with rounded corners and dropshadows | **Editorial "Four Doors" image-led panels with sharp corners and flex expansion** | Complies with Plan 1/2 design language: art-directed, cinematic, zero generic card grids. |
| **Brands Presentation** | Standard clickable image cards | **Hairline grid logo wall (6×2 desktop, 4×3 tablet, 3×4 mobile) on `--bone`** | Premium editorial texture; rhythmic shift from dark to light background echoing the hero bone disc. |
| **Typography** | Generic system sans-serif | **Barlow Condensed (600–700 uppercase) + Manrope (300–500)** | Authoritative editorial tone. |
| **Color System** | Blue / multi-color accents | **Strict token palette: `--ink-950`, `--bone`, `--charcoal`, `--red` accent** | Premium automotive luxury atmosphere without garish gradients. |
