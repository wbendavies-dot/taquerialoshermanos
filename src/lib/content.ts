import { z } from "zod";

import cateringJson from "@/content/catering.json";
import locationsJson from "@/content/locations.json";
import menuJson from "@/content/menu.json";
import siteJson from "@/content/site.json";
import specialsJson from "@/content/specials.json";
import {
  cateringSchema,
  locationSchema,
  menuSchema,
  siteSchema,
  specialsSchema,
  type Catering,
  type Location,
  type MenuCategory,
  type Special,
} from "@/content/schema";

/**
 * Content is parsed at module load, so invalid content fails `next build`
 * (every page importing this module throws during static generation).
 */

const locationsFileSchema = z.object({
  locations: z
    .array(locationSchema)
    .min(1)
    .superRefine((locations, ctx) => {
      const seen = new Set<string>();
      for (const location of locations) {
        if (seen.has(location.slug)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate location slug: ${location.slug}`,
          });
        }
        seen.add(location.slug);
      }
    }),
});

const parsedLocations = locationsFileSchema.parse(locationsJson);
const parsedMenu = menuSchema.parse(menuJson);
const parsedSpecials = specialsSchema.parse(specialsJson);
const parsedSite = siteSchema.parse(siteJson);
const parsedCatering = cateringSchema.parse(cateringJson);

export function getSiteSettings() {
  return parsedSite;
}

export function getCatering(): Catering {
  return parsedCatering;
}

export function getLocations(): Location[] {
  return parsedLocations.locations;
}

export function getLocation(slug: string): Location {
  const location = parsedLocations.locations.find((l) => l.slug === slug);
  if (!location) {
    throw new Error(`Unknown location slug: ${slug}`);
  }
  return location;
}

export function getMenuCategories(): MenuCategory[] {
  return parsedMenu.categories;
}

export function getSpecials(): Special[] {
  return parsedSpecials.specials;
}

/**
 * Homepage "Lo más pedido": ranked popular items (owner-provided
 * bestseller list). Falls back gracefully if items are retired.
 */
export function getPopularItems(limit = 6) {
  return parsedMenu.categories
    .flatMap((category) =>
      category.items.map((item) => ({ ...item, categorySlug: category.slug })),
    )
    .filter((item) => item.popular && item.popularRank !== undefined)
    .sort((a, b) => (a.popularRank ?? 99) - (b.popularRank ?? 99))
    .slice(0, limit);
}

/** Resolve an item's price for a location (per-location overrides win). */
export function priceFor(
  item: { price: number; priceOverrides: Record<string, number> },
  locationSlug: string,
): number {
  return item.priceOverrides[locationSlug] ?? item.price;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
