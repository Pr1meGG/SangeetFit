import { strict as assert } from "node:assert";
import {
  assertVtoPayloadSize,
  GARMENT_UPLOAD_BYTES,
  MAX_UPLOAD_BYTES,
  MAX_VTO_REQUEST_BYTES,
  PERSON_UPLOAD_BYTES,
} from "../src/lib/image.ts";

assert.equal(MAX_UPLOAD_BYTES, 3_400_000);
assert.equal(MAX_VTO_REQUEST_BYTES, 4_000_000);
assert.equal(PERSON_UPLOAD_BYTES, 2_400_000);
assert.equal(GARMENT_UPLOAD_BYTES, 1_400_000);
assertVtoPayloadSize({
  fullBodyDataUrl: "a".repeat(PERSON_UPLOAD_BYTES),
  garmentDataUrl: "a".repeat(GARMENT_UPLOAD_BYTES),
  category: "full-body",
});
console.log("PASS: full encoded image budgets leave room for VTO request metadata");

// JSON adds two bytes around a bare string; the complete request must be below 4 MB.
assertVtoPayloadSize("a".repeat(MAX_VTO_REQUEST_BYTES - 3));
assert.throws(() => assertVtoPayloadSize("a".repeat(MAX_VTO_REQUEST_BYTES - 2)), /too large together/);
assert.throws(() => assertVtoPayloadSize("a".repeat(MAX_VTO_REQUEST_BYTES)), /too large together/);
assert.throws(() => assertVtoPayloadSize("é".repeat(MAX_VTO_REQUEST_BYTES / 2)), /too large together/);
console.log("PASS: combined payload guard counts serialized UTF-8 bytes and rejects the boundary");
