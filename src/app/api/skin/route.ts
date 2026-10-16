import { NextRequest, NextResponse } from "next/server";

const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY || "";
const YOUCAM_BASE = process.env.YOUCAM_BASE_URL || "https://yce-api-01.makeupar.com/s2s/v2.0";
const MOCK_MODE = process.env.MOCK_MODE === "true";

interface SkinRequest {
  imageDataUrl: string;
}

/** Caller: POST /api/skin from page.tsx step 2. Returns { skin_color, mode }. */
async function uploadFile(apiKey: string, fileBuffer: Buffer, fileName: string): Promise<string> {
  const fileSize = fileBuffer.length;

  const uploadRes = await fetch(`${YOUCAM_BASE}/file`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: [{
        content_type: "image/jpeg",
        file_name: fileName,
        file_size: fileSize,
      }],
    }),
  });

  if (!uploadRes.ok) {
    throw new Error(`Upload failed: ${uploadRes.status} ${await uploadRes.text()}`);
  }

  const uploadData = await uploadRes.json();
  const fileId = uploadData.data.files[0].file_id;
  const putUrl = uploadData.data.files[0].upload_url;

  const putRes = await fetch(putUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "image/jpeg",
    },
    body: fileBuffer as BodyInit,
  });

  if (!putRes.ok) {
    throw new Error(`PUT failed: ${putRes.status}`);
  }

  return fileId;
}

async function submitTask(apiKey: string, fileId: string): Promise<string> {
  const res = await fetch(`${YOUCAM_BASE}/task/skin-tone-analysis`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file_id: fileId }),
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

    if (data.data.task_status === "failed") {
      throw new Error(`Task failed: ${data.data.error || "unknown"}`);
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

    if (MOCK_MODE || !YOUCAM_API_KEY) {
      return NextResponse.json({
        success: true,
        skin_color: "#b9947c",
        mode: "mock",
      });
    }

    const commaIdx = imageDataUrl.indexOf(",");
    if (commaIdx === -1) {
      return NextResponse.json({ success: false, error: "Invalid data URL" }, { status: 400 });
    }
    const base64 = imageDataUrl.slice(commaIdx + 1);
    const fileBuffer = Buffer.from(base64, "base64");

    const fileId = await uploadFile(YOUCAM_API_KEY, fileBuffer, "selfie.jpg");
    const skinColor = await pollTask(YOUCAM_API_KEY, fileId);

    return NextResponse.json({ success: true, skin_color: skinColor, mode: "live" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
