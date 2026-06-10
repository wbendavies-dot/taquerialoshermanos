import { z } from "zod";

import locationsJson from "@/content/locations.json";
import menuJson from "@/content/menu.json";
import specialsJson from "@/content/specials.json";
import {
  locationSchema,
  menuSchema,
  specialsSchema,
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
