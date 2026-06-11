# Content TODO — data that must come from the owners / Toast

Tracked per CLAUDE.md: no invented data ships. Build-time validation will
fail (by design) on any attempt to add menu items without real prices.

## Menu data status (Phase 2)

- [x] **Full menu with real prices** — captured June 10, 2026 from the
      Dunwoody Toast page (user-assisted browser capture, `.toast-data/`).
      ~150 items across 20 categories entered in `src/content/menu.json`.
- [ ] **Per-location price differences** — Dunwoody prices are the base.
      Re-run `node scripts/scrape-toast-headed.mjs <toast-url> <slug>` for
      the other four locations and enter differences as `priceOverrides`.
- [ ] **Toast deep-link anchors** — Toast renders categories client-side;
      no stable per-item URL was observable. Item CTAs currently open the
      location's Toast ordering page root (always correct, never broken).
      If Toast exposes stable anchors, add them to the link builder.

### Editorial decisions in menu.json (faithful-capture exceptions)

- Excluded from the marketing menu (still orderable in Toast): the ~45
  "S/O …" side-order modifiers, Salsa To Go / Bag of Chips charges,
  Loteria Mugs (merch), "Dundwoody Wildcat Card" (school fundraiser),
  and Water (listed without a price).
- Two Toast display truncations completed from context ("on the s[ide]",
  "pico de ga[llo]"); raw-food advisory boilerplate trimmed from three
  descriptions; one Toast typo corrected ("Pechga salsa champinones" →
  "Pechuga Salsa Champiñones"). Owners should confirm.
- `spice` tags (1–2) set only where descriptions say "spicy"; `vegetarian`
  tags only where the item is unambiguously meatless by name/description.
  Owners should review both before launch.
- **Address discrepancy found**: old site says Suwanee is "3245 Peachtree
  Pkwy # I"; Toast says "Ste 15". Confirm against the Google Business
  Profile and align locations.json (NAP consistency matters for SEO).

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
