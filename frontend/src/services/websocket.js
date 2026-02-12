/**
 * WebSocket client for TRYMINT sandbox.
 * Connects to backend with session credentials, sends/receives command lifecycle events.
 */

const getWsUrl = () => {
  // In dev with proxy: use same origin so /ws gets proxied to backend
  if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}/ws/ui`
  }
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1'
  try {
    const url = new URL(apiUrl)
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${url.host}/ws/ui`
  } catch {
    return 'ws://localhost:3000/ws/ui'
  }
}

export function createSandboxWebSocket(sessionId, sessionSecret, callbacks) {
  const baseUrl = getWsUrl()
  const params = new URLSearchParams({ sessionId, sessionSecret })
  const url = `${baseUrl}?${params.toString()}`
  const ws = new WebSocket(url)

  ws.onopen = () => {
    callbacks.onOpen?.()
  }

  ws.onclose = (event) => {
    callbacks.onClose?.(event)
  }

  ws.onerror = (event) => {
    callbacks.onError?.(event)
  }

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data)
      const { type, payload } = msg

      switch (type) {
        case 'session:connected':
          callbacks.onSessionConnected?.(payload)
          break
        case 'simulation:result':
          callbacks.onSimulationResult?.(payload)
          break
        case 'execution:started':
          callbacks.onExecutionStarted?.(payload)
          break
        case 'execution:output':
          callbacks.onExecutionOutput?.(payload)
          break
        case 'execution:complete':
          callbacks.onExecutionComplete?.(payload)
          break
        case 'simulation:failed':
          callbacks.onSimulationFailed?.(payload)
          break
        case 'agent:heartbeat':
          callbacks.onHeartbeat?.(payload)
          break
        case 'agent:connected':
          callbacks.onAgentConnected?.(payload)
          break
        case 'agent:disconnected':
          callbacks.onAgentDisconnected?.(payload)
          break
        case 'agent:ready':
          callbacks.onAgentReady?.(payload)
          break
        case 'filesystem:list:result':
          callbacks.onFilesystemListResult?.(payload)
          break
        case 'filesystem:content':
          callbacks.onFilesystemContent?.(payload)
          break
        case 'postmortem:complete':
          callbacks.onPostmortemComplete?.(payload)
          break
        case 'postmortem:error':
          callbacks.onPostmortemError?.(payload)
          break
        default:
          break
      }
    } catch (err) {
      console.warn('[WebSocket] Failed to parse message:', err)
    }
  }

  return {
    send(type, payload) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type, payload }))
      }
    },
    close() {
      ws.close()
    },
    get readyState() {
      return ws.readyState
    },
  }
}
