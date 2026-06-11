import { expect, test } from "@playwright/test";

import locationsJson from "../src/content/locations.json";
import menuJson from "../src/content/menu.json";

const categoryCount = menuJson.categories.length;
const itemCount = menuJson.categories.reduce(
  (n, c) => n + c.items.length,
  0,
);

test.describe("menu page", () => {
  test("server-rendered HTML contains every category and priced item (SEO)", async ({
    request,
  }) => {
    const response = await request.get("/menu");
    expect(response.status()).toBe(200);
    const html = await response.text();

    for (const category of menuJson.categories) {
      expect(html).toContain(category.name);
    }
    // Spot-check items across the menu, including prices.
    expect(html).toContain("Cesina Taco");
    expect(html).toContain("$4.50");
    expect(html).toContain("Molcajete");
    expect(html).toContain("$37.50");
    expect(html).toContain("Pastel De Tres Leches");
  });

  test("renders all categories and items in the browser", async ({ page }) => {
    await page.goto("/menu");
    await expect(
      page.getByRole("heading", { level: 1, name: "The Menu" }),
    ).toBeVisible();
    // One section heading per category.
    for (const category of menuJson.categories) {
      await expect(
        page.getByRole("heading", { level: 2, name: category.name }),
      ).toBeAttached();
    }
  });

  test("search filters items and announces the result count", async ({
    page,
  }) => {
    await page.goto("/menu");
    await page.getByRole("searchbox").fill("brisket");

    await expect(page.getByText(/dishes found/)).toBeVisible();
    await expect(page.getByText("Brisket Taquitos")).toBeVisible();
    await expect(page.getByText("Cesina Taco", { exact: true })).toBeHidden();
  });

  test("vegetarian filter shows only tagged items", async ({ page }) => {
    await page.goto("/menu");
    await page.getByRole("button", { name: "Vegetarian" }).click();

    await expect(page.getByText("Veggie Fajitas")).toBeVisible();
    await expect(page.getByText("Asada Taco", { exact: true })).toBeHidden();

    const expected = menuJson.categories.reduce(
      (n, c) =>
        n + c.items.filter((i) => i.dietary?.includes("vegetarian")).length,
      0,
    );
    await expect(page.getByText(`${expected} dishes found.`)).toBeVisible();
  });

  test("filter state round-trips through the URL", async ({ page }) => {
    await page.goto("/menu?q=churros&diet=vegetarian");
    await expect(page.getByRole("searchbox")).toHaveValue("churros");
    await expect(
      page.getByRole("button", { name: "Vegetarian" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("with a remembered location, Add to order links to that location's Toast", async ({
    page,
  }) => {
    const suwanee = locationsJson.locations.find((l) => l.slug === "suwanee")!;
    await page.goto("/menu");
    await page.evaluate(() =>
      window.localStorage.setItem("lh-location", "suwanee"),
    );
    await page.reload();

    await expect(
      page.getByRole("button", { name: /Prices for Suwanee/ }),
    ).toBeVisible();
    const firstAdd = page
      .getByRole("link", { name: /Add to order · Suwanee/ })
      .first();
    await expect(firstAdd).toHaveAttribute("href", suwanee.toastUrl);
  });

  test("without a location, Add to order opens the order dialog", async ({
    page,
  }) => {
    await page.goto("/menu");
    await page
      .getByRole("button", { name: "Add to order →" })
      .first()
      .click();
    await expect(
      page.getByRole("dialog", { name: "Order online" }),
    ).toBeVisible();
  });

  test("valid Menu JSON-LD is embedded", async ({ page }) => {
    await page.goto("/menu");
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const parsed = JSON.parse(jsonLd!);
    expect(parsed["@type"]).toBe("Menu");
    expect(parsed.hasMenuSection).toHaveLength(categoryCount);
    const totalItems = parsed.hasMenuSection.reduce(
      (n: number, s: { hasMenuItem: unknown[] }) => n + s.hasMenuItem.length,
      0,
    );
    expect(totalItems).toBe(itemCount);
  });

  test("legacy /menu-1 now redirects to /menu", async ({ request }) => {
    const response = await request.get("/menu-1", { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers()["location"]).toBe("/menu");
  });

});
