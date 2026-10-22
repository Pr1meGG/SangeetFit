import { createHash, timingSafeEqual } from "node:crypto";

export function liveAccessConfigured(): boolean {
  const length = (process.env.LIVE_ACCESS_CODE || "").length;
  return length >= 24 && length <= 256;
}

export function liveAccessError(req: Request): { status: number; error: string } | null {
  const expected = process.env.LIVE_ACCESS_CODE || "";
  if (!liveAccessConfigured()) {
    return { status: 503, error: "Live generation access is not configured on this deployment." };
  }
  const supplied = req.headers.get("x-sangeetfit-access-code") || "";
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (supplied.length > 256 || !timingSafeEqual(digest(expected), digest(supplied))) {
    return { status: 401, error: "Enter a valid preview access code to generate." };
  }
  return null;
}
