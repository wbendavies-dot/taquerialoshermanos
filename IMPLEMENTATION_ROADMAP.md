# Taqueria Los Hermanos — Implementation Roadmap

**Stack (decided):** Next.js 15+ (App Router, React Server Components) · TypeScript (strict) · Tailwind CSS 4 · Framer Motion
**Build target:** `DESIGN_SPEC.md` · **Standards:** `CLAUDE.md` · **Assets:** `ASSET_LIST.md`

**Stack ground rules** (expanded in `CLAUDE.md`):
- Server Components by default; `"use client"` only on the designated interactive components (mobile nav, location picker, menu filter, catering form, motion wrappers).
- Every route statically generated (`generateStaticParams` / full SSG). No runtime SSR for content pages.
- Framer Motion loaded via `LazyMotion` + `domAnimation` (~15KB, not the full bundle); all motion respects `useReducedMotion()`.
- Content (menu, locations, specials) = typed JSON validated by Zod at build time. A menu item without `price`, `name`, `toastCategory` fails `next build`.

**Timeline at a glance:**

| Phase | Weeks | Theme |
|---|---|---|
| 0 | 1 | Foundation & CI gates |
| 1 | 2–3 | Design system & global shell |
| 2 | 3–5 | Menu experience (the core) |
| 3 | 5–6 | Homepage |
| 4 | 6–8 | Catering funnel |
| 5 | 8–9 | Locations & local SEO |
| 6 | 9–10 | Story, specials, gift cards, 404 |
| 7 | 10–11 | Hardening & launch |
| 8 | 12+ | Post-launch optimization |

Phases 3–4 can run parallel to 5–6 with two developers; the sequence above assumes one.

---

## Phase 0 — Foundation & CI Gates (Week 1)

**Objective:** A deployable skeleton where every quality gate already runs — budgets enforced from commit #1, because retrofitting performance/a11y discipline never works.

**Deliverables:**
- Next.js 15 App Router project: TypeScript strict, ESLint, Prettier, Tailwind 4 with the full design-token theme (palette, fluid type scale, spacing, z-index scale from `CLAUDE.md`)
- Content layer: `src/content/` with Zod schemas for `locations` (NAP, hours, geo, Toast URLs), `menu` (items, prices, categories, dietary tags, Toast category slugs), `specials`; build fails on invalid content
- Seed content: all 5 locations + at least one full menu category with real prices (gathered from Toast)
- CI pipeline (GitHub Actions): typecheck, lint, unit tests, Playwright, Lighthouse CI (mobile profile, budgets from `CLAUDE.md`), axe scan, schema validation
- Legacy redirect map in `next.config` (`/menu-1`, `/copy-of-menu`, `/online-order` → new slugs)
- Deploy pipeline to staging (Vercel/Netlify) with preview deploys per PR
- `ASSETS_TODO.md` tracking placeholder vs. final imagery

**Acceptance criteria:**
- `next build` fails when a menu item is missing a price (proven by a test fixture)
- Lighthouse CI runs on the skeleton homepage and reports ≥95 mobile
- A PR with an intentionally oversized image or failing axe check is blocked by CI
- All legacy URLs 301 to their new homes on staging
- README documents: run, test, content-editing workflow, deploy

**Testing requirements:**
- Unit: Zod schema rejection cases (missing price, malformed hours, bad Toast URL)
- CI self-test: one deliberately failing fixture per gate to prove gates actually gate
- Manual: staging deploy reachable, redirects verified with curl

---

## Phase 1 — Design System & Global Shell (Weeks 2–3)

**Objective:** Every pixel of chrome that wraps all pages: header, mobile navigation, footer, the order modal, and the motion system — so subsequent phases only build page content.

**Deliverables:**
- Component library: buttons (primary red CTA, secondary, ghost), cards, section containers, badges (Est. 2001, dietary/spice tags), divider motif, accordion, input set with labels/errors
- Header: logo lockup, 5-item nav, sticky red ORDER button (the one `"use client"` + eager component)
- Mobile navigation per `DESIGN_SPEC.md` §7: full-screen drawer (focus-trapped, body-scroll-locked) + sticky bottom bar (Menu · Order · Call · Map) with scroll-direction hide/show
- **Location context**: client provider reading/writing `localStorage`, optional geolocation sort; powers Call/Map buttons, menu prices, and Toast links site-wide
- **Order modal**: location picker → Toast deep link; remembers choice; full keyboard/focus management (`<dialog>` based)
- Announcement bar (dismissible, cookie-remembered, zero CLS — height reserved)
- Footer: 5× NAP + hours rendered from the locations collection, nav, social, gift cards link
- Motion primitives: `<FadeIn>`, `<Stagger>` wrappers using LazyMotion + IntersectionObserver (animate once), with reduced-motion passthrough built in
- Texture assets (T1–T4) and icon set (IC1–IC2) integrated as optimized assets/SVG sprite

**Acceptance criteria:**
- Bottom bar Call and Map buttons dial/navigate to the *remembered* location; changing location in the modal updates them without reload
- Order modal → Toast URL is correct for each of the 5 locations (table-driven check)
- Drawer and modal: focus trapped, Escape closes, focus returns to trigger, inert background
- Zero CLS from announcement bar, sticky bars, or font loading (verified in Lighthouse)
- All chrome renders and navigates with JavaScript disabled (modal degrades to a `/locations` link)
- Tap targets ≥44px verified at 360px viewport

**Testing requirements:**
- Playwright: location persistence across pages and reloads; modal keyboard flow; drawer open/close/focus-return; bottom-bar deep links per location
- Unit: open-now/closes-at calculation (timezone-safe, holiday override support)
- axe: zero violations on shell at 360px and 1280px
- Manual: VoiceOver or NVDA pass on header → drawer → modal → footer; reduced-motion OS setting verified

---

## Phase 2 — Menu Experience (Weeks 3–5)

**Objective:** The single most important screen — the priced, photographed, filterable menu wired to Toast. 80% of visitors come for this; it converts or the project fails.

**Deliverables:**
- Full menu content entered: every item with price (per-location price variants where they differ), description, dietary/spice tags, category, Toast deep-link slug
- `/menu` route per `DESIGN_SPEC.md` §6: location context chip, sticky horizontal category nav with scroll-spy, item cards (photo, name, price, tags, "Add to order")
- Client island: search + dietary/spice filters (URL-state synced, so filtered views are shareable/back-button safe)
- Toast deep-link builder: `location × category/item → URL`, unit-tested, single module
- Catering interrupt banner after third category
- Sticky mobile footer CTA ("Order from {location}")
- `Menu`/`MenuItem` JSON-LD with prices
- Placeholder food photography (watermarked, per `ASSET_LIST.md` F-series prompts) wired through `next/image` with final dimensions

**Acceptance criteria:**
- No item renders without a price; switching location updates every price and every Toast link
- Search returns results <50ms perceived (client-side, pre-indexed); filters combine correctly (vegetarian + 🌶🌶)
- Filter/search state survives reload via URL params
- Category nav scroll-spy highlights correctly; jump-to-category accounts for sticky header offset
- Menu page ≤160KB total JS (gzipped); LCP <2.0s with full imagery on throttled 4G
- Menu content fully present in server-rendered HTML (view-source test) — search engines see every dish
- Schema validates in Rich Results test

**Testing requirements:**
- Unit: Toast URL builder (all 5 locations × all categories, including URL-encoding edge cases); price formatter; filter logic
- Playwright: money path #1 — land on menu → pick location → filter → tap "Add to order" → assert exact Toast URL; repeat for a second location
- Lighthouse CI: menu page added to the gated pages list
- Visual regression (Playwright screenshots) on item cards at 360/768/1280
- Manual: screen-reader pass on filter controls and item cards; keyboard-only filter + order flow

---

## Phase 3 — Homepage (Weeks 5–6)

**Objective:** The router page: route visitors to Menu / Order / Catering within seconds while establishing the brand (`DESIGN_SPEC.md` §2, all 12 sections).

**Deliverables:**
- Hero: video loop (muted, `playsinline`, poster-first, paused under reduced-motion/data-saver, ≤4MB) with headline + 3 CTAs + location/hours strip
- Trust bar with aggregated Google rating (build-time fetched + cached, facade pattern — no client-side third-party call before LCP)
- "Lo más pedido" favorites: 6 items pulled from the menu collection (single source of truth) with Toast deep links
- Story teaser, catering band (price anchor + 1-hour-reply CTA), locations strip with open-now badges
- Reviews section (location-filterable, build-time data), Instagram grid (static snapshot, hydrate-on-interaction facade)
- Email/SMS capture band + timed pop-up (≥10s or 50% scroll, never on catering page, suppressed after dismissal/signup) wired to ESP (Mailchimp/Klaviyo) via route handler
- OG images (BG4) and metadata via the Metadata API

**Acceptance criteria:**
- LCP <2.0s on 4G (poster image is the LCP element, `fetchpriority="high"`)
- All 12 sections present; every section's CTA resolves (favorites → Toast, catering → /catering, locations → city pages)
- Pop-up honors timing rules, never traps focus incorrectly, dismissal persists ≥30 days, and is absent on `/catering`
- Zero third-party scripts before LCP (verified in waterfall); reviews/Instagram load as facades
- Open-now badges correct across the 5 locations at boundary times (unit-tested clock)
- Email signup: success + failure states announced via `aria-live`; double-submit prevented

**Testing requirements:**
- Playwright: full homepage CTA sweep (every button/link lands correctly); pop-up timing/suppression; signup happy + error paths (ESP mocked)
- Lighthouse CI: homepage within all budgets with video + full imagery
- Unit: favorites selector (falls back gracefully if an item is retired); open-now boundaries
- Manual: reduced-motion (video paused, reveals instant); 360px thumb reach of all CTAs

---

## Phase 4 — Catering Funnel (Weeks 6–8)

**Objective:** The highest-AOV channel: landing page + multi-step form + the speed-to-lead machinery that makes the 1-hour promise real. This phase has the most backend.

**Deliverables:**
- `/catering` per `DESIGN_SPEC.md` §3: hero with 1-hour-reply promise, trust strip, how-it-works (IC3 icons), 5 package cards with per-person pricing + total anchors, event gallery, testimonials by event type, FAQ/policies accordion (with `FAQPage` schema)
- Multi-step form (client island): Step 1 event type/date/guest count → Step 2 contact + notes; inline validation; step changes announced; state preserved on back
- Server Action / route handler pipeline: validate (Zod, shared schema with client) → store lead (DB or Sheets API) → email auto-confirmation to lead (Resend) → SMS/email alert to catering phones → tag source/package
- `/catering/gracias` confirmation page (sets the 1-hour expectation, next steps, menu links)
- Nurture hooks: lead tagged in ESP for the 3-email sequence (sequence copy provided, configured in ESP)
- Spam protection: honeypot + time-trap (no CAPTCHA — friction on the money form is forbidden)
- Sticky GET A QUOTE button (replaces the standard bottom bar on this page)

**Acceptance criteria:**
- Submission → lead stored + both emails dispatched <30s (measured on staging)
- Form completes in <2 minutes; Step 1 has zero personal-info fields
- Validation errors: specific, inline, announced, never color-only; data never lost between steps or on error
- Server rejects what the client would (schema parity proven by shared Zod module)
- Package card CTAs pre-select that package in the form
- FAQ schema validates; page works as a cold landing page (no dependency on header/homepage context)
- Failure path: if email dispatch fails, lead is still stored and an ops alert fires — a lead is never silently lost

**Testing requirements:**
- Playwright: money path #2 — full multi-step submission (happy path, validation failures, back-navigation, double-submit guard) with mocked email/storage; assert confirmation page + payload contents
- Unit: lead schema, date validation (no past dates; <48h notice flagged not blocked — flagged leads alert as "rush")
- Integration (staging): one real end-to-end submission per release verifying actual email delivery
- Manual: screen-reader full form pass; mobile one-handed completion test; load test 20 concurrent submissions

---

## Phase 5 — Locations & Local SEO (Weeks 8–9)

**Objective:** Convert one generic site into five city landing pages — the map-pack play (`DESIGN_SPEC.md` §5).

**Deliverables:**
- `/locations` index: map (facade-loaded), distance sort via geolocation opt-in, 5 cards with open-now status
- `/locations/[city]` template ×5 via `generateStaticParams`: hero, essentials block (copyable address, hours table, `tel:` link, parking note), embedded map (facade), photo row, location-specific reviews, 80–120 words genuine local copy (drafted with owners), menu + catering cross-links
- Per-location `Restaurant`/`LocalBusiness` JSON-LD (NAP, geo, hours, ordering URL) rendered from the locations collection
- `sitemap.ts` + `robots.ts`; canonical URLs; city-specific title/meta patterns
- GBP alignment runbook (`GBP_CHECKLIST.md`): which URL goes in each profile field per location, catering service listing — for the owners to execute

**Acceptance criteria:**
- Each city page: unique title (`… | Tucker, GA`), unique meta, unique imagery, unique local copy (no near-duplicate content across the 5)
- Schema validates for all 5 in Rich Results test; NAP on page, in footer, and in schema are byte-identical (single source proven by test)
- Order CTA on each city page deep-links to *that* location's Toast — no re-picking
- Open-now status correct at open/close boundaries and on holiday overrides
- Maps load as facades (no Google scripts before interaction); index page LCP <2.0s

**Testing requirements:**
- Unit: schema generator snapshot per location; NAP single-source test (grep-style assertion that no address literal exists outside the collection)
- Playwright: index → city page → order CTA URL per all 5 locations; distance sort with mocked geolocation
- Lighthouse CI: one city page added to gated list
- Manual: verify each page against its real-world data (hours, phone) with the owners before launch

---

## Phase 6 — Story, Specials, Gift Cards, 404 (Weeks 9–10)

**Objective:** The brand-depth pages that turn first-timers into regulars, plus content infrastructure the owners maintain themselves.

**Deliverables:**
- `/nuestra-historia` per `DESIGN_SPEC.md` §4: brothers hero, origin essay, horizontal timeline (keyboard-operable, degrades to vertical stack), food philosophy with kitchen photography, brothers' cards, community section, CTA band
- `/especiales`: specials rendered from the content collection (title, price, date range — auto-expire past items), illustrated evergreen header (H7)
- `/gift-cards`: hero (S7), Toast gift card link, corporate/catering cross-sell
- Branded 404 (H8 illustration + menu/order CTAs)
- Content-editing workflow documented for non-developers (edit JSON via CMS-lite or guided PR; whichever is chosen, a dry run with a real owner edit must succeed)

**Acceptance criteria:**
- Timeline fully operable by keyboard and touch; reduced-motion = no horizontal scroll-linked effects
- Expired specials disappear without a deploy (build-time date logic + scheduled rebuild, or ISR on this route only — decision documented)
- An owner (non-developer) successfully adds a special end-to-end in the dry run
- 404 returns proper status code and routes users back to money pages
- Story page maintains budgets despite being the most photography-heavy page (aggressive lazy-loading below fold)

**Testing requirements:**
- Playwright: specials expiry logic with mocked dates; 404 status + CTA navigation
- Visual regression on story page sections
- Manual: owner content-edit dry run; story page screen-reader pass (timeline announcement order)

---

## Phase 7 — Hardening & Launch (Weeks 10–11)

**Objective:** Replace placeholders, audit everything against `CLAUDE.md`, cut over DNS, and capture the baseline numbers the redesign will be judged against.

**Deliverables:**
- Final photography integrated (all `[REAL]` assets from the three shoots replace watermarked placeholders; `ASSETS_TODO.md` empty)
- Full accessibility audit: axe across every template + manual keyboard/screen-reader pass on all money paths; issues fixed
- Performance pass: bundle analysis, font subsetting verification, image audit, budgets green on every gated page
- SEO launch kit: all redirects verified against a crawl of the old Wix site (full URL inventory, not just the known three), sitemap submitted, Search Console verified, schema spot-checked live
- Launch runbook: DNS cutover steps, rollback plan, monitoring (uptime, Core Web Vitals RUM via `useReportWebVitals`, error tracking)
- Baseline metrics doc: current Toast orders/month, catering inquiries/month, email list size (0), map-pack positions per city — the `REDESIGN_STRATEGY.md` success-metrics table filled in
- GBP updates executed with owners per the Phase 5 runbook

**Acceptance criteria:**
- Zero watermarked/placeholder images in production build (CI check on filename convention)
- Old-site crawl: 100% of indexed URLs return 200 or 301 to a relevant page — zero 404s from legacy links
- All money-path Playwright suites green against the production build
- RUM reporting live; alerts configured for CWV regression and form-pipeline failures
- Owners trained: specials editing, lead handling (the 1-hour process), GBP basics — sign-off recorded

**Testing requirements:**
- Full regression: every Playwright suite, axe on all templates, Lighthouse CI on all gated pages, schema validation on all structured-data pages
- Production smoke test post-cutover: order path per location, one real catering submission, email delivery confirmed
- 48-hour post-launch watch: RUM CWV, 404 logs, form pipeline, Search Console coverage

---

## Phase 8 — Post-Launch Optimization (Week 12+, ongoing)

**Objective:** Turn the measurement infrastructure into compounding revenue — this is where the redesign pays for itself.

**Deliverables (recurring):**
- Funnel dashboards: menu → location → Toast handoff; catering form step drop-off; capture conversion
- A/B tests (one at a time, hypothesis-documented): hero CTA copy, first-order incentive offer, favorites selection, catering price anchors
- Toast checkout upsell configuration (chips+queso, churros, drinks) with before/after AOV measurement
- Monthly content cadence: specials rotation, seasonal catering pushes (graduation, holidays, Super Bowl)
- Quarterly review against the strategy's 6-month targets: +40% direct orders, 3–5× catering inquiries, 5,000+ list, top-3 map pack ×5 cities, <1hr catering response time

**Acceptance criteria (per quarter):**
- Every shipped experiment has a written result (win/loss/flat) and a decision
- Budgets still green — no regression debt accumulated (Lighthouse CI stays in CI forever)
- Success-metrics table updated with real numbers vs. targets

**Testing requirements:**
- CI gates remain mandatory on every change — post-launch velocity never bypasses Phase 0's gates
- Experiment instrumentation verified before each test starts (no untracked experiments)
- Quarterly manual a11y spot-check on money paths (regressions creep through component edits)
