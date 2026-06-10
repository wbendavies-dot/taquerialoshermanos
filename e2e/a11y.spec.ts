import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Automated accessibility gate (CLAUDE.md: axe in CI on every page
 * template). Catches ~40% of issues; manual keyboard/screen-reader passes
 * on money paths remain a release requirement.
 */
test.describe("accessibility", () => {
  test("homepage has no axe violations (WCAG 2.x A/AA)", async ({ page }) => {
    // Deterministic scans: entrance animations are instant under reduced
    // motion, so axe never reads contrast off a half-faded element.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    // Compact projection keeps failure diffs readable in CI logs.
    const violations = results.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => ({
        target: node.target.join(" "),
        summary: node.failureSummary,
      })),
    }));
    expect(violations).toEqual([]);
  });
});
