import { randomUUID } from "node:crypto";

import type { CommandModule } from "../types/command";

const uuidCommand: CommandModule = {
  name: "uuid",
  description: "Generate a UUID.",
  async run() {
    process.stdout.write(`${randomUUID()}\n`);
  },
};

export default uuidCommand;

