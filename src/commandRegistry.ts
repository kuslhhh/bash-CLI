import type { CommandDefinition, CommandModule } from "./types/command";

type CommandCategory = "filesystem" | "search" | "system" | "utility";

interface CommandRecord extends CommandDefinition {
  category: CommandCategory;
}

const commandRecords: CommandRecord[] = [
  {
    name: "ls",
    description: "List directory contents.",
    category: "filesystem",
    load: async () => (await import("./commands/ls")).default,
  },
  {
    name: "cat",
    description: "Print file contents.",
    category: "filesystem",
    load: async () => (await import("./commands/cat")).default,
  },
  {
    name: "touch",
    description: "Create an empty file.",
    category: "filesystem",
    load: async () => (await import("./commands/touch")).default,
  },
  {
    name: "mkdir",
    description: "Create a directory.",
    category: "filesystem",
    load: async () => (await import("./commands/mkdir")).default,
  },
  {
    name: "rmdir",
    description: "Remove a directory recursively.",
    category: "filesystem",
    load: async () => (await import("./commands/rmdir")).default,
  },
  {
    name: "rm",
    description: "Remove a file.",
    category: "filesystem",
    load: async () => (await import("./commands/rm")).default,
  },
  {
    name: "cp",
    description: "Copy files or directories.",
    category: "filesystem",
    load: async () => (await import("./commands/cp")).default,
  },
  {
    name: "mv",
    description: "Move files or directories.",
    category: "filesystem",
    load: async () => (await import("./commands/mv")).default,
  },
  {
    name: "pwd",
    description: "Print current directory.",
    category: "filesystem",
    load: async () => (await import("./commands/pwd")).default,
  },
  {
    name: "tree",
    description: "Show directory tree.",
    category: "filesystem",
    load: async () => (await import("./commands/tree")).default,
  },
  {
    name: "stat",
    description: "Display file or directory metadata.",
    category: "filesystem",
    load: async () => (await import("./commands/stat")).default,
  },
  {
    name: "head",
    description: "Show the first lines of a file.",
    category: "filesystem",
    load: async () => (await import("./commands/head")).default,
  },
  {
    name: "tail",
    description: "Show the last lines of a file.",
    category: "filesystem",
    load: async () => (await import("./commands/tail")).default,
  },
  {
    name: "wc",
    description: "Count lines, words, and characters in a file.",
    category: "filesystem",
    load: async () => (await import("./commands/wc")).default,
  },
  {
    name: "which",
    description: "Show where a command resolves from.",
    category: "filesystem",
    load: async () => (await import("./commands/which")).default,
  },
  {
    name: "grep",
    description: "Search a pattern inside a file.",
    category: "search",
    load: async () => (await import("./commands/grep")).default,
  },
  {
    name: "find",
    description: "Find files by wildcard pattern.",
    category: "search",
    load: async () => (await import("./commands/find")).default,
  },
  {
    name: "ps",
    description: "List running processes.",
    category: "system",
    load: async () => (await import("./commands/ps")).default,
  },
  {
    name: "kill",
    description: "Stop a process by PID.",
    category: "system",
    load: async () => (await import("./commands/kill")).default,
  },
  {
    name: "top",
    description: "Show top processes by CPU usage.",
    category: "system",
    load: async () => (await import("./commands/top")).default,
  },
  {
    name: "df",
    description: "Show filesystem disk usage.",
    category: "system",
    load: async () => (await import("./commands/df")).default,
  },
  {
    name: "du",
    description: "Estimate directory space usage.",
    category: "system",
    load: async () => (await import("./commands/du")).default,
  },
  {
    name: "whoami",
    description: "Show current user.",
    category: "system",
    load: async () => (await import("./commands/whoami")).default,
  },
  {
    name: "uptime",
    description: "Show system uptime.",
    category: "system",
    load: async () => (await import("./commands/uptime")).default,
  },
  {
    name: "clear",
    description: "Clear terminal output.",
    category: "utility",
    load: async () => (await import("./commands/clear")).default,
  },
  {
    name: "echo",
    description: "Echo text.",
    category: "utility",
    load: async () => (await import("./commands/echo")).default,
  },
  {
    name: "json",
    description: "Pretty print JSON text or JSON file.",
    category: "utility",
    load: async () => (await import("./commands/json")).default,
  },
  {
    name: "base64",
    description: "Encode or decode base64 text.",
    category: "utility",
    load: async () => (await import("./commands/base64")).default,
  },
  {
    name: "uuid",
    description: "Generate a UUID.",
    category: "utility",
    load: async () => (await import("./commands/uuid")).default,
  },
  {
    name: "hash",
    description: "Create a hash from text or file bytes.",
    category: "utility",
    load: async () => (await import("./commands/hash")).default,
  },
];

const recordsByName = new Map<string, CommandRecord>(commandRecords.map((command) => [command.name, command]));

export class CommandRegistry {
  list(): CommandRecord[] {
    return [...commandRecords].sort((a, b) => a.name.localeCompare(b.name));
  }

  listByCategory(): Record<CommandCategory, CommandRecord[]> {
    const grouped: Record<CommandCategory, CommandRecord[]> = {
      filesystem: [],
      search: [],
      system: [],
      utility: [],
    };

    for (const record of commandRecords) {
      grouped[record.category].push(record);
    }

    for (const category of Object.keys(grouped) as CommandCategory[]) {
      grouped[category].sort((a, b) => a.name.localeCompare(b.name));
    }

    return grouped;
  }

  async load(name: string): Promise<CommandModule | null> {
    const record = recordsByName.get(name);
    if (!record) {
      return null;
    }
    return record.load();
  }
}
