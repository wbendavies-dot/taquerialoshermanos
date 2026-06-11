import { expect, test } from "@playwright/test";

import locationsJson from "../src/content/locations.json";

test.describe("catering page (demo stage)", () => {
  test("renders all four packages with real per-person prices", async ({
    page,
  }) => {
    await page.goto("/catering");
    await expect(
      page.getByRole("heading", { name: "Catering by Los Hermanos" }),
    ).toBeVisible();

    for (const [name, price] of [
      ["Taco Bar", "$14.95"],
      ["Nacho Bar", "$13.95"],
      ["Quesadilla Bar", "$12.95"],
    ] as const) {
      const card = page.getByRole("listitem").filter({
        has: page.getByRole("heading", { name, exact: true }),
      });
      await expect(card.getByText(`${price}/person`)).toBeAttached();
    }
    // Fajita Bar prices by protein variant.
    await expect(page.getByText("Steak · $16.95")).toBeAttached();
    // Total anchor: Taco Bar for 20 = 14.95 * 20.
    await expect(page.getByText("$299.00")).toBeAttached();
  });

  test("inquiry form builds a complete mailto link", async ({ page }) => {
    await page.goto("/catering");
    const form = page.locator("form");

    // Incomplete form: submit is a disabled button (no dead links).
    await expect(
      form.getByRole("button", { name: "Email us this inquiry" }),
    ).toBeDisabled();

    await form.getByLabel("Event type").selectOption("Office / corporate");
    await form.getByLabel("Event date").fill("2026-07-15");
    await form.getByLabel("Guest count").fill("25");
    await form.getByLabel("Your name").fill("Test Planner");

    const submit = form.getByRole("link", { name: "Email us this inquiry" });
    await expect(submit).toBeVisible();
    const href = await submit.getAttribute("href");
    expect(href).toContain("mailto:Taquerialoshermanoscatering@gmail.com");
    expect(href).toContain(encodeURIComponent("Office / corporate"));
    expect(href).toContain(encodeURIComponent("Guest count: 25"));
  });

  test("embeds FAQ structured data", async ({ page }) => {
    await page.goto("/catering");
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    expect(JSON.parse(jsonLd!)["@type"]).toBe("FAQPage");
  });
});

test.describe("location pages", () => {
  test("index lists all five locations with details links", async ({
    page,
  }) => {
    await page.goto("/locations");
    const main = page.getByRole("main");
    for (const location of locationsJson.locations) {
      const card = main.getByRole("listitem").filter({
        has: page.getByRole("heading", { name: location.name, exact: true }),
      });
      await expect(card.getByText(location.address.street)).toBeVisible();
      await expect(card.getByRole("link", { name: "Details" })).toHaveAttribute(
        "href",
        `/locations/${location.slug}`,
      );
    }
  });

  for (const location of locationsJson.locations) {
    test(`${location.slug} page has NAP, city title, and Restaurant schema`, async ({
      page,
    }) => {
      await page.goto(`/locations/${location.slug}`);

      await expect(page).toHaveTitle(
        new RegExp(`${location.address.city}, GA`),
      );
      // Scope to main: the footer and location dialog repeat addresses.
      await expect(
        page.getByRole("main").getByText(location.address.street),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: `Order from ${location.name}` }),
      ).toHaveAttribute("href", location.toastUrl);

      const jsonLd = await page
        .locator('script[type="application/ld+json"]')
        .first()
        .textContent();
      const parsed = JSON.parse(jsonLd!);
      expect(parsed["@type"]).toBe("Restaurant");
      expect(parsed.address.streetAddress).toBe(location.address.street);
      expect(parsed.telephone).toBe(`+1-${location.phone}`);
    });
  }

  test("unknown location 404s", async ({ request }) => {
    const response = await request.get("/locations/atlanta");
    expect(response.status()).toBe(404);
  });
});

test.describe("nuestra historia", () => {
  test("tells the owner-provided origin story", async ({ page }) => {
    await page.goto("/nuestra-historia");
    await expect(
      page.getByRole("heading", { name: "Nuestra Historia" }),
    ).toBeVisible();
    await expect(
      page.getByText(/Miguel, Roel and Raul/),
    ).toBeVisible();
    await expect(
      page.getByText(/southwestern coast of Mexico/),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Find your taqueria" }),
    ).toHaveAttribute("href", "/locations");
  });
});

test.describe("site navigation", () => {
  test("sitemap.xml lists all pages including the five locations", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    for (const path of ["/menu", "/catering", "/nuestra-historia"]) {
      expect(xml).toContain(path);
    }
    for (const location of locationsJson.locations) {
      expect(xml).toContain(`/locations/${location.slug}`);
    }
  });

  test("mobile drawer opens, navigates, and traps focus", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "drawer is mobile chrome");
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation" }).click();

    const drawer = page.getByRole("dialog", { name: "Site navigation" });
    await expect(drawer).toBeVisible();
    await expect(
      drawer.getByRole("link", { name: "Catering" }),
    ).toHaveAttribute("href", "/catering");

    await drawer.getByRole("link", { name: "Nuestra Historia" }).click();
    await expect(page).toHaveURL(/nuestra-historia/);
    await expect(drawer).toBeHidden();
  });

  test("desktop header links to every page", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "desktop nav");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const [label, href] of [
      ["Menu", "/menu"],
      ["Catering", "/catering"],
      ["Locations", "/locations"],
      ["Nuestra Historia", "/nuestra-historia"],
    ] as const) {
      await expect(nav.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
    }
  });
});
