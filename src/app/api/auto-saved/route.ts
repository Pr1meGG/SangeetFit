import { listAutoSavedVtoResults, getAutoSavedVtoResult, deleteAutoSavedResult, retryAutoSavedResult } from "@/lib/shared-results";
import { privateJson } from "@/lib/request";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  return id ? getAutoSavedVtoResult(req, id) : listAutoSavedVtoResults(req);
}

export const POST = retryAutoSavedResult;

export function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  return id ? deleteAutoSavedResult(req, id) : privateJson({ error: "Saved look not found" }, 404);
}
