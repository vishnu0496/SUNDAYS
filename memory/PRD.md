# Sundays — Premium Cookie Brand Website
**Date Created:** 2025-01-01  
**Last Updated:** 2025-01-01

## Original Problem Statement
Create a high-end, single-page "Motion-First" website for "Sundays," a premium cookie brand.
- Aesthetic: Dark, moody, Forest Night Green (#1C3A2A) and Antique Gold (#C9A84C)
- Motion: Parallax scrolling, hero video loop, hover effects on cookie cards
- Structure: Intro, Process timeline, Shop, Footer
- Tone: Luxurious, artisanal, "worth the wait"

## User Inputs
- WhatsApp: +919177155540
- 7 Cookie SKUs across 5 categories
- High-quality chocolate chip cookie making video for hero

## Architecture
- **Frontend Only** — React SPA (no backend needed)
- **Animations:** framer-motion (v12)
- **Fonts:** Playfair Display (serif, headings) + Manrope (sans, body)
- **Colors:** #0A140E (bg), #1C3A2A (surface), #C9A84C (gold), #FDFBF7 (text)

## What's Been Implemented (v1.0 — 2025-01-01)

### Sections
1. **Navbar** — Fixed glassmorphism, SUNDAYS wordmark, gold "Order Now" WhatsApp CTA
2. **Hero** — Full-screen video loop (Mixkit chocolate chip cookies), parallax + fade-out on scroll
3. **Intro** — Philosophy copy, 4 animated stats (24h, 7, 0, ∞)
4. **Process** — 4 alternating image/text timeline steps (Browning → Mixing → 24hr Chilling → Baking)
5. **Shop** — 5 category groups, 7 cookie cards with hover zoom/brighten + gold WhatsApp order buttons
6. **Footer** — Massive Sundays typographic branding + WhatsApp CTA

### Cookie SKUs
| Category | Name | Flavor |
|---|---|---|
| The OG | The Lazy Legend | Classic Choco Chip |
| The Minis | Little Rebels | Mini Choco Bites |
| Rotation 1 | The Dark Side | Oreo Cookies & Cream |
| Rotation 1 | The After Hours | Double Dark & Sea Salt |
| Rotation 2 | The Golden Affair | Lotus Biscoff |
| Rotation 2 | The Midnight Meltdown | S'mores |
| Rich & Reckless | Nutella Lava | Hazelnut Chocolate |

### Motion Features
- ✅ Parallax scrolling (hero video + process images via `useScroll/useTransform`)
- ✅ Scroll-triggered fade + slide animations (`whileInView`)
- ✅ Hover zoom (scale 1.07) + brighten (brightness 1.18) on cookie card images
- ✅ Staggered entrance animations on stats and cards
- ✅ Bouncing scroll indicator chevron

## Prioritized Backlog

### P0 — Core (DONE)
- [x] Hero video background
- [x] All 7 cookie cards with WhatsApp links
- [x] Process timeline
- [x] Animations (parallax, hover, scroll-triggered)

### P1 — Enhancements
- [ ] Instagram link in footer (user to provide handle)
- [ ] Pricing on cookie cards (user to provide prices)
- [ ] Lightbox/modal for cookie detail view
- [ ] Menu navigation links in navbar (Process, Shop)
- [ ] Scroll-based active section highlighting

### P2 — Future
- [ ] Custom cookie order form
- [ ] Gallery/testimonials section
- [ ] SEO meta tags

## Files
- `/app/frontend/src/App.js` — All components
- `/app/frontend/src/App.css` — Typography + grain texture + scrollbar
- `/app/frontend/src/index.css` — Tailwind base + CSS variables
