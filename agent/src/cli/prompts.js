/**
 * Interactive CLI Prompts
 */

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Prompt for session credentials
 */
export function promptForCredentials() {
  return new Promise((resolve) => {
    const credentials = {};

    rl.question('Session ID: ', (sessionId) => {
      credentials.sessionId = sessionId.trim();
      rl.question('Session Token: ', (token) => {
        credentials.token = token.trim();
        rl.close();
        resolve(credentials);
      });
    });
  });
}

/**
 * Prompt for confirmation
 */
export function promptConfirm(message) {
  return new Promise((resolve) => {
    rl.question(`${message} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}
