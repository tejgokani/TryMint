import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { useAuth } from '../../context/AuthContext'
import { useSandbox } from '../../context/SandboxContext'

/**
 * Format display path for prompt (e.g. ~/trymint-sandbox-xxx or ~/Desktop or ~/trymint-sandbox-xxx/node_modules)
 */
function formatPromptPath(sandboxPath, currentDir) {
  const base = sandboxPath
    ? `~/${sandboxPath.split('/').filter(Boolean).pop() || '~'}`
    : '~'
  if (!currentDir || currentDir === '.' || currentDir === '/') return base
  // When in home subdir (e.g. ../Desktop), show ~/Desktop
  if (currentDir.startsWith('../')) {
    const rel = currentDir.replace(/^\.\.\/?/, '')
    return rel ? `~/${rel}` : '~'
  }
  return `${base}/${currentDir.replace(/^\.\/?|\/+$/g, '')}`.replace(/\/+/g, '/')
}

export default function Terminal() {
  const terminalRef = useRef(null)
  const terminalInstanceRef = useRef(null)
  const fitAddonRef = useRef(null)
  const { currentSession } = useAuth()
  const { sandboxPath, currentDir, setCurrentDir, submitCommand, submitPostmortem, executionOutput, clearOutput, requestFilesystemList } = useSandbox()
  const promptPathRef = useRef(formatPromptPath(sandboxPath, currentDir))
  const currentDirRef = useRef(currentDir)
  const handlersRef = useRef({ setCurrentDir, submitCommand, clearOutput, requestFilesystemList, sandboxPath })
  promptPathRef.current = formatPromptPath(sandboxPath, currentDir)
  currentDirRef.current = currentDir
  handlersRef.current = { setCurrentDir, submitCommand, submitPostmortem, clearOutput, requestFilesystemList, sandboxPath }

  // Initialize terminal
  useEffect(() => {
    if (!terminalRef.current) return

    const terminal = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      theme: {
        background: '#000000',
        foreground: '#00ff88',
        cursor: '#00ff88',
        selection: '#00ff8820',
      },
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      scrollback: 1000,
      allowProposedApi: true,
    })

    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.open(terminalRef.current)
    terminalInstanceRef.current = terminal
    fitAddonRef.current = fitAddon

    const safeFit = () => {
      const el = terminalRef.current
      const addon = fitAddonRef.current
      if (!el || !addon || !terminalInstanceRef.current) return
      const { clientWidth, clientHeight } = el
      if (clientWidth > 0 && clientHeight > 0) {
        try {
          addon.fit()
        } catch { /* ignore dimensions error */ }
      }
    }
    // Defer fit() until container has dimensions (avoids xterm dimensions error)
    requestAnimationFrame(() => requestAnimationFrame(safeFit))
    const ro = new ResizeObserver(() => safeFit())
    ro.observe(terminalRef.current)

    const writePromptNow = (pathStr) => {
      terminal.write(`\x1b[36m${pathStr || '~'}\x1b[0m \x1b[32m$\x1b[0m `)
    }

    terminal.writeln('Welcome to TRYMINT Sandbox Terminal')
    terminal.writeln('Type commands to simulate package installation')
    terminal.writeln('')
    writePromptNow(promptPathRef.current)

    let currentLine = ''
    terminal.onData((data) => {
      const code = data.charCodeAt(0)

      if (code === 13) {
        terminal.write('\r\n')
        const cmd = currentLine.trim()
        currentLine = ''

        const { setCurrentDir: setDir, submitCommand: submit, clearOutput: clear, requestFilesystemList: reqList, sandboxPath: sbPath } = handlersRef.current

        if (!cmd) {
          writePromptNow(promptPathRef.current)
          return
        }

        if (cmd === 'clear') {
          terminal.clear()
          clear?.()
          terminal.__lastOutputLen = 0
        } else if (cmd === 'help') {
          terminal.writeln('Available commands:')
          terminal.writeln('  cd <dir>        - Change directory (updates prompt & folder tree)')
          terminal.writeln('  <any command>   - Submit for simulation, then approve in Risk Report')
          terminal.writeln('  npm install <pkg> - Install package (requires approval)')
          terminal.writeln('  postmortem         - Run security analysis on package')
          terminal.writeln('  clear           - Clear terminal')
          terminal.writeln('  help            - Show this help')
        } else if (cmd === 'postmortem') {
          const { submitPostmortem: postmortem } = handlersRef.current
          postmortem?.()
          writePromptNow(promptPathRef.current)
          return
        } else if (cmd.startsWith('cd ')) {
          const arg = cmd.slice(3).trim()
          const prevDir = currentDirRef.current
          let newDir = '.'
          if (!arg || arg === '-') {
            newDir = '.'
          } else if (arg === '~' || arg === '~/') {
            newDir = '..'
          } else if (arg === '..') {
            const parts = (prevDir && prevDir !== '.' && prevDir !== '/') ? prevDir.replace(/\/+$/, '').split('/').filter(Boolean) : []
            parts.pop()
            newDir = parts.length ? parts.join('/') : '.'
          } else {
            // Expand ~ to ".." (home) so agent resolves ~/path to parent of sandbox
            let pathForCd = arg.replace(/^~\/?/, (m) => (m === '~' ? '..' : '../'))
            pathForCd = pathForCd.replace(/\/\.\//g, '/').replace(/^\.\/+|\/+$/g, '') || '.'
            const base = (prevDir && prevDir !== '.' && prevDir !== '/') ? prevDir.replace(/\/+$/, '') : ''
            newDir = pathForCd.startsWith('../') ? pathForCd : (base ? `${base}/${pathForCd}` : pathForCd)
          }
          currentDirRef.current = newDir
          promptPathRef.current = formatPromptPath(sbPath, newDir)
          setDir?.(newDir)
          reqList?.(newDir === '.' ? '.' : newDir)
          writePromptNow(promptPathRef.current)
          return
        } else {
          submit?.(cmd)
          terminal.writeln(`\x1b[33m→ Simulating... Check Risk Report to approve.\x1b[0m`)
        }

        writePromptNow(promptPathRef.current)
      } else if (code === 127) {
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1)
          terminal.write('\b \b')
        }
      } else if (code >= 32) {
        currentLine += data
        terminal.write(data)
      }
    })

    const handleResize = () => {
      const el = terminalRef.current
      if (!el || !fitAddonRef.current || el.clientWidth <= 0 || el.clientHeight <= 0) return
      try {
        fitAddonRef.current.fit()
      } catch { /* ignore */ }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      ro.disconnect()
      terminalInstanceRef.current = null
      fitAddonRef.current = null
      try {
        terminal.dispose()
      } catch {
        // Ignore dispose errors
      }
    }
  }, [])

  // Write execution output from agent to terminal
  useEffect(() => {
    const term = terminalInstanceRef.current
    if (!term || !executionOutput) return
    try {
      const prevLen = term.__lastOutputLen || 0
      if (executionOutput.length > prevLen) {
        const newChunk = executionOutput.slice(prevLen)
        term.write(newChunk)
        term.__lastOutputLen = executionOutput.length
      }
    } catch {
      // Ignore write errors (e.g. when terminal is unmounting)
    }
  }, [executionOutput])

  return (
    <div className="flex flex-col h-full bg-[#000000]">
      {/* Header Bar */}
      <div className="bg-[#111827] border-b border-[#1f2937] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            TERMINAL
          </span>
          {currentSession && (
            <>
              <span className="text-xs text-gray-500">|</span>
              <span className="text-xs text-gray-300">
                Session: <span className="text-[#00ff88]">{currentSession.id}</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Terminal Container */}
      <div
        ref={terminalRef}
        className="flex-1 p-2"
        style={{ minHeight: 0 }}
      />
    </div>
  )
}
