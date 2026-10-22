import { isRecord, parseDataUrl, type ParsedDataUrl } from "./youcam";
import { inflateSync } from "node:zlib";

// Reuse Next's bundled image header reader; only buffers (never paths/URLs) enter it.
const { imageSize } = require("next/dist/compiled/image-size") as {
  imageSize: (buffer: Buffer) => { width?: number; height?: number; type?: string };
};

export const MAX_VTO_REQUEST_BYTES = 4_000_000;

export class VtoInputError extends Error {
  constructor(message: string, readonly status = 400) { super(message); }
}

const crcTable = Uint32Array.from({ length: 256 }, (_, byte) => {
  let crc = byte;
  for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  return crc >>> 0;
});

function validPng(buffer: Buffer, width: number, height: number): boolean {
  let offset = 8;
  let depth = 0;
  let channels = 0;
  let interlace = 0;
  let paletteRequired = false;
  let hasPalette = false;
  let dataEnded = false;
  const chunks: Buffer[] = [];
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const end = offset + length + 12;
    if (end > buffer.length) return false;
    const type = buffer.toString("latin1", offset + 4, offset + 8);
    if (!/^[A-Za-z]{2}[A-Z][A-Za-z]$/.test(type)) return false;
    let crc = 0xffffffff;
    for (let i = offset + 4; i < end - 4; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ buffer[i]) & 255];
    if (((crc ^ 0xffffffff) >>> 0) !== buffer.readUInt32BE(end - 4)) return false;
    if (offset === 8 && type !== "IHDR") return false;
    if (type === "IHDR") {
      if (offset !== 8 || length !== 13) return false;
      depth = buffer[offset + 16];
      const colour = buffer[offset + 17];
      const depths: Record<number, number[]> = { 0: [1, 2, 4, 8, 16], 2: [8, 16], 3: [1, 2, 4, 8], 4: [8, 16], 6: [8, 16] };
      if (!depths[colour]?.includes(depth) || buffer[offset + 18] !== 0 || buffer[offset + 19] !== 0) return false;
      interlace = buffer[offset + 20];
      if (interlace > 1) return false;
      channels = ({ 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 } as Record<number, number>)[colour];
      paletteRequired = colour === 3;
    } else if (type === "PLTE") {
      if (hasPalette || chunks.length || length === 0 || length > 768 || length % 3) return false;
      hasPalette = true;
    } else if (type === "IDAT") {
      if (dataEnded || (paletteRequired && !hasPalette)) return false;
      chunks.push(buffer.subarray(offset + 8, end - 4));
    } else if (type === "IEND") {
      if (length !== 0 || end !== buffer.length || chunks.length === 0) return false;
      const passes = interlace ? [[0, 0, 8, 8], [4, 0, 8, 8], [0, 4, 4, 8], [2, 0, 4, 4], [0, 2, 2, 4], [1, 0, 2, 2], [0, 1, 1, 2]] : [[0, 0, 1, 1]];
      const rows = passes.map(([x, y, dx, dy]) => {
        const w = Math.max(0, Math.ceil((width - x) / dx));
        return { bytes: Math.ceil(w * depth * channels / 8) + 1, count: w ? Math.max(0, Math.ceil((height - y) / dy)) : 0 };
      });
      const expected = rows.reduce((total, row) => total + row.bytes * row.count, 0);
      try {
        const pixels = inflateSync(Buffer.concat(chunks), { maxOutputLength: expected });
        if (pixels.length !== expected) return false;
        let position = 0;
        for (const row of rows) for (let i = 0; i < row.count; i++, position += row.bytes) if (pixels[position] > 4) return false;
        return true;
      } catch { return false; }
    } else if (type[0] === type[0].toUpperCase()) return false;
    if (chunks.length && type !== "IDAT") dataEnded = true;
    offset = end;
  }
  return false;
}

// shortcut: JPEG segment/scan integrity is checked, full entropy decoding needs an installed decoder.
function validJpeg(buffer: Buffer): boolean {
  let offset = 2;
  let frame = false;
  let scan = false;
  while (offset < buffer.length) {
    if (buffer[offset++] !== 255) return false;
    while (buffer[offset] === 255) offset++;
    const marker = buffer[offset++];
    if (marker === 0xd9) return frame && scan && offset === buffer.length;
    if (!marker || marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || offset + 2 > buffer.length) return false;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) return false;
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      if (frame || length < 11 || length !== 8 + 3 * buffer[offset + 7]) return false;
      frame = true;
    }
    if (marker !== 0xda) { offset += length; continue; }
    if (!frame || length < 8 || length !== 6 + 2 * buffer[offset + 2]) return false;
    scan = true;
    offset += length;
    const start = offset;
    while (offset < buffer.length) {
      if (buffer[offset] !== 255) { offset++; continue; }
      let next = offset + 1;
      while (buffer[next] === 255) next++;
      if (buffer[next] === 0 || (buffer[next] >= 0xd0 && buffer[next] <= 0xd7)) { offset = next + 1; continue; }
      break;
    }
    if (offset === start) return false;
  }
  return false;
}

export function parseVtoImage(value: unknown, label: string): ParsedDataUrl {
  const invalid = `${label} must be a valid JPG or PNG image`;
  if (typeof value !== "string") throw new VtoInputError(invalid);
  const parsed = parseDataUrl(value);
  if (!parsed) throw new VtoInputError(invalid);
  const { buffer } = parsed;
  const png = buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const jpeg = buffer.length >= 4 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
  if ((parsed.contentType === "image/png" && !png) || (parsed.contentType !== "image/png" && !jpeg)) {
    throw new VtoInputError(invalid);
  }
  if (buffer.toString("base64").replace(/=+$/, "") !== value.split(",")[1].replace(/=+$/, "")) {
    throw new VtoInputError(invalid);
  }
  let dimensions;
  try { dimensions = imageSize(buffer); } catch { throw new VtoInputError(invalid); }
  if (!dimensions.width || !dimensions.height || dimensions.width > 4096 || dimensions.height > 4096) {
    throw new VtoInputError(`${label} must have positive dimensions no larger than 4096 pixels per side`);
  }
  if (Math.max(dimensions.width, dimensions.height) < 128) {
    throw new VtoInputError(`${label} is too small. Choose an image with a longest side of at least 128 pixels.`);
  }
  if (png ? !validPng(buffer, dimensions.width, dimensions.height) : !validJpeg(buffer)) {
    throw new VtoInputError(invalid);
  }
  return { buffer, contentType: png ? "image/png" : "image/jpeg" };
}

type VtoInput = {
  kind: "upload";
  fullBody: ParsedDataUrl;
  garmentImage: ParsedDataUrl;
  garmentImageDataUrl: string;
  garmentCategory: "upper_body" | "full_body";
} | {
  kind: "catalogue";
  fullBody: ParsedDataUrl | null;
  garmentId: string;
  referenceAsset: string;
  vtoSupported: boolean;
};

export function parseVtoInput(body: unknown): VtoInput {
  if (!isRecord(body)) throw new VtoInputError("Try-on request must be a JSON object");
  if (Buffer.byteLength(JSON.stringify(body), "utf8") >= MAX_VTO_REQUEST_BYTES) {
    throw new VtoInputError("Try-on request must be under 4 MB", 413);
  }
  if ("garmentImageDataUrl" in body || "garmentCategory" in body) {
    if ("imageDataUrl" in body || "selfieDataUrl" in body) {
      throw new VtoInputError("Use a full-body photo for virtual try-on");
    }
    if (["garmentId", "referenceAsset", "vtoSupported", "displayImage"].some(key => key in body)) {
      throw new VtoInputError("Choose either a catalogue outfit or an uploaded garment");
    }
    if (body.garmentCategory !== "upper_body" && body.garmentCategory !== "full_body") {
      throw new VtoInputError("Choose upper_body or full_body for the uploaded garment");
    }
    if (!body.fullBodyDataUrl) throw new VtoInputError("A full-body photo is required for virtual try-on");
    return {
      kind: "upload",
      fullBody: parseVtoImage(body.fullBodyDataUrl, "Full-body photo"),
      garmentImage: parseVtoImage(body.garmentImageDataUrl, "Garment photo"),
      garmentImageDataUrl: body.garmentImageDataUrl as string,
      garmentCategory: body.garmentCategory,
    };
  }
  if (typeof body.garmentId !== "string") throw new VtoInputError("Unknown outfit");
  if (typeof body.referenceAsset !== "string") throw new VtoInputError("Unknown garment reference");
  return {
    kind: "catalogue",
    fullBody: body.fullBodyDataUrl === undefined ? null : parseVtoImage(body.fullBodyDataUrl, "Full-body photo"),
    garmentId: body.garmentId,
    referenceAsset: body.referenceAsset,
    vtoSupported: body.vtoSupported === true,
  };
}
