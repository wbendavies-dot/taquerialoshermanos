# CLAUDE.md — Taqueria Los Hermanos Website

Premium redesign of taquerialoshermanos.com — a 5-location family taqueria in metro Atlanta (Tucker, Lilburn, Suwanee, Lawrenceville, Dunwoody), founded 2001 by three brothers. The site must feel comparable to leading restaurant chains (Tacombi, Torchy's) while staying a family brand.

**The site has exactly three jobs: take orders, book catering, make five cities feel local.** Every change must serve one of them.

## Source-of-truth documents (read before designing or building anything)

| File | Contains |
|---|---|
| `DESIGN_SPEC.md` | Sitemap, every page layout, mobile navigation — the build target |
| `ASSET_LIST.md` | All imagery/icons with dimensions, naming convention, perf budgets |
| `REDESIGN_STRATEGY.md` | Phasing, success metrics, platform rationale |
| `SITE_AUDIT.md` / `RESEARCH_REPORT.md` / `FEATURE_LIST.md` | Why every decision was made |

Do not re-litigate decisions recorded in these docs (e.g., Toast stays; "Order Online" is a modal, not a page; red is CTA-only). If a conflict arises between this file and those docs, this file wins for *how* to build, `DESIGN_SPEC.md` wins for *what* to build.

## Tech stack (fixed — decided June 2026, supersedes earlier Astro recommendation)

- **Next.js 15+ (App Router)** — Server Components by default; every content route statically generated (`generateStaticParams`/SSG). No runtime SSR for content pages. `"use client"` only on designated interactive components: mobile nav, location picker/order modal, menu filter, catering form, motion wrappers.
- **TypeScript, strict mode.** No `any`, no `@ts-ignore` without a comment explaining the external cause.
- **Tailwind CSS 4** — design tokens defined once in the theme; no arbitrary hex values in markup.
- **Framer Motion** — loaded only via `LazyMotion` + `domAnimation` (never the full bundle); every motion component routes through the shared `<FadeIn>`/`<Stagger>` primitives, which respect `useReducedMotion()`.
- **Forms/backend**: Server Actions / route handlers for the catering form → lead store + email alert + auto-confirmation (Resend). Client and server share one Zod schema. No client-side-only form handling.
- **Content**: menu, locations, hours, specials live in typed JSON under `src/content/`, validated by Zod at build time — never hardcoded in components. These files are the single source of truth the future CMS will replace.
- **Hosting**: static deploy + serverless functions (Vercel/Netlify — pick once, document in README).

See `IMPLEMENTATION_ROADMAP.md` for the phased build plan on this stack.

No other runtime dependencies without a written justification in the PR description. Every dependency is a performance and maintenance liability.

## Non-negotiables (hard rules — violating any of these fails review)

1. **Mobile-first, always.** Write the mobile layout first; `sm:`/`md:` add up from it. Never design desktop and squeeze down.
2. **Tap targets ≥ 44×44px** (48px for primary CTAs). Interactive elements never closer than 8px.
3. **Sticky order CTA on every page** (top-bar button + mobile bottom bar per `DESIGN_SPEC.md` §7). The path to ordering is never more than one tap away.
4. **Red (`--color-cta`) is reserved exclusively for primary CTAs.** Nothing decorative may use it. This is the visual hierarchy system.
5. **No price-less menu content, ever.** Menu components must render price or fail loudly in dev. "(Prices vary)" is forbidden copy.
6. **Every menu item/category links to the correct location's Toast deep link.** Toast URLs live in the locations collection, one source of truth.
7. **WCAG 2.2 AA is the floor** (details below). A feature that fails AA is not done.
8. **Performance budgets are CI gates, not aspirations** (details below). A PR that exceeds budget does not merge.
9. **No stock or AI-generated imagery in production for food, people, or locations.** Placeholders from `ASSET_LIST.md` prompts are allowed only behind a `PLACEHOLDER` watermark and must be tracked in `ASSETS_TODO.md`.
10. **Spanish brand terms are not decoration.** "Nuestra Historia," "Lo más pedido," "Gracias" are fixed brand copy — never machine-translate or anglicize them, and never add Spanish the brand voice didn't specify.

## Design system

Tokens (define in Tailwind theme; never inline hex):

```
--color-cream:      #FAF3E7   /* page base */
--color-terra:      #C8552D   /* brand primary — graphics & large display text only (fails AA at body sizes: 3.97:1 on cream) */
--color-terra-text: #B04A24   /* terra for body/small text — 4.9:1 on cream, 5.4:1 on white */
--color-cta:        #8C2B1E   /* deep adobo red — PRIMARY CTAs ONLY */
--color-charcoal:   #2B2420   /* text */
--color-gold:       #D9A441   /* badges, dividers, ratings */
```

- **Type**: display face for headlines only (hand-painted character); humanist sans for all UI, menus, prices, forms. Prices and buttons are never set in the display face.
- **Type scale**: fluid via `clamp()`; body ≥ 16px on mobile (prevents iOS zoom-on-focus); line-height ≥ 1.5 body, ≤ 1.2 display.
- **Spacing**: 4px base grid; section rhythm per `DESIGN_SPEC.md` wireframes.
- **Imagery**: follow `ASSET_LIST.md` dimensions and naming (`food-menu-cesina-taco-1200x900.avif`). All photos share the established look (warm light, dark wood/talavera surfaces) — reject assets that break the system.
- **Texture, not flatness**: cream plaster base (T1) at low contrast; terra cotta bands (T2) for interrupt sections. Premium = tactile and restrained, never busy.

## Animation standards

Animations exist to confirm actions and guide attention — never to perform.

- **Durations**: micro-interactions 150–200ms; reveals 350–600ms; choreographed entrances (hero stagger) may total ~1s. (Amended June 2026 — owner direction: bolder motion design.)
- **Easing**: `ease-out` / `--ease-entrance` for entrances, `ease-in-out` for movement; no bounces/elastics — this is a premium brand, not a toy.
- **Only animate `transform` and `opacity`.** Animating layout properties (width/height/top/margin) is forbidden — it causes jank and CLS.
- **Scroll reveals**: once per element via `FadeIn`/`Stagger` primitives (≤32px translate + fade). Content must be readable with JS disabled — `[data-motion]` + `scripting: none` CSS covers this.
- **Sanctioned continuous/decorative motion** (amended June 2026): slow hero image drift (`.kenburns`), the CSS transform dish ribbon (`.marquee-track`, decorative `aria-hidden` only, pauses on hover), the scroll cue pulse, and `.card-lift` hover physics. All are CSS, transform/opacity only, and **all stop under `prefers-reduced-motion`** (single media block in globals.css — new continuous animations must be added to it).
- **`prefers-reduced-motion: reduce` disables all non-essential motion.** Every animation ships with its reduced variant in the same PR. Essential feedback (button press states, form validation) remains, instant.
- **Still forbidden**: parallax, autoplaying carousels, scroll-jacking, marquees carrying *content* (decorative-only), animated page transitions that delay content.
- The hero video: muted, `playsinline`, lazy, poster-first, paused under reduced-motion and data-saver, ≤4MB.

## Accessibility (WCAG 2.2 AA floor, AAA where cheap)

- **Semantics first**: native elements (`button`, `a`, `nav`, `main`, `dialog`, `details`) before ARIA. ARIA only to fill genuine gaps.
- **Contrast**: 4.5:1 minimum all text (AA); target 7:1 (AAA) for body text on cream — charcoal on cream passes, verify every texture/photo overlay with a contrast check, use the built-in scrims from the asset specs.
- **Keyboard**: every interaction operable by keyboard; visible focus ring (2px gold offset ring — on brand, never `outline: none` without replacement); logical tab order; focus trapped in modals (location picker, mobile drawer) and returned on close.
- **Forms (catering = revenue, so this is a conversion rule too)**: every input has a visible `<label>`; errors are specific, inline, announced via `aria-live`, and never color-only; multi-step form announces step changes; no placeholder-as-label.
- **Images**: descriptive `alt` for food ("Cesina taco with cilantro and onion on handmade tortilla" — it's also SEO), `alt=""` for decorative textures/illustrations.
- **Touch + pointer**: 2.2 criteria — drag alternatives, no down-event-only triggers, target size respected.
- **Screen-reader pass on the order path and catering form** (VoiceOver or NVDA) before any release that touches them.
- **Language**: `lang="en"` site-wide; `lang="es"` on Spanish phrases so screen readers pronounce them correctly.
- Automated: `axe` checks in CI on every page template. Automated tools catch ~40% — the manual keyboard/SR pass is what makes it real.

## Performance budgets (CI-enforced)

Tested on throttled 4G, mid-range Android profile (Lighthouse mobile):

| Metric | Budget |
|---|---|
| LCP | < 2.0s |
| CLS | < 0.1 |
| INP | < 200ms |
| Lighthouse (mobile) | ≥ 95 all categories |
| First Load JS per route (gzipped) | ≤ 130KB; menu page ≤ 160KB |
| Above-fold image weight | ≤ 200KB/image (AVIF + WebP fallback) |
| Fonts | ≤ 2 families, WOFF2, subset, `font-display: swap`, preloaded |

Rules that keep the budgets:
- Server Components by default; client components lazy-mounted on visibility where possible (`next/dynamic`), except the header order button (eager).
- All images through `next/image`: explicit `width`/`height` (CLS), responsive `sizes`, lazy below fold, `priority` on the LCP image only.
- No layout shift from dynamic content: reserve space for the announcement bar, review widgets, and open/closed badges.
- Third-party embeds (Google reviews, Instagram, maps) load facade-first: static snapshot, hydrate on interaction. **No third-party script may load before LCP.**
- Run Lighthouse CI on the homepage, menu, catering, and one location page in every PR.

## SEO standards

- **Title pattern**: `{Page} | Taqueria Los Hermanos | {City}, GA` — city-specific on location pages, "Metro Atlanta" elsewhere. The word "United States" must never appear in a title tag (audit scar tissue).
- **One `h1` per page**, heading hierarchy without skips, canonical URLs, descriptive meta descriptions (~155 chars) per page.
- **Structured data (JSON-LD)**: `Restaurant` + `LocalBusiness` per location page (NAP, geo, hours, `servesCuisine`, ordering URL), `Menu`/`MenuItem` with prices on `/menu`, `FAQPage` on catering FAQ, `Organization` site-wide. Validate in CI with a schema linter.
- **Slugs are keywords**: `/menu`, `/catering`, `/locations/tucker`. Never `menu-1`, never `copy-of-*`.
- **301 redirects** from all legacy Wix URLs (`/menu-1`, `/copy-of-menu`, `/online-order`) — maintain the map in `redirects` config; never delete entries.
- **OG/Twitter cards** per key page using the BG4 assets; XML sitemap + robots.txt generated at build.
- **NAP consistency**: name/address/phone rendered only from the locations collection — one source of truth feeding pages, footer, and schema. Hand-typed addresses anywhere else are a bug.
- Every page ships indexable HTML — no content rendered only client-side.

## Code standards

- **Components**: one responsibility, `PascalCase.tsx`, colocated in `src/components/{section}/`. Page sections compose components; pages compose sections. Server Component unless interactivity demands otherwise.
- **Props typed and validated**; content collections schema'd with Zod — a menu item without `price`, `name`, and `toastCategory` fails the build (this enforces non-negotiable #5/#6 mechanically).
- **No magic values**: colors, breakpoints, durations, z-indices from tokens.
- **CSS**: Tailwind utilities in markup; extract a component only at third repetition. No `!important`. `z-index` scale: content 0, sticky bars 10, drawer 20, modal 30, toast 40.
- **Naming the domain truthfully**: `location`, `menuItem`, `cateringLead` — not `data`, `item2`, `info`.
- **Comments** only for constraints code can't express (e.g., "Toast deep links break if the category slug is URL-encoded twice").
- **Testing**: Playwright smoke tests for the three money paths — (1) home → menu → Toast handoff URL is correct per location, (2) catering form full submission + confirmation, (3) location picker persistence. Run in CI. Unit-test only logic (hours/open-now calculation, price formatting), not markup.
- **Git**: small focused commits; PR description states which of the three jobs the change serves and which budget/checklist items were verified.

## Definition of done (every PR checklist)

- [ ] Mobile layout built first and verified at 360px, 390px, 768px, 1280px
- [ ] Keyboard-only walkthrough passes; focus visible throughout
- [ ] `prefers-reduced-motion` variant verified
- [ ] axe clean; contrast spot-checked on photo/texture overlays
- [ ] Lighthouse CI within all budgets (mobile profile)
- [ ] Schema validates (if page-level change)
- [ ] No new dependency, or its justification is in the PR
- [ ] Money-path Playwright tests green
- [ ] Copy follows brand voice (warm, first-person-plural; Spanish terms intact; no "flavor town" energy)

## Forbidden (instant review failure)

- PDF menus, or menu content without prices
- Carousels/sliders for hero or menu content
- `"use client"` outside the designated interactive components; importing the full `framer-motion` bundle instead of `LazyMotion`
- Stock photography or unwatermarked AI imagery of food/people/places
- Pop-ups before 10s/50% scroll, or any pop-up on the catering form page
- Third-party scripts before LCP; tracking pixels without consent handling
- `outline: none` without a visible replacement
- Layout-property animations; scroll-jacking; autoplay with sound
- Hand-typed NAP data outside the locations collection
- Red (`--color-cta`) on anything that isn't a primary CTA
