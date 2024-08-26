#!/usr/bin/env node

const { exec } = require('child_process');
const { Command } = require('commander');
const program = new Command();

program
  .name('bash-cli')
  .description('CLI to run bash-like commands on Windows PowerShell')
  .version('1.0.0');

const runCommand = (command) => {
  exec(command, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`${stdout}`);
  });
};

program
  .command('ls [path]')
  .description('List directory contents')
  .action((path = '.') => {
    runCommand(`ls ${path}`);
  });

program
  .command('cat <file>')
  .description('Display the contents of a file')
  .action((file) => {
    runCommand(`Get-Content ${file}`);
  });

program
  .command('echo <text>')
  .description('Print text to the terminal')
  .action((text) => {
    runCommand(`echo ${text}`);
  });

program
  .command('rm <file>')
  .description('Remove a file')
  .action((file) => {
    runCommand(`Remove-Item ${file}`);
  });

program
  .command('touch <file>')
  .description('Create an empty file')
  .action((file) => {
    runCommand(`New-Item -ItemType File ${file}`);
  });

program
  .command('mkdir <dir>')
  .description('Create a new directory')
  .action((dir) => {
    runCommand(`New-Item -ItemType Directory ${dir}`);
  });

program
  .command('rmdir <dir>')
  .description('Remove a directory')
  .action((dir) => {
    runCommand(`Remove-Item -Recurse -Force ${dir}`);
  });

program
  .command('cp <source> <destination>')
  .description('Copy a file')
  .action((source, destination) => {
    runCommand(`Copy-Item ${source} ${destination}`);
  });

program
  .command('mv <source> <destination>')
  .description('Move a file or directory')
  .action((source, destination) => {
    runCommand(`Move-Item ${source} ${destination}`);
  });

program
  .command('pwd')
  .description('Print the current working directory')
  .action(() => {
    runCommand(`pwd`);
  });

program
  .command('grep <pattern> <file>')
  .description('Search for a pattern in a file')
  .action((pattern, file) => {
    runCommand(`Select-String -Pattern ${pattern} -Path ${file}`);
  });

program
  .command('clear')
  .description('Clear the terminal')
  .action(() => {
    runCommand('cls');
  });

// Advanced Commands

program
  .command('find <path> <pattern>')
  .description('Find files and directories matching a pattern')
  .action((path, pattern) => {
    runCommand(`Get-ChildItem -Path ${path} -Recurse -Include ${pattern}`);
  });

program
  .command('du <path>')
  .description('Estimate file space usage')
  .action((path) => {
    runCommand(`Get-ChildItem -Path ${path} -Recurse | Measure-Object -Property Length -Sum`);
  });

program
  .command('chmod <permissions> <file>')
  .description('Change file mode bits')
  .action((permissions, file) => {
    // PowerShell does not support chmod directly; use Set-Acl for permissions
    runCommand(`# PowerShell equivalent for chmod not directly supported`);
  });

program
  .command('ps')
  .description('List running processes')
  .action(() => {
    runCommand(`Get-Process`);
  });

program
  .command('kill <pid>')
  .description('Terminate a process')
  .action((pid) => {
    runCommand(`Stop-Process -Id ${pid}`);
  });

program
  .command('df')
  .description('Show disk space usage')
  .action(() => {
    runCommand(`Get-PSDrive`);
  });

program
  .command('top')
  .description('Display the top processes')
  .action(() => {
    runCommand(`Get-Process | Sort-Object -Property CPU -Descending | Select-Object -First 10`);
  });

program.parse(process.argv);
