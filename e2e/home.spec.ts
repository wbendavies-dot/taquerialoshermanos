import { expect, test } from "@playwright/test";

import menuJson from "../src/content/menu.json";
import { menuSchema } from "../src/content/schema";

const menu = menuSchema.parse(menuJson);

test.describe("homepage sections (Phase 3)", () => {
  test("hero renders the priority image and primary CTAs", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("img", { name: /burrito.*papel picado/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "View the menu" }),
    ).toHaveAttribute("href", "/menu");
    await expect(
      page.getByRole("link", { name: "Find your taqueria" }),
    ).toHaveAttribute("href", "#locations");
  });

  test("trust bar shows only verified claims", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(/Best Mexican Food.*Best of Perimeter/),
    ).toBeVisible();
    await expect(page.getByText("Family-owned since 2001")).toBeVisible();
  });

  test("favorites renders the six ranked bestsellers with prices", async ({
    page,
  }) => {
    await page.goto("/");
    const ranked = menu.categories
      .flatMap((c) => c.items)
      .filter((i) => i.popular && i.popularRank !== undefined)
      .sort((a, b) => (a.popularRank ?? 99) - (b.popularRank ?? 99))
      .slice(0, 6);
    expect(ranked).toHaveLength(6);
    expect(ranked[0]!.name).toBe("Brisket Tamales");

    const favorites = page.locator("section", {
      has: page.getByRole("heading", { name: "Lo más pedido" }),
    });
    for (const item of ranked) {
      await expect(
        favorites.getByRole("heading", { name: item.name, exact: true }),
      ).toBeVisible();
    }
    await expect(favorites.getByText("$19.50")).toBeVisible();
  });

  test("favorites Order opens the dialog without a location, links to Toast with one", async ({
    page,
  }) => {
    await page.goto("/");
    const favorites = page.locator("section", {
      has: page.getByRole("heading", { name: "Lo más pedido" }),
    });
    await favorites.getByRole("button", { name: "Order →" }).first().click();
    await expect(
      page.getByRole("dialog", { name: "Order online" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");

    await page.evaluate(() =>
      window.localStorage.setItem("lh-location", "tucker"),
    );
    await page.reload();
    await expect(
      favorites.getByRole("link", { name: "Order →" }).first(),
    ).toHaveAttribute("href", /order\.toasttab\.com.*tucker/);
  });

  test("testimonials show the three real reviews with attribution", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText(/World's best Corn and Shrimp chowder/)).toBeAttached();
    await expect(page.getByText("— Dave Scott")).toBeAttached();
    await expect(page.getByText("— Misty Sanders Bowman")).toBeAttached();
  });

  test("catering band links to the real catering email and phone", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Email the catering team" }),
    ).toHaveAttribute(
      "href",
      "mailto:Taquerialoshermanoscatering@gmail.com",
    );
    await expect(
      page.getByRole("link", { name: /Call Miguel/ }),
    ).toHaveAttribute("href", "tel:+1-404-993-8037");
  });

  test("location cards show a live open/closed badge", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#locations");
    // Status text appears after hydration; either state is valid.
    await expect(cards.getByText(/● Open|○ Closed/).first()).toBeVisible();
  });

  test("menu cards show the bestseller badge", async ({ page }) => {
    await page.goto("/menu");
    await expect(
      page.getByText("★ Lo más pedido").first(),
    ).toBeAttached();
  });
});
