// Mock-only retirement regression: old selfie URLs reach try-on without camera access.
import { strict as assert } from "node:assert";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chromium", headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
const base = process.env.TEST_ORIGIN || process.env.TEST_BASE_URL || "http://localhost:3500";
const errors = [];
let skinRequests = 0;
let modelRequests = 0;
let vtoRequests = 0;
page.on("pageerror", error => errors.push(error.message));
try {
  assert.deepEqual(await page.request.get(`${base}/api/mode`).then(response => response.json()), { mode: "mock" });
  await page.addInitScript(() => {
    window.__cameraCalls = 0;
    if (navigator.mediaDevices) Object.defineProperty(navigator.mediaDevices, "getUserMedia", { value: async () => {
      window.__cameraCalls++;
      throw new DOMException("Camera must remain unused", "NotAllowedError");
    } });
  });
  await page.route("**/api/skin", async route => { skinRequests++; await route.abort(); });
  await page.route("**/api/vto", async route => { vtoRequests++; await route.abort(); });
  await page.route("https://cdn.jsdelivr.net/npm/@mediapipe/**", async route => { modelRequests++; await route.abort(); });
  const noSelfie = async () => {
    assert.equal(await page.locator("#selfie-file, .cap-stage, .sf-palette-row").count(), 0);
    assert.equal(await page.getByRole("button", { name: /^(Use camera instead|Analyze selfie|Optional skin-tone analysis)$/ }).count(), 0);
    assert.equal(await page.getByLabel("Selfie photo", { exact: true }).count(), 0);
    assert.equal(await page.evaluate(() => window.__cameraCalls), 0, "retired selfie entry must never request the camera");
  };
  await page.goto(base);
  await page.getByRole("button", { name: "Reception An evening to remember", exact: true }).click();
  await page.getByRole("heading", { name: "Your clothes. Your kind of look.", exact: true }).waitFor();
  assert.equal(await page.getByRole("group", { name: "Choose occasion", exact: true }).getByRole("button", { name: "Reception", exact: true }).getAttribute("aria-pressed"), "true");
  await noSelfie();
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/?step=2&occasion=sangeet&skin=%23b9947c`);
    await page.getByRole("heading", { name: "Your clothes. Your kind of look.", exact: true }).waitFor();
    const colour = page.getByRole("combobox", { name: "Preferred colour", exact: true });
    assert.equal(await colour.inputValue(), "", "old skin parameters must not set a colour preference");
    await colour.selectOption("#6b1e3a");
    assert.equal(await colour.inputValue(), "#6b1e3a", "manual colour filtering stays available");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await noSelfie();
  }
  await page.goto(`${base}/?step=2&vto=concept-emerald-kurta`);
  const dialog = page.getByRole("dialog", { name: "Make this look yours." });
  await dialog.waitFor();
  await dialog.getByRole("button", { name: "I understand — continue" }).click();
  await dialog.getByRole("button", { name: "Use our sample model (woman)", exact: true }).click();
  await dialog.getByText("Photo ready. Uploading did not start a task.").waitFor();
  assert(await dialog.getByRole("button", { name: "Generate try-on", exact: true }).isEnabled());
  await noSelfie();
  assert.equal(skinRequests, 0);
  assert.equal(modelRequests, 0, "no face-tracking model should be loaded");
  assert.equal(vtoRequests, 0, "photo preparation still requires an explicit Generate");
  assert.deepEqual(errors, []);
  console.log("PASS: selfie/camera UI archived, legacy step2 links reach try-on, manual colours remain and no camera/model/API task is requested");
} finally {
  await browser.close();
}
