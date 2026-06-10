import { test } from "@playwright/test";

/**
 * Visual-review captures (not assertions). Skipped in CI; run locally:
 *   npx playwright test e2e/screenshots.spec.ts --project=mobile
 */
test.describe("review screenshots", () => {
  test.skip(!!process.env["CI"], "local visual review only");

  test("capture chrome states", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: ".screenshots/p1-top.png" });

    await page
      .getByRole("banner")
      .getByRole("button", { name: "Order online" })
      .click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: ".screenshots/p1-dialog.png" });
  });
});
