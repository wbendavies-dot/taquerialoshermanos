# Taqueria Los Hermanos — Website Design Specification

**Brief:** Top-tier agency engagement, $50K budget. Design the ideal website for a 5-location, 25-year-old family taqueria in metro Atlanta. Every design decision below is tied to the conversion research (`RESEARCH_REPORT.md`) and the current-site audit (`SITE_AUDIT.md`).

**Design thesis:** *Chain-grade ordering UX wrapped in a family story no chain can fake.* The site has exactly three jobs — take orders, book catering, and make five cities feel like their neighborhood taqueria. Everything that doesn't serve one of those jobs gets cut.

---

## 0. Brand Foundation

A $50K engagement starts with brand direction because every layout below depends on it.

| Element | Direction | Why |
|---|---|---|
| **Name treatment** | "Los Hermanos" as the brand mark; "Taqueria Los Hermanos · Est. 2001" as the lockup | "The Brothers" is the story. The Est. 2001 date is a trust signal competitors can't fake — wear it permanently. |
| **Palette** | Warm cream base; terra cotta primary; deep adobo red for CTAs; charcoal text; gold accents | Research: terra cotta/gold/deep red signal Mexican authenticity without sombrero clichés. One red reserved exclusively for CTAs creates instant visual hierarchy (Paytronix principle #4). |
| **Typography** | Bold display face with hand-painted character for headlines (à la mercado signage); clean humanist sans for UI, menus, and prices | Hand-crafted display = family-made food. Sans for anything a hungry person reads at 6pm on a phone — prices and buttons must never be decorative. |
| **Photography** | Three mandatory shoots within the budget: (1) menu items — overhead + 45°, natural light, real plates; (2) the brothers & kitchen — hands pressing tortillas, the trompo, Miguel/Roel/Raul together; (3) one staged catering taco-bar event | 84% of guests look at photos before ordering; catering pages without real event photos don't convert. Stock photography is forbidden — 45% of visitors look for food photos first and fakes destroy trust. |
| **Voice** | Warm, first-person-plural, bilingual accents ("Nuestra historia," "Pedir ahora" alongside English) | A 25-year family business should sound like one. Retires "flavor town." |
| **Motion** | Micro-animations only: button feedback, cart confirmations, gentle scroll reveals. Nothing that costs load time. | Perceived premium without breaking the <2s mobile budget (every extra second = −7% orders). |

---

## 1. Sitemap

```
taquerialoshermanos.com
│
├── /                        Homepage — route traffic to Order / Menu / Catering in <5 seconds
├── /menu                    THE core experience — priced, photographed, wired to Toast
├── /catering                Lead-generation machine (own funnel, own photography)
│   └── /catering/gracias    Post-inquiry page — sets the 1-hour response expectation
├── /locations               Index: map + 5 cards with live open/closed status
│   ├── /locations/tucker            ┐
│   ├── /locations/lilburn           │  One template, 5 instances.
│   ├── /locations/suwanee           │  Each = a local SEO landing page
│   ├── /locations/lawrenceville     │  + that location's Toast link
│   └── /locations/dunwoody          ┘
├── /nuestra-historia        About — the brothers, 2001 → today, the food philosophy
├── /especiales              Specials & seasonal items — email-list content engine
├── /gift-cards              Currently buried on the order page; gets its own URL
│
├── [Order Online]           Not a page — a location-picker modal that deep-links
│                            to the right Toast menu (remembers your location)
│
└── Utility: /privacy · /accessibility · 404 (with menu + order CTAs — even errors sell)
```

**Why this structure:**
- **Flat, 7 primary destinations.** Current site hides pages behind "More…". Every money page is one tap from anywhere.
- **`/catering` and `/menu` are clean, keyword-bearing slugs** replacing `/copy-of-menu` and the `/menu` + `/menu-1` split. 301-redirect the old URLs.
- **5 location pages are the SEO spine.** Each city gets its own indexed page with LocalBusiness schema — the difference between competing in 1 map pack and 5.
- **"Order Online" is deliberately not a page.** Pages add a click. A modal (location picker → Toast deep link) keeps the path to checkout at minimum steps from any screen, and remembers the choice for next time.
- **Spanish-named story/specials pages** (`/nuestra-historia`, `/especiales`) are a deliberate brand voice decision — navigation labels appear in English alongside.

---

## 2. Homepage Layout

The homepage is a router, not a brochure. A visitor decides in seconds; 80% want the menu, the rest mostly want hours, directions, or catering. Every section either routes or reassures.

```
┌─────────────────────────────────────────────────────┐
│ ① ANNOUNCEMENT BAR  "Free queso with your first     │
│    online order → code HERMANOS"                     │
├─────────────────────────────────────────────────────┤
│ ② HEADER   [LOGO]  Menu Catering Locations Story    │
│                              [● ORDER ONLINE]  ←red  │
├─────────────────────────────────────────────────────┤
│ ③ HERO                                              │
│    Full-bleed: 6-second loop — hands pressing       │
│    tortillas / cesina hitting the plancha            │
│                                                      │
│    "Three brothers. One kitchen. Since 2001."       │
│    [ORDER ONLINE]  [VIEW MENU]  [CATERING]          │
│    ─ Tucker · Lilburn · Suwanee · Lawrenceville ·   │
│      Dunwoody — Open today 11–9  ▸ Find yours       │
├─────────────────────────────────────────────────────┤
│ ④ TRUST BAR  ★4.x from N,NNN Google reviews ·      │
│    Family-owned since 2001 · 100% fresh meat, daily │
├─────────────────────────────────────────────────────┤
│ ⑤ FAVORITES — "Lo más pedido"                       │
│   ┌──────┐ ┌──────┐ ┌──────┐                        │
│   │photo │ │photo │ │photo │   6 bestsellers:       │
│   │name  │ │name  │ │name  │   photo, price,        │
│   │$x.xx │ │$x.xx │ │$x.xx │   [Order this →]       │
│   └──────┘ └──────┘ └──────┘   [Full menu →]        │
├─────────────────────────────────────────────────────┤
│ ⑥ STORY TEASER                                      │
│   [Photo: Miguel, Roel & Raul]                       │
│   "In 2001, three brothers from Mexico's            │
│    southwestern coast opened one taqueria…"          │
│   [Nuestra historia →]                               │
├─────────────────────────────────────────────────────┤
│ ⑦ CATERING BAND  (full-width, taco-bar photo)       │
│   "Taco bar for 20 — from $299."                     │
│   Offices · weddings · quinceañeras                  │
│   [Get a quote — we reply within the hour]           │
├─────────────────────────────────────────────────────┤
│ ⑧ LOCATIONS STRIP — 5 cards                         │
│   [Tucker ● Open] [Lilburn ● Open] [Suwanee…]       │
│   each: address · ☎ · Directions · Order             │
├─────────────────────────────────────────────────────┤
│ ⑨ REVIEWS — rotating live Google reviews,           │
│    filterable by location                            │
├─────────────────────────────────────────────────────┤
│ ⑩ INSTAGRAM GRID — latest 6, tagged real photos     │
├─────────────────────────────────────────────────────┤
│ ⑪ EMAIL/SMS BAND  "La familia list — first-order    │
│    queso + weekly specials"  [email] [Join]          │
├─────────────────────────────────────────────────────┤
│ ⑫ FOOTER — 5× NAP + hours (schema-marked),          │
│    nav, gift cards, social, catering email,          │
│    privacy/accessibility                             │
└─────────────────────────────────────────────────────┘
```

**Section rationale:**

1. **Announcement bar** — the first-order incentive doubles as list-builder and promo surface (Talkin' Tacos pattern: visible header promos + capture → 40K contacts, $120K/month direct). Dismissible, cookie-remembered.
2. **Header** — five nav items max (audit: "More…" overflow hides pages). The red Order button is the only red element on screen and is sticky on scroll — optimized CTA placement is worth +34% conversion.
3. **Hero** — answers "is this my kind of place, and what do I do next?" in one screen. Video loop earns +35% time-on-site; the headline replaces "flavor town" with the actual moat (brothers, 2001); the location/hours strip kills the #1 mobile question without a tap. Three CTAs map to the site's three jobs.
4. **Trust bar** — 74% of guests check reviews/offers on the site. Aggregated live Google rating across 5 locations is thousands of reviews the current site wastes. "Since 2001" and "100% fresh meat" are existing claims, finally merchandised.
5. **Favorites** — the menu is why 80% came; give the impatient majority six photographed, priced bestsellers with direct Toast deep links. "Popular" social proof also simplifies decisions (Paytronix #13).
6. **Story teaser** — differentiation in 2 sentences. Converts first-timers into "regulars of a family business" rather than "users of a taco website." Full story lives on its own page so the homepage stays fast.
7. **Catering band** — the highest-AOV channel gets homepage real estate with a price anchor ("from $299") and the response-time promise as the CTA copy. Price anchoring pre-qualifies; speed promise differentiates (competitors say nothing; the old site said 72 hours).
8. **Locations strip** — live open/closed status answers the time-sensitive question; per-card Order buttons start the funnel from geography (89% of mobile restaurant searchers act within 24 hours).
9. **Reviews** — full social-proof section, location-filterable so a Suwanee visitor sees Suwanee praise.
10. **Instagram grid** — fresh content with zero maintenance; UGC authenticity (Tiki Chick pattern).
11. **Email band** — second capture surface for pop-up dismissers. Direct-database restaurants grow 5–10x faster.
12. **Footer** — full NAP × 5 with schema markup makes every page a local SEO asset; gift cards get permanent placement instead of being buried.

---

## 3. Catering Page Layout (`/catering`)

Designed as a standalone landing page — it must work for cold traffic from ads and "mexican catering atlanta" searches, not just homepage clicks. The form is reachable from every scroll position.

```
┌─────────────────────────────────────────────────────┐
│ ① HERO — real taco-bar event photo (from the shoot) │
│   "Catering by Los Hermanos"                         │
│   "Taco bars, fajitas y más — for 10 to 500 guests" │
│   [GET A QUOTE]      ◂ jumps to form                 │
│   ✓ We reply within 1 business hour                  │
├─────────────────────────────────────────────────────┤
│ ② TRUST STRIP                                       │
│   25 years · N,NNN events · ★4.x · offices,         │
│   weddings & quinceañeras across metro Atlanta       │
├─────────────────────────────────────────────────────┤
│ ③ HOW IT WORKS — 3 steps                            │
│   1 Tell us about your event (2 minutes)             │
│   2 We reply within the hour with a quote            │
│   3 We cook, deliver & set up                        │
├─────────────────────────────────────────────────────┤
│ ④ PACKAGES — 5 menu cards (photo each)              │
│   ┌─────────────┐ ┌─────────────┐                    │
│   │ TACO BAR    │ │ FAJITA BAR  │                    │
│   │ $14.95/pp   │ │ from        │  + Nacho Bar,      │
│   │ "20 guests  │ │ $13.95/pp   │  Quesadilla Bar,   │
│   │  from $299" │ │             │  À la carte        │
│   │ [included…] │ │ [included…] │                    │
│   │ [Quote →]   │ │ [Quote →]   │                    │
│   └─────────────┘ └─────────────┘                    │
│   Desserts & drinks add-ons row (tres leches,        │
│   churros, aguas)                                    │
├─────────────────────────────────────────────────────┤
│ ⑤ EVENT GALLERY — 6–8 real setup photos             │
├─────────────────────────────────────────────────────┤
│ ⑥ TESTIMONIALS — by event type:                     │
│   office lunch · wedding · quinceañera · school      │
├─────────────────────────────────────────────────────┤
│ ⑦ FAQ / POLICIES (accordion)                        │
│   48-hr notice · 10-person minimum · delivery zones  │
│   & fees · setup · deposits & cancellation ·         │
│   vegetarian/GF accommodations                       │
├─────────────────────────────────────────────────────┤
│ ⑧ INQUIRY FORM — multi-step                         │
│   Step 1: Event type ▾ · Date 📅 · Guest count ▾    │
│           [Continue →]                               │
│   Step 2: Name · Email · Phone · Notes               │
│           [Get my quote]                             │
│   "You'll hear from us within 1 business hour."      │
├─────────────────────────────────────────────────────┤
│   (mobile: sticky [GET A QUOTE] button throughout)   │
└─────────────────────────────────────────────────────┘
   ↓ submits to
/catering/gracias — confirmation page:
   "¡Gracias, {name}! Miguel or Christian will call you
   within the hour (Mon–Sat, 11–9)." + what-happens-next
   + browse-the-menu links + auto-email confirmation
```

**Section rationale:**

1. **Hero** — CTA above the fold within 2 seconds (research requirement). The 1-hour reply promise is *in the hero* because speed-to-lead is the #1 catering conversion factor and no competitor promises it. "10 to 500 guests" widens the perceived capability.
2. **Trust strip** — corporate planners and quinceañera moms both need "these people have done this before" answered immediately.
3. **How it works** — reduces perceived effort; "2 minutes" lowers form anxiety before the form is ever seen.
4. **Packages** — the audit's key finding: pricing transparency already exists, it just isn't merchandised. Cards with photos + per-person prices + a total-cost anchor ("20 guests from $299") let buyers self-qualify and arrive pre-sold. Each card's CTA pre-selects that package in the form.
5. **Event gallery** — real event photography is the single most-cited catering-page converter in the research. One staged shoot covers this permanently.
6. **Testimonials by event type** — a wedding planner needs wedding proof, an office manager needs lunch-drop-off proof. Segmented proof converts where generic praise doesn't.
7. **FAQ/policies** — publishing deposits, delivery fees, and dietary accommodations removes the uncertainty that kills high-value bookings (current site: none of this exists). Also resolves the 72-hour/48-hour contradiction.
8. **Multi-step form** — Step 1 asks zero personal info (low commitment, high completion); contact details come only after psychological investment. Fields match what the kitchen actually needs to quote, so the 1-hour reply is *possible*. Auto-confirmation email + SMS alert to the catering phones on submit; every lead logged with source and value.

---

## 4. About Page Layout (`/nuestra-historia`)

The conversion pages sell food; this page sells *the family* — it's what makes everything else un-copyable. It is also deliberately the most "premium-feeling" page: long-scroll, photography-led, minimal UI.

```
┌─────────────────────────────────────────────────────┐
│ ① HERO — full-bleed portrait: Miguel, Roel & Raul   │
│   in the kitchen, aprons on                          │
│   "Nuestra Historia"                                 │
│   "Three brothers. One kitchen. Twenty-five years."  │
├─────────────────────────────────────────────────────┤
│ ② ORIGIN — short essay (150–200 words)              │
│   The southwestern coast of Mexico → Atlanta →       │
│   the first taqueria in 2001. Family recipes,        │
│   written down nowhere, taught by hand.              │
├─────────────────────────────────────────────────────┤
│ ③ TIMELINE — horizontal scroll                      │
│   2001 first location → … → today: 5 taquerias       │
│   across metro Atlanta (photo per milestone)         │
├─────────────────────────────────────────────────────┤
│ ④ THE FOOD PHILOSOPHY                               │
│   "100% fresh meat, prepped every morning."          │
│   Kitchen photography: the trompo, the comal,        │
│   hands making salsa. Substantiates the claim        │
│   the old site only asserted.                        │
├─────────────────────────────────────────────────────┤
│ ⑤ MEET THE BROTHERS — 3 cards                       │
│   Miguel · Roel · Raul — portrait, one-line role,    │
│   one personal detail each (favorite dish?)          │
├─────────────────────────────────────────────────────┤
│ ⑥ COMMUNITY — 25 years in Atlanta:                  │
│   the neighborhoods, the regulars, schools &         │
│   churches catered. Local roots = local loyalty.     │
├─────────────────────────────────────────────────────┤
│ ⑦ CTA BAND — "Come taste the story."                │
│   [Find your location]  [Order online]               │
└─────────────────────────────────────────────────────┘
```

**Section rationale:**

1. **Hero** — faces, not food. Every other page has food; this page's job is the people. Named, real, photographed founders are a trust signal chains structurally cannot produce.
2. **Origin essay** — short by design. The Tacombi pattern: heritage told confidently, not exhaustively.
3. **Timeline** — 2001→2026 growth proves quality without bragging: five locations exist *because* the food is good. Each milestone is implicit social proof.
4. **Food philosophy** — converts the bare "100% FRESH MEAT" claim into evidence (photos of morning prep). Substantiated claims build trust; asserted ones don't.
5. **Brothers' cards** — "Los Hermanos" stops being a name and becomes three people. Personal details make regulars feel like insiders.
6. **Community section** — feeds local SEO (city names in indexable, genuine copy) and feeds catering (schools/churches/offices mentioned = catering proof).
7. **CTA band** — every page ends with a next step; story-moved visitors are warm traffic, don't strand them.

---

## 5. Locations Experience (`/locations` + 5 city pages)

### Index page

```
┌─────────────────────────────────────────────────────┐
│ "Five taquerias across metro Atlanta"                │
│ ┌─────────────────────────────────────┐              │
│ │  MAP — 5 pins, tap = card highlight │              │
│ └─────────────────────────────────────┘              │
│ [Use my location] ◂ sorts cards by distance          │
│                                                      │
│ ┌──────────────────────────────────────────┐         │
│ │ TUCKER            ● Open until 9:00      │         │
│ │ 123 Main St · ☎ tap-to-call              │         │
│ │ [Directions] [View page] [ORDER →]       │         │
│ └──────────────────────────────────────────┘         │
│  …× 5 (Lilburn, Suwanee, Lawrenceville, Dunwoody)   │
└─────────────────────────────────────────────────────┘
```

### Location page template (×5)

```
┌─────────────────────────────────────────────────────┐
│ ① HERO — exterior/interior photo of THIS location   │
│   "Los Hermanos — Tucker"                            │
│   ● Open now · closes 9:00                           │
│   [ORDER FROM TUCKER]  [Directions]  [☎ Call]       │
├─────────────────────────────────────────────────────┤
│ ② ESSENTIALS — address (copyable) · full hours      │
│   table · phone · parking note · embedded map        │
├─────────────────────────────────────────────────────┤
│ ③ PHOTOS — 4–6: dining room, counter, plates        │
├─────────────────────────────────────────────────────┤
│ ④ REVIEWS — live Google reviews for THIS location   │
├─────────────────────────────────────────────────────┤
│ ⑤ LOCAL COPY — 80–120 genuine words: neighborhood,  │
│   nearby landmarks, "serving Tucker since 20XX"      │
├─────────────────────────────────────────────────────┤
│ ⑥ MENU + CATERING cross-links                       │
│   "Catering in Tucker? We deliver. →"                │
└─────────────────────────────────────────────────────┘
+ Restaurant/LocalBusiness schema: NAP, geo, hours,
  menu URL, this location's Toast ordering URL
```

**Rationale:**

- **Index = decision tool**: map + distance sort + open-now status answers "which one is mine and is it open?" — the entire job. Order buttons on cards start the funnel without visiting the detail page.
- **Detail pages are the local SEO spine.** Each is the landing page for "mexican restaurant tucker," its city's map-pack listing, and its Google Business Profile's website link. Genuine local copy (⑤) plus per-location schema is what the current single-page site structurally cannot do.
- **Hero CTA is location-bound** ("Order from Tucker") — by the time someone is on this page, the location decision is made; don't make them re-choose in the ordering modal.
- **Per-location reviews** (④) — proof specific to the door they'll walk through.
- **Each page feeds GBP**: profile website field → this page; menu field → /menu; ordering field → this location's Toast deep link. Consistent NAP everywhere.

---

## 6. The Menu Experience (`/menu`)

The single most important screen on the site — 80% of visitors come for it. Designed as an interactive product, not a page.

```
┌─────────────────────────────────────────────────────┐
│ ① LOCATION CONTEXT (first visit: chip prompt)       │
│   "Prices shown for: Tucker ▾"   ◂ persists,        │
│   powers correct prices + correct Toast deep links   │
├─────────────────────────────────────────────────────┤
│ ② STICKY CATEGORY NAV (horizontal scroll chips)     │
│   Tacos · Burritos · Enchiladas · Nachos ·           │
│   Especialidades · Soups · Desserts · Drinks         │
│   ── plus 🔍 search and ▾ filters:                  │
│      Vegetarian · Gluten-free · 🌶 spice            │
├─────────────────────────────────────────────────────┤
│ ③ ITEM CARDS (2-col desktop / 1-col mobile)         │
│   ┌──────────────────────────────────────┐           │
│   │ [photo]  Cesina Taco        $4.25    │           │
│   │ ★ Lo más pedido                       │           │
│   │ Salted beef, onion, cilantro,         │           │
│   │ handmade tortilla        🌶🌶 GF      │           │
│   │              [Add to order →]         │           │
│   └──────────────────────────────────────┘           │
│   "Add to order" → deep link into this item/         │
│   category on the selected location's Toast menu     │
├─────────────────────────────────────────────────────┤
│ ④ CATERING INTERRUPT — one banner card after the    │
│   3rd category: "Feeding a crowd? Taco bar from      │
│   $299 →"                                            │
├─────────────────────────────────────────────────────┤
│ ⑤ STICKY FOOTER CTA (mobile)                        │
│   [ORDER FROM TUCKER →]                              │
└─────────────────────────────────────────────────────┘
```

**Design decisions and why:**

1. **Location context first** — kills the "(PRICES VARY BY LOCATION)" cop-out. One light decision up front (remembered in localStorage, defaulted by geolocation consent) buys correct prices and one-tap ordering everywhere. Never show a price-less menu: 80% come for the menu and price is half of what "the menu" means.
2. **Sticky chips + search + dietary filters** — progressive disclosure (categories → items) keeps cognitive load down; search/filter serves the "does it have a GF option for my friend" visitor who currently bounces. Searchable HTML menus drive up to +58% more completed orders vs. static formats.
3. **Item cards** — photo, price, description, tags on every card (photo menus +25% conversion; 84% look at photos first). "Lo más pedido" badges = social proof at the decision point. The **Add to order** button makes the menu the top of the ordering funnel instead of a dead-end brochure — the audit's single biggest conversion gap.
4. **Catering interrupt** — menu readers include office managers planning lunch. One contextual cross-sell, placed after engagement is proven, not before.
5. **Sticky mobile CTA** — the order action never scrolls away (Paytronix: keep primary actions visible while scrolling).
6. **Performance contract**: images lazy-loaded WebP/AVIF, menu data statically rendered (CMS-editable by the brothers), no client-side framework bloat. <2s on 4G or it fails the spec.
7. **Schema**: full Menu/MenuItem markup so dishes can surface in search rich results — currently impossible on the Wix site.

---

## 7. Mobile Navigation

83% of restaurant searches are mobile; the mobile frame IS the site. Design for one thumb, standing in line, 6pm.

```
┌─────────────────────────────┐
│ ⊕ Free queso — 1st order ✕ │ ◂ announcement (dismissible)
├─────────────────────────────┤
│ [☰]   LOS HERMANOS   [ORDER]│ ◂ ① sticky top bar
├─────────────────────────────┤
│                             │
│        page content         │
│                             │
├─────────────────────────────┤
│  Menu  │ Order │ Call │ Map │ ◂ ② sticky bottom bar
└─────────────────────────────┘   (thumb zone)

☰ opens ③ full-screen drawer:
┌─────────────────────────────┐
│ ✕                           │
│  ORDER ONLINE        ◂ red  │
│  ─────────────              │
│  Menu                       │
│  Catering                   │
│  Locations                  │
│  Nuestra Historia           │
│  Especiales                 │
│  Gift Cards                 │
│  ─────────────              │
│  ● Tucker — open til 9 ▾    │ ◂ your location,
│  ☎ (770) xxx-xxxx           │   tap to switch
│  [IG] [FB]                  │
└─────────────────────────────┘
```

**Design decisions and why:**

1. **Sticky top bar** — logo home-link, hamburger, and a permanent red ORDER button. The single highest-value CTA never leaves the screen (+34% conversion for optimized placement). 48px tap targets minimum.
2. **Sticky bottom bar — the workhorse.** Four actions in the natural thumb zone (research: primary actions belong in the lower two-thirds of the screen): **Menu** (what 80% want), **Order** (the conversion), **Call** (`tel:` to the remembered location), **Map** (native directions). 89% of mobile restaurant searchers call or visit within 24 hours — Call and Map are conversions, not conveniences. Bar hides on scroll-down inside the menu (reading mode), reappears on scroll-up.
3. **Full-screen drawer, not a dropdown** — every destination as a large, full-width tap target; ORDER repeated at top in red for muscle memory. The drawer footer carries the remembered location with open-status and one-tap call/switch, so "is my Lilburn one open?" is answerable from any page in two taps.
4. **No "More…", ever.** Seven destinations, all visible, all reachable in ≤2 taps from anywhere.
5. **Catering's mobile path**: the sticky GET A QUOTE button on /catering substitutes for the bottom bar there — on the page whose conversion is a form, the bar's slot serves the form.

---

## Budget Allocation (how the $50K earns its keep)

| Workstream | Est. | Justification |
|---|---|---|
| Brand direction, design system, all 7 page designs | $12K | Everything above |
| Photography (menu shoot ×~40 dishes, brothers/kitchen, staged catering event) | $7K | The highest-ROI line item: powers menu (+25%), catering, story, and 12 months of social/email content |
| Build (static-rendered front end, CMS for menus/specials/hours, Toast deep-link integration, location-picker modal) | $18K | The <2s, schema-complete, owner-editable engine Wix can't be |
| Catering funnel (multi-step form, auto-confirmation, lead alerts, CRM logging, nurture emails) | $5K | Protects the highest-AOV channel |
| Local SEO (5 location pages' content, schema, GBP alignment, redirects from old URLs) | $4K | 5 map packs |
| Analytics (GA4 funnels, form drop-off, baseline capture) + launch QA/accessibility audit | $4K | Proves the ROI; WCAG 2.1 AA |

**Explicitly out of scope (and why):** native app and loyalty program (premature before first-party volume exists — Phase 5+ of the strategy), reservations (counter-service concept), blog (specials page covers content needs without a maintenance burden the owners won't sustain).
