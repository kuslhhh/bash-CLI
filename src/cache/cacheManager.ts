import { createHash } from "node:crypto";
import path from "node:path";

import { ensureDir, listFiles, readJsonFile, removeFile, writeJsonFile } from "../utils/fileUtils";
import type { Logger } from "../utils/logger";

interface CacheEntry<T> {
  key: string;
  createdAt: number;
  expiresAt: number;
  value: T;
}

export class CacheManager {
  private readonly cacheDir: string;
  private readonly defaultTtlMs: number;
  private readonly logger: Logger;
  private readonly cleanupIntervalMs: number;
  private lastCleanupAt = 0;

  constructor(options: {
    cacheDir: string;
    logger: Logger;
    defaultTtlMs?: number;
    cleanupIntervalMs?: number;
  }) {
    this.cacheDir = options.cacheDir;
    this.logger = options.logger;
    this.defaultTtlMs = options.defaultTtlMs ?? 60_000;
    this.cleanupIntervalMs = options.cleanupIntervalMs ?? 5 * 60_000;
  }

  private getCacheFilePath(key: string): string {
    const digest = createHash("sha1").update(key).digest("hex");
    return path.join(this.cacheDir, `${digest}.json`);
  }

  private async maybeCleanup(): Promise<void> {
    const now = Date.now();
    if (now - this.lastCleanupAt < this.cleanupIntervalMs) {
      return;
    }
    this.lastCleanupAt = now;
    await this.cleanup();
  }

  async get<T>(key: string): Promise<T | null> {
    await ensureDir(this.cacheDir);
    await this.maybeCleanup();

    const filePath = this.getCacheFilePath(key);
    try {
      const entry = await readJsonFile<CacheEntry<T>>(filePath);
      if (entry.expiresAt <= Date.now()) {
        await removeFile(filePath);
        this.logger.debug(`cache expired: ${key}`);
        return null;
      }
      return entry.value;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlMs = this.defaultTtlMs): Promise<void> {
    await ensureDir(this.cacheDir);
    await this.maybeCleanup();

    const now = Date.now();
    const entry: CacheEntry<T> = {
      key,
      createdAt: now,
      expiresAt: now + ttlMs,
      value,
    };
    const filePath = this.getCacheFilePath(key);
    await writeJsonFile(filePath, entry);
    this.logger.debug(`cache set: ${key} (ttl=${ttlMs}ms)`);
  }

  async invalidate(key: string): Promise<void> {
    const filePath = this.getCacheFilePath(key);
    await removeFile(filePath);
    this.logger.debug(`cache invalidated: ${key}`);
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    await ensureDir(this.cacheDir);
    const files = await listFiles(this.cacheDir);
    for (const fileName of files) {
      const filePath = path.join(this.cacheDir, fileName);
      try {
        const entry = await readJsonFile<CacheEntry<unknown>>(filePath);
        if (entry.key.startsWith(prefix)) {
          await removeFile(filePath);
          this.logger.debug(`cache invalidated by prefix ${prefix}: ${entry.key}`);
        }
      } catch {
        continue;
      }
    }
  }

  async cleanup(): Promise<void> {
    await ensureDir(this.cacheDir);
    const files = await listFiles(this.cacheDir);
    const now = Date.now();

    for (const fileName of files) {
      const filePath = path.join(this.cacheDir, fileName);
      try {
        const entry = await readJsonFile<CacheEntry<unknown>>(filePath);
        if (entry.expiresAt <= now) {
          await removeFile(filePath);
        }
      } catch {
        await removeFile(filePath);
      }
    }
  }

  async clear(): Promise<void> {
    await ensureDir(this.cacheDir);
    const files = await listFiles(this.cacheDir);
    await Promise.all(files.map((fileName) => removeFile(path.join(this.cacheDir, fileName))));
    this.logger.debug("cache cleared");
  }
}
