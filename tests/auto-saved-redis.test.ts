// Execute the production autosave Lua only on explicitly disposable local Redis.
import { strict as assert } from "node:assert";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { STORE_AUTO_SAVED_SCRIPT, DELETE_AUTO_SAVED_SCRIPT } from "../src/lib/shared-results.ts";

const execute = promisify(execFile);

void (async () => {
  if (process.env.REQUIRE_REDIS_TEST !== "true") {
    console.log("SKIP: autosave Lua requires explicitly disposable Redis; CI requires it.");
    return;
  }
  const container = process.env.TEST_REDIS_CONTAINER;
  const command = container ? "docker" : "redis-cli";
  const prefix = container ? ["exec", container, "redis-cli", "--json"] : ["--json"];
  const redis = async (...args: string[]): Promise<unknown> => {
    const { stdout } = await execute(command, [...prefix, ...args], { timeout: 30_000 });
    return JSON.parse(stdout);
  };
  assert.equal(await redis("PING"), "PONG");
  const namespace = `sangeetfit:test:autosave:${randomUUID()}`;
  const index = `${namespace}:index`, keys: string[] = [index];
  const createdAt = Math.floor(Date.now() / 1000), expiresAt = createdAt + 86_400;
  const visitor = "synthetic-visitor";
  const save = async (id: string, created = createdAt, expires = expiresAt, owner = visitor) => {
    const key = `${namespace}:${id}`;
    const summaryKey = `${key}:summary`;
    keys.push(key, summaryKey);
    return redis("EVAL", STORE_AUTO_SAVED_SCRIPT, "3", key, index, summaryKey,
      JSON.stringify({ id, visitor: owner, expiresAt: expires }), String(created), String(expires), owner, id,
      JSON.stringify({ id, outfitLabel: "Synthetic outfit", mode: "live", createdAt: created, expiresAt: expires }));
  };
  try {
    assert.equal(await save("first"), expiresAt);
    assert.equal(await save("second"), expiresAt);
    assert.equal(await save("later", createdAt + 1, expiresAt + 1), expiresAt + 1);
    assert.equal(await redis("ZCARD", index), 3, "same-second and later saves retain all earlier entries");
    assert.equal(Number(await redis("ZSCORE", index, "first")), expiresAt);
    assert.equal(await save("first", createdAt + 5, expiresAt + 5), expiresAt, "retry preserves the first expiry");
    const summary = JSON.parse(String(await redis("GET", `${namespace}:first:summary`)));
    assert.equal(summary.expiresAt, expiresAt, "retry preserves metadata expiry too");
    assert.deepEqual(Object.keys(summary).sort(), ["createdAt", "expiresAt", "id", "mode", "outfitLabel"]);
    assert.equal(await save("first", createdAt, expiresAt, "other-visitor"), -2);
    const additions: unknown[] = [];
    // Bound native CLI processes while still racing writes at the capacity boundary.
    for (let offset = 0; offset < 60; offset += 10) {
      additions.push(...await Promise.all(Array.from({ length: 10 }, (_, i) => save(`parallel-${offset + i}`))));
    }
    assert.equal(additions.filter(value => value === expiresAt).length, 47);
    assert.equal(additions.filter(value => value === -1).length, 13);
    assert.equal(await redis("ZCARD", index), 50, "concurrent saves cannot exceed the gallery cap");
    await redis("ZADD", index, String(createdAt), "second");
    assert.equal(await save("replacement"), expiresAt, "only expired index entries are pruned at capacity");
    assert.equal(Number(await redis("ZSCORE", index, "first")), expiresAt);
    assert.equal(await redis("ZCARD", index), 50);
    assert.equal(await redis("EVAL", DELETE_AUTO_SAVED_SCRIPT, "3", `${namespace}:first`, index, `${namespace}:first:summary`, "first"), 1);
    assert.equal(await redis("GET", `${namespace}:first:summary`), null, "deletion removes the summary atomically");
    assert.equal(await save("first"), -3, "a deleted result cannot be restored by a delayed save");
    assert.equal(await redis("ZCARD", index), 49);
    console.log("PASS: actual Redis autosave Lua preserves multiple results, expiry, idempotence, owner binding, concurrent cap and deletion markers");
  } finally {
    await redis("DEL", ...new Set(keys));
  }
})().catch(error => { console.error(error); process.exit(1); });
