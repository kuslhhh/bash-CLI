import os from "node:os";
import path from "node:path";
import { mkdtemp, readdir, rm } from "node:fs/promises";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { CacheManager } from "../cache/cacheManager";
import { Logger } from "../utils/logger";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("CacheManager", () => {
  let cacheDir = "";
  let cache: CacheManager;

  beforeEach(async () => {
    cacheDir = await mkdtemp(path.join(os.tmpdir(), "ksh-cache-"));
    cache = new CacheManager({
      cacheDir,
      logger: new Logger(false),
      cleanupIntervalMs: 0,
    });
  });

  afterEach(async () => {
    if (cacheDir) {
      await rm(cacheDir, { recursive: true, force: true });
    }
  });

  it("stores and reads values before TTL expiry", async () => {
    await cache.set("du:.", { bytes: 100 }, 200);
    const value = await cache.get<{ bytes: number }>("du:.");
    expect(value).toEqual({ bytes: 100 });
  });

  it("expires values after TTL", async () => {
    await cache.set("find:tmp:*", "first", 20);
    await sleep(35);
    const value = await cache.get<string>("find:tmp:*");
    expect(value).toBeNull();
  });

  it("invalidates by prefix", async () => {
    await cache.set("du:one", "1");
    await cache.set("du:two", "2");
    await cache.set("ps:all", "3");

    await cache.invalidatePrefix("du:");

    expect(await cache.get("du:one")).toBeNull();
    expect(await cache.get("du:two")).toBeNull();
    expect(await cache.get("ps:all")).toBe("3");
  });

  it("cleanup removes expired cache files", async () => {
    await cache.set("top:10", "active", 200);
    await cache.set("top:5", "expired", 10);
    await sleep(30);
    await cache.cleanup();

    const files = await readdir(cacheDir);
    expect(files.length).toBe(1);
    expect(await cache.get("top:10")).toBe("active");
    expect(await cache.get("top:5")).toBeNull();
  });
});
