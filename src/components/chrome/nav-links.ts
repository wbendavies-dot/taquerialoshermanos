/**
 * Single source for site navigation. Only routes that exist may be
 * listed (no dead links, ever) — entries are added as their pages ship.
 */
export const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "Catering", href: "/catering" },
  { label: "Locations", href: "/locations" },
  { label: "About Us", href: "/about-us" },
] as const;
