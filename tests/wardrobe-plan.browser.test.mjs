// Mock-only: archived planning stays unreachable while direct try-on still works.
import { strict as assert } from "node:assert";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = process.env.TEST_ORIGIN || process.env.TEST_BASE_URL || "http://localhost:3500";
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chromium", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(10000);
const errors = [];
let tasks = 0;
page.on("pageerror", error => errors.push(error.message));
const noPlanning = async () => {
  assert.equal(await page.locator("#wedding-plan, .sf-week-board, .sf-plan-print").count(), 0, "archived board and printable output must not be mounted");
  assert.equal(await page.getByRole("button", { name: /^(Plan my|Build my plan|Create my celebration plan|Print \/ Save as PDF|(?:Plan|Planned) for )/ }).count(), 0);
  assert.equal(await page.locator('a[href*="view=plan"], a[href="#wedding-plan"]').count(), 0, "active links must not point into the archive");
};
try {
  assert.deepEqual(await page.request.get(`${base}/api/mode`).then(response => response.json()), { mode: "mock" });
  await page.route("**/api/skin", () => { throw new Error("Browsing must not analyze skin"); });
  await page.route("**/api/vto", async route => {
    tasks++;
    await route.fulfill({ json: { success: true, mode: "mock", resultUrl: `${base}/garment_test/editorial/emerald-kurta.jpg` } });
  });
  for (const path of ["/", "/?step=3&view=try-on", "/?step=3&view=plan", "/?view=plan", "/#wedding-plan", "/#how-it-works", "/#faq", "/library"]) {
    await page.goto(`${base}${path}`);
    await page.locator("#main-content").waitFor();
    if (path.includes("view=") || path === "/#wedding-plan") {
      await page.getByRole("heading", { name: "Your clothes. Your kind of look.", exact: true }).waitFor();
    }
    await noPlanning();
  }
  assert.equal(tasks, 0, "legacy links and normal browsing must not generate");
  await page.goto(`${base}/?step=3&occasion=sangeet&vto=concept-emerald-kurta`);
  const dialog = page.getByRole("dialog", { name: "Make this look yours." });
  await dialog.waitFor();
  await dialog.getByRole("button", { name: "I understand — continue" }).click();
  await dialog.getByRole("button", { name: "Use our sample model (woman)", exact: true }).click();
  await dialog.getByText("Photo ready. Uploading did not start a task.").waitFor();
  assert.equal(tasks, 0, "direct entry and photo preparation must not generate");
  await dialog.getByRole("button", { name: "Generate try-on", exact: true }).click();
  await dialog.getByText("Mock preview — reference outfit, not a personal try-on").waitFor();
  await dialog.getByRole("button", { name: "Close try-on" }).click();
  const comparison = page.getByRole("region", { name: "Compare session looks" });
  assert.equal(await comparison.locator("article").count(), 1);
  await noPlanning();
  assert.equal(await comparison.getByRole("button", { name: /^(?:Plan|Planned) for / }).count(), 0, "comparison must not retain hidden assignment actions");
  await comparison.getByRole("button", { name: "Show original", exact: true }).click();
  await comparison.getByAltText("Original photo for Emerald Silk Kurta").waitFor();
  await comparison.getByRole("button", { name: "Remove result for Emerald Silk Kurta", exact: true }).click();
  assert.equal(await comparison.count(), 0);
  assert.equal(tasks, 1, "comparison and removal must not generate");
  assert.deepEqual(errors, []);
  console.log("PASS: board/PDF/assignment controls archived, old links fall back to try-on, direct generation and comparison preserved");
} finally {
  await browser.close();
}
