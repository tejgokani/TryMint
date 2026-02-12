/**
 * Built-in shell commands for TRYMINT sandbox.
 * @see CURSOR_BUILD_PROMPT.md - Built-in Commands
 */

/** Commands that must be implemented by shell builtins */
export const BUILTIN_COMMANDS = [
  'cd',
  'ls',
  'pwd',
  'mkdir',
  'touch',
  'cat',
  'rm',
  'cp',
  'mv',
  'echo',
  'clear',
  'exit',
]

/** Commands that delegate to npm */
export const NPM_COMMANDS = ['npm']

/** Commands that run via Node/WebContainer */
export const RUNTIME_COMMANDS = ['node']

/** Special analysis command */
export const POSTMORTEM_COMMAND = 'postmortem'
