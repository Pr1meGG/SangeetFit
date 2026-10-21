// Browser regression: fake camera + MediaPipe contract, no real photos or API tasks.
// Run against MOCK_MODE=true npm run dev -- --port 3100.
// PLAYWRIGHT_MODULE_PATH may point to an existing Playwright installation.
import { strict as assert } from "node:assert";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
const errors = [];
page.on("pageerror", error => errors.push(error.message));

await page.addInitScript(() => {
  window.cameraTest = { active: 0, stopped: 0, closed: 0, created: 0, frames: 0, delay: 0, modelDelay: 0, denied: false, dark: false, detectionError: false,
    box: { originX: 420, originY: 260, width: 120, height: 160 } };
  Object.defineProperty(navigator.mediaDevices, "getUserMedia", { value: async () => {
    if (window.cameraTest.denied) throw new DOMException("Denied", "NotAllowedError");
    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 720;
    const draw = () => {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = window.cameraTest.dark ? "#111" : "#ddd";
      ctx.fillRect(0, 0, 960, 720);
    };
    draw();
    const timer = setInterval(draw, 50);
    const stream = canvas.captureStream(10);
    window.cameraTest.active++;
    const track = stream.getTracks()[0];
    const stop = track.stop.bind(track);
    track.stop = () => {
      if (track.readyState === "ended") return;
      clearInterval(timer); window.cameraTest.stopped++; window.cameraTest.active--; stop();
    };
    await new Promise(resolve => setTimeout(resolve, window.cameraTest.delay));
    return stream;
  } });
});

let blockModel = false;
await page.route("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@*/vision_bundle.mjs", route => blockModel ? route.abort() : route.fulfill({
  contentType: "text/javascript",
  headers: { "access-control-allow-origin": "*" },
  body: `
    export const FilesetResolver = { forVisionTasks: async () => ({ wasmLoaderPath: "fake" }) };
    export const FaceDetector = { createFromOptions: async (fileset, options) => {
      if (fileset.wasmLoaderPath !== "fake" || options.runningMode !== "VIDEO") throw Error("Invalid detector setup");
      window.cameraTest.created++;
      await new Promise(resolve => setTimeout(resolve, window.cameraTest.modelDelay));
      let lastTimestamp = -1;
      return {
        detectForVideo(video, timestamp) {
          if (window.cameraTest.detectionError) throw Error("Inference unavailable");
          if (!video.videoWidth || !(timestamp > lastTimestamp)) throw Error("Invalid video frame/timestamp");
          lastTimestamp = timestamp;
          window.cameraTest.frames++;
          return { detections: window.cameraTest.box ? [{ boundingBox: window.cameraTest.box }] : [] };
        },
        close() { window.cameraTest.closed++; }
      };
    } };
  `,
}));

try {
  const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3100";
  await page.goto(baseUrl);
  assert.deepEqual(await page.request.get(`${baseUrl}/api/mode`).then(r => r.json()), { mode: "mock" });
  await page.getByRole("button", { name: "Sangeet", exact: true }).click();
  await page.getByRole("button", { name: "Use camera instead" }).click();
  await page.getByText("Move a little closer", { exact: true }).waitFor({ timeout: 10000 });
  assert.equal(await page.evaluate(() => window.cameraTest.created), 1);
  console.log("PASS: real MediaPipe factory, video method and bounding-box contract drive hints");

  for (const [box, text] of [
    [null, "Bring your face into the oval"],
    [{ originX: 280, originY: 150, width: 400, height: 400 }, "Move back a bit"],
    [{ originX: 500, originY: 180, width: 250, height: 250 }, "Center your face in the oval"],
    [{ originX: 355, originY: 177, width: 250, height: 250 }, "Perfect — hold still ✨"],
  ]) {
    await page.evaluate(box => { window.cameraTest.box = box; }, box);
    await page.getByText(text, { exact: true }).waitFor();
  }
  await page.evaluate(() => { window.cameraTest.dark = true; });
  await page.getByText("Find brighter light in front of you", { exact: true }).waitFor();
  await page.evaluate(() => { window.cameraTest.dark = false; });
  await page.getByText("Perfect — hold still ✨", { exact: true }).waitFor();
  console.log("PASS: portrait-crop framing, missing face and poor-light hints");

  let skinRequests = 0;
  let vtoRequests = 0;
  await page.route("**/api/skin", async route => {
    skinRequests++;
    const body = route.request().postDataJSON();
    assert.deepEqual(Object.keys(body), ["imageDataUrl"]);
    assert(body.imageDataUrl.startsWith("data:image/jpeg;base64,"));
    await route.fulfill({ json: { success: true, skin_color: "#b9947c", mode: "mock" } });
  });
  await page.route("**/api/vto", async route => { vtoRequests++; await route.abort(); });
  await page.getByRole("button", { name: "Capture selfie", exact: true }).click();
  await page.getByRole("button", { name: "Use this photo" }).waitFor();
  const preview = await page.getByAltText("Captured selfie preview").evaluate(image => ({
    width: image.naturalWidth, height: image.naturalHeight,
  }));
  assert.equal(preview.width, 540);
  assert.equal(preview.height, 720);
  assert.equal(skinRequests, 0, "capture must wait for photo confirmation");
  const counts = await page.evaluate(() => ({ ...window.cameraTest }));
  assert.equal(counts.active, 0);
  assert.equal(counts.closed, 1);
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(() => window.cameraTest.frames), counts.frames, "inference must stop after capture");
  await page.getByRole("button", { name: "Retake", exact: true }).click();
  await page.getByText("Perfect — hold still ✨", { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.cameraTest.created), 2);
  await page.getByRole("button", { name: "Capture selfie", exact: true }).click();
  await page.getByRole("button", { name: "Use this photo" }).click();
  await page.getByText("Detected skin tone", { exact: true }).waitFor();
  assert.equal(skinRequests, 1);
  assert.equal(vtoRequests, 0);
  console.log("PASS: cropped JPEG capture, cleanup, retake and confirmed selfie-only submission");

  await page.evaluate(() => { window.cameraTest.delay = 700; });
  await page.getByRole("button", { name: "Use camera instead" }).click();
  await page.getByText("Starting camera…", { exact: true }).waitFor();
  await page.waitForFunction(() => window.cameraTest.active > 0);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.waitForFunction(() => window.cameraTest.active === 0);
  assert.equal(await page.evaluate(() => window.cameraTest.created), 2);
  console.log("PASS: late camera permission response is stopped after cancellation");

  await page.evaluate(() => { window.cameraTest.delay = 0; window.cameraTest.denied = true; });
  await page.getByRole("button", { name: "Use camera instead" }).click();
  await page.getByRole("alert").filter({ hasText: "Camera permission denied" }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Capture selfie", exact: true }).isDisabled(), true);
  await page.evaluate(() => { window.cameraTest.denied = false; });
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await page.getByText("Perfect — hold still ✨", { exact: true }).waitFor();
  await page.evaluate(() => { window.cameraTest.detectionError = true; });
  await page.getByText("Live face tracking unavailable — center your face in the oval", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Capture anyway", exact: true }).click();
  await page.getByRole("button", { name: "Use this photo" }).waitFor();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  console.log("PASS: denied permission can recover; inference failure keeps manual capture available");

  await page.evaluate(() => { window.cameraTest.detectionError = false; window.cameraTest.modelDelay = 1000; });
  await page.getByRole("button", { name: "Use camera instead" }).click();
  await page.getByText("Center your face while tracking loads — you can capture now", { exact: true }).waitFor();
  await page.waitForFunction(() => window.cameraTest.created === 4);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.waitForFunction(() => window.cameraTest.closed === 4);
  console.log("PASS: a detector that finishes loading after cancellation is released");

  blockModel = true;
  await page.reload();
  await page.getByRole("button", { name: "Sangeet", exact: true }).click();
  await page.getByRole("button", { name: "Use camera instead" }).click();
  await page.getByText("Live face tracking unavailable — center your face in the oval", { exact: true }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Capture anyway", exact: true }).isEnabled(), true);
  await page.evaluate(() => { window.cameraTest.dark = true; });
  await page.getByText("Find brighter light in front of you", { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  assert.equal(await page.evaluate(() => window.cameraTest.active), 0);
  console.log("PASS: blocked CDN retains manual capture and brightness hints; mobile layout fits");
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
