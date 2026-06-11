/**
 * One-off data-gathering utility (not part of the build): loads a public
 * Toast ordering page in a real browser and dumps its menu structure so
 * real prices can be entered into src/content/menu.json.
 *
 * Usage: node scripts/scrape-toast.mjs <toast-url> <out-prefix>
 */
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const [url, outPrefix = "toast-dump"] = process.argv.slice(2);
if (!url) {
  console.error("Usage: node scripts/scrape-toast.mjs <toast-url> <out-prefix>");
  process.exit(1);
}

mkdirSync(".toast-data", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
});

console.log(`Loading ${url} ...`);
const response = await page.goto(url, {
  waitUntil: "domcontentloaded",
  timeout: 60_000,
});
console.log(`HTTP ${response?.status()}`);

// Give the SPA time to render the menu.
await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {
  console.log("(networkidle timeout — continuing with what rendered)");
});
await page.waitForTimeout(3_000);

// 1) Full rendered text (for manual inspection / price extraction).
const text = await page.evaluate(() => document.body.innerText);
writeFileSync(`.toast-data/${outPrefix}.txt`, text, "utf8");

// 2) Any embedded JSON state Toast ships with the page.
const embedded = await page.evaluate(() => {
  const out = {};
  const next = document.getElementById("__NEXT_DATA__");
  if (next) out.nextData = next.textContent;
  for (const script of document.querySelectorAll(
    'script[type="application/ld+json"]',
  )) {
    out.ldJson ??= [];
    out.ldJson.push(script.textContent);
  }
  return out;
});
writeFileSync(
  `.toast-data/${outPrefix}.embedded.json`,
  JSON.stringify(embedded, null, 2),
  "utf8",
);

await page.screenshot({
  path: `.toast-data/${outPrefix}.png`,
  fullPage: false,
});

await browser.close();
console.log(`Wrote .toast-data/${outPrefix}.txt / .embedded.json / .png`);
