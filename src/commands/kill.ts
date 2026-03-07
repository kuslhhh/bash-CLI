import type { CommandModule } from "../types/command";
import { invalidateExpensiveCaches, usage } from "./shared";

const killCommand: CommandModule = {
  name: "kill",
  description: "Stop a process by PID.",
  async run(args, context) {
    const pidRaw = args[0];
    if (!pidRaw) {
      usage("kill");
    }
    const pid = Number.parseInt(pidRaw, 10);
    if (Number.isNaN(pid) || pid <= 0) {
      throw new Error("PID must be a positive integer.");
    }

    await context.runner.runScript(`Stop-Process -Id ${pid} -Force`);
    await invalidateExpensiveCaches(context);
  },
};

export default killCommand;

