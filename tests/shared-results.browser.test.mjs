// Synthetic responses only: no provider tasks, real clipboard changes or DB writes.
import { strict as assert } from "node:assert";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = process.env.TEST_ORIGIN || "http://localhost:3500";
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chromium", headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", e => errors.push(e.message));
let generated = 0, shared = false, writes = 0, signedIn = false, imageBytes;
const expiresAt = Math.floor(Date.now() / 1000) + 86400;
const id = "123e4567-e89b-42d3-a456-426614174000";
const token = "synthetic-private-key";
try {
  assert.deepEqual(await page.request.get(`${base}/api/mode`).then(r => r.json()), { mode: "mock" });
  await page.addInitScript(() => {
    window.clipboardWrites = [];
    window.allowClipboard = false;
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async value => {
      window.clipboardWrites.push(value);
      if (!window.allowClipboard) throw new Error("Synthetic clipboard denial");
    } } });
  });
  await page.route("**/api/mode", r => r.fulfill({ json: { mode: "live" } }));
  await page.route("**/api/vto", r => { generated++; return r.fulfill({ json: { success: true, mode: "live", resultUrl: `${base}/garment_test/editorial/emerald-kurta.jpg`, autoSave: { id, expiresAt }, sharing: { id, receipt: "synthetic-receipt", accessToken: token } } }); });
  await page.route("**/api/shared-results**", async route => {
    const request = route.request(), url = new URL(request.url()), path = url.pathname, method = request.method();
    assert(!request.url().includes(token), "private key must not appear in an API URL");
    if (path.endsWith("/admin")) {
      if (method === "POST") { assert.equal(request.postDataJSON().password, "synthetic-password"); signedIn = true; }
      else signedIn = false;
      return route.fulfill({ json: { success: true } });
    }
    if (method === "POST") {
      writes++;
      return route.fulfill({ status: 400, json: { error: "Unexpected legacy save request" } });
    }
    if (path === "/api/shared-results") return route.fulfill({ status: signedIn ? 200 : 401, json: signedIn ? { results: shared ? [{ id, outfitLabel: "Synthetic kurta", createdAt: expiresAt - 86400, expiresAt }] : [] } : { error: "Unauthorized" } });
    if (!signedIn && request.headers().authorization !== `Bearer ${token}`) return route.fulfill({ status: 404, json: { error: "Not found" } });
    if (method === "DELETE") { shared = false; return route.fulfill({ json: { deleted: true } }); }
    if (!shared) return route.fulfill({ status: 404, json: { error: "Not found" } });
    if (url.searchParams.get("image") === "1") return route.fulfill({ contentType: "image/jpeg", body: imageBytes });
    return route.fulfill({ json: { id, outfitLabel: "Synthetic kurta", expiresAt } });
  });
  await page.goto(`${base}/?step=3&vto=concept-emerald-kurta`);
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "I understand — continue" }).click();
  const choice = dialog.getByRole("checkbox", { name: "Automatically save my generated looks for 24 hours and share them with the creator. Optional.", exact: true });
  assert.equal(await choice.count(), 0, "automatic saving must not require the removed optional checkbox");
  const data = await page.evaluate(() => { const c = Object.assign(document.createElement("canvas"), { width: 400, height: 600 }); c.getContext("2d").fillRect(0, 0, 400, 600); return c.toDataURL("image/jpeg"); });
  imageBytes = Buffer.from(data.split(",")[1], "base64");
  await dialog.getByLabel("Full-body photo", { exact: true }).setInputFiles({ name: "synthetic.jpg", mimeType: "image/jpeg", buffer: imageBytes });
  await dialog.getByText("Photo ready. Uploading did not start a task.").waitFor();
  await dialog.getByRole("button", { name: "Generate try-on", exact: true }).click();
  await dialog.getByRole("slider").waitFor();
  assert.equal(generated, 1, "Generate must submit once; the server returns its automatic-save receipt");
  assert.equal(writes, 0, "successful automatic save must not trigger an extra legacy sharing POST");
  await dialog.getByRole("button", { name: "Close try-on" }).click();
  await page.getByRole("button", { name: "Try on Emerald Silk Kurta", exact: true }).click();
  await dialog.getByRole("slider").waitFor();
  assert.equal(generated, 1, "reopening the saved session result must not regenerate");

  // Existing private links remain usable independently of the creator's autosave gallery.
  shared = true;
  const privateLink = `${base}/view/${id}#key=${token}`;
  await page.goto(`${base}/view/${id}`);
  await page.getByText("This look is unavailable or has expired. Reopen the full private link to try again.", { exact: true }).waitFor();
  await page.evaluate(link => { window.location.href = link; }, privateLink);
  await page.getByRole("heading", { name: "Synthetic kurta", exact: true }).waitFor();
  assert.equal(new URL(page.url()).hash, "", "remove key from address after browser reads it");
  assert.equal(await page.locator('meta[name="referrer"]').getAttribute("content"), "no-referrer");
  assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  await page.waitForFunction(() => document.querySelector('section[aria-label="Private result"] img')?.naturalWidth > 0);
  assert.equal(await page.locator("#main-content").getAttribute("tabindex"), "-1");
  await page.getByRole("button", { name: "Copy private link", exact: true }).click();
  await page.getByLabel("Private result link").waitFor();
  assert.equal(await page.getByLabel("Private result link").inputValue(), privateLink, "clipboard denial must retain a copyable private link");
  await page.evaluate(() => { window.allowClipboard = true; });
  await page.getByRole("button", { name: "Copy private link", exact: true }).click();
  assert.equal((await page.evaluate(() => window.clipboardWrites)).at(-1), privateLink);
  await page.getByRole("button", { name: "Delete this result", exact: true }).click();
  await page.getByText("This look has been deleted.", { exact: true }).waitFor();
  assert.equal(await page.locator('section[aria-label="Private result"] img').count(), 0);
  await page.goto(`${base}/view/${id}`);
  await page.getByText("This look is unavailable or has expired. Reopen the full private link to try again.", { exact: true }).waitFor();
  assert.equal(await page.locator('section[aria-label="Private result"] img').count(), 0);
  shared = true;
  await page.goto(`${base}/results`);
  await page.getByLabel("Creator password").fill("synthetic-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("heading", { name: "Synthetic kurta", exact: true }).waitFor();
  await page.waitForFunction(() => document.querySelector('article img')?.naturalWidth > 0);
  await page.getByRole("button", { name: "Remove shared look: Synthetic kurta", exact: true }).click();
  await page.getByText("No shared looks yet.").waitFor();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.getByLabel("Creator password").waitFor();
  assert.equal(await page.getByLabel("Creator password").inputValue(), "");
  assert.equal(generated, 1, "viewing, copying and deleting saved results must not generate another task");
  assert.equal(writes, 0);
  assert.deepEqual(errors, []);
  console.log("PASS: one automatic-save-shaped generation, session reopen, private clipboard fallback/view/delete and authenticated creator gallery (synthetic only)");
} finally { await browser.close(); }
