// Synthetic browser responses only; no provider tasks or hosted storage.
import { strict as assert } from "node:assert";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = process.env.TEST_ORIGIN || "http://127.0.0.1:3500";
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chromium", headless: true });
const expiresAt = Math.floor(Date.now() / 1000) + 86400;
const id = "123e4567-e89b-42d3-a456-426614174000";
const secondId = "123e4567-e89b-42d3-a456-426614174001";
const errors = [];
let releaseSave, releaseRaceA, releaseRaceB;
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  assert.deepEqual(await page.request.get(`${base}/api/mode`).then(response => response.json()), { mode: "mock" });
  let generated = 0, retries = 0, sourceSent, referenceAsset;
  let retryStarted;
  const started = new Promise(resolve => { retryStarted = resolve; });
  const referenceBytes = await readFile("public/garment_test/editorial/emerald-kurta.jpg");
  await page.route("**/api/mode", route => route.fulfill({ json: { mode: "live" } }));
  await page.route("**/api/vto", route => {
    generated++; sourceSent = route.request().postDataJSON().fullBodyDataUrl; referenceAsset = route.request().postDataJSON().referenceAsset;
    return route.fulfill({ json: { success: true, mode: "live", resultUrl: `${base}/garment_test/editorial/emerald-kurta.jpg`, autoSave: null, autoSaveError: "Synthetic unavailable store", sharing: { id, receipt: "synthetic-receipt", accessToken: "synthetic-private-token" } } });
  });
  await page.route("**/api/shared-results**", () => { throw new Error("Automatic saving must not make the legacy sharing POST"); });
  await page.route("**/api/auto-saved", async route => {
    assert.equal(route.request().method(), "POST"); retries++;
    const body = route.request().postDataJSON();
    assert.equal(body.receipt, "synthetic-receipt"); assert.equal(body.personImageDataUrl, sourceSent);
    assert.equal(referenceAsset, "editorial/emerald-kurta.jpg");
    assert(Buffer.from(body.garmentImageDataUrl.split(",")[1], "base64").equals(referenceBytes), "retry sends the exact original catalogue reference");
    retryStarted(); await new Promise(resolve => { releaseSave = resolve; });
    await route.fulfill({ json: { id, expiresAt } });
  });
  await page.goto(`${base}/?step=3&vto=concept-emerald-kurta`);
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "I understand — continue" }).click();
  const photo = await page.evaluate(() => { const canvas = Object.assign(document.createElement("canvas"), { width: 400, height: 600 }); canvas.getContext("2d").fillRect(0, 0, 400, 600); return canvas.toDataURL("image/jpeg"); });
  await dialog.getByLabel("Full-body photo", { exact: true }).setInputFiles({ name: "synthetic.jpg", mimeType: "image/jpeg", buffer: Buffer.from(photo.split(",")[1], "base64") });
  await dialog.getByText("Photo ready. Uploading did not start a task.").waitFor();
  await dialog.getByRole("button", { name: "Generate try-on", exact: true }).click();
  await dialog.getByRole("slider").waitFor();
  await dialog.getByText("Automatic saving could not finish. Your try-on is still here.", { exact: true }).waitFor();
  assert.equal(generated, 1); assert.equal(retries, 0, "initial storage was already attempted on the server");
  await dialog.getByRole("button", { name: "Retry saving", exact: true }).click();
  await started;
  await dialog.getByText("Saving your generated look…", { exact: true }).waitFor();
  await dialog.getByRole("button", { name: "Close try-on" }).click();
  await page.getByRole("button", { name: "Try on Emerald Silk Kurta", exact: true }).click();
  await dialog.getByText("Saving your generated look…", { exact: true }).waitFor();
  assert.equal(await dialog.getByRole("button", { name: "Retry saving", exact: true }).count(), 0, "pending save survives dialog remount");
  releaseSave();
  await dialog.getByText("Saving your generated look…", { exact: true }).waitFor({ state: "hidden" });
  assert.equal(await dialog.getByRole("button", { name: "Retry saving", exact: true }).count(), 0);
  assert.equal(generated, 1); assert.equal(retries, 1, "storage retry must never generate again");
  await context.close();

  const raceContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const racePage = await raceContext.newPage();
  racePage.on("pageerror", error => errors.push(error.message));
  let raceGenerations = 0, raceRetries = 0;
  await racePage.route("**/api/mode", route => route.fulfill({ json: { mode: "live" } }));
  await racePage.route("**/api/vto", route => {
    raceGenerations++;
    const currentId = raceGenerations === 1 ? id : secondId;
    return route.fulfill({ json: { success: true, mode: "live", resultUrl: `${base}/garment_test/editorial/emerald-kurta.jpg`, autoSave: null, autoSaveError: "Synthetic storage failure", sharing: { id: currentId, receipt: `race-receipt-${raceGenerations}`, accessToken: `race-private-${raceGenerations}` } } });
  });
  await racePage.route("**/api/auto-saved", async route => {
    raceRetries++;
    const receipt = route.request().postDataJSON().receipt;
    assert(["race-receipt-1", "race-receipt-2"].includes(receipt));
    await new Promise(resolve => { if (receipt === "race-receipt-1") releaseRaceA = resolve; else releaseRaceB = resolve; });
    return receipt === "race-receipt-1" ? route.fulfill({ json: { id, expiresAt } }) : route.fulfill({ status: 503, json: { error: "Synthetic retry B failed" } });
  });
  await racePage.goto(`${base}/?step=3&vto=concept-emerald-kurta`);
  const raceDialog = racePage.getByRole("dialog");
  await raceDialog.getByRole("button", { name: "I understand — continue" }).click();
  await raceDialog.getByLabel("Full-body photo", { exact: true }).setInputFiles({ name: "synthetic.jpg", mimeType: "image/jpeg", buffer: Buffer.from(photo.split(",")[1], "base64") });
  await raceDialog.getByText("Photo ready. Uploading did not start a task.").waitFor();
  await raceDialog.getByRole("button", { name: "Generate try-on", exact: true }).click();
  const requestA = racePage.waitForRequest(request => request.url().endsWith("/api/auto-saved") && request.postDataJSON().receipt === "race-receipt-1");
  await raceDialog.getByRole("button", { name: "Retry saving", exact: true }).click();
  await requestA;
  await raceDialog.getByText("Saving your generated look…", { exact: true }).waitFor();
  await raceDialog.getByRole("button", { name: "Close try-on" }).click();
  await racePage.getByRole("button", { name: "Remove result for Emerald Silk Kurta", exact: true }).click();
  await racePage.getByRole("button", { name: "Try on Emerald Silk Kurta", exact: true }).click();
  await raceDialog.getByRole("button", { name: "Generate try-on", exact: true }).click();
  await raceDialog.getByText("Automatic saving could not finish. Your try-on is still here.", { exact: true }).waitFor();
  const requestB = racePage.waitForRequest(request => request.url().endsWith("/api/auto-saved") && request.postDataJSON().receipt === "race-receipt-2");
  await raceDialog.getByRole("button", { name: "Retry saving", exact: true }).click();
  await requestB;
  await raceDialog.getByText("Saving your generated look…", { exact: true }).waitFor();
  const replyA = racePage.waitForResponse(response => response.url().endsWith("/api/auto-saved") && response.request().postDataJSON().receipt === "race-receipt-1");
  releaseRaceA();
  await (await replyA).finished();
  await racePage.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  assert.equal(await raceDialog.getByText("Saving your generated look…", { exact: true }).count(), 1, "old retry A cannot mark regenerated look B as saved");
  releaseRaceB();
  await raceDialog.getByText("Automatic saving could not finish. Your try-on is still here.", { exact: true }).waitFor();
  assert.equal(await raceDialog.getByRole("button", { name: "Retry saving", exact: true }).count(), 1);
  assert.equal(raceGenerations, 2); assert.equal(raceRetries, 2, "replacement results must have independent receipt locks");
  await raceContext.close();

  const failureContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const failurePage = await failureContext.newPage();
  failurePage.on("pageerror", error => errors.push(error.message));
  let failedRetries = 0, failedGenerations = 0;
  await failurePage.route("**/api/mode", route => route.fulfill({ json: { mode: "live" } }));
  await failurePage.route("**/api/vto", route => { failedGenerations++; return route.fulfill({ json: { success: true, mode: "live", resultUrl: `${base}/garment_test/editorial/emerald-kurta.jpg`, autoSave: null, autoSaveError: "Synthetic failure", sharing: { id, receipt: "synthetic-receipt", accessToken: "synthetic-private-token" } } }); });
  await failurePage.route("**/api/auto-saved", route => { failedRetries++; return route.fulfill({ status: 503, json: { error: "Synthetic unavailable store" } }); });
  await failurePage.goto(`${base}/?step=3&vto=concept-emerald-kurta`);
  const failedDialog = failurePage.getByRole("dialog");
  await failedDialog.getByRole("button", { name: "I understand — continue" }).click();
  await failedDialog.getByLabel("Full-body photo", { exact: true }).setInputFiles({ name: "synthetic.jpg", mimeType: "image/jpeg", buffer: Buffer.from(photo.split(",")[1], "base64") });
  await failedDialog.getByText("Photo ready. Uploading did not start a task.").waitFor();
  await failedDialog.getByRole("button", { name: "Generate try-on", exact: true }).click();
  await failedDialog.getByRole("button", { name: "Retry saving", exact: true }).click();
  await failedDialog.getByText("Automatic saving could not finish. Your try-on is still here.", { exact: true }).waitFor();
  assert.equal(await failedDialog.getByRole("slider").count(), 1); assert.equal(failedRetries, 1); assert.equal(failedGenerations, 1);
  await failureContext.close();

  const admin = await browser.newPage({ viewport: { width: 390, height: 844 } });
  admin.on("pageerror", error => errors.push(error.message));
  let signedIn = false, failListing = false, failDelete = true;
  const saved = [{ id, outfitLabel: "First synthetic look", mode: "live", expiresAt }, { id: secondId, outfitLabel: "Second synthetic look", mode: "live", expiresAt }];
  await admin.route("**/api/shared-results/admin", async route => {
    const method = route.request().method();
    if (method === "POST") { assert.equal(route.request().postDataJSON().password, "synthetic-password"); signedIn = true; }
    else signedIn = false;
    return route.fulfill({ headers: { "Set-Cookie": `sf_result_admin_v2=${signedIn ? "synthetic-admin" : ""}; Path=/api; HttpOnly; SameSite=Strict${signedIn ? "" : "; Max-Age=0"}` }, json: { authenticated: signedIn } });
  });
  await admin.route("**/api/auto-saved**", async route => {
    const request = route.request(), url = new URL(request.url());
    if (!signedIn) return route.fulfill({ status: 401, json: { error: "Sign in" } });
    assert.match(request.headers().cookie, /sf_result_admin_v2=synthetic-admin/, "creator cookie reaches the autosave path");
    if (request.method() === "DELETE") {
      if (failDelete) { failDelete = false; return route.fulfill({ status: 503, json: { error: "Synthetic failure" } }); }
      saved.splice(saved.findIndex(item => item.id === url.searchParams.get("id")), 1);
      return route.fulfill({ json: { deleted: true } });
    }
    if (url.searchParams.has("image")) return route.fulfill({ contentType: "image/jpeg", body: referenceBytes });
    if (failListing) return route.fulfill({ status: 503, json: { error: "Synthetic outage" } });
    return route.fulfill({ json: { results: saved } });
  });
  await admin.goto(`${base}/admin`);
  await admin.getByLabel("Creator password").fill("synthetic-password");
  await admin.getByRole("button", { name: "Sign in", exact: true }).click();
  await admin.getByRole("heading", { name: "First synthetic look", exact: true }).waitFor();
  await admin.getByRole("heading", { name: "Second synthetic look", exact: true }).waitFor();
  await admin.waitForFunction(() => [...document.querySelectorAll("article img")].every(image => image.naturalWidth > 0));
  await admin.getByRole("button", { name: "Remove saved look: First synthetic look", exact: true }).click();
  await admin.getByText("Could not remove this saved look. Try again.", { exact: true }).waitFor();
  assert.equal(await admin.getByRole("heading", { name: "First synthetic look", exact: true }).count(), 1);
  await admin.getByRole("button", { name: "Remove saved look: First synthetic look", exact: true }).click();
  await admin.getByRole("heading", { name: "First synthetic look", exact: true }).waitFor({ state: "hidden" });
  failListing = true;
  await admin.getByRole("button", { name: "Refresh saved looks", exact: true }).click();
  await admin.getByText("Failed to load auto-saved results. Try again.", { exact: true }).waitFor();
  assert.equal(await admin.getByText("No auto-saved results yet.", { exact: true }).count(), 0, "outage must not look like an empty gallery");
  await admin.getByRole("button", { name: "Sign out", exact: true }).click();
  await admin.getByLabel("Creator password").waitFor();
  assert.equal(await admin.locator("article img").count(), 0); assert.equal(await admin.getByLabel("Creator password").inputValue(), "");
  assert.equal((await admin.context().cookies()).filter(cookie => cookie.name === "sf_result_admin_v2").length, 0);
  assert.deepEqual(errors, []);
  console.log("PASS: private automatic-save retry/remount without regeneration; authenticated multi-look admin, deletion, error recovery and sign-out (synthetic only)");
} finally { releaseSave?.(); releaseRaceA?.(); releaseRaceB?.(); await browser.close(); }
