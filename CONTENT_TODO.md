# Content TODO — data that must come from the owners / Toast

Tracked per CLAUDE.md: no invented data ships. Build-time validation will
fail (by design) on any attempt to add menu items without real prices.

## Blocking Phase 2 (menu)

- [ ] **Full menu with real prices** — export item names, descriptions,
      prices, and category slugs from the Toast back office (Toast pages
      block scraping; an owner export is the correct source anyway).
      Target file: `src/content/menu.json` (schema: `src/content/schema.ts`).
- [ ] **Per-location price differences** — the old site said "prices vary
      by location"; confirm which items differ and capture them in
      `priceOverrides` keyed by location slug.
- [ ] **Toast category/item deep-link slugs** — verify the URL anchor format
      for each location's Toast menu so "Add to order" lands on the item.

## Blocking Phase 5 (locations)

- [ ] **Verified lat/lng per location** (`geo` field) — needed for
      LocalBusiness schema and the map. Pull from each Google Business
      Profile, not from geocoding guesses.
- [ ] **Confirm per-location hours** — current data assumes all 5 share the
      schedule published on the old homepage ("hours will vary by location"
      was stated but never specified). Owner confirmation required.
- [ ] **Parking/landmark note per location** (1 sentence each).

## Blocking Phase 4 (catering)

- [ ] **Catering contact destination** — replace
      Taquerialoshermanoscatering@gmail.com with a domain mailbox
      (catering@taquerialoshermanos.com) before the form ships.
- [ ] **Policies copy**: deposit, delivery zones/fees, setup, cancellation,
      dietary accommodations (owners to confirm; currently unpublished).

## Nice-to-have

- [ ] Real holiday schedule for `holidayOverrides`.
- [ ] Top-6 bestsellers (from Toast sales data) for the homepage favorites.
