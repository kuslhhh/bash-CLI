import type { CommandModule } from "../types/command";

const pwdCommand: CommandModule = {
  name: "pwd",
  description: "Print current directory.",
  async run(_args, context) {
    await context.runner.runScript("Get-Location | Select-Object -ExpandProperty Path");
  },
};

export default pwdCommand;

