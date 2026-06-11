import { z } from "zod";

/** "HH:MM" 24-hour local time (America/New_York). */
const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:MM (24-hour)");

/** null = closed that day. */
export const dayHoursSchema = z
  .object({ open: timeString, close: timeString })
  .nullable();

export const weeklyHoursSchema = z.object({
  sun: dayHoursSchema,
  mon: dayHoursSchema,
  tue: dayHoursSchema,
  wed: dayHoursSchema,
  thu: dayHoursSchema,
  fri: dayHoursSchema,
  sat: dayHoursSchema,
});

/** One-off deviations (holidays). `hours: null` = closed all day. */
export const holidayOverrideSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  label: z.string().min(1),
  hours: dayHoursSchema,
});

export const locationSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be kebab-case"),
  name: z.string().min(1),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.literal("GA"),
    zip: z.string().regex(/^\d{5}$/),
  }),
  phone: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, "Phone must be XXX-XXX-XXXX"),
  /**
   * Exact Toast online-ordering URL for this location — the single source
   * of truth for every order CTA on the site (CLAUDE.md non-negotiable #6).
   */
  toastUrl: z
    .string()
    .url()
    .refine(
      (url) => new URL(url).hostname.endsWith("toasttab.com"),
      "toastUrl must point to toasttab.com",
    ),
  hours: weeklyHoursSchema,
  holidayOverrides: z.array(holidayOverrideSchema).default([]),
  /** Verified lat/lng — required before Phase 5 location pages ship. */
  geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
});

export const dietaryTagSchema = z.enum(["vegetarian", "gluten-free"]);

/**
 * A menu item is invalid without a name, a positive price, and a Toast
 * category mapping. This is what makes "no price-less menu content"
 * (CLAUDE.md non-negotiable #5) a build-time guarantee, not a convention.
 */
export const menuItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  description: z.string().default(""),
  /** Price in USD. Per-location overrides keyed by location slug. */
  price: z.number().positive().finite(),
  /** True when the price is a starting price (size/protein variants). */
  priceFrom: z.boolean().default(false),
  priceOverrides: z.record(z.string(), z.number().positive().finite()).default({}),
  toastCategory: z.string().min(1),
  dietary: z.array(dietaryTagSchema).default([]),
  /** 0 = not spicy … 3 = hottest. */
  spice: z.number().int().min(0).max(3).default(0),
  popular: z.boolean().default(false),
  /** Homepage "Lo más pedido" ordering; popular items without a rank get
      a menu badge but don't appear on the homepage. */
  popularRank: z.number().int().positive().optional(),
});

export const menuCategorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  items: z.array(menuItemSchema),
});

export const menuSchema = z.object({
  categories: z.array(menuCategorySchema),
});

export const specialSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive().finite().optional(),
  /** Inclusive display window — expired specials disappear at build. */
  startsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const specialsSchema = z.object({ specials: z.array(specialSchema) });

/**
 * Site-wide settings. `announcement: null` hides the announcement bar —
 * it only renders with a real, owner-approved offer (no invented promos).
 */
export const siteSchema = z.object({
  instagramUrl: z.string().url(),
  facebookUrls: z.record(z.string(), z.string().url()),
  announcement: z
    .object({
      message: z.string().min(1),
      href: z.string().optional(),
      /** Last day the bar shows, YYYY-MM-DD. */
      expiresOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })
    .nullable(),
  /** Interim catering contact (replaced by the Phase 4 form pipeline). */
  catering: z.object({
    email: z.string().email(),
    phones: z.array(
      z.object({
        name: z.string().min(1),
        phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/),
      }),
    ),
  }),
});

const pricedLineSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive().finite(),
});

export const cateringSchema = z.object({
  minimumGuests: z.number().int().positive(),
  noticeHours: z.number().int().positive(),
  packages: z.array(
    z
      .object({
        slug: z.string().regex(/^[a-z0-9-]+$/),
        name: z.string().min(1),
        menuNumber: z.number().int().positive(),
        pricePerPerson: z.number().positive().finite().optional(),
        variants: z
          .array(
            z.object({
              name: z.string().min(1),
              pricePerPerson: z.number().positive().finite(),
            }),
          )
          .optional(),
        note: z.string().default(""),
        includes: z.array(z.string().min(1)).min(1),
      })
      .refine(
        (pkg) => pkg.pricePerPerson !== undefined || pkg.variants?.length,
        "A package needs a pricePerPerson or variants — no price-less packages",
      ),
  ),
  alaCarte: z.array(pricedLineSchema),
  desserts: z.array(pricedLineSchema),
  drinks: z.array(pricedLineSchema),
});

export type Catering = z.infer<typeof cateringSchema>;
export type CateringPackage = Catering["packages"][number];

export type DayHours = z.infer<typeof dayHoursSchema>;
export type WeeklyHours = z.infer<typeof weeklyHoursSchema>;
export type HolidayOverride = z.infer<typeof holidayOverrideSchema>;
export type Location = z.infer<typeof locationSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type Special = z.infer<typeof specialSchema>;
