import { createHash, getHashes } from "node:crypto";
import { readFile } from "node:fs/promises";

import type { CommandModule } from "../types/command";
import { usage } from "./shared";

const DEFAULT_ALGORITHM = "sha256";

const hashCommand: CommandModule = {
  name: "hash",
  description: "Create a hash from text or file bytes.",
  async run(args) {
    if (args.length === 0) {
      usage("hash");
    }

    let data: Buffer;
    let algorithm = DEFAULT_ALGORITHM;

    if (args[0] === "-f") {
      const filePath = args[1];
      if (!filePath) {
        usage("hash");
      }
      algorithm = args[2] ?? DEFAULT_ALGORITHM;
      data = await readFile(filePath);
    } else {
      const text = args[0];
      if (!text) {
        usage("hash");
      }
      algorithm = args[1] ?? DEFAULT_ALGORITHM;
      data = Buffer.from(text, "utf8");
    }

    if (!getHashes().includes(algorithm)) {
      throw new Error(`Unsupported hash algorithm: ${algorithm}`);
    }

    const digest = createHash(algorithm).update(data).digest("hex");
    process.stdout.write(`${digest}\n`);
  },
};

export default hashCommand;
