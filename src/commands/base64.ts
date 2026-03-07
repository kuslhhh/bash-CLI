import type { CommandModule } from "../types/command";
import { usage } from "./shared";

const base64Command: CommandModule = {
  name: "base64",
  description: "Encode or decode base64 text.",
  async run(args) {
    const mode = (args[0] ?? "encode").toLowerCase();
    if (mode !== "encode" && mode !== "decode") {
      usage("base64");
    }

    const payload = args.slice(1).join(" ");
    if (!payload) {
      usage("base64");
    }

    const output =
      mode === "encode"
        ? Buffer.from(payload, "utf8").toString("base64")
        : Buffer.from(payload, "base64").toString("utf8");

    process.stdout.write(`${output}\n`);
  },
};

export default base64Command;

