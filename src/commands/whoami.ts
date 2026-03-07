import type { CommandModule } from "../types/command";

const whoamiCommand: CommandModule = {
  name: "whoami",
  description: "Show current user.",
  async run(_args, context) {
    await context.runner.runScript("whoami");
  },
};

export default whoamiCommand;

