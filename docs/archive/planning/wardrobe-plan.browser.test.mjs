// Mock-only: catches disconnected outfit choices, false rewear counts and private print leakage.
import { strict as assert } from "node:assert";
import { createRequire } from "node:module";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = process.env.TEST_ORIGIN || "http://localhost:3500";
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chromium", headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.setDefaultTimeout(10000);
const errors = [];
let tasks = 0;
page.on("pageerror", error => errors.push(error.message));
try {
  assert.deepEqual(await page.request.get(`${base}/api/mode`).then(response => response.json()), { mode: "mock" });
  await page.route("**/api/mode", route => route.fulfill({ json: { mode: "mock" } }));
  await page.route("**/api/skin", () => { throw new Error("Planning must not analyze skin"); });
  await page.route("**/api/vto", async route => {
    tasks++;
    assert(route.request().postDataJSON().garmentImageDataUrl, "exercise the own-garment request path");
    await route.fulfill({ json: { success: true, mode: "mock", resultUrl: `${base}/garment_test/editorial/emerald-kurta.jpg?PRIVATE-RESULT-MARKER` } });
  });
  await page.addInitScript(() => { window.print = () => { window.__planPrintCalls = (window.__planPrintCalls || 0) + 1; }; });
  await page.goto(`${base}/?step=3&occasion=sangeet`);
  const files = await page.evaluate(() => {
    const image = color => {
      const canvas = Object.assign(document.createElement("canvas"), { width: 400, height: 600 });
      const context = canvas.getContext("2d");
      context.fillStyle = color; context.fillRect(0, 0, 400, 600);
      return canvas.toDataURL("image/jpeg");
    };
    return [image("#892b48"), image("#c89b42"), image("#d9d9d9"), image("#aabbcc")];
  });
  const file = index => ({ name: "synthetic.jpg", mimeType: "image/jpeg", buffer: Buffer.from(files[index].split(",")[1], "base64") });
  for (const [index, name] of ["My kurta", "My full outfit"].entries()) {
    await page.getByRole("button", { name: "Add my outfit", exact: true }).click();
    const form = page.getByRole("form", { name: "Add your own outfit" });
    await form.getByLabel("Outfit name", { exact: true }).fill(name);
    await form.getByLabel(/Garment reference/).selectOption(index === 0 ? "upper_body" : "full_body");
    await form.getByLabel("Garment photo", { exact: true }).setInputFiles(file(index));
    await form.getByRole("button", { name: "Add to my clothes", exact: true }).click();
    await page.getByRole("heading", { name, exact: true }).waitFor();
  }
  const board = page.getByRole("region", { name: "Five moments. One wardrobe.", exact: true });
  const kurta = await board.getByLabel("Outfit for Sangeet").inputValue();
  const other = await board.getByLabel("Outfit for Sangeet").locator("option").filter({ hasText: "My full outfit" }).getAttribute("value");
  const dialog = page.getByRole("dialog", { name: "Make this look yours." });
  const generate = async (name, source) => {
    await page.getByRole("button", { name: `Try on ${name}`, exact: true }).click();
    const permission = dialog.getByRole("button", { name: "I understand — continue" });
    if (await permission.count()) await permission.click();
    if (source !== undefined) {
      await dialog.locator("#fullbody-file").setInputFiles(file(source));
      await dialog.getByText("Photo ready. Uploading did not start a task.", { exact: true }).waitFor();
    }
    await dialog.getByRole("button", { name: "Generate try-on", exact: true }).click();
    await dialog.getByText("Mock preview — reference outfit, not a personal try-on").waitFor();
    await dialog.getByRole("button", { name: "Close try-on" }).click();
  };
  await generate("My kurta", 2);
  const comparison = page.getByRole("region", { name: "Compare session looks" });
  assert.equal(await comparison.getByRole("button", { name: "Planned for Sangeet", exact: true }).getAttribute("aria-pressed"), "true", "uploaded garment is already assigned to its empty event");
  await generate("My kurta", 3);
  assert.equal(await comparison.getByRole("button", { name: "Planned for Sangeet", exact: true }).count(), 2, "two photo versions share the outfit assignment");
  await generate("My full outfit");
  await comparison.getByRole("button", { name: "Plan for Sangeet", exact: true }).click();
  assert.equal(await board.getByLabel("Outfit for Sangeet").inputValue(), other);
  await page.getByRole("button", { name: "Mehendi", exact: true }).click();
  await comparison.locator("article").filter({ hasText: "My kurta" }).getByRole("button", { name: "Plan for Mehendi", exact: true }).click();
  assert.equal(await board.getByLabel("Outfit for Mehendi").inputValue(), kurta);
  await board.getByLabel("Outfit for Reception").selectOption(kurta);
  const reference = await board.getByLabel("Outfit for Haldi").locator('optgroup[label="AI outfit ideas"] option').first().getAttribute("value");
  await board.getByLabel("Outfit for Haldi").selectOption(reference);
  const summary = board.getByRole("status", { name: "Wardrobe plan summary" });
  assert.match(await summary.innerText(), /4 of 5 planned/);
  assert.match(await summary.innerText(), /2 owned outfits used/);
  assert.match(await summary.innerText(), /1 planned rewear/);
  await comparison.getByRole("button", { name: "Remove result for My kurta", exact: true }).click();
  assert.equal(await board.getByLabel("Outfit for Mehendi").inputValue(), kurta, "removing a result must preserve the outfit plan");
  assert.equal(tasks, 3, "only explicit generation submits tasks");

  const evidence = await mkdtemp(join(tmpdir(), "sangeetfit-wardrobe-"));
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow at ${width}`);
    const imageBounds = await board.locator(".sf-week-board-image").evaluateAll(slots => slots.flatMap(slot => {
      const image = slot.querySelector("img");
      if (!image) return [];
      const frame = slot.getBoundingClientRect();
      const picture = image.getBoundingClientRect();
      return [{ inside: picture.top >= frame.top - 1 && picture.bottom <= frame.bottom + 1 && picture.left >= frame.left - 1 && picture.right <= frame.right + 1 }];
    }));
    assert(imageBounds.every(image => image.inside), `garment images must stay inside their preview slots at ${width}px`);
    const printButton = board.getByRole("button", { name: "Print / Save as PDF", exact: true });
    const size = await printButton.boundingBox();
    assert(size && size.height >= 44, "print action must be touch accessible");
    await board.scrollIntoViewIfNeeded();
    await page.screenshot({ path: join(evidence, `board-${width}.png`) });
  }
  await board.getByRole("button", { name: "Print / Save as PDF", exact: true }).focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => window.__planPrintCalls), 1, "keyboard action must invoke native print");
  // Adversarial print: the modal still contains a person photo, result and synthetic access code.
  await board.getByLabel("Outfit for Sangeet").locator("..").getByRole("button", { name: "Try on this look" }).click();
  await dialog.waitFor();
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator("main").isVisible(), false, "entire interactive app must be excluded");
  assert.equal(await page.locator("img:visible, input:visible, a:visible, dialog:visible").count(), 0);
  const text = await page.locator("body").innerText();
  for (const name of ["Sangeet", "Mehendi", "Haldi", "Wedding", "Reception", "My kurta", "My full outfit", "Not planned", "Your clothes", "AI inspiration"]) assert(text.includes(name));
  for (const excluded of ["PRIVATE-RESULT-MARKER", "SYNTHETIC-DO-NOT-EXPORT-ACCESS", "data:image", "http://", "Mock preview"]) assert(!text.includes(excluded));
  const pdf = await page.pdf({ path: join(evidence, "wardrobe-plan.pdf"), format: "A4", displayHeaderFooter: false });
  assert(!/\/Subtype\s*\/Image\b/.test(pdf.toString("latin1")), "actual exported PDF must contain no image objects");
  await page.screenshot({ path: join(evidence, "print-view.png"), fullPage: true });
  await page.emulateMedia({ media: "screen" });
  await dialog.getByRole("button", { name: "Close try-on" }).click();
  await page.locator(".sf-my-clothes summary").click();
  await page.getByRole("button", { name: "Remove garment My kurta", exact: true }).click();
  assert.equal(await board.getByLabel("Outfit for Mehendi").inputValue(), "");
  assert.equal(await board.getByLabel("Outfit for Reception").inputValue(), "");
  assert.match(await summary.innerText(), /0 planned rewears/);
  page.once("dialog", prompt => prompt.accept());
  await page.getByRole("button", { name: "Clear private session", exact: true }).click();
  assert.match(await summary.innerText(), /0 of 5 planned/);
  assert.match(await summary.innerText(), /0 owned outfits used/);
  assert.equal(tasks, 3, "planning, printing, result removal and clearing create no extra tasks");
  assert.deepEqual(errors, []);
  console.log(`PASS: outfit assignment, photo versions, rewear counts, removal/reset, keyboard print and image-free PDF; synthetic evidence: ${evidence}`);
} finally {
  await browser.close();
}
