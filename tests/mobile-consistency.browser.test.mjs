// Isolated mock-only regression of consistent mobile navigation and accessible occasion controls.
import { strict as assert } from "node:assert";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chromium", headless: true });
const base = process.env.TEST_ORIGIN || process.env.TEST_BASE_URL || "http://localhost:3500";
const page = await browser.newPage({ viewport: { width: 320, height: 700 } });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
try {
  assert.deepEqual(await page.request.get(`${base}/api/mode`).then(res => res.json()), { mode: "mock" }, "only run against mock server");
  await page.goto(base);
  const subtitles = new Map([
    ["Sangeet", "Dance-floor moments"], ["Mehendi", "Colourful afternoons"],
    ["Haldi", "A little sunshine"], ["Wedding", "The big celebration"],
    ["Reception", "An evening to remember"],
  ]);
  for (const [name, subtitle] of subtitles) {
    const button = page.getByRole("button", { name: `${name} ${subtitle}`, exact: true });
    assert(await button.isVisible(), `${name} accessible name must include visible subtitle`);
  }
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 700 });
    await page.goto(`${base}/library`);
    await page.getByRole("heading", { name: "The celebration edit." }).waitFor();
    await page.getByText("To try a look, add a clear head-to-toe photo").waitFor();
    await page.getByRole("link", { name: "Skip to content", exact: true }).focus();
    await page.keyboard.press("Enter");
    assert(await page.locator("#main-content").evaluate(el => el === document.activeElement && !el.querySelector(".sf-navbar")), "library skip link must focus content after navigation");
    await page.keyboard.press("Tab");
    assert(await page.getByRole("link", { name: "Back to your looks", exact: true }).evaluate(el => el === document.activeElement), "Tab after skipping must enter library content");
    assert(await page.locator('input[type="search"], select').evaluateAll(fields => fields.every(el => parseFloat(getComputedStyle(el).fontSize) >= 16)), "mobile library fields must avoid iOS focus zoom");
    const nav = page.getByRole("navigation", { name: "App navigation" });
    assert.deepEqual(await nav.locator("a").allTextContents().then(items => items.map(item => item.trim())), ["For you", "Explore", "My clothes", "Shortlist"]);
    assert.equal(await nav.getByRole("link", { name: "Explore" }).getAttribute("aria-current"), "page");
    assert.equal(await nav.getByRole("link", { name: "My clothes" }).getAttribute("href"), "/?step=3&view=clothes");
    assert.equal(await nav.getByRole("link", { name: "Shortlist" }).getAttribute("href"), "/?step=3&view=shortlist");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "no horizontal overflow");
    const columns = await page.locator(".sf-library-grid").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
    assert.equal(columns, width === 320 ? 1 : 2, "narrow library cards must have readable columns");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    assert(await nav.evaluate(el => Math.abs(el.getBoundingClientRect().bottom - innerHeight) <= 1 && getComputedStyle(el).position === "fixed"), "library navigation stays fixed on scroll");
    await nav.getByRole("link", { name: "Shortlist" }).click();
    await page.getByRole("heading", { name: "Your shortlist." }).waitFor();
    assert.equal(await page.getByRole("navigation", { name: "App navigation" }).getByRole("button", { name: /Shortlist/ }).getAttribute("aria-current"), "page");
    await page.goto(`${base}/library`);
    await page.getByRole("navigation", { name: "App navigation" }).getByRole("link", { name: "My clothes" }).click();
    await page.getByRole("heading", { name: "Your clothes. Your kind of look." }).waitFor();
    assert(await page.getByRole("form", { name: "Add your own outfit" }).isVisible(), "My clothes link must open the wardrobe form");
    assert.equal(await page.getByRole("navigation", { name: "App navigation" }).getByRole("button", { name: "My clothes" }).getAttribute("aria-current"), "page");
  }
  assert.deepEqual(errors, []);
  console.log("PASS: mobile navigation parity, deep links, responsive library, and accessible occasion labels");
} finally {
  await browser.close();
}
