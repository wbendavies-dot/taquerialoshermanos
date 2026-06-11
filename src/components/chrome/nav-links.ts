/**
 * Single source for site navigation. Only routes that exist may be
 * listed (no dead links, ever) — entries are added as their pages ship.
 */
export const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "Catering", href: "/catering" },
  { label: "Locations", href: "/locations" },
  { label: "Nuestra Historia", href: "/nuestra-historia" },
] as const;
