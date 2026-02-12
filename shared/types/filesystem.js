/**
 * File system types for TRYMINT.
 * @see CURSOR_BUILD_PROMPT.md - FILE EXPLORER SPECIFICATIONS
 */

/**
 * @typedef {Object} FileNode
 * @property {string} name - File or directory name
 * @property {string} path - Full path from root
 * @property {'file'|'directory'} type - Node type
 * @property {FileNode[]} [children] - Child nodes (directories only)
 * @property {boolean} [expanded] - UI state for expansion
 * @property {number} [size] - File size in bytes
 * @property {Date|string} [modified] - Last modified timestamp
 */

/**
 * @typedef {Object} FileExplorerState
 * @property {FileNode} root - Root file node
 * @property {string} currentPath - Synced with terminal's pwd
 * @property {string|null} selectedPath - Currently selected path
 */

/**
 * @typedef {'create'|'delete'|'modify'} FsChangeEvent
 */
