import { strict as assert } from "node:assert";
import { autoSaveTimeoutMs } from "../src/lib/shared-results.ts";

const deadline = 1_800_000_180_000;
assert.equal(autoSaveTimeoutMs(deadline, deadline - 170_000), 20_000, "a fast try-on keeps the full 20s save window");
assert.equal(autoSaveTimeoutMs(deadline, deadline - 15_000), 10_000, "a slow try-on saves only within the time left, minus a response margin");
assert.equal(autoSaveTimeoutMs(deadline, deadline - 7_000), 0, "too little time left skips the save instead of timing out a finished result");
assert.equal(autoSaveTimeoutMs(deadline, deadline + 1_000), 0, "a passed deadline never produces a negative timeout");
console.log("PASS: autosave never extends a finished try-on past its request deadline");
