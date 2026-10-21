// Run against the local mock server; reuse an installed Playwright via PLAYWRIGHT_MODULE_PATH.
import { strict as assert } from "node:assert";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
const base = process.env.TEST_ORIGIN || process.env.TEST_BASE_URL || "http://localhost:3500";
const errors = [];
page.on("pageerror", error => errors.push(error.message));
let vtoRequests = 0;
let skinRequests = 0;
page.on("request", req => {
  if (req.url().endsWith("/api/vto")) {
    vtoRequests++;
    const data = req.postDataJSON();
    assert.equal(data.garmentId, "library-navy-gold-lehenga");
    assert.equal(data.referenceAsset, "library/navy-gold-lehenga.png");
    assert(data.fullBodyDataUrl.startsWith("data:image/jpeg;base64,"));
  }
  if (req.url().endsWith("/api/skin")) skinRequests++;
});
try {
  assert.deepEqual(await page.request.get(`${base}/api/mode`).then(r => r.json()), { mode: "mock" });
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(base);
  const browseLink = page.getByRole("link", { name: "Explore outfits" });
  assert(await browseLink.isVisible(), "photo-free browsing must be visible on a narrow phone");
  assert(await page.getByRole("navigation", { name: "App navigation" }).getByRole("link", { name: "Explore" }).isVisible());
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await browseLink.click();
  await page.getByRole("heading", { name: "The celebration edit." }).waitFor();
  assert.equal(await page.getByRole("article").count(), 8);
  assert.equal(vtoRequests, 0, "browsing must not generate a task");
  console.log("PASS: narrow-phone landing exposes photo-free browse; collection defaults to try-on references without a task");

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${base}/library`);
  await page.getByText("Search and filter outfits").click();
  await page.getByLabel("Try-on references only").uncheck();
  assert.equal(await page.getByRole("article").count(), 14);
  for (const article of await page.getByRole("article").all()) {
    const image = article.getByRole("img");
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(img => img.decode());
    assert(await image.evaluate(img => img.naturalWidth >= 320));
    assert.equal(await article.getByRole("link").filter({ hasText: /CC0|CC BY-SA|Public domain/ }).count(), 1);
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  console.log("PASS: all 14 local photos decode, show source/license credits and fit mobile layout");

  await page.getByLabel("Collection", { exact: true }).selectOption("men");
  assert.equal(await page.getByRole("article").count(), 6);
  await page.getByLabel("Occasion", { exact: true }).selectOption("sangeet");
  assert.equal(await page.getByRole("article").count(), 4);
  await page.getByLabel("Try-on references only").check();
  assert.equal(await page.getByRole("article").count(), 3);
  await page.getByRole("searchbox").fill("nonexistent-garment");
  await page.getByText("No garments match these filters.").waitFor();
  await page.getByRole("button", { name: "Clear filters" }).click();
  assert.equal(await page.getByRole("article").count(), 8);
  await page.getByRole("searchbox").fill("Navy");
  assert.equal(await page.getByRole("article").count(), 1);
  console.log("PASS: collection, occasion, reference and text filters combine; empty state resets");

  await page.getByLabel("Occasion", { exact: true }).selectOption("reception");
  const tryLink = page.getByRole("link", { name: "Try with your photo" });
  assert((await tryLink.getAttribute("href")).includes("occasion=reception"), "secondary occasion must survive a reference link");
  await tryLink.click();
  await page.getByText("Start virtual try-on with a photo of yourself.", { exact: true }).waitFor();
  assert.equal(vtoRequests, 0, "opening a library link must not submit a task");
  await page.getByRole("button", { name: "I understand — continue" }).click();
  await page.locator("#fullbody-file").setInputFiles(fileURLToPath(new URL("../public/garment_test/fullbody_mock.png", import.meta.url)));
  await page.getByText("Photo ready. Uploading did not start a task.", { exact: true }).waitFor();
  assert.equal(vtoRequests, 0, "uploading the source must not generate");
  await page.getByRole("button", { name: "Generate try-on", exact: true }).click();
  await page.getByText("Mock preview — reference outfit, not a personal try-on", { exact: true }).waitFor();
  await page.waitForTimeout(800); // catch the former URL-restoration duplicate-submit timer
  assert.equal(vtoRequests, 1, "linked full-body upload must submit exactly once");
  assert.equal(skinRequests, 0, "direct try-on needs no skin-analysis task");
  assert((await page.getByAltText("Try-on result for Navy & Gold Lehenga").getAttribute("src")).endsWith("/garment_test/library/navy-gold-lehenga.png"));
  assert.deepEqual(errors, []);
  console.log("PASS: library link opens exact outfit; confirmed full-body upload produces one mock request and the matching result");
} finally { await browser.close(); }
