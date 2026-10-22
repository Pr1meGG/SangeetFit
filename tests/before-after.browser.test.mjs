// A synthetic live-shaped response checks inspection UI without contacting YouCam.
import { strict as assert } from "node:assert";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = process.env.TEST_ORIGIN || "http://localhost:3500";
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chromium", headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
let submissions = 0;

try {
  assert.deepEqual(await page.request.get(`${base}/api/mode`).then(response => response.json()), { mode: "mock" });
  await page.route("**/api/vto", async route => {
    submissions++;
    await route.fulfill({ json: { success: true, mode: "live", resultUrl: `${base}/garment_test/editorial/emerald-kurta.jpg` } });
  });
  await page.goto(`${base}/?step=3&occasion=sangeet&vto=concept-emerald-kurta`);
  const dialog = page.getByRole("dialog", { name: "Make this look yours." });
  await dialog.getByRole("button", { name: "I understand — continue" }).click();
  const person = await page.evaluate(() => {
    const canvas = Object.assign(document.createElement("canvas"), { width: 400, height: 600 });
    canvas.getContext("2d").fillRect(0, 0, 400, 600);
    return canvas.toDataURL("image/jpeg");
  });
  await page.getByLabel("Full-body photo", { exact: true }).setInputFiles({ name: "synthetic.jpg", mimeType: "image/jpeg", buffer: Buffer.from(person.split(",")[1], "base64") });
  await dialog.getByRole("button", { name: "Generate try-on" }).click();
  const range = dialog.getByRole("slider", { name: "Reveal before and after for Emerald Silk Kurta" });
  await range.waitFor();
  assert.equal(await range.inputValue(), "50");
  assert.equal(await range.locator("..").locator("img").last().evaluate(image => image.style.clipPath), "inset(0px 0px 0px 50%)");
  assert(await range.locator("..").evaluate(stage => stage.getBoundingClientRect().height > 100), "slider stage must remain visible");
  await range.focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await range.inputValue(), "51");
  assert.equal(await range.locator("..").locator("img").last().evaluate(image => image.style.clipPath), "inset(0px 0px 0px 49%)");
  await dialog.getByRole("button", { name: "Show original" }).click();
  assert.equal(await range.count(), 0);
  await dialog.getByRole("button", { name: "Show result" }).click();
  await range.waitFor();
  await dialog.getByRole("button", { name: "Close try-on" }).click();
  const comparisonRange = page.getByRole("region", { name: "Compare session looks" }).getByRole("slider", { name: "Reveal before and after for Emerald Silk Kurta" });
  await comparisonRange.waitFor();
  assert.equal(submissions, 1, "inspecting and reopening a result must not submit another task");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "mobile viewport must not overflow");
  console.log("PASS: live-shaped before/after slider supports keyboard and comparison with one explicit mock-stubbed request");
} finally {
  await browser.close();
}
