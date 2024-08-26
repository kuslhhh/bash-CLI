Here’s a version of your `README.md` without the color formatting:

```markdown
# **ksh CLI**

**ksh CLI** is a command-line tool designed for Windows users who want to run bash-like commands directly in PowerShell. Ideal for those familiar with Unix-like systems, `ksh` provides a set of commands that make file and directory management more intuitive and powerful on Windows.

Whether you’re a developer, system administrator, or just someone who prefers a command-line interface, `ksh` can simplify your workflow by offering familiar commands that streamline common tasks.

## Installation

Install `ksh` globally using npm:

```bash
npm install -g ksh
```

## Usage

### Commands

- **`ksh ls [path]`**: List directory contents.
- **`ksh cat <file>`**: Display file contents.
- **`ksh echo <text>`**: Print text to the terminal.
- **`ksh rm <file>`**: Remove a file.
- **`ksh touch <file>`**: Create an empty file.
- **`ksh mkdir <dir>`**: Create a directory.
- **`ksh rmdir <dir>`**: Remove a directory.
- **`ksh cp <source> <destination>`**: Copy a file.
- **`ksh mv <source> <destination>`**: Move a file.
- **`ksh pwd`**: Print the current directory.
- **`ksh grep <pattern> <file>`**: Search for a pattern in a file.
- **`ksh clear`**: Clear the terminal.

### Advanced Commands

- **`ksh find <path> <pattern>`**: Find files matching a pattern.
- **`ksh du <path>`**: Estimate file space usage.
- **`ksh chmod <permissions> <file>`**: Change file permissions (PowerShell equivalent not directly supported).
- **`ksh ps`**: List running processes.
- **`ksh kill <pid>`**: Terminate a process.
- **`ksh df`**: Show disk space usage.
- **`ksh top`**: Display top processes by CPU usage.

## License

MIT License - see [LICENSE](LICENSE).

## Author

Kushal Jadhav
