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
  assert.equal(await page.locator(".sf-text-link").filter({ has: page.locator("svg") }).first().evaluate(link => getComputedStyle(link, "::after").content), "none", "icon links must not render decorative underlines");
  assert.equal(await desktop().getByRole("button", { name: "For you", exact: true }).getAttribute("aria-current"), "page");
  assert.deepEqual(await page.locator("#main-content > section").evaluateAll(sections => sections.map(section => section.id || section.className)), ["sf-editorial-wrap sf-home-enter", "occasions", "sf-final-invite"], "home must contain only hero, occasions and closing invitation");
  assert.equal(await page.locator("#features, #how-it-works, #faq").count(), 0, "support content must stay out of the home scroll");
  await page.locator(".sf-occasion").first().hover();
  await page.waitForFunction(() => new DOMMatrix(getComputedStyle(document.querySelector(".sf-occasion")).transform).m42 < -4);
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
  assert.equal(await desktop().getByRole("button", { name: "How it works", exact: true }).getAttribute("aria-current"), "page");
  assert.equal(await page.locator(".sf-editorial-hero").count(), 0, "guide must open on its own surface");
  assert.equal(await page.locator(".sf-feature").count(), 4);
  assert.equal(await page.locator(".sf-step-illustration").count(), 3);
  await page.waitForFunction(() => document.querySelector(".sf-step-illustration").getAnimations({ subtree: true }).some(animation => animation.playState === "running" && animation.currentTime > 0));
  await page.getByRole("button", { name: "Pause animations", exact: true }).click();
  assert(await page.locator(".sf-illustration-sway").first().evaluate(el => getComputedStyle(el).animationPlayState === "paused"), "pause must stop the illustration loop");
  await page.getByRole("button", { name: "Play animations", exact: true }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert(await page.locator(".sf-illustration-sway").first().evaluate(el => getComputedStyle(el).animationName === "none"), "device reduced-motion preference must disable loops");
  await page.emulateMedia({ reducedMotion: "no-preference" });
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
  for (const section of ["how-it-works", "faq"]) {
    await page.goto(`${base}/#${section}`);
    await focusedSection(section);
    assert.equal(await page.locator(".sf-editorial-hero").count(), 0, "support deep links must open the separate support view");
    await page.getByRole("button", { name: "Back to celebrations", exact: true }).click();
    await page.locator(".sf-editorial-hero").waitFor();
    assert.equal(new URL(page.url()).hash, "", "returning home must clear a support hash");
  }
  await page.goto(`${base}/#faq`);
  await focusedSection("faq");
  await desktop().getByRole("button", { name: "How it works", exact: true }).click();
  assert.equal(new URL(page.url()).hash, "#how-it-works", "switching support views must keep the hash in sync");
  await page.reload();
  await focusedSection("how-it-works");
  for (const query of ["step=3&view=plan", "step=3&vto=concept-emerald-kurta"]) {
    for (const section of ["how-it-works", "faq"]) {
      await page.goto(`${base}/?${query}#${section}`);
      await focusedSection(section);
      await page.reload();
      await focusedSection(section);
      await page.getByRole("button", { name: "Back to celebrations", exact: true }).click();
      await page.locator(".sf-editorial-hero").waitFor();
      assert.equal(new URL(page.url()).searchParams.get("step"), null, "returning home must clear the entry-only step");
    }
    for (const action of ["My wardrobe", "Shortlist", "Plan my week"]) {
      await page.goto(`${base}/?${query}#faq`);
      await focusedSection("faq");
      await desktop().getByRole("button", { name: action, exact: true }).click();
      assert.equal(new URL(page.url()).searchParams.get("step"), null, "core navigation must consume entry-only parameters");
      if (action === "My wardrobe") await page.getByRole("form", { name: "Add your own outfit" }).waitFor();
      else if (action === "Shortlist") await page.getByRole("heading", { name: "Your shortlist.", exact: true }).waitFor();
      else await focusedSection("wedding-plan");
      assert.equal(await page.getByRole("dialog").count(), 0, "stale outfit links must not reopen a fitting room during navigation");
    }
  }

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
    const menuBounds = await mobile().boundingBox();
    assert(menuBounds, "open disclosure must have a visible box");
    const backgroundAction = width <= 640 ? await page.getByRole("navigation", { name: "App navigation", exact: true }).getByRole("button", { name: "My clothes", exact: true }).boundingBox() : null;
    const outsidePoint = backgroundAction ? { x: backgroundAction.x + backgroundAction.width / 2, y: backgroundAction.y + backgroundAction.height / 2 } : { x: 8, y: menuBounds.y + menuBounds.height + 16 };
    assert(await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.classList.contains("sf-menu-scrim"), outsidePoint), "menu backdrop must cover the content below the disclosure");
    await page.mouse.click(outsidePoint.x, outsidePoint.y);
    assert.equal(await mobile().count(), 0, "outside click must close the disclosure");
    assert.equal(await page.getByRole("form", { name: "Add your own outfit" }).count(), 0, "dismissal must not activate the clothes action under the backdrop");
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
