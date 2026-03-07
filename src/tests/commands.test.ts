import os from "node:os";
import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import findCommand from "../commands/find";
import hashCommand from "../commands/hash";
import lsCommand from "../commands/ls";
import { CacheManager } from "../cache/cacheManager";
import type { CommandContext } from "../types/command";
import { Logger } from "../utils/logger";

describe("command modules", () => {
  let cacheDir = "";
  let cache: CacheManager;

  beforeEach(async () => {
    cacheDir = await mkdtemp(path.join(os.tmpdir(), "ksh-commands-"));
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

  it("ls builds a quoted PowerShell command", async () => {
    const runScript = vi.fn().mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });
    const context: CommandContext = {
      runner: { runScript },
      cache,
      logger: new Logger(false),
      cwd: process.cwd(),
    };

    await lsCommand.run(["C:\\Program Files"], context);

    expect(runScript).toHaveBeenCalledTimes(1);
    expect(runScript).toHaveBeenCalledWith("Get-ChildItem -Force -Path 'C:\\Program Files'");
  });

  it("find uses cache after first call", async () => {
    const runScript = vi.fn().mockResolvedValue({
      exitCode: 0,
      stdout: "C:\\work\\file.txt\n",
      stderr: "",
    });
    const writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const context: CommandContext = {
      runner: { runScript },
      cache,
      logger: new Logger(false),
      cwd: process.cwd(),
    };

    await findCommand.run(["C:\\work", "*.txt"], context);
    await findCommand.run(["C:\\work", "*.txt"], context);

    expect(runScript).toHaveBeenCalledTimes(1);
    expect(writeSpy).toHaveBeenCalledWith("C:\\work\\file.txt\n");
  });

  it("hash generates deterministic output for text", async () => {
    const writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const context: CommandContext = {
      runner: { runScript: vi.fn().mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" }) },
      cache,
      logger: new Logger(false),
      cwd: process.cwd(),
    };

    await hashCommand.run(["hello", "md5"], context);
    expect(writeSpy).toHaveBeenCalledWith("5d41402abc4b2a76b9719d911017c592\n");
  });
});
