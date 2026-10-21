import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Reports the app's operating mode so UI badges are truthful. No secrets returned.
// Mirrors the env logic in src/app/api/vto/route.ts and src/app/api/skin/route.ts.
const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY || "";
const MOCK_MODE = process.env.MOCK_MODE === "true";

export async function GET() {
  const mode = MOCK_MODE ? "mock" : YOUCAM_API_KEY ? "live" : "unconfigured";
  return NextResponse.json({ mode });
}
