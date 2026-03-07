import { readFile } from "node:fs/promises";

import { fileExists } from "../utils/fileUtils";
import type { CommandModule } from "../types/command";
import { usage } from "./shared";

const jsonCommand: CommandModule = {
  name: "json",
  description: "Pretty print JSON text or JSON file.",
  async run(args) {
    const firstArg = args[0];
    if (!firstArg) {
      usage("json");
    }

    const maybeFile = firstArg;
    const raw = (await fileExists(maybeFile)) ? await readFile(maybeFile, "utf8") : args.join(" ");
    const parsed = JSON.parse(raw);
    process.stdout.write(`${JSON.stringify(parsed, null, 2)}\n`);
  },
};

export default jsonCommand;

