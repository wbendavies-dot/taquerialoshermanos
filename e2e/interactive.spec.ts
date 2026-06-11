import { expect, test } from "@playwright/test";

test.describe("interactive motion layer", () => {
  test("scroll progress bar exists, is decorative, and tracks scroll", async ({
    page,
  }) => {
    await page.goto("/");
    const bar = page.locator('[aria-hidden="true"].fixed.top-0').first();
    await expect(bar).toBeAttached();
    // Let hydration finish — scrolling mid-hydration is a test-only race
    // (pre-hydration scroll restoration is covered by the mount sync in
    // ScrollProgressBar).
    await page.waitForLoadState("networkidle");

    // Instant scroll (the site uses scroll-behavior: smooth) and a wait
    // long enough for the progress spring to settle.
    await page.evaluate(() =>
      window.scrollTo({
        top: document.body.scrollHeight / 2,
        behavior: "instant",
      }),
    );
    await page.waitForTimeout(1500);
    const probe = await bar.evaluate((el) => ({
      scrollY: window.scrollY,
      inline: (el as HTMLElement).style.transform,
      computed: getComputedStyle(el).transform,
    }));
    expect(probe.scrollY).toBeGreaterThan(100);
    // Framer writes scaleX(n) inline; computed resolves to matrix(n, ...).
    const source = probe.inline || probe.computed;
    const match = source.match(/(?:scaleX\(|matrix\()([\d.]+)/);
    const scale = match ? Number(match[1]) : 0;
    expect(scale).toBeGreaterThan(0.05);
  });

  test("hero content is server-rendered despite the motion layer (SEO)", async ({
    request,
  }) => {
    const response = await request.get("/");
    const html = await response.text();
    expect(html).toContain("Los Hermanos");
    expect(html).toContain("Three brothers. One kitchen.");
    expect(html).toContain("View the menu");
  });

  test("dish ribbon renders doubled decorative content", async ({ page }) => {
    await page.goto("/");
    const ribbon = page.locator('[aria-hidden="true"]', {
      hasText: "Quesabirria",
    });
    await expect(ribbon.first()).toBeAttached();
    // Two copies for the seamless loop.
    expect(await page.getByText("Quesabirria").count()).toBe(2);
  });

  test("magnetic CTAs remain plain working links", async ({ page }) => {
    await page.goto("/");
    const heroMenuLink = page
      .locator("section")
      .first()
      .getByRole("link", { name: /View the menu/ });
    await expect(heroMenuLink).toHaveAttribute("href", "/menu");
    await heroMenuLink.click();
    await expect(page).toHaveURL(/\/menu/);
  });

  test("reduced motion: page renders fully with motion statics", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Los Hermanos" }),
    ).toBeVisible();
    // Parallax/spotlight/magnetic must not break content visibility.
    await expect(page.getByRole("link", { name: /View the menu/ })).toBeVisible();
  });
});
