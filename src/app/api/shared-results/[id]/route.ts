import { deleteSharedResult, getSharedResult } from "@/lib/shared-results";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
type Context = { params: Promise<{ id: string }> };
export async function GET(req: Request, context: Context) { return getSharedResult(req, (await context.params).id); }
export async function DELETE(req: Request, context: Context) { return deleteSharedResult(req, (await context.params).id); }
