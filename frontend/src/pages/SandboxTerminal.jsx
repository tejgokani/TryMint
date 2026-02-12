import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { SandboxProvider, useSandbox } from '../context/SandboxContext'
import FileExplorer from '../components/sandbox/FileExplorer'
import Terminal from '../components/sandbox/Terminal'
import RiskReport from '../components/sandbox/RiskReport'
import ProfileDropdown from '../components/profile/ProfileDropdown'
import { formatTimeRemaining } from '../utils/sessionUtils'
import { LayoutDashboard, Terminal as TerminalIcon, FileText, PanelLeftClose, PanelLeft } from 'lucide-react'
import { SessionError } from '../utils/errorHandler'
import { handleError } from '../utils/errorHandler'

function SandboxContent() {
  const navigate = useNavigate()
  const { currentSession, setCurrentSession } = useAuth()
  const { showError, showWarning, showSuccess } = useToast()
  const { isConnected, agentConnected, riskScore, approveCommand, rejectCommand, currentCommand } = useSandbox()
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false)
  const [activeMobileTab, setActiveMobileTab] = useState('terminal') // 'explorer', 'terminal', 'report'
  const [sessionExpired, setSessionExpired] = useState(false)
  const [explorerVisible, setExplorerVisible] = useState(true)

  // Timer countdown
  useEffect(() => {
    if (!currentSession) return

    const updateTimer = () => {
      const now = new Date()
      const startTime = new Date(currentSession.startTime)
      const duration = currentSession.duration
      const elapsed = now.getTime() - startTime.getTime()
      const remaining = Math.max(0, duration - elapsed)
      setTimeRemaining(Math.floor(remaining / 1000))

      // Auto-end session when timer reaches 0
      if (remaining <= 0 && !sessionExpired) {
        setSessionExpired(true)
        showWarning('Session has expired')
        setTimeout(() => {
          setCurrentSession(null)
          navigate('/')
        }, 2000)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [currentSession, navigate, setCurrentSession])

  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const formatShortTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const handleApproveChanges = () => {
    try {
      if (!currentSession) {
        throw new SessionError('No active session')
      }
      if (sessionExpired || timeRemaining <= 0) {
        throw new SessionError('Session has expired')
      }
      if (currentCommand?.commandId) {
        approveCommand(currentCommand.commandId)
        showSuccess('Changes approved! Command sent for execution.')
      } else {
        showWarning('No pending command to approve. Submit a command first.')
      }
    } catch (error) {
      handleError(error, showError)
    }
  }

  const handleRejectSession = () => {
    if (currentCommand?.commandId) {
      if (window.confirm('Reject this command? It will not be executed.')) {
        rejectCommand(currentCommand.commandId)
        showWarning('Command rejected.')
      }
    } else if (window.confirm('Are you sure you want to end this session?')) {
      try {
        showWarning('Session ended.')
        setCurrentSession(null)
        navigate('/')
      } catch (error) {
        handleError(error, showError)
      }
    }
  }

  const handleEndSession = async () => {
    if (showEndSessionConfirm) {
      try {
        if (currentSession) {
          // Call backend API to terminate session
          const { api } = await import('../services/api')
          await api.terminateSession(currentSession.id).catch(() => {
            // Continue with local cleanup even if backend fails
          })
        }
        setCurrentSession(null)
        showSuccess('Session ended successfully')
        navigate('/')
      } catch (error) {
        handleError(error, showError)
      }
    } else {
      setShowEndSessionConfirm(true)
    }
  }

  const handleEndSessionConfirm = () => {
    try {
      setCurrentSession(null)
      showSuccess('Session ended successfully')
      navigate('/')
    } catch (error) {
      handleError(error, showError)
    }
  }

  if (!currentSession) {
    return null
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0f1a]">
      {/* Top Navigation Bar */}
      <header className="bg-[#111827] border-b border-[#1f2937] px-2 md:px-4 py-2 md:py-3 flex items-center justify-between" role="banner">
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-1 md:gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse-slow flex-shrink-0"></div>
            <span className="text-xs md:text-sm text-gray-300 truncate">
              <span className="hidden sm:inline">Session ID: </span>
              <span className="text-[#00ff88] font-mono">{currentSession.id}</span>
            </span>
          </div>
          <span className="text-gray-500 hidden md:inline">|</span>
          <span
            className={`text-xs md:text-sm text-gray-300 ${
              timeRemaining < 60 ? 'animate-pulse-slow' : ''
            }`}
          >
            <span className="hidden sm:inline">Time: </span>
            <span
              className={`font-mono ${
                timeRemaining < 60 ? 'text-red-400' : 'text-[#00ff88]'
              }`}
            >
              {formatShortTimer(timeRemaining)}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00ff88]' : 'bg-gray-500'}`} title="Backend connection"></div>
            <span className={`text-xs ${isConnected ? 'text-[#00ff88]' : 'text-gray-400'}`}>
              Backend
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${agentConnected ? 'bg-[#00ff88]' : 'bg-amber-500/80'}`} title="Agent connection"></div>
            <span className={`text-xs ${agentConnected ? 'text-[#00ff88]' : 'text-amber-400'}`}>
              Agent {agentConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="hidden md:block">
            <ProfileDropdown />
          </div>
          {showEndSessionConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEndSessionConfirm(false)}
                className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm border border-[#1f2937] rounded text-gray-300 hover:bg-[#1f2937] transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleEndSessionConfirm}
                className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors min-h-[44px]"
              >
                Confirm
              </button>
            </div>
          ) : (
            <button
              onClick={handleEndSession}
              className="px-2 md:px-4 py-1 md:py-1.5 text-xs md:text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors min-h-[44px]"
            >
              <span className="hidden sm:inline">End Session</span>
              <span className="sm:hidden">End</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <nav className="lg:hidden bg-[#111827] border-b border-[#1f2937] flex" role="tablist" aria-label="Sandbox panels">
        <button
          onClick={() => setActiveMobileTab('explorer')}
          role="tab"
          aria-selected={activeMobileTab === 'explorer'}
          aria-controls="explorer-panel"
          id="explorer-tab"
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px] ${
            activeMobileTab === 'explorer'
              ? 'bg-[#00ff88]/20 text-[#00ff88] border-b-2 border-[#00ff88]'
              : 'text-gray-300 hover:bg-[#1f2937]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
          Explorer
        </button>
        <button
          onClick={() => setActiveMobileTab('terminal')}
          role="tab"
          aria-selected={activeMobileTab === 'terminal'}
          aria-controls="terminal-panel"
          id="terminal-tab"
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px] ${
            activeMobileTab === 'terminal'
              ? 'bg-[#00ff88]/20 text-[#00ff88] border-b-2 border-[#00ff88]'
              : 'text-gray-300 hover:bg-[#1f2937]'
          }`}
        >
          <TerminalIcon className="w-4 h-4" aria-hidden="true" />
          Terminal
        </button>
        <button
          onClick={() => setActiveMobileTab('report')}
          role="tab"
          aria-selected={activeMobileTab === 'report'}
          aria-controls="report-panel"
          id="report-tab"
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px] ${
            activeMobileTab === 'report'
              ? 'bg-[#00ff88]/20 text-[#00ff88] border-b-2 border-[#00ff88]'
              : 'text-gray-300 hover:bg-[#1f2937]'
          }`}
        >
          <FileText className="w-4 h-4" aria-hidden="true" />
          Report
        </button>
      </nav>

      {/* Main Content - Responsive Layout */}
      <main className="flex-1 flex overflow-hidden relative" role="main">
        {/* Explorer show button - when hidden (desktop only) */}
        {!explorerVisible && (
          <button
            onClick={() => setExplorerVisible(true)}
            className="hidden lg:flex absolute left-0 top-0 bottom-0 w-10 bg-[#111827] border-r border-[#1f2937] flex-col items-center justify-center gap-1 hover:bg-[#1f2937] hover:border-[#00ff88]/30 transition-colors z-10"
            title="Show Explorer"
          >
            <PanelLeft className="w-5 h-5 text-gray-400 hover:text-[#00ff88]" />
            <span className="text-[9px] text-gray-500 uppercase tracking-wider -rotate-90">Explorer</span>
          </button>
        )}

        {/* File Explorer */}
        <div
          id="explorer-panel"
          role="tabpanel"
          aria-labelledby="explorer-tab"
          className={`${
            activeMobileTab === 'explorer' ? 'block' : 'hidden'
          } ${explorerVisible ? 'lg:block' : 'lg:hidden'} w-full lg:w-[250px] flex-shrink-0`}
        >
          <FileExplorer onHide={() => setExplorerVisible(false)} />
        </div>

        {/* Terminal */}
        <div
          id="terminal-panel"
          role="tabpanel"
          aria-labelledby="terminal-tab"
          className={`${
            activeMobileTab === 'terminal' ? 'block' : 'hidden'
          } lg:block flex-1 flex flex-col min-w-0`}
        >
          <Terminal />
        </div>

        {/* Risk Report */}
        <div
          id="report-panel"
          role="tabpanel"
          aria-labelledby="report-tab"
          className={`${
            activeMobileTab === 'report' ? 'block' : 'hidden'
          } lg:block w-full lg:w-[300px] flex-shrink-0`}
        >
          <RiskReport
          />
        </div>
      </main>
    </div>
  )
}

export default function SandboxTerminal() {
  const navigate = useNavigate()
  const { currentSession } = useAuth()

  useEffect(() => {
    if (!currentSession) {
      navigate('/start-session')
    }
  }, [currentSession, navigate])

  if (!currentSession) {
    return null
  }

  return (
    <SandboxProvider session={currentSession}>
      <SandboxContent />
    </SandboxProvider>
  )
}
