import type { CommandModule } from "../types/command";

const clearCommand: CommandModule = {
  name: "clear",
  description: "Clear terminal output.",
  async run(_args, context) {
    await context.runner.runScript("Clear-Host");
  },
};

export default clearCommand;

