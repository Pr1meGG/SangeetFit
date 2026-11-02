// Android Chrome emulation only. Physical camera, file picker and saving need a real phone.
import { strict as assert } from "node:assert";
import { createRequire } from "node:module";

const { chromium, devices } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = process.env.TEST_ORIGIN || "http://127.0.0.1:3500";
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chromium", headless: true });
const context = await browser.newContext({ ...devices["Pixel 7"] });
const page = await context.newPage();
let requests = 0;
let rejectBudget = true;
try {
  assert.deepEqual(await page.request.get(`${base}/api/mode`).then(response => response.json()), { mode: "mock" });
  await page.route("**/api/mode", route => route.fulfill({ json: { mode: "live" } }));
  await page.route("**/api/vto", route => {
    requests++;
    return route.fulfill(rejectBudget
      ? { status: 503, json: { success: false, error: "Live generation allowance reached. Browsing is still available." } }
      : { json: { success: true, mode: "live", resultUrl: `${base}/garment_test/editorial/emerald-kurta.jpg` } });
  });
  await page.goto(`${base}/?step=3&occasion=sangeet`);
  assert(await page.evaluate(() => navigator.maxTouchPoints > 0 && /Android/.test(navigator.userAgent)));
  for (const viewport of [{ width: 360, height: 800 }, { width: 393, height: 851 }, { width: 412, height: 915 }, { width: 851, height: 393 }]) {
    await page.setViewportSize(viewport);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `gallery overflow at ${viewport.width}px`);
  }
  await page.setViewportSize({ width: 393, height: 851 });
  await page.getByRole("button", { name: "Try on Emerald Silk Kurta", exact: true }).tap();
  const dialog = page.getByRole("dialog", { name: "Make this look yours." });
  await dialog.getByRole("button", { name: "I understand — continue" }).tap();
  const data = await page.evaluate(() => {
    const canvas = Object.assign(document.createElement("canvas"), { width: 400, height: 600 });
    canvas.getContext("2d").fillRect(0, 0, 400, 600);
    return canvas.toDataURL("image/jpeg").split(",")[1];
  });
  await dialog.getByLabel("Full-body photo", { exact: true }).setInputFiles({ name: "synthetic.jpg", mimeType: "image/jpeg", buffer: Buffer.from(data, "base64") });
  await dialog.getByText("Photo ready. Uploading did not start a task.").waitFor();
  assert.equal(requests, 0);
  const generate = dialog.getByRole("button", { name: "Generate try-on", exact: true });
  assert(await generate.isEnabled(), "prepared photo enables Generate without a code");
  assert.equal(await dialog.getByLabel("Preview access code", { exact: false }).count(), 0);
  assert((await generate.boundingBox()).height >= 44, "primary touch target must be at least 44px");
  await generate.tap();
  await dialog.getByText("Live generation allowance reached. Browsing is still available.", { exact: true }).waitFor();
  assert.equal(requests, 1, "budget failure must not retry");
  rejectBudget = false;
  await generate.tap();
  const slider = dialog.getByRole("slider");
  await slider.waitFor();
  await slider.scrollIntoViewIfNeeded();
  const rectangle = await slider.boundingBox();
  assert(rectangle.height >= 44);
  await page.touchscreen.tap(rectangle.x + rectangle.width * 0.8, rectangle.y + rectangle.height / 2);
  assert(Number(await slider.inputValue()) >= 70, "touch must move before/after range");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await dialog.getByRole("button", { name: "Close try-on" }).tap();
  await page.getByRole("button", { name: "Show original", exact: true }).tap();
  assert.equal(requests, 2, "comparison and original view must not generate");
  console.log("PASS: Android touch emulation, 360–851px layouts, local preparation, budget error, slider and comparison; physical device untested");
} finally {
  await context.close();
  await browser.close();
}
