import { NextRequest, NextResponse } from "next/server";

import { parseDataUrl, uploadYouCamFile } from "@/lib/youcam";

// Route polls YouCam for up to 180s; allow 300s per official Vercel limits
// (Fluid Compute: Hobby default+max = 300s; legacy non-Fluid Hobby caps at 60s).
// NOTE: verify the deployed project's Fluid Compute setting (Functions settings)
// in the Vercel dashboard before live VTO is enabled — if Fluid is off, the
// 180s poll exceeds the 60s legacy limit and requests will be terminated.
export const maxDuration = 300;

const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY || "";
const YOUCAM_BASE = process.env.YOUCAM_BASE_URL || "https://yce-api-01.makeupar.com/s2s/v2.0";
const MOCK_MODE = process.env.MOCK_MODE === "true";

interface SkinRequest {
  imageDataUrl: string;
}

/** Caller: POST /api/skin from page.tsx step 2. Returns { skin_color, mode }. */
async function submitTask(apiKey: string, fileId: string): Promise<string> {
  const res = await fetch(`${YOUCAM_BASE}/task/skin-tone-analysis`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ src_file_id: fileId }),
  });

  if (!res.ok) {
    throw new Error(`Task submission failed: ${res.status}`);
  }

  const data = await res.json();
  return data.data.task_id;
}

async function pollTask(apiKey: string, taskId: string, timeout = 180000): Promise<string> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const res = await fetch(`${YOUCAM_BASE}/task/skin-tone-analysis/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(`Poll failed: ${res.status}`);
    }

    const data = await res.json();
    if (data.data.task_status === "success") {
      return data.data.results.color.skin_color;
    }

    if (data.data.task_status === "error") {
      throw new Error(`Task failed: ${data.data.error_message || data.data.error || "unknown"}`);
    }

    await new Promise(r => setTimeout(r, 3000));
  }

  throw new Error("Timeout waiting for skin-tone result");
}

export async function POST(req: NextRequest) {
  try {
    const body: SkinRequest = await req.json();
    const { imageDataUrl } = body;

    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      return NextResponse.json({ success: false, error: "imageDataUrl is required" }, { status: 400 });
    }

    if (MOCK_MODE) {
      return NextResponse.json({
        success: true,
        skin_color: "#b9947c",
        mode: "mock",
      });
    }

    if (!YOUCAM_API_KEY) {
      // Live mode explicitly requested but not configured — never substitute a mock value.
      return NextResponse.json(
        { success: false, error: "Live skin analysis is unavailable: YOUCAM_API_KEY is not configured on this deployment", mode: "live" },
        { status: 503 },
      );
    }

    const parsedImage = parseDataUrl(imageDataUrl);
    if (!parsedImage) {
      return NextResponse.json({ success: false, error: "Invalid data URL" }, { status: 400 });
    }

    const fileId = await uploadYouCamFile({
      apiKey: YOUCAM_API_KEY,
      baseUrl: YOUCAM_BASE,
      buffer: parsedImage.buffer,
      fileName: parsedImage.contentType === "image/png" ? "selfie.png" : "selfie.jpg",
      contentType: parsedImage.contentType,
    });
    const taskId = await submitTask(YOUCAM_API_KEY, fileId);
    const skinColor = await pollTask(YOUCAM_API_KEY, taskId);

    return NextResponse.json({ success: true, skin_color: skinColor, mode: "live" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
