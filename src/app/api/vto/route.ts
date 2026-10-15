import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY || "";
const YOUCAM_BASE = process.env.YOUCAM_BASE_URL || "https://yce-api-01.makeupar.com/s2s/v2.0";
const MOCK_MODE = process.env.MOCK_MODE === "true";

interface VTORequest {
  userId: string;
  garmentId: string;
  category: string;
}

async function uploadFile(apiKey: string, filePath: string, fileName: string): Promise<string> {
  const fileSize = (await fs.stat(filePath)).size;

  const uploadRes = await fetch(`${YOUCAM_BASE}/file/cloth-v3`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
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

  const fileBuffer = await fs.readFile(filePath);
  const putRes = await fetch(putUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "image/jpeg",
    },
    body: fileBuffer,
  });

  if (!putRes.ok) {
    throw new Error(`PUT failed: ${putRes.status}`);
  }

  return fileId;
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
      format: "json",
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
    const res = await fetch(`${YOUCAM_BASE}/task/cloth-v4/{taskId}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(`Poll failed: ${res.status}`);
    }

    const data = await res.json();
    if (data.data.task_status === "success") {
      return data.data.results.url;
    }

    if (data.data.task_status === "failed") {
      throw new Error(`Task failed: ${data.data.error || "unknown"}`);
    }

    await new Promise(r => setTimeout(r, 3000));
  }

  throw new Error("Timeout waiting for VTO result");
}

export async function POST(req: NextRequest) {
  try {
    const body: VTORequest = await req.json();
    const { userId, garmentId, category } = body;

    if (MOCK_MODE || !YOUCAM_API_KEY) {
      return NextResponse.json({
        success: true,
        resultUrl: `/garment_test/${garmentId}_hd_result.png`,
        mode: "mock",
      });
    }

    const outDir = path.join(process.cwd(), "out", "garment_test");
    const userPath = path.join(outDir, `${userId}.jpg`);
    const garmentPath = path.join(outDir, `${garmentId}.png`);

    try {
      await fs.access(userPath);
      await fs.access(garmentPath);
    } catch {
      return NextResponse.json({ success: false, error: "Source or garment file not found" }, { status: 400 });
    }

    const srcFileId = await uploadFile(YOUCAM_API_KEY, userPath, path.basename(userPath));
    const refFileId = await uploadFile(YOUCAM_API_KEY, garmentPath, path.basename(garmentPath));
    const taskId = await submitTask(YOUCAM_API_KEY, srcFileId, refFileId, category);
    const resultUrl = await pollTask(YOUCAM_API_KEY, taskId);

    return NextResponse.json({ success: true, resultUrl });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
