import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Automated accessibility gate (CLAUDE.md: axe in CI on every page
 * template). Catches ~40% of issues; manual keyboard/screen-reader passes
 * on money paths remain a release requirement.
 */
test.describe("accessibility", () => {
  test("homepage has no axe violations (WCAG 2.x A/AA)", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
