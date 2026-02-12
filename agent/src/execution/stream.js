/**
 * Output Streaming - Buffer and send chunks to backend
 */

const FLUSH_INTERVAL_MS = 100;
const MAX_BUFFER_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Create an output stream that buffers and sends via sendFn
 * @param {string} commandId - Command ID for payload
 * @param {function} sendFn - (msg) => void - sends execution:output
 * @returns {object} { write, flush, end }
 */
export function createStream(commandId, sendFn) {
  let buffer = '';
  let flushTimer = null;

  function sendChunk(data, stream = 'stdout') {
    if (data && sendFn) {
      sendFn({ type: 'execution:output', payload: { commandId, data, stream } });
    }
  }

  function flush() {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (buffer) {
      sendChunk(buffer);
      buffer = '';
    }
  }

  return {
    write(data, stream = 'stdout') {
      if (!data) return;
      const str = typeof data === 'string' ? data : data.toString();
      buffer += str;
      if (buffer.includes('\n') || buffer.length > 1024) {
        flush();
      } else if (!flushTimer) {
        flushTimer = setTimeout(flush, FLUSH_INTERVAL_MS);
      }
      if (buffer.length > MAX_BUFFER_SIZE) {
        flush();
      }
    },
    flush,
    end(exitCode, duration) {
      flush();
      if (flushTimer) {
        clearTimeout(flushTimer);
        flushTimer = null;
      }
    },
  };
}
