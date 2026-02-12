import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { createSandboxWebSocket } from '../services/websocket'
import { api } from '../services/api'
import { formatPostmortemReport } from '../utils/formatPostmortem'

const SandboxContext = createContext()

/**
 * Maps riskLevel (LOW/MEDIUM/HIGH) to numeric score 0-10
 */
function riskLevelToScore(level) {
  if (level === 'LOW') return 2
  if (level === 'MEDIUM') return 5
  if (level === 'HIGH') return 8
  return 3
}

/**
 * Maps effect type to changed file status
 */
function effectToFileStatus(type) {
  if (type === 'READ_DIR' || type === 'READ_FILE') return 'READ'
  if (type === 'FILE_CREATE') return 'CREATED'
  if (type === 'FILE_DELETE') return 'DELETED'
  if (type === 'FILE_MODIFY') return 'MODIFIED'
  return 'MODIFIED'
}

/**
 * Maps effects array to changedFiles format for RiskReport
 */
function effectsToChangedFiles(effects = [], workingDir = '/') {
  if (!effects?.length) return []
  const seen = new Set()
  return effects.map((e) => {
    const target = e.target || 'unknown'
    const name = target.startsWith('/') ? target : `${workingDir}/${target}`.replace(/\/+/g, '/')
    const status = effectToFileStatus(e.type)
    const key = `${name}-${status}`
    if (seen.has(key)) return null
    seen.add(key)
    return { name, status, type: status.toLowerCase() }
  }).filter(Boolean)
}

/**
 * Update file tree at a given path with new entries.
 * Always REPLACES children with fresh data from agent - no merging, no duplicates.
 */
function updateFileTreeAtPath(tree, path, entries) {
  let normalized = (path || '').replace(/^\/+|\/+$/g, '').replace(/^\.\/?/, '')
  if (normalized.startsWith('..')) normalized = normalized.replace(/^\.\.\/?/, '')
  const parts = normalized ? normalized.split('/').filter(Boolean) : []
  const seen = new Set()
  const newItems = entries
    .filter((e) => {
      if (seen.has(e.name)) return false
      seen.add(e.name)
      return true
    })
    .map((e) => ({
      name: e.name,
      type: e.isDirectory ? 'folder' : 'file',
      children: e.isDirectory ? [] : undefined,
    }))
  if (parts[0] === '..' || parts[0] === '~' || parts.length === 0) return newItems

  function updateAt(items, [head, ...rest]) {
    if (!head) return newItems
    const idx = items.findIndex((item) => item.name === head)
    if (idx >= 0) {
      const existing = items[idx]
      const updated = {
        ...existing,
        type: 'folder',
        children: rest.length === 0 ? newItems : updateAt(existing.children || [], rest),
      }
      return items.map((item, i) => (i === idx ? updated : item))
    }
    if (rest.length === 0) {
      return [...items.filter((i) => i.name !== head), { name: head, type: 'folder', children: newItems }]
    }
    return items
  }

  return updateAt(tree, parts)
}

/**
 * Maps warnings array to RiskReport format
 */
function mapWarnings(warnings = []) {
  return warnings.map((w) => ({
    type: typeof w === 'string' ? 'warning' : (w.type || 'warning'),
    message: typeof w === 'string' ? w : (w.message || w.text || String(w)),
  }))
}

export function SandboxProvider({ children, session }) {
  const [isConnected, setIsConnected] = useState(false)
  const [agentConnected, setAgentConnected] = useState(false)
  const [agentCapabilities, setAgentCapabilities] = useState([])
  const [sandboxPath, setSandboxPath] = useState(null)
  const [homeDir, setHomeDir] = useState(null)
  const [currentDir, setCurrentDir] = useState('.')
  const [browsePath, setBrowsePath] = useState('.')
  const [fileTree, setFileTree] = useState([])
  const [fileTreeLoading, setFileTreeLoading] = useState(false)
  const [riskScore, setRiskScore] = useState(0)
  const [changedFiles, setChangedFiles] = useState([])
  const [warnings, setWarnings] = useState([])
  const [postmortemReport, setPostmortemReport] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [postmortemHistory, setPostmortemHistory] = useState([])
  const [history, setHistory] = useState([])
  const [currentCommand, setCurrentCommand] = useState(null)
  const [executionOutput, setExecutionOutput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const wsRef = useRef(null)
  const outputBufferRef = useRef('')
  const homeDirRef = useRef(null)

  const workingDir = currentDir === '.' ? '/' : currentDir

  const fetchHistory = useCallback(async () => {
    if (!session?.id) return
    try {
      const res = await api.getCommandHistory(session.id, { limit: 50 })
      if (res?.success && res?.data?.commands) {
        const commands = res.data.commands
        const mapped = commands.map((c) => {
          const sim = c.simulationResult || {}
          const raw = typeof sim.finalScore === 'number' ? sim.finalScore : riskLevelToScore(sim.riskLevel)
          const score = raw > 10 ? Math.round(raw / 10) : raw
          const s = c.status === 'COMPLETED' ? 'approved' : c.status === 'REJECTED' ? 'blocked' : c.status === 'APPROVED' ? 'approved' : 'pending'
          const status = s === 'blocked' && score >= 6 ? 'high-risk' : s
          const cmd = c.command || ''
          const pkg = cmd.includes('npm install') ? cmd.replace(/npm install\s+/, '').trim() || cmd : cmd
          return {
            id: c.id,
            package: pkg,
            command: cmd,
            timestamp: c.createdAt ? new Date(c.createdAt).toLocaleString() : '—',
            riskScore: score,
            status,
          }
        })
        setHistory(mapped)
      }
    } catch (err) {
      console.warn('[Sandbox] Failed to fetch command history:', err)
    }
  }, [session?.id])

  useEffect(() => {
    if (!session?.id || !session?.secret) return

    const ws = createSandboxWebSocket(session.id, session.secret, {
      onOpen: () => setIsConnected(true),
      onClose: () => setIsConnected(false),
      onError: () => setIsConnected(false),
      onSessionConnected: (payload) => {
        setIsConnected(true)
        if (payload?.agentConnected) {
          setAgentConnected(true)
          setFileTreeLoading(true)
          if (wsRef.current) {
            wsRef.current.send('filesystem:list', { path: '.' })
          }
        }
        fetchHistory()
      },
      onAgentConnected: (payload) => {
        setAgentConnected(true)
        setAgentCapabilities(payload?.capabilities || [])
        // Request root directory listing when agent connects
        if (wsRef.current) {
          setFileTreeLoading(true)
          wsRef.current.send('filesystem:list', { path: '.' })
        }
      },
      onAgentDisconnected: () => {
        setAgentConnected(false)
        setAgentCapabilities([])
        setSandboxPath(null)
        setHomeDir(null)
        homeDirRef.current = null
        setCurrentDir('.')
      },
      onAgentReady: (payload) => {
        if (payload?.sandboxPath) setSandboxPath(payload.sandboxPath)
        if (payload?.homeDir) {
          setHomeDir(payload.homeDir)
          homeDirRef.current = payload.homeDir
        }
        if (payload?.capabilities?.length) setAgentCapabilities(payload.capabilities)
        setBrowsePath('.')
        if (wsRef.current) {
          setFileTreeLoading(true)
          wsRef.current.send('filesystem:list', { path: '.' })
        }
      },
      onFilesystemListResult: (payload) => {
        setFileTreeLoading(false)
        if (payload?.entries || payload?.error) {
          const p = (payload.path || '.').replace(/\/+$/, '')
          const hd = homeDirRef.current
          const isHome = p === '..' || p === '~' || (hd && (p === hd || p === hd.replace(/\/+$/, '')))
          if (payload.error) {
            const parts = p.replace(/^\.\.\/?/, '').split('/').filter(Boolean)
            parts.pop()
            const parentPath = p.startsWith('../') ? (parts.length ? `../${parts.join('/')}` : '..') : (parts.length ? parts.join('/') : '.')
            setCurrentDir(parentPath)
            setBrowsePath(parentPath === '..' ? '..' : parentPath)
            const displayPath = parentPath === '.' || parentPath === '..' ? '~' : (parentPath.startsWith('../') ? `~/${parentPath.replace(/^\.\.\/?/, '')}` : parentPath)
            outputBufferRef.current += `\n\x1b[33mls: ${payload.error}\x1b[0m\n\n\x1b[36m${displayPath}\x1b[0m \x1b[32m$\x1b[0m `
            setExecutionOutput(outputBufferRef.current)
            setFileTreeLoading(true)
            wsRef.current?.send('filesystem:list', { path: parentPath })
          } else {
            setBrowsePath(isHome ? '..' : p)
          }
          if (payload.entries) {
            setFileTree((prev) => {
              const pathForUpdate = isHome ? '..' : (payload.path || '')
              return updateFileTreeAtPath(prev, pathForUpdate, payload.entries)
            })
          }
        }
      },
      onSimulationResult: (payload) => {
        const { commandId, success, riskLevel, finalScore, effects, warnings: w, canExecute } = payload
        setCurrentCommand({
          commandId,
          success,
          riskLevel,
          canExecute,
        })
        // Use backend's computed finalScore when available, else fall back to riskLevel mapping
        setRiskScore(typeof finalScore === 'number' ? finalScore : riskLevelToScore(riskLevel))
        setChangedFiles(effectsToChangedFiles(effects, workingDir))
        setWarnings(mapWarnings(w))
        if (effects?.length === 0 && !w?.length) {
          setChangedFiles([])
          setWarnings([])
        }
        fetchHistory()
      },
      onExecutionStarted: () => {
        setIsExecuting(true)
        outputBufferRef.current = ''
        setExecutionOutput('')
      },
      onExecutionOutput: (payload) => {
        const text = payload?.data ?? payload?.chunk ?? payload?.output ?? ''
        if (text) {
          outputBufferRef.current += text
          setExecutionOutput(outputBufferRef.current)
        }
      },
      onExecutionComplete: () => {
        setIsExecuting(false)
        setCurrentCommand(null)
        fetchHistory()
      },
      onSimulationFailed: () => {
        setCurrentCommand(null)
      },
      onPostmortemComplete: (payload) => {
        const report = payload?.report
        const text = payload?.terminalReport || (report ? formatPostmortemReport(report) : '')
        if (text) {
          outputBufferRef.current += '\n' + text
          setExecutionOutput(outputBufferRef.current)
        }
        if (report) {
          setPostmortemReport(report)
          const score100 = report.overallScore ?? 0
          setRiskScore(Math.min(10, Math.round(score100 / 10)))
          const findings = report.findings || []
          setWarnings(findings.map((f) => ({
            type: f.severity === 'critical' ? 'critical' : f.severity === 'high' ? 'warning' : 'info',
            message: f.title ? `${f.title}${f.location ? ` (${f.location})` : ''}` : f.description,
            category: f.category,
            location: f.location,
          })))
          setRecommendations(report.recommendations || [])
          const pkg = report.packageName || 'package'
          const ver = report.packageVersion || ''
          const stats = report.stats
          setChangedFiles(
            stats?.filesScanned
              ? [{ name: `${pkg}@${ver} (${stats.filesScanned} files, ${stats.linesScanned} lines scanned)`, status: 'ANALYZED', type: 'analyzed' }]
              : [{ name: `${pkg}@${ver}`, status: 'ANALYZED', type: 'analyzed' }]
          )
          setPostmortemHistory((prev) => [
            { package: `${pkg}@${ver}`, score: score100, timestamp: new Date().toLocaleString() },
            ...prev.slice(0, 49),
          ])
        }
        setIsExecuting(false)
      },
      onPostmortemError: (payload) => {
        const err = payload?.error ?? 'Postmortem failed'
        outputBufferRef.current += `\n\x1b[31mError: ${err}\x1b[0m\n`
        setExecutionOutput(outputBufferRef.current)
        setPostmortemReport(null)
        setRecommendations([])
        setIsExecuting(false)
      },
      onFilesystemContent: (payload) => {
        if (payload?.error) {
          outputBufferRef.current += `\n\x1b[31mcat: ${payload.error}\x1b[0m\n`
        } else if (payload?.content !== undefined) {
          outputBufferRef.current += `\n${payload.content}\n`
        }
        setExecutionOutput(outputBufferRef.current)
      },
    })

    wsRef.current = ws

    return () => {
      ws.close()
      wsRef.current = null
      setIsConnected(false)
    }
  }, [session?.id, session?.secret, fetchHistory])

  const submitCommand = useCallback((command, workingDirOverride) => {
    if (!wsRef.current || !command?.trim()) return
    const dir = workingDirOverride !== undefined ? workingDirOverride : workingDir
    wsRef.current.send('command:submit', {
      command: command.trim(),
      workingDir: dir,
    })
    setCurrentCommand(null)
    setChangedFiles([])
    setWarnings([])
    setRiskScore(0)
    setPostmortemReport(null)
    setRecommendations([])
  }, [workingDir])

  const approveCommand = useCallback((commandId) => {
    if (!wsRef.current || !commandId) return
    wsRef.current.send('command:approve', { commandId })
    setCurrentCommand(null)
  }, [])

  const rejectCommand = useCallback((commandId, reason) => {
    if (!wsRef.current || !commandId) return
    wsRef.current.send('command:reject', { commandId, reason: reason || 'rejected' })
    setCurrentCommand(null)
    setChangedFiles([])
    setWarnings([])
    setRiskScore(0)
    setPostmortemReport(null)
    setRecommendations([])
  }, [])

  const submitPostmortem = useCallback(() => {
    if (!wsRef.current) return
    setIsExecuting(true)
    outputBufferRef.current += '\nRunning postmortem analysis...\n'
    setExecutionOutput(outputBufferRef.current)
    const pathForPostmortem = (!workingDir || workingDir === '/' || workingDir === '.') ? '.' : workingDir.replace(/^\/+/, '')
    wsRef.current.send('postmortem:start', { path: pathForPostmortem })
  }, [workingDir])

  const clearOutput = useCallback(() => {
    outputBufferRef.current = ''
    setExecutionOutput('')
  }, [])

  const requestFilesystemList = useCallback((path) => {
    if (!wsRef.current || !path) return
    setFileTreeLoading(true)
    wsRef.current.send('filesystem:list', { path })
  }, [])

  const navigateToParent = useCallback(() => {
    if (!wsRef.current) return
    setBrowsePath('..')
    setFileTree([])
    setFileTreeLoading(true)
    wsRef.current.send('filesystem:list', { path: '~' })
  }, [])

  const navigateToPath = useCallback((path) => {
    if (!wsRef.current || !path) return
    setBrowsePath(path)
    setFileTreeLoading(true)
    wsRef.current.send('filesystem:list', { path })
  }, [])

  // Click folder in explorer: cd there and refresh tree
  // Note: requestFilesystemList is called by handleExpandFolder - don't duplicate here to avoid double request
  const navigateToPathFromExplorer = useCallback((path) => {
    if (!path) return
    setCurrentDir(path)
    setBrowsePath(path)
    // Show cd in terminal so user sees the navigation
    let displayPath = '~'
    if (path && path !== '.' && path !== '/') {
      if (path.startsWith('../')) {
        const rel = path.replace(/^\.\.\/?/, '')
        displayPath = rel ? `~/${rel}` : '~'
      } else {
        const base = sandboxPath ? `~/${sandboxPath.split('/').filter(Boolean).pop()}` : '~'
        displayPath = `${base}/${path}`.replace(/\/+/g, '/')
      }
    } else if (sandboxPath) {
      displayPath = `~/${sandboxPath.split('/').filter(Boolean).pop()}`
    }
    outputBufferRef.current += `\n$ cd ${displayPath}\n`
    setExecutionOutput(outputBufferRef.current)
  }, [setCurrentDir, sandboxPath])

  // Click file in explorer: read content and display in terminal
  const requestFileContent = useCallback((path) => {
    if (!wsRef.current || !path) return
    wsRef.current.send('filesystem:read', { path })
  }, [])

  return (
    <SandboxContext.Provider
      value={{
        isConnected,
        agentConnected,
        agentCapabilities,
        sandboxPath,
        homeDir,
        currentDir,
        setCurrentDir,
        fileTree,
        fileTreeLoading,
        browsePath,
        requestFilesystemList,
        navigateToParent,
        navigateToPath,
        navigateToPathFromExplorer,
        requestFileContent,
        riskScore,
        changedFiles,
        warnings,
        recommendations,
        postmortemReport,
        postmortemHistory,
        history,
        currentCommand,
        executionOutput,
        isExecuting,
        submitCommand,
        approveCommand,
        rejectCommand,
        submitPostmortem,
        clearOutput,
        fetchHistory,
      }}
    >
      {children}
    </SandboxContext.Provider>
  )
}

export function useSandbox() {
  const ctx = useContext(SandboxContext)
  if (!ctx) {
    throw new Error('useSandbox must be used within SandboxProvider')
  }
  return ctx
}
