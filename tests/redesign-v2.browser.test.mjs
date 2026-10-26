// Mock-only: navigation must preserve the private page session and submit no AI tasks.
import { strict as assert } from "node:assert";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chromium", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(10000);
const base = process.env.TEST_ORIGIN || process.env.TEST_BASE_URL || "http://localhost:3500";
const errors = [];
let tasks = 0;
page.on("pageerror", error => errors.push(error.message));
const desktop = () => page.getByRole("navigation", { name: "Main navigation", exact: true });
const mobile = () => page.getByRole("navigation", { name: "Mobile navigation", exact: true });
const overflow = async width => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow at ${width}px`);
const focusedSection = async id => {
  await page.waitForFunction(target => document.activeElement?.id === target, id);
  const section = await page.locator(`#${id}`).boundingBox();
  const navbar = await page.locator(".sf-navbar").boundingBox();
  assert(section && navbar && section.y >= navbar.y + navbar.height - 1, `${id} must land below the sticky navbar`);
};

try {
  assert.deepEqual(await page.request.get(`${base}/api/mode`).then(response => response.json()), { mode: "mock" }, "refuse a non-mock server");
  await page.route("**/api/{skin,vto}", async route => {
    tasks++;
    await route.fulfill({ status: 500, json: { success: false, error: "Navigation must not generate" } });
  });
  await page.goto(base);
  await desktop().getByText("Mock Mode", { exact: true }).waitFor();
  assert.equal(await desktop().getByRole("button", { name: "For you", exact: true }).getAttribute("aria-current"), "page");
  await overflow(1440);
  await desktop().getByRole("button", { name: "Plan my week", exact: true }).click();
  await page.locator("#week-board-title").waitFor({ state: "visible" });
  await page.locator('.sf-heart[aria-pressed="false"]').first().click();
  await desktop().getByRole("button", { name: "For you", exact: true }).click();
  await page.getByRole("heading", { name: "Five moments. One wardrobe.", exact: true }).waitFor();
  await desktop().getByRole("button", { name: /^Shortlist/ }).click();
  assert.equal(await page.locator(".sf-outfit-open").count(), 1, "navbar actions must retain a saved outfit");
  assert.match(await desktop().getByRole("button", { name: /^Shortlist/ }).innerText(), /1/);

  await desktop().getByRole("button", { name: "My wardrobe", exact: true }).click();
  const form = page.getByRole("form", { name: "Add your own outfit" });
  await form.waitFor();
  const fixture = await page.evaluate(() => {
    const canvas = Object.assign(document.createElement("canvas"), { width: 400, height: 600 });
    const context = canvas.getContext("2d");
    context.fillStyle = "#6b1e3a";
    context.fillRect(0, 0, 400, 600);
    return canvas.toDataURL("image/jpeg");
  });
  await form.getByLabel("Outfit name", { exact: true }).fill("Navigation test kurta");
  await form.getByLabel("Garment photo", { exact: true }).setInputFiles({ name: "synthetic.jpg", mimeType: "image/jpeg", buffer: Buffer.from(fixture.split(",")[1], "base64") });
  await form.getByRole("button", { name: "Add to my clothes", exact: true }).click();
  await page.getByRole("heading", { name: "Navigation test kurta", exact: true }).waitFor();
  await desktop().getByRole("button", { name: "For you", exact: true }).click();
  await desktop().getByRole("button", { name: "Plan my week", exact: true }).click();
  assert.match(await page.locator("#week-board-sangeet option:checked").innerText(), /Navigation test kurta/, "navbar actions must retain the owned outfit and its event assignment");
  await desktop().getByRole("button", { name: "How it works", exact: true }).click();
  await focusedSection("how-it-works");
  await desktop().getByRole("button", { name: "FAQ", exact: true }).click();
  await focusedSection("faq");
  const question = page.locator("#faq summary").first();
  await question.focus();
  await page.keyboard.press("Enter");
  assert(await question.evaluate(summary => summary.parentElement.open), "FAQ must open from the keyboard");

  page.once("dialog", dialog => dialog.dismiss());
  await desktop().getByRole("link", { name: "Collection", exact: true }).click();
  assert.equal(new URL(page.url()).pathname, "/", "cancelled navigation must keep the session on home");
  page.once("dialog", dialog => dialog.accept());
  await desktop().getByRole("link", { name: "Collection", exact: true }).click();
  await page.waitForURL(`${base}/library`);
  assert.equal(await desktop().getByRole("link", { name: "Collection", exact: true }).getAttribute("aria-current"), "page");
  assert.equal(await desktop().getByRole("link", { name: "My wardrobe", exact: true }).getAttribute("href"), "/?step=3&view=clothes");
  assert.equal(await desktop().getByRole("link", { name: "Shortlist", exact: true }).getAttribute("href"), "/?step=3&view=shortlist");
  await desktop().getByRole("link", { name: "Plan my week", exact: true }).click();
  await page.locator("#week-board-title").waitFor({ state: "visible" });
  assert.equal(new URL(page.url()).searchParams.get("view"), "plan", "the library plan link must open the wedding board");

  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    await page.getByRole("heading", { name: "Five moments. One wardrobe.", exact: true }).waitFor();
    await overflow(width);
    const toggle = page.getByRole("button", { name: "Open menu", exact: true });
    const bounds = await toggle.boundingBox();
    assert(bounds && bounds.width >= 44 && bounds.height >= 44, "menu toggle must have a touch target");
    await toggle.click();
    assert.equal(await page.getByRole("button", { name: "Close menu", exact: true }).getAttribute("aria-expanded"), "true");
    await overflow(width);
    await page.keyboard.press("Escape");
    assert.equal(await mobile().count(), 0);
    assert(await toggle.evaluate(button => button === document.activeElement), "Escape must restore toggle focus");
    await toggle.click();
    await page.locator(".sf-menu-scrim").evaluate(el => { for (const type of ["pointerdown", "pointerup", "click"]) el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, clientX: 40, clientY: 90 })); });
    assert.equal(await mobile().count(), 0, "outside click must close the disclosure");
    await toggle.click();
    await mobile().getByRole("button", { name: "How it works", exact: true }).click();
    await focusedSection("how-it-works");
    assert.equal(await mobile().count(), 0, "selecting an action must close the disclosure");
    await toggle.click();
    await mobile().getByRole("button", { name: "FAQ", exact: true }).click();
    await focusedSection("faq");
    await toggle.click();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.waitForFunction(() => !document.querySelector("#sf-mobile-menu"));
  }
  assert.equal(tasks, 0, "browsing, uploading, planning and all navbar actions must submit zero skin/VTO requests");
  assert.deepEqual(errors, []);
  console.log("PASS: redesign v2 navigation, session retention, FAQ, deep links and mobile keyboard behavior; zero AI tasks");
} finally {
  await browser.close();
}
