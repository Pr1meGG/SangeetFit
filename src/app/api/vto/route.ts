import { NextRequest, NextResponse } from "next/server";

import fs from "fs/promises";
import path from "path";
import { setTimeout as wait } from "node:timers/promises";
import { isRecord, uploadYouCamFile, YouCamHttpError } from "@/lib/youcam";
import { MAX_VTO_REQUEST_BYTES, parseVtoInput, VtoInputError } from "@/lib/vto-input";
import { INDIAN_WEAR_LIBRARY } from "@/data/indian-wear";

// Whole request has a 180s deadline; allow 300s per official Vercel limits
// (Fluid Compute: Hobby default+max = 300s; legacy non-Fluid Hobby caps at 60s).
// NOTE: verify the deployed project's Fluid Compute setting (Functions settings)
// in the Vercel dashboard before live VTO is enabled — if Fluid is off, the
// 180s poll exceeds the 60s legacy limit and requests will be terminated.
export const maxDuration = 300;

const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY || "";
const YOUCAM_BASE = process.env.YOUCAM_BASE_URL || "https://yce-api-01.makeupar.com/s2s/v2.0";
const MOCK_MODE = process.env.MOCK_MODE === "true";

/**
 * Allowlist of reference assets that live in public/garment_test, with the
 * garmentTypes each one may serve. A reference must VISUALLY correspond to
 * the product — no category-level collapse, no garment substitution.
 * The source-only sample (fullbody_mock.png) is intentionally excluded.
 * Garment reference photos may show a model wearing the catalog outfit.
 */
const REFERENCE_ASSETS: Record<string, { contentType: string; garmentTypes: string[] }> = {
  "lehenga_ethnic_hd.png": { contentType: "image/png", garmentTypes: ["lehenga-choli"] },
  "user_saree.png": { contentType: "image/png", garmentTypes: ["saree"] },
  "kurta_set_hd.png": { contentType: "image/png", garmentTypes: ["kurta-set"] },
  "western_dress_hd.png": { contentType: "image/png", garmentTypes: ["gown"] },
  ...Object.fromEntries(INDIAN_WEAR_LIBRARY.filter(outfit => outfit.vtoSupported).map(outfit => [
    outfit.tryOnReference!,
    { contentType: outfit.tryOnReference!.endsWith(".png") ? "image/png" : "image/jpeg", garmentTypes: [outfit.garmentType] },
  ])),
};

async function getOutfit(garmentId: string) {
  const { OUTFITS } = await import("@/data/outfits");
  return OUTFITS.find(o => o.id === garmentId) || null;
}

async function submitTask(apiKey: string, srcFileId: string, refFileId: string, category: string, signal: AbortSignal): Promise<string> {
  signal.throwIfAborted();
  const res = await fetch(`${YOUCAM_BASE}/task/cloth-v4`, {
    method: "POST",
    signal,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      src_file_id: srcFileId,
      ref_file_id: refFileId,
      garment_category: category,
    }),
  });

  if (!res.ok) {
    throw new YouCamHttpError(`Task submission failed: ${res.status}`, res.status);
  }

  const data = await res.json();
  if (!isRecord(data) || !isRecord(data.data) || typeof data.data.task_id !== "string" || !data.data.task_id) {
    throw new Error("Malformed task submission response");
  }
  return data.data.task_id;
}

async function pollTask(apiKey: string, taskId: string, signal: AbortSignal, timeout = 180000): Promise<string> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    signal.throwIfAborted();
    const res = await fetch(`${YOUCAM_BASE}/task/cloth-v4/${taskId}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
      signal,
    });

    if (!res.ok) {
      throw new YouCamHttpError(`Poll failed: ${res.status}`, res.status);
    }

    const data = await res.json();
    if (!isRecord(data) || !isRecord(data.data) || typeof data.data.task_status !== "string") {
      throw new Error("Malformed poll response");
    }
    if (data.data.task_status === "success") {
      if (!isRecord(data.data.results) || typeof data.data.results.url !== "string" || !/^https?:\/\//.test(data.data.results.url)) {
        throw new Error("Malformed VTO result URL");
      }
      return data.data.results.url;
    }

    if (data.data.task_status === "error") {
      throw new Error(`Task failed: ${data.data.error_message || data.data.error || "unknown"}`);
    }

    await wait(Math.min(3000, Math.max(0, timeout - (Date.now() - start))), undefined, { signal });
  }

  throw new Error("Timeout waiting for VTO result");
}

async function runTryOn(req: NextRequest, signal: AbortSignal) {
  try {
    signal.throwIfAborted();
    const rawBody = await req.text();
    signal.throwIfAborted();
    if (Buffer.byteLength(rawBody, "utf8") >= MAX_VTO_REQUEST_BYTES) {
      throw new VtoInputError("Try-on request must be under 4 MB", 413);
    }
    let body: unknown;
    try { body = JSON.parse(rawBody); } catch { throw new VtoInputError("Try-on request must contain valid JSON"); }
    const input = parseVtoInput(body);
    let outfit = null;
    let reference = null;
    if (input.kind === "catalogue") {
      outfit = await getOutfit(input.garmentId);
      if (!outfit) throw new VtoInputError("Unknown outfit");

      reference = Object.hasOwn(REFERENCE_ASSETS, input.referenceAsset) ? REFERENCE_ASSETS[input.referenceAsset] : null;
      if (!reference) throw new VtoInputError("Unknown garment reference");
      // A reference is permitted only for its exact catalog outfit and garment type.
      if (!reference.garmentTypes.includes(outfit.garmentType) || !input.vtoSupported || !outfit.vtoSupported || outfit.tryOnReference !== input.referenceAsset || outfit.tryOnStatus === "blocked") {
        throw new VtoInputError("Try-on is not supported for this outfit yet");
      }
    }

    if (MOCK_MODE) {
      if (input.kind === "upload") {
        return NextResponse.json({ success: true, resultUrl: input.garmentImageDataUrl, mode: "mock" });
      }
      if (!outfit) throw new VtoInputError("Unknown outfit");
      // Mock mode: results are placeholders — show the SAME display thumbnail the
      // catalog preview uses, clearly labelled, so what you preview is what mock shows.
      const mockUrl = outfit.imageUrl;
      return NextResponse.json({
        success: true,
        resultUrl: mockUrl,
        displayImage: outfit.imageUrl,
        mode: "mock",
      });
    }

    // Live mode requires a real full-body source — never fall back to a sample.
    if (!input.fullBody) {
      return NextResponse.json({ success: false, error: "A full-body photo is required for virtual try-on" }, { status: 400 });
    }

    if (!YOUCAM_API_KEY) {
      // Live mode explicitly requested but not configured — never substitute a mock image.
      return NextResponse.json(
        { success: false, error: "Live try-on is unavailable: YOUCAM_API_KEY is not configured on this deployment", mode: "live" },
        { status: 503 },
      );
    }

    // Load both images before any paid/external operation; never accept client paths.
    const garmentBuffer = input.kind === "upload"
      ? input.garmentImage.buffer
      : await fs.readFile(path.join(process.cwd(), "public", "garment_test", input.referenceAsset), { signal });
    const contentType = input.kind === "upload" ? input.garmentImage.contentType : reference!.contentType;
    const category = input.kind === "upload" ? input.garmentCategory : outfit!.youcamCategory;
    const srcFileId = await uploadYouCamFile({
      apiKey: YOUCAM_API_KEY,
      baseUrl: YOUCAM_BASE,
      buffer: input.fullBody.buffer,
      fileName: input.fullBody.contentType === "image/png" ? "fullbody.png" : "fullbody.jpg",
      contentType: input.fullBody.contentType,
      signal,
    });
    const refFileId = await uploadYouCamFile({
      apiKey: YOUCAM_API_KEY,
      baseUrl: YOUCAM_BASE,
      buffer: garmentBuffer,
      fileName: input.kind === "catalogue" ? path.basename(input.referenceAsset) : contentType === "image/png" ? "garment.png" : "garment.jpg",
      contentType,
      signal,
    });
    const taskId = await submitTask(YOUCAM_API_KEY, srcFileId, refFileId, category, signal);
    const resultUrl = await pollTask(YOUCAM_API_KEY, taskId, signal);

    return NextResponse.json({ success: true, resultUrl, mode: "live" });
  } catch (err: unknown) {
    if (signal.aborted) return timedOutResponse();
    const status = err instanceof VtoInputError ? err.status : err instanceof YouCamHttpError && err.status === 429 ? 429 : 500;
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Try-on failed" }, { status });
  }
}

function timedOutResponse() {
  return NextResponse.json({ success: false, error: "Try-on timed out or was cancelled. A submitted task may still complete; no new task was started automatically." }, { status: 504 });
}

export async function POST(req: NextRequest) {
  const signal = AbortSignal.any([req.signal, AbortSignal.timeout(180_000)]);
  let onAbort = () => {};
  const cancelled = new Promise<NextResponse>(resolve => {
    onAbort = () => resolve(timedOutResponse());
    if (signal.aborted) onAbort();
    else signal.addEventListener("abort", onAbort, { once: true });
  });
  try { return await Promise.race([runTryOn(req, signal), cancelled]); }
  finally { signal.removeEventListener("abort", onAbort); }
}
