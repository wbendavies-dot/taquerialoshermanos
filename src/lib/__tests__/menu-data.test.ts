import { describe, expect, it } from "vitest";

import menuJson from "@/content/menu.json";
import { menuSchema } from "@/content/schema";

describe("shipped menu content", () => {
  const parsed = menuSchema.parse(menuJson);

  it("validates against the schema (every item priced)", () => {
    expect(parsed.categories.length).toBeGreaterThan(0);
  });

  it("has globally unique item ids", () => {
    const ids = parsed.categories.flatMap((c) => c.items.map((i) => i.id));
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(duplicates).toEqual([]);
  });

  it("has unique category slugs", () => {
    const slugs = parsed.categories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("contains the captured Dunwoody anchor items at their real prices", () => {
    const all = parsed.categories.flatMap((c) => c.items);
    const byId = new Map(all.map((i) => [i.id, i]));

    expect(byId.get("cesina-taco")?.price).toBe(4.5);
    expect(byId.get("molcajete")?.price).toBe(37.5);
    expect(byId.get("pastel-de-tres-leches")?.price).toBe(6.5);
    expect(byId.get("cheese-dip")?.priceFrom).toBe(true);
  });

  it("keeps prices in sane menu range", () => {
    for (const category of parsed.categories) {
      for (const item of category.items) {
        expect(item.price).toBeGreaterThan(0);
        expect(item.price).toBeLessThan(100);
      }
    }
  });
});
