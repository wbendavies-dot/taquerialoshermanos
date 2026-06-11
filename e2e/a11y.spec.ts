import { expect, test } from "@playwright/test";

import { settledAxeScan } from "./axe-helpers";

/**
 * Automated accessibility gate (CLAUDE.md: axe in CI on every page
 * template). Catches ~40% of issues; manual keyboard/screen-reader passes
 * on money paths remain a release requirement.
 */
test.describe("accessibility", () => {
  for (const path of [
    "/",
    "/menu",
    "/catering",
    "/locations",
    "/locations/tucker",
    "/nuestra-historia",
  ]) {
    test(`${path} has no axe violations (WCAG 2.x A/AA)`, async ({ page }) => {
      const violations = await settledAxeScan(page, path);
      expect(violations).toEqual([]);
    });
  }
});
