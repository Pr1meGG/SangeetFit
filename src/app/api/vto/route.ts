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
  /** Exact reference asset filename from public/garment_test, one of REFERENCE_ASSETS. */
  referenceAsset: string;
  /** Frontend echo of outfit.vtoSupported — server still validates the reference. */
  vtoSupported: boolean;
  /** Outfit display thumbnail; used as the mock placeholder so mock result and catalog preview align. */
  displayImage: string;
}

/**
 * Allowlist of reference assets that live in public/garment_test, with the
 * garmentTypes each one may serve. A reference must VISUALLY correspond to
 * the product — no category-level collapse, no garment substitution.
 * Assets depicting a person (fullbody_mock.png) are intentionally excluded.
 */
const REFERENCE_ASSETS: Record<string, { contentType: string; garmentTypes: string[] }> = {
  "lehenga_ethnic_hd.png": { contentType: "image/png", garmentTypes: ["lehenga-choli"] },
  "user_saree.png": { contentType: "image/png", garmentTypes: ["saree"] },
  "kurta_set_hd.png": { contentType: "image/png", garmentTypes: ["kurta-set"] },
  "western_dress_hd.png": { contentType: "image/png", garmentTypes: ["gown"] },
};

async function getOutfit(garmentId: string) {
  const { OUTFITS } = await import("@/data/outfits");
  return OUTFITS.find(o => o.id === garmentId) || null;
}

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
    const { fullBodyDataUrl, garmentId, referenceAsset, vtoSupported, displayImage } = body;

    // Validate the outfit identity before any image/external logic.
    const outfit = await getOutfit(garmentId);
    if (!outfit) {
      return NextResponse.json({ success: false, error: "Unknown outfit" }, { status: 400 });
    }

    const reference = referenceAsset ? REFERENCE_ASSETS[referenceAsset] : null;
    if (!reference) {
      return NextResponse.json({ success: false, error: "Unknown garment reference" }, { status: 400 });
    }
    // Reference must be permitted for THIS garment type — no cross-garment substitution.
    if (!reference.garmentTypes.includes(outfit.garmentType)) {
      return NextResponse.json({ success: false, error: "Try-on is not supported for this outfit yet" }, { status: 400 });
    }
    if (!vtoSupported || outfit.tryOnReference !== referenceAsset) {
      return NextResponse.json({ success: false, error: "Try-on is not supported for this outfit yet" }, { status: 400 });
    }

    const parsedFullBody = fullBodyDataUrl ? parseDataUrl(fullBodyDataUrl) : null;
    if (fullBodyDataUrl && !parsedFullBody) {
      return NextResponse.json({ success: false, error: "Full-body photo must be a valid JPG or PNG image" }, { status: 400 });
    }
    if (parsedFullBody && parsedFullBody.buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Full-body photo must be under 10MB" }, { status: 400 });
    }

    if (MOCK_MODE) {
      // Mock mode: results are placeholders — show the SAME display thumbnail the
      // catalog preview uses, clearly labelled, so what you preview is what mock shows.
      const mockUrl = displayImage && displayImage.startsWith("/outfits/") ? displayImage : outfit.imageUrl;
      return NextResponse.json({
        success: true,
        resultUrl: mockUrl,
        displayImage: outfit.imageUrl,
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
    const garmentBuffer = await fs.readFile(path.join(process.cwd(), "public", "garment_test", referenceAsset));
    const refFileId = await uploadYouCamFile({
      apiKey: YOUCAM_API_KEY,
      baseUrl: YOUCAM_BASE,
      buffer: garmentBuffer,
      fileName: referenceAsset,
      contentType: reference.contentType,
    });
    const taskId = await submitTask(YOUCAM_API_KEY, srcFileId, refFileId, outfit.youcamCategory);
    const resultUrl = await pollTask(YOUCAM_API_KEY, taskId);

    return NextResponse.json({ success: true, resultUrl, mode: "live" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
