#!/usr/bin/env node

/**
 * TRYMINT Agent CLI Entry Point
 * Handles command-line interface and argument parsing
 */

import { program } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectCommand } from './commands.js';
import { statusCommand } from './commands.js';
import { disconnectCommand } from './commands.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
const version = packageJson.version;

program
  .name('trymint')
  .description('TRYMINT Agent - Secure package management sandbox CLI')
  .version(version);

// Connect command
program
  .command('connect')
  .description('Connect to TRYMINT backend with session credentials')
  .option('-s, --session <sessionId>', 'Session ID')
  .option('-t, --token <token>', 'Session secret token')
  .option('--cleanup-live <id>', 'Cleanup live identifier')
  .action(async (options) => {
    try {
      await connectCommand(options);
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Show connection and session status')
  .action(async () => {
    try {
      await statusCommand();
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Disconnect command
program
  .command('disconnect')
  .description('Disconnect from backend and cleanup')
  .action(async () => {
    try {
      await disconnectCommand();
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Version command (already handled by program.version)
program
  .command('version')
  .description('Show agent version')
  .action(() => {
    console.log(chalk.green(`TRYMINT Agent v${version}`));
  });

// Parse arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
