import { describe, expect, it } from "vitest";

import type { Location } from "@/content/schema";
import { directionsHref, telHref } from "@/lib/links";

const tucker: Location = {
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
  holidayOverrides: [],
};

describe("telHref", () => {
  it("builds a tappable US tel link", () => {
    expect(telHref(tucker)).toBe("tel:+1-678-937-0660");
  });
});

describe("directionsHref", () => {
  it("builds a Google Maps directions link with the full canonical address", () => {
    const href = directionsHref(tucker);
    expect(href).toMatch(/^https:\/\/www\.google\.com\/maps\/dir\/\?api=1/);
    const url = new URL(href);
    expect(url.searchParams.get("destination")).toBe(
      "Taqueria Los Hermanos, 4418 Hugh Howell Rd # B3, Tucker, GA 30084",
    );
  });
});
