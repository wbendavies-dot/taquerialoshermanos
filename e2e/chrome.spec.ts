import { expect, test } from "@playwright/test";

import locationsJson from "../src/content/locations.json";

const tucker = locationsJson.locations[0]!;

test.describe("order dialog", () => {
  test("header Order button opens dialog with all five locations linking to Toast", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("banner")
      .getByRole("button", { name: "Order online" })
      .click();

    const dialog = page.getByRole("dialog", { name: "Order online" });
    await expect(dialog).toBeVisible();

    for (const location of locationsJson.locations) {
      // Anchor to the start: "Lawrenceville" must not match Lilburn's
      // "4774 Lawrenceville Hwy" address inside the accessible name.
      await expect(
        dialog.getByRole("link", { name: new RegExp(`^${location.name}`) }),
      ).toHaveAttribute("href", location.toastUrl);
    }
  });

  test("Escape closes the dialog and focus returns to the trigger", async ({
    page,
  }) => {
    await page.goto("/");
    const trigger = page
      .getByRole("banner")
      .getByRole("button", { name: "Order online" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("choosing a location in order mode persists it across reloads", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("banner")
      .getByRole("button", { name: "Order online" })
      .click();

    // Click the Tucker link but block the off-site navigation.
    await page.route("https://order.toasttab.com/**", (route) => route.abort());
    await page
      .getByRole("dialog")
      .getByRole("link", { name: /Tucker/ })
      .click()
      .catch(() => {
        /* aborted navigation is expected */
      });

    await page.goto("/");
    const stored = await page.evaluate(() =>
      window.localStorage.getItem("lh-location"),
    );
    expect(stored).toBe("tucker");
  });
});

test.describe("mobile bottom bar", () => {
  test.skip(
    ({ isMobile }) => !isMobile,
    "bottom bar is mobile-only chrome (hidden ≥ md)",
  );

  test("without a remembered location, Call opens the chooser; choosing wires the bar", async ({
    page,
  }) => {
    await page.goto("/");
    const bar = page.getByRole("navigation", { name: "Quick actions" });
    await expect(bar).toBeVisible();

    await bar.getByRole("button", { name: "Call" }).click();
    const dialog = page.getByRole("dialog", { name: "Choose your taqueria" });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: /Tucker/ }).click();
    await expect(dialog).toBeHidden();

    await expect(bar.getByRole("link", { name: "Call" })).toHaveAttribute(
      "href",
      `tel:+1-${tucker.phone}`,
    );
    await expect(bar.getByRole("link", { name: "Directions" })).toHaveAttribute(
      "href",
      /google\.com\/maps\/dir/,
    );
    await expect(
      bar.getByRole("link", { name: /Order · Tucker/ }),
    ).toHaveAttribute("href", tucker.toastUrl);
  });

  test("remembered location survives reload and powers the bar directly", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() =>
      window.localStorage.setItem("lh-location", "dunwoody"),
    );
    await page.reload();

    const bar = page.getByRole("navigation", { name: "Quick actions" });
    const dunwoody = locationsJson.locations.find(
      (l) => l.slug === "dunwoody",
    )!;
    await expect(
      bar.getByRole("link", { name: /Order · Dunwoody/ }),
    ).toHaveAttribute("href", dunwoody.toastUrl);
    await expect(bar.getByRole("link", { name: "Call" })).toHaveAttribute(
      "href",
      `tel:+1-${dunwoody.phone}`,
    );
  });
});

test.describe("desktop chrome", () => {
  test.skip(({ isMobile }) => isMobile === true, "desktop-only checks");

  test("bottom bar is not rendered in the desktop layout", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("navigation", { name: "Quick actions" }),
    ).toBeHidden();
  });
});

test.describe("footer", () => {
  test("renders NAP for all five locations from the single source", async ({
    page,
  }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    for (const location of locationsJson.locations) {
      await expect(footer.getByText(location.address.street)).toBeVisible();
      await expect(
        footer.getByRole("link", { name: location.phone }),
      ).toHaveAttribute("href", `tel:+1-${location.phone}`);
    }
    await expect(
      footer.getByRole("link", { name: /Instagram/ }),
    ).toHaveAttribute("href", /instagram\.com\/taquerialoshermanos/);
  });
});
