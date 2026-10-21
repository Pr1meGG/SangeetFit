export type FetchLike = typeof fetch;

export class YouCamHttpError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

export interface ParsedDataUrl {
  contentType: string;
  buffer: Buffer;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseDataUrl(dataUrl: string): ParsedDataUrl | null {
  const match = /^data:(image\/(?:jpeg|jpg|png));base64,([A-Za-z0-9+/]+={0,2})$/.exec(dataUrl);
  if (!match) return null;

  try {
    const buffer = Buffer.from(match[2], "base64");
    if (buffer.length === 0) return null;
    return { contentType: match[1], buffer };
  } catch {
    return null;
  }
}

export async function uploadYouCamFile(input: {
  apiKey: string;
  baseUrl: string;
  buffer: Buffer;
  fileName: string;
  contentType: string;
  fetchImpl?: FetchLike;
  signal?: AbortSignal;
}): Promise<string> {
  const fetchImpl = input.fetchImpl ?? fetch;
  input.signal?.throwIfAborted();
  const uploadRes = await fetchImpl(`${input.baseUrl}/file`, {
    method: "POST",
    signal: input.signal,
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: [{
        content_type: input.contentType,
        file_name: input.fileName,
        file_size: input.buffer.length,
      }],
    }),
  });

  if (!uploadRes.ok) {
    throw new YouCamHttpError(`Upload metadata failed: ${uploadRes.status}`, uploadRes.status);
  }

  const uploadData = await uploadRes.json() as unknown;
  if (!isRecord(uploadData) || !isRecord(uploadData.data) || !Array.isArray(uploadData.data.files)) {
    throw new Error("Malformed upload metadata response");
  }

  const uploadResponse = uploadData.data as { files?: unknown[] };
  const fileEntry = uploadResponse.files?.[0];
  if (!isRecord(fileEntry)) {
    throw new Error("Malformed upload metadata response");
  }

  const uploadRequest = Array.isArray(fileEntry.requests) ? fileEntry.requests[0] : undefined;
  if (
    !isRecord(uploadRequest) ||
    typeof uploadRequest.url !== "string" ||
    typeof uploadRequest.method !== "string" ||
    !isRecord(uploadRequest.headers) ||
    typeof fileEntry.file_id !== "string" ||
    fileEntry.file_id.length === 0
  ) {
    throw new Error("Malformed upload metadata response");
  }

  const uploadHeaders: Record<string, string> = {};
  for (const [header, value] of Object.entries(uploadRequest.headers)) {
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error("Malformed upload headers");
    }
    uploadHeaders[header] = String(value);
  }

  input.signal?.throwIfAborted();
  const binaryRes = await fetchImpl(uploadRequest.url, {
    method: uploadRequest.method,
    signal: input.signal,
    headers: uploadHeaders,
    body: new Uint8Array(input.buffer),
  });

  if (!binaryRes.ok) {
    throw new YouCamHttpError(`Binary (signed PUT) upload failed: ${binaryRes.status}`, binaryRes.status);
  }

  return fileEntry.file_id;
}
