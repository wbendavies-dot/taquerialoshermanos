import { expect, test } from "@playwright/test";

import locationsJson from "../src/content/locations.json";

test.describe("homepage", () => {
  test("renders brand and all five locations with correct Toast links", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Los Hermanos" }),
    ).toBeVisible();

    const main = page.getByRole("main");
    for (const location of locationsJson.locations) {
      const card = main.getByRole("listitem").filter({
        has: page.getByRole("heading", { name: location.name, exact: true }),
      });
      await expect(card).toBeVisible();
      await expect(card.getByText(location.address.street)).toBeVisible();
      await expect(
        card.getByRole("link", { name: `${location.phone}` }),
      ).toHaveAttribute("href", `tel:+1-${location.phone}`);
      await expect(
        card.getByRole("link", { name: new RegExp("Order online") }),
      ).toHaveAttribute("href", location.toastUrl);
    }
  });

  test("has a single h1 and a page title with local keywords", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Taqueria Los Hermanos/);
    await expect(page).toHaveTitle(/Atlanta/);
    // Audit scar tissue: the old Wix title ended in "United States".
    await expect(page).not.toHaveTitle(/United States/);
  });
});

test.describe("legacy Wix URL redirects", () => {
  for (const legacyPath of ["/menu-1", "/copy-of-menu", "/online-order"]) {
    test(`${legacyPath} permanently redirects`, async ({ request }) => {
      const response = await request.get(legacyPath, {
        maxRedirects: 0,
      });
      expect(response.status()).toBe(308);
      expect(response.headers()["location"]).toBe("/");
    });
  }
});
