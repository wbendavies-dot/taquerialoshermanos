/**
 * Headed menu capture: opens a visible browser so YOU can pass the
 * Cloudflare "Verify you are human" check; once the menu renders, the
 * script dumps it automatically and closes.
 *
 * Usage: node scripts/scrape-toast-headed.mjs [toast-url] [out-prefix]
 * Defaults to the Dunwoody location.
 */
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const DEFAULT_URL =
  "https://order.toasttab.com/online/taqueria-los-hermanos-dunwoody-new-5500-chamblee-dunwoody-rd-ste-3";

const [url = DEFAULT_URL, outPrefix = "dunwoody"] = process.argv.slice(2);

mkdirSync(".toast-data", { recursive: true });

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

console.log(`Opening ${url}`);
console.log(
  "→ If Cloudflare shows a checkbox, click it. The script waits up to 3 minutes for the menu to appear, then saves everything automatically.",
);
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });

// Wait until the page contains several price-looking strings — the sign
// the real menu (not the challenge page) has rendered.
await page.waitForFunction(
  () => (document.body.innerText.match(/\$\d+\.\d{2}/g) ?? []).length > 10,
  { timeout: 180_000 },
);

// Let lazy sections settle, then scroll through the page to force-render
// every category before capturing.
await page.waitForTimeout(2_000);
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 800) {
    window.scrollTo(0, y);
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1_000);

const text = await page.evaluate(() => document.body.innerText);
writeFileSync(`.toast-data/${outPrefix}.txt`, text, "utf8");

const html = await page.content();
writeFileSync(`.toast-data/${outPrefix}.html`, html, "utf8");

await page.screenshot({
  path: `.toast-data/${outPrefix}.png`,
  fullPage: true,
});

await browser.close();
console.log(
  `Done — wrote .toast-data/${outPrefix}.txt, .html, and .png. Tell Claude it's ready.`,
);
