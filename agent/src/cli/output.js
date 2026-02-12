/**
 * Terminal Output Formatting
 */

import chalk from 'chalk';

/**
 * Format status output
 */
export function formatOutput(type, data) {
  switch (type) {
    case 'status':
      console.log(chalk.bold('\n=== TRYMINT Agent Status ==='));
      console.log(chalk.cyan(`Session ID: ${data.sessionId}`));
      console.log(chalk.cyan(`Connected: ${data.connected ? chalk.green('Yes') : chalk.red('No')}`));
      if (data.lastHeartbeat) {
        console.log(chalk.cyan(`Last Heartbeat: ${new Date(data.lastHeartbeat).toLocaleString()}`));
      }
      console.log('');
      break;

    case 'error':
      console.error(chalk.red(`Error: ${data.message}`));
      if (data.details) {
        console.error(chalk.gray(data.details));
      }
      break;

    case 'info':
      console.log(chalk.cyan(data.message));
      break;

    case 'success':
      console.log(chalk.green(`✓ ${data.message}`));
      break;

    default:
      console.log(JSON.stringify(data, null, 2));
  }
}
