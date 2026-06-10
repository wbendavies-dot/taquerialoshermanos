import { describe, expect, it } from "vitest";

import {
  locationSchema,
  menuItemSchema,
  specialSchema,
} from "@/content/schema";
import locationsJson from "@/content/locations.json";

const validItem = {
  id: "cesina-taco",
  name: "Cesina Taco",
  description: "Salted beef, onion, cilantro on a handmade tortilla.",
  price: 4.25,
  toastCategory: "tacos",
};

describe("menuItemSchema (the no-price-less-menu gate)", () => {
  it("accepts a complete item", () => {
    expect(menuItemSchema.safeParse(validItem).success).toBe(true);
  });

  it("rejects an item without a price", () => {
    const withoutPrice: Record<string, unknown> = { ...validItem };
    delete withoutPrice["price"];
    expect(menuItemSchema.safeParse(withoutPrice).success).toBe(false);
  });

  it("rejects zero and negative prices", () => {
    expect(menuItemSchema.safeParse({ ...validItem, price: 0 }).success).toBe(
      false,
    );
    expect(
      menuItemSchema.safeParse({ ...validItem, price: -4.25 }).success,
    ).toBe(false);
  });

  it("rejects an item without a Toast category mapping", () => {
    const withoutToast: Record<string, unknown> = { ...validItem };
    delete withoutToast["toastCategory"];
    expect(menuItemSchema.safeParse(withoutToast).success).toBe(false);
  });

  it("rejects invalid price overrides", () => {
    expect(
      menuItemSchema.safeParse({
        ...validItem,
        priceOverrides: { tucker: 0 },
      }).success,
    ).toBe(false);
  });
});

const validLocation = {
  slug: "tucker",
  name: "Tucker",
  address: {
    street: "4418 Hugh Howell Rd # B3",
    city: "Tucker",
    state: "GA",
    zip: "30084",
  },
  phone: "678-937-0660",
  toastUrl:
    "https://order.toasttab.com/online/taqueria-los-hermanos-tucker-new-4418-hugh-howell-rd-ste-b-3",
  hours: {
    sun: { open: "11:30", close: "21:00" },
    mon: { open: "11:00", close: "21:00" },
    tue: { open: "11:00", close: "21:00" },
    wed: { open: "11:00", close: "21:00" },
    thu: { open: "11:00", close: "21:00" },
    fri: { open: "11:00", close: "22:00" },
    sat: { open: "11:00", close: "22:00" },
  },
};

describe("locationSchema (the NAP/Toast single-source gate)", () => {
  it("accepts a complete location", () => {
    expect(locationSchema.safeParse(validLocation).success).toBe(true);
  });

  it("rejects ordering URLs that are not toasttab.com", () => {
    expect(
      locationSchema.safeParse({
        ...validLocation,
        toastUrl: "https://www.doordash.com/store/los-hermanos",
      }).success,
    ).toBe(false);
  });

  it("rejects malformed phone numbers", () => {
    expect(
      locationSchema.safeParse({ ...validLocation, phone: "6789370660" })
        .success,
    ).toBe(false);
  });

  it("rejects malformed hours", () => {
    expect(
      locationSchema.safeParse({
        ...validLocation,
        hours: { ...validLocation.hours, mon: { open: "11am", close: "9pm" } },
      }).success,
    ).toBe(false);
  });
});

describe("shipped content", () => {
  it("contains all five metro Atlanta locations, valid", () => {
    const slugs = locationsJson.locations.map((l) => l.slug);
    expect(slugs).toEqual([
      "tucker",
      "lilburn",
      "suwanee",
      "lawrenceville",
      "dunwoody",
    ]);
    for (const location of locationsJson.locations) {
      expect(locationSchema.safeParse(location).success).toBe(true);
    }
  });
});

describe("specialSchema", () => {
  it("rejects a special without a display window", () => {
    expect(
      specialSchema.safeParse({
        id: "taco-tuesday",
        title: "Taco Tuesday",
        description: "Three tacos special.",
      }).success,
    ).toBe(false);
  });
});
