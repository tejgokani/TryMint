/**
 * WebSocket message types for TRYMINT.
 * @see CURSOR_BUILD_PROMPT.md - WEBSOCKET MESSAGE PROTOCOL
 */

/**
 * @typedef {Object} WebSocketMessage
 * @property {string} type - Message type
 * @property {*} payload - Message payload
 * @property {number} [timestamp] - Unix timestamp
 * @property {string} [id] - UUID for request/response matching
 */

/**
 * Terminal messages
 * Client → Server: terminal:input, terminal:resize, terminal:interrupt
 * Server → Client: terminal:output, terminal:prompt, terminal:clear, terminal:exit
 */
export const TERMINAL_INPUT = 'terminal:input'
export const TERMINAL_RESIZE = 'terminal:resize'
export const TERMINAL_INTERRUPT = 'terminal:interrupt'
export const TERMINAL_OUTPUT = 'terminal:output'
export const TERMINAL_PROMPT = 'terminal:prompt'
export const TERMINAL_CLEAR = 'terminal:clear'
export const TERMINAL_EXIT = 'terminal:exit'

/**
 * File system messages
 * Client → Server: fs:list, fs:read, fs:watch
 * Server → Client: fs:tree, fs:content, fs:changed, fs:error
 */
export const FS_LIST = 'fs:list'
export const FS_READ = 'fs:read'
export const FS_WATCH = 'fs:watch'
export const FS_TREE = 'fs:tree'
export const FS_CONTENT = 'fs:content'
export const FS_CHANGED = 'fs:changed'
export const FS_ERROR = 'fs:error'

/**
 * Postmortem messages
 * Client → Server: postmortem:start, postmortem:cancel
 * Server → Client: postmortem:progress, postmortem:finding, postmortem:complete, postmortem:error
 */
export const POSTMORTEM_START = 'postmortem:start'
export const POSTMORTEM_CANCEL = 'postmortem:cancel'
export const POSTMORTEM_PROGRESS = 'postmortem:progress'
export const POSTMORTEM_FINDING = 'postmortem:finding'
export const POSTMORTEM_COMPLETE = 'postmortem:complete'
export const POSTMORTEM_ERROR = 'postmortem:error'

/**
 * Session messages
 * Client → Server: session:create, session:destroy
 * Server → Client: session:ready, session:error
 */
export const SESSION_CREATE = 'session:create'
export const SESSION_DESTROY = 'session:destroy'
export const SESSION_READY = 'session:ready'
export const SESSION_ERROR = 'session:error'
