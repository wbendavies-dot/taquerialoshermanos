# Taqueria Los Hermanos — Website

Premium redesign of taquerialoshermanos.com. Five locations across metro
Atlanta, family-owned since 2001.

**Read first:** `CLAUDE.md` (development standards — binding) and
`IMPLEMENTATION_ROADMAP.md` (phased plan). Design target: `DESIGN_SPEC.md`.

## Stack

Next.js 15 (App Router, RSC, full SSG) · TypeScript strict · Tailwind CSS 4
· Framer Motion (LazyMotion only) · Zod-validated JSON content.

## Commands

```bash
npm run dev        # local dev server
npm run build      # production build (fails on invalid content — by design)
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm test           # unit tests (vitest)
npm run test:e2e   # Playwright (requires a prior `npm run build`)
```

## Editing content (menu, locations, hours, specials)

All restaurant data lives in `src/content/*.json`, validated by
`src/content/schema.ts` at build time:

- `locations.json` — NAP, hours, Toast ordering URLs. **The only place
  addresses/phones/Toast links may exist.** Pages, footer, and schema all
  render from here.
- `menu.json` — items require `name`, `description`, `price`, and
  `toastCategory`; the build fails otherwise. Real prices pending Toast
  export — see `CONTENT_TODO.md`.
- `specials.json` — date-windowed; expired items drop out automatically.

## Quality gates (CI)

Every push runs: typecheck → lint → unit tests → production build →
Playwright e2e (mobile profile first) → Lighthouse CI (perf ≥ 95 mobile,
LCP < 2.0s, CLS < 0.1). Budgets live in `lighthouserc.json` and `CLAUDE.md`.

## Status

Phase 0 (foundation) complete. Next: Phase 1 — design system & global shell.
Blocked items live in `CONTENT_TODO.md` / `ASSETS_TODO.md`.
