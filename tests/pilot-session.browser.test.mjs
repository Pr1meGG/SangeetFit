// Mock-only regression: two candidate references use one photo and stay comparable in one session.
import { strict as assert } from "node:assert";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = process.env.TEST_ORIGIN || "http://localhost:3500";
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chromium", headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
const requests = [];

try {
  assert.deepEqual(await page.request.get(`${base}/api/mode`).then(response => response.json()), { mode: "mock" });
  await page.route("**/api/vto", async route => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ json: { success: true, mode: "mock", resultUrl: `${base}/garment_test/editorial/emerald-kurta.jpg` } });
  });
  await page.goto(`${base}/?step=3&occasion=sangeet&vto=concept-emerald-kurta`);
  const dialog = page.getByRole("dialog", { name: "Make this look yours." });
  await dialog.getByText("Emerald Silk Kurta").waitFor();
  const person = await page.evaluate(() => {
    const canvas = Object.assign(document.createElement("canvas"), { width: 400, height: 600 });
    canvas.getContext("2d").fillRect(0, 0, 400, 600);
    return canvas.toDataURL("image/jpeg");
  });
  await dialog.getByRole("button", { name: "I understand — continue" }).click();
  await page.getByLabel("Full-body photo", { exact: true }).setInputFiles({ name: "synthetic-person.jpg", mimeType: "image/jpeg", buffer: Buffer.from(person.split(",")[1], "base64") });
  await page.getByText("Photo ready. Uploading did not start a task.").waitFor();
  assert.equal(requests.length, 0);
  await dialog.getByRole("button", { name: "Generate try-on" }).click();
  await dialog.getByText("Mock preview — reference outfit, not a personal try-on").waitFor();
  await dialog.getByRole("button", { name: "Close try-on" }).click();

  await page.getByRole("button", { name: "Explore reference outfits" }).click();
  await page.getByRole("button", { name: "Try on Sapphire Embroidered Sherwani" }).click();
  await dialog.getByText("Sapphire Embroidered Sherwani").waitFor();
  assert.equal(requests.length, 1, "switching references must not generate");
  await dialog.getByRole("button", { name: "Generate try-on" }).click();
  await dialog.getByText("Mock preview — reference outfit, not a personal try-on").waitFor();
  await dialog.getByRole("button", { name: "Close try-on" }).click();

  assert.deepEqual(requests.map(request => request.garmentId), ["concept-emerald-kurta", "concept-sapphire-sherwani"]);
  assert.equal(requests[0].fullBodyDataUrl, requests[1].fullBodyDataUrl);
  assert.equal(await page.getByRole("region", { name: "Compare session looks" }).locator("article").count(), 2);
  assert.equal(await page.getByText(/These looks use different source photos/).count(), 0);
  // A deliberate cross-occasion choice must remain representable by the event selector.
  await page.getByRole("button", { name: "Haldi", exact: true }).click();
  await page.getByRole("region", { name: "Compare session looks" }).locator("article").filter({ hasText: "Sapphire Embroidered Sherwani" }).getByRole("button", { name: "Plan for Haldi", exact: true }).click();
  const board = page.getByRole("region", { name: "Five moments. One wardrobe.", exact: true });
  assert.equal(await board.getByLabel("Outfit for Haldi").inputValue(), "concept-sapphire-sherwani", "the selected out-of-tag reference needs a corresponding select option");
  assert.match(await board.getByLabel("Outfit for Haldi").locator("option:checked").textContent(), /Sapphire Embroidered Sherwani/);
  assert.match(await board.getByRole("status", { name: "Wardrobe plan summary" }).innerText(), /0 owned outfits used/);
  await page.getByRole("searchbox", { name: "Search outfit ideas" }).fill("no-such-outfit");
  await page.getByRole("button", { name: "Browse reference candidates" }).click();
  assert.equal(await page.getByRole("searchbox", { name: "Search outfit ideas" }).inputValue(), "");
  assert(await page.locator(".sf-reference-card").count() > 0, "empty-state recovery must show candidates in their labelled group");
  assert.equal(requests.length, 2, "browsing after comparison must not generate");
  console.log("PASS: two candidate looks, explicit cross-occasion planning and comparison use exactly two mock requests");
} finally {
  await browser.close();
}
