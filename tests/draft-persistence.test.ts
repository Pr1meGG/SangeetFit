import { strict as assert } from "node:assert";
import { after, beforeEach, test } from "node:test";
import { clearSession, loadSession, persistSession } from "../src/lib/persistence.ts";

const stored = new Map<string, string>();
const previousStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, String(value)),
    removeItem: (key: string) => stored.delete(key),
  },
});
beforeEach(() => stored.clear());
after(() => {
  if (previousStorage) Object.defineProperty(globalThis, "localStorage", previousStorage);
  else Reflect.deleteProperty(globalThis, "localStorage");
});

test("standalone mode, occasion, and looks updates are persisted", () => {
  persistSession({ skinMode: "mock" });
  persistSession({ occasion: "sangeet" });
  persistSession({ looks: [{ id: "example-look" }] });

  const loaded = loadSession();
  assert.equal(loaded.skinMode, "mock");
  assert.equal(loaded.occasion, "sangeet");
  assert.deepEqual(loaded.looks, [{ id: "example-look" }]);
});

test("explicit null clears skin values while omitted fields retain their state", () => {
  persistSession({ skinColor: "#aabbcc", skinMode: "mock", occasion: "haldi" });
  persistSession({ skinColor: null, skinMode: null });

  const loaded = loadSession();
  assert.equal(loaded.skinColor, null);
  assert.equal(loaded.skinMode, null);
  assert.equal(loaded.occasion, "haldi");
});

test("empty collections replace previous values and clearing preserves unrelated storage", () => {
  stored.set("unrelated-setting", "keep");
  persistSession({ owned: [{ id: "outfit" }], favorites: new Set(["outfit"]) });
  persistSession({ owned: [], favorites: new Set() });
  assert.deepEqual(loadSession().owned, []);
  assert.deepEqual(loadSession().favorites, new Set());

  clearSession();
  assert.deepEqual(loadSession().owned, []);
  assert.equal(stored.size, 1);
  assert.equal(stored.get("unrelated-setting"), "keep");
});
