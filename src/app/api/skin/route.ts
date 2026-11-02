import { privateJson } from "@/lib/request";

export async function POST(_req: Request) {
  return privateJson({ success: false, error: "Skin-tone analysis is archived." }, 410);
}
