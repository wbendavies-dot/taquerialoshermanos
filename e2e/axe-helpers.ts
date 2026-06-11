import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

/**
 * Deterministic axe scan: scroll through the page so every entrance
 * animation has triggered and finished before contrast is measured —
 * axe must never read a half-faded element (the source of flaky
 * color-contrast failures).
 */
export async function settledAxeScan(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);

  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  // Longest reveal: 350ms duration + 200ms max stagger delay.
  await page.waitForTimeout(700);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  // Compact projection keeps failure diffs readable in CI logs.
  return results.violations.map((violation) => ({
    id: violation.id,
    nodes: violation.nodes.map((node) => ({
      target: node.target.join(" "),
      summary: node.failureSummary,
    })),
  }));
}
