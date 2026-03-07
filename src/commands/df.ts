import type { CommandModule } from "../types/command";

const dfCommand: CommandModule = {
  name: "df",
  description: "Show filesystem disk usage.",
  async run(_args, context) {
    await context.runner.runScript(
      "Get-PSDrive -PSProvider FileSystem | " +
        "Select-Object Name,Root,Used,Free," +
        "@{Name='UsedGB';Expression={[math]::Round($_.Used/1GB,2)}}," +
        "@{Name='FreeGB';Expression={[math]::Round($_.Free/1GB,2)}}",
    );
  },
};

export default dfCommand;

