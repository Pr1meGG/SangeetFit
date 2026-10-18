import { NextRequest, NextResponse } from "next/server";

import fs from "fs/promises";
import path from "path";
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

interface VTORequest {
  fullBodyDataUrl?: string;
  garmentId: string;
  category: string;
}

const GARMENT_REFERENCES: Record<string, { fileName: string; contentType: string }> = {
  lehenga: { fileName: "lehenga_ethnic_hd.png", contentType: "image/png" },
  anarkali: { fileName: "user_saree.png", contentType: "image/png" },
  saree: { fileName: "user_saree.png", contentType: "image/png" },
  palazzo: { fileName: "kurta_set_hd.png", contentType: "image/png" },
  kurti: { fileName: "kurta_set_hd.png", contentType: "image/png" },
  gown: { fileName: "western_dress_hd.png", contentType: "image/png" },
  suit: { fileName: "western_dress_hd.png", contentType: "image/png" },
  sharara: { fileName: "lehenga_ethnic_hd.png", contentType: "image/png" },
};

const YOUCAM_CATEGORY_MAP: Record<string, "auto"> = {
  lehenga: "auto",
  anarkali: "auto",
  saree: "auto",
  palazzo: "auto",
  kurti: "auto",
  gown: "auto",
  suit: "auto",
  sharara: "auto",
};

async function submitTask(apiKey: string, srcFileId: string, refFileId: string, category: string): Promise<string> {
  const res = await fetch(`${YOUCAM_BASE}/task/cloth-v4`, {
    method: "POST",
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
    throw new Error(`Submit failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.data.task_id;
}

async function pollTask(apiKey: string, taskId: string, timeout = 180000): Promise<string> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const res = await fetch(`${YOUCAM_BASE}/task/cloth-v4/${taskId}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(`Poll failed: ${res.status}`);
    }

    const data = await res.json();
    if (data.data.task_status === "success") {
      return data.data.results.url;
    }

    if (data.data.task_status === "error") {
      throw new Error(`Task failed: ${data.data.error_message || data.data.error || "unknown"}`);
    }

    await new Promise(r => setTimeout(r, 3000));
  }

  throw new Error("Timeout waiting for VTO result");
}

export async function POST(req: NextRequest) {
  try {
    const body: VTORequest = await req.json();
    const { fullBodyDataUrl, garmentId, category } = body;

    // Validate garment before any image/external logic.
    const garmentReference = GARMENT_REFERENCES[category];
    if (!garmentReference) {
      return NextResponse.json({ success: false, error: "Unknown garment" }, { status: 400 });
    }
    const youcamCategory = YOUCAM_CATEGORY_MAP[category];
    if (!youcamCategory) {
      return NextResponse.json({ success: false, error: "Invalid garment category" }, { status: 400 });
    }

    const parsedFullBody = fullBodyDataUrl ? parseDataUrl(fullBodyDataUrl) : null;
    if (fullBodyDataUrl && !parsedFullBody) {
      return NextResponse.json({ success: false, error: "Full-body photo must be a valid JPG or PNG image" }, { status: 400 });
    }
    if (parsedFullBody && parsedFullBody.buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Full-body photo must be under 10MB" }, { status: 400 });
    }

    if (MOCK_MODE) {
      // Mock mode: the source is the bundled sample full-body photo
      // (public/garment_test/fullbody_mock.png), and results are clearly labelled mock.
      // Map outfit categories to existing mock result images
      const MOCK_RESULT: Record<string, string> = {
        lehenga: "/garment_test/lehenga_ethnic_hd.png",
        anarkali: "/garment_test/user_saree.png",
        saree: "/garment_test/user_saree.png",
        palazzo: "/garment_test/kurta_set_hd.png",
        kurti: "/garment_test/kurta_set_hd.png",
        gown: "/garment_test/western_dress_hd.png",
        suit: "/garment_test/western_dress_hd.png",
        sharara: "/garment_test/lehenga_ethnic_hd.png",
      };
      const mockUrl = MOCK_RESULT[category] || "/garment_test/user_saree.png";
      return NextResponse.json({
        success: true,
        resultUrl: mockUrl,
        mode: "mock",
      });
    }

    // Live mode requires a real full-body source — never fall back to a sample.
    if (!parsedFullBody) {
      return NextResponse.json({ success: false, error: "A full-body photo is required for virtual try-on" }, { status: 400 });
    }

    if (!YOUCAM_API_KEY) {
      // Live mode explicitly requested but not configured — never substitute a mock image.
      return NextResponse.json(
        { success: false, error: "Live try-on is unavailable: YOUCAM_API_KEY is not configured on this deployment", mode: "live" },
        { status: 503 },
      );
    }

    const srcFileId = await uploadYouCamFile({
      apiKey: YOUCAM_API_KEY,
      baseUrl: YOUCAM_BASE,
      buffer: parsedFullBody.buffer,
      fileName: parsedFullBody.contentType === "image/png" ? "fullbody.png" : "fullbody.jpg",
      contentType: parsedFullBody.contentType,
    });
    const garmentBuffer = await fs.readFile(path.join(process.cwd(), "public", "garment_test", garmentReference.fileName));
    const refFileId = await uploadYouCamFile({
      apiKey: YOUCAM_API_KEY,
      baseUrl: YOUCAM_BASE,
      buffer: garmentBuffer,
      fileName: garmentReference.fileName,
      contentType: garmentReference.contentType,
    });
    const taskId = await submitTask(YOUCAM_API_KEY, srcFileId, refFileId, youcamCategory);
    const resultUrl = await pollTask(YOUCAM_API_KEY, taskId);

    return NextResponse.json({ success: true, resultUrl, mode: "live" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
