import { NextRequest, NextResponse } from "next/server";
import { setTimeout as wait } from "node:timers/promises";
import { isRecord, uploadYouCamFile, YouCamHttpError } from "@/lib/youcam";
import { parseVtoImage, VtoInputError } from "@/lib/vto-input";
import { privateJson, readPhotoJson } from "@/lib/request";
import { liveAccessError } from "@/lib/live-access";
import { LiveBudgetError, reserveLiveBudget } from "@/lib/live-budget";

// Whole request has a 180s deadline; verify Fluid Compute before enabling live
// processing because legacy non-Fluid Hobby functions are limited to 60s.
export const maxDuration = 300;

const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY || "";
const YOUCAM_BASE = process.env.YOUCAM_BASE_URL || "https://yce-api-01.makeupar.com/s2s/v2.0";
const MOCK_MODE = process.env.MOCK_MODE === "true";

/** Caller: POST /api/skin from page.tsx step 2. Returns { skin_color, mode }. */
async function submitTask(apiKey: string, fileId: string, signal: AbortSignal): Promise<string> {
  signal.throwIfAborted();
  const res = await fetch(`${YOUCAM_BASE}/task/skin-tone-analysis`, {
    method: "POST",
    signal,
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ src_file_id: fileId }),
  });
  if (!res.ok) throw new YouCamHttpError(`Task submission failed: ${res.status}`, res.status);
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
    const res = await fetch(`${YOUCAM_BASE}/task/skin-tone-analysis/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal,
    });
    if (!res.ok) throw new YouCamHttpError(`Poll failed: ${res.status}`, res.status);
    const data = await res.json();
    if (!isRecord(data) || !isRecord(data.data) || typeof data.data.task_status !== "string") throw new Error("Malformed poll response");
    if (data.data.task_status === "success") {
      if (!isRecord(data.data.results) || !isRecord(data.data.results.color) || typeof data.data.results.color.skin_color !== "string" || !/^#[0-9a-f]{6}$/i.test(data.data.results.color.skin_color)) {
        throw new Error("Malformed skin-tone result");
      }
      return data.data.results.color.skin_color;
    }
    if (data.data.task_status === "error") throw new Error("YouCam could not analyze this selfie");
    await wait(Math.min(3000, Math.max(0, timeout - (Date.now() - start))), undefined, { signal });
  }
  throw new Error("Timeout waiting for skin-tone result");
}

function timedOutResponse() {
  return privateJson({ success: false, error: "Skin analysis timed out or was cancelled. A submitted task may still complete; no task was retried automatically." }, 504);
}

async function runAnalysis(req: NextRequest, signal: AbortSignal) {
  try {
    const body = await readPhotoJson(req, signal);
    if (!isRecord(body)) throw new VtoInputError("Skin analysis request must be a JSON object");
    const parsedImage = parseVtoImage(body.imageDataUrl, "Selfie");
    if (MOCK_MODE) {
      return privateJson({ success: true, skin_color: "#b9947c", mode: "mock" });
    }
    if (!YOUCAM_API_KEY) {
      // Live mode explicitly requested but not configured — never substitute a mock value.
      return privateJson({ success: false, error: "Live skin analysis is unavailable: YOUCAM_API_KEY is not configured on this deployment", mode: "live" }, 503);
    }
    await reserveLiveBudget("skin", signal);
    const fileId = await uploadYouCamFile({
      apiKey: YOUCAM_API_KEY,
      baseUrl: YOUCAM_BASE,
      buffer: parsedImage.buffer,
      fileName: parsedImage.contentType === "image/png" ? "selfie.png" : "selfie.jpg",
      contentType: parsedImage.contentType,
      signal,
    });
    const taskId = await submitTask(YOUCAM_API_KEY, fileId, signal);
    const skinColor = await pollTask(YOUCAM_API_KEY, taskId, signal);
    return privateJson({ success: true, skin_color: skinColor, mode: "live" });
  } catch (err: unknown) {
    if (signal.aborted) return timedOutResponse();
    const status = err instanceof VtoInputError || err instanceof LiveBudgetError ? err.status : err instanceof YouCamHttpError && err.status === 429 ? 429 : 502;
    const error = err instanceof VtoInputError || err instanceof LiveBudgetError ? err.message : status === 429 ? "YouCam rate limit reached (429). No task was retried." : "Skin analysis could not complete. Check the selfie before trying again.";
    return privateJson({ success: false, error }, status);
  }
}

export async function POST(req: NextRequest) {
  if (!MOCK_MODE) {
    const denied = liveAccessError(req);
    if (denied) return privateJson({ success: false, error: denied.error, mode: "live" }, denied.status);
  }
  const signal = AbortSignal.any([req.signal, AbortSignal.timeout(180_000)]);
  let onAbort = () => {};
  const cancelled = new Promise<NextResponse>(resolve => {
    onAbort = () => resolve(timedOutResponse());
    if (signal.aborted) onAbort();
    else signal.addEventListener("abort", onAbort, { once: true });
  });
  try { return await Promise.race([runAnalysis(req, signal), cancelled]); }
  finally { signal.removeEventListener("abort", onAbort); }
}
