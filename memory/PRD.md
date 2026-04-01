# Sundays — Premium Cookie Brand Website
**Date Created:** 2025-01-01  
**Last Updated:** 2026-04-01

## Original Problem Statement
Create a high-end, single-page "Motion-First" website for "Sundays," a premium cookie brand.
- Aesthetic: Dark, moody, Forest Night Green (#1C3A2A) and Antique Gold (#C9A84C)
- Motion: Parallax scrolling, hero video loop, hover effects on cookie cards
- Structure: Intro, Process timeline, Shop, Footer
- Tone: Luxurious, artisanal, "worth the wait"

## User Inputs
- WhatsApp: +919177155540
- Instagram: https://www.instagram.com/sundays.hyd/
- 7 Cookie SKUs across 2 categories (Always Available + Exclusive)
- Pricing provided per cookie/pack
- Assorted box of 6 for ₹649
- 10% off for first-time social media tag
- All cookies contain eggs
- Delivery only, confirmation via WhatsApp

## Architecture
- **Frontend:** React SPA with Framer Motion
- **Backend:** FastAPI + MongoDB (orders)
- **Fonts:** Playfair Display (serif, headings) + Manrope (sans, body)
- **Colors:** #0A140E (bg), #1C3A2A (surface), #C9A84C (gold), #FDFBF7 (text)

## What's Been Implemented

### v1.0 — Initial MVP (2025-01-01)
- Static site with hero video, process timeline, 7 cookie cards
- WhatsApp click-to-chat ordering

### v2.0 — Full Ordering System (2026-04-01)
- **Shop restructured**: "Always Available" (Lazy Legend + Little Rebels) and "Exclusive Flavours" (5 cookies)
- **Pricing on all cards**: ₹89, ₹99, ₹109, ₹219/pack
- **Quantity selector** (1, 2, 4, 6) on all cookies except minis
- **Weight info**: 65g before baking (regular), 12g each (minis)
- **Egg allergen badge** on all cards
- **Cart system**: Add to cart, update qty, remove items, cart panel slide-over
- **Assorted Box builder**: Pick 6 from all regular flavors for ₹649
- **Order form**: Name, phone (+91 validation), delivery address, notes
- **Backend API**: POST /api/orders, GET /api/orders (MongoDB storage)
- **Order success overlay** with WhatsApp confirmation message
- **10% off promo section** for Instagram tagging @sundays.hyd
- **Instagram link** in navbar and footer
- **Delivery only** messaging throughout
- **Toast notifications** (Sonner) for cart actions

### Cookie SKUs
| Section | Name | Flavor | Price | Weight |
|---|---|---|---|---|
| Always Available | The Lazy Legend | Classic Choco Chip | ₹89/cookie | 65g |
| Always Available | Little Rebels | Mini Choco Bites | ₹219/pack | 12g each |
| Exclusive | The Dark Side | Oreo Cookies & Cream | ₹99/cookie | 65g |
| Exclusive | The After Hours | Double Dark & Sea Salt | ₹89/cookie | 65g |
| Exclusive | The Golden Affair | Lotus Biscoff | ₹109/cookie | 65g |
| Exclusive | The Midnight Meltdown | S'mores | ₹109/cookie | 65g |
| Exclusive | Nutella Lava | Hazelnut Chocolate | ₹109/cookie | 65g |

## Prioritized Backlog

### P0 — Core (DONE)
- [x] Hero video background
- [x] All 7 cookie cards with correct pricing
- [x] Process timeline
- [x] Animations (parallax, hover, scroll-triggered)
- [x] Cart + Order system
- [x] Assorted box of 6
- [x] Backend order API
- [x] Instagram integration
- [x] 10% promo section

### P1 — Enhancements
- [ ] Admin dashboard to view/manage orders
- [ ] Order status tracking
- [ ] Lightbox/modal for cookie detail view
- [ ] Scroll-based active section highlighting in navbar

### P2 — Future
- [ ] Payment integration (Razorpay)
- [ ] Gallery/testimonials section
- [ ] SEO meta tags
- [ ] Loyalty/repeat customer tracking

## Files
- `/app/frontend/src/App.js` — Main app with all sections
- `/app/frontend/src/components/CartPanel.jsx` — Cart slide panel
- `/app/frontend/src/components/OrderModal.jsx` — Order form modal
- `/app/frontend/src/App.css` — Typography + grain texture
- `/app/frontend/src/index.css` — Tailwind base
- `/app/backend/server.py` — FastAPI with order endpoints
