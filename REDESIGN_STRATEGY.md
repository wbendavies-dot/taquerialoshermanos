# Taqueria Los Hermanos — Prioritized Redesign Strategy

Built from `SITE_AUDIT.md` (current-state findings) and `RESEARCH_REPORT.md` / `FEATURE_LIST.md` (what drives revenue). Ordered by expected business impact per unit of effort.

**Strategic frame:** The business fundamentals are already strong — 5 locations, 25 years, Toast ordering in place, catering with real pricing. The website is the bottleneck, not the business. The redesign's job is to stop leaking the demand that already exists (menu dead-ends, 72-hour catering responses, zero local SEO for 5 cities) before chasing new demand.

---

## Phase 0 — Same-week fixes (do immediately, even on the current Wix site)

These don't wait for the redesign:

1. **Fix title tags**: replace "| United States" with city-keyword titles on every page. (~10 minutes, affects every Google result the site appears in.)
2. **Rename `/copy-of-menu` → `/catering`** with a redirect.
3. **Change the catering response promise** from "within 72 hours" to "within 1 business hour during opening hours" — and set up phone/email alerts so it's true. Speed-to-lead is the single biggest catering conversion factor; this is a process fix, not a design fix.
4. **Add event date, guest count, and event type fields** to the existing catering form.
5. **Create catering@taquerialoshermanos.com** (domain email) to replace the Gmail address.

## Phase 1 — The Menu Engine (weeks 1–4)

*The menu is why 80% of visitors come, and it currently has no prices and no path to ordering.*

1. **One unified, priced, photographed HTML menu.** Merge `/menu` and `/menu-1` into a single mobile-first menu: tappable category blocks, photo + description + price per item, dietary/spice tags. If prices genuinely differ by location, add a location selector that persists — never "(prices vary)" as a substitute for prices.
2. **Wire the menu to Toast.** Every category (and ideally item) deep-links into the matching section of the visitor's chosen location's Toast menu. The menu becomes the top of the ordering funnel instead of a dead end.
3. **Conversion hero**: appetizing close-up (or short video loop of the trompo/plancha), three CTAs — **Order Online · View Menu · Catering** — plus a one-tap location/hours strip. Retire "flavor town."
4. **Sticky mobile bottom bar**: Order · Call · Directions, present on every page.
5. **Performance budget**: < 2s mobile load — WebP images, lazy loading, no carousels.

**Expected impact:** This phase alone addresses the +58% (HTML/orderable menu), +25% (photo menu), +34% (CTA placement), and +42% (mobile optimization) findings from the research.

## Phase 2 — The Catering Lead Machine (weeks 3–6, overlaps Phase 1)

*Highest order values; the pricing transparency advantage already exists — package it.*

1. **Rebuilt `/catering` page**: real event photography (shoot one taco-bar setup — half a day's work), the 5 menus presented as cards with per-person pricing and "Taco Bar for 20 from $299"-style anchors, dietary accommodations stated, policies published (deposit, delivery, setup, cancellation, 48-hour notice).
2. **Multi-step inquiry form**: Step 1 event type + date + guest count (low commitment) → Step 2 contact details. Auto-confirmation email immediately; lead alert to Miguel/Christian's phones; every lead logged to a sheet/CRM with source, value, and outcome.
3. **Catering social proof block**: testimonials from offices/schools/weddings/quinceañeras; "trusted by" client types; photos from real events.
4. **Catering follow-up sequence** (3 emails: welcome → menu highlights → testimonials) for leads that don't book within 48 hours.
5. **Track the numbers**: inquiries/month, response time, inquiry→booking rate, average catering order value.

## Phase 3 — Own the 5 Local Markets (weeks 5–8)

*Five locations and zero city pages is the biggest pure-SEO miss on the site.*

1. **Five location pages** (`/locations/tucker`, `/locations/lilburn`, …): address, hours, phone (`tel:` links), embedded map, interior/food photos, that location's Toast ordering link, city-keyword copy.
2. **Structured data**: Restaurant + LocalBusiness schema per location, Menu schema on the menu, consistent NAP everywhere.
3. **Google Business Profile alignment**: each GBP points its website/menu/ordering links to the matching location page, priced menu, and Toast deep link; catering listed as a service on all 5 profiles.
4. **Live Google reviews on site**: rating badges per location + rotating recent reviews on the homepage. Replaces the 3 static testimonials with thousands of real ones.

## Phase 4 — Capture & Retention (weeks 7–10)

1. **Email/SMS capture with a first-order incentive** (e.g., free queso or 10% off first online order), timed pop-up + inline footer signup. Target: build the re-marketable database (the 5–10x growth channel).
2. **Brand/story page**: Miguel, Roel, and Raul; 2001 → today; coastal southwestern Mexico recipes; "100% fresh meat" substantiated with kitchen photos. "Since 2001" badge in the header. This is the content that makes the brand un-copyable.
3. **Specials & events module**: weekly specials, seasonal items, catering-season pushes (graduation, holidays, Super Bowl) — doubles as the email-list content engine.
4. **Promote gift cards** out of their buried spot (header link + holiday pushes, cross-sold on catering confirmations).

## Phase 5 — Optimize (ongoing)

1. **Toast checkout upsells** configured (chips+queso, churros, drinks) — +15–25% AOV potential.
2. **GA4 + funnel tracking**: menu → location select → Toast handoff → order; catering form step drop-off; per-location conversion.
3. **A/B test** hero CTAs, incentive offers, menu layouts.
4. **Quarterly review** of: direct orders/month, catering inquiries & close rate, email list growth, map-pack rankings per city.

---

## Platform recommendation

The current Wix site can absorb Phase 0, but Phases 1–3 (unified priced menu with Toast deep links, multi-step forms, per-location schema) fight against Wix's constraints. Two viable paths:

- **Pragmatic:** Rebuild on a restaurant-specific platform (BentoBox, Owner.com) — fastest route to the conversion patterns, less control.
- **Premium (recommended for this project's goals):** Custom build (e.g., Next.js/Astro, statically rendered for the <2s budget) with Toast deep-link integration, full schema control, and a CMS the owners can edit menus/specials in. This is the only path that delivers everything in Phases 1–5 without platform compromises.

## Success metrics (define before launch)

| Metric | Baseline to capture now | Target (6 months) |
|---|---|---|
| Direct (Toast) orders/month | from Toast reports | +40% |
| Catering inquiries/month | from email history | 3–5x |
| Catering response time | ~72 hrs (stated) | < 1 business hour |
| Email/SMS list size | 0 | 5,000+ |
| Map-pack rankings | check per city | top 3 in all 5 cities |
| Mobile load time | measure current | < 2 seconds |
