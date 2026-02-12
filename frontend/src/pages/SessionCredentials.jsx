import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Copy, Eye, EyeOff, Clock, AlertTriangle } from 'lucide-react'
import CopyButton from '../components/common/CopyButton'
import Spinner from '../components/common/Spinner'
import { SessionError } from '../utils/errorHandler'
import { handleError } from '../utils/errorHandler'

export default function SessionCredentials() {
  const navigate = useNavigate()
  const { currentSession, setCurrentSession } = useAuth()
  const { showError, showWarning, showSuccess } = useToast()
  const [isSecretVisible, setIsSecretVisible] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(180) // 3 minutes in seconds
  const [isExpired, setIsExpired] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  // Pending credentials: shown after Regenerate, confirmed only when Open Sandbox is clicked
  const [pendingCredentials, setPendingCredentials] = useState(null)

  // Display: pending (if any) else confirmed
  const displaySession = pendingCredentials || currentSession

  // Redirect if no session and no pending
  useEffect(() => {
    if (!currentSession && !pendingCredentials) {
      navigate('/start-session')
    }
  }, [currentSession, pendingCredentials, navigate])

  // Countdown timer (use displaySession for timer)
  useEffect(() => {
    if (!displaySession || isExpired) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [displaySession, isExpired])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Generate CLI command
  const getCliCommand = () => {
    if (!displaySession) return ''
    const sessionId = displaySession.id.replace(/-/g, '_')
    const token = displaySession.secret
    return `trymint connect --session=${sessionId} --token=${token}`
  }

  const handleRegenerate = async () => {
    const baseSession = pendingCredentials || currentSession
    if (!baseSession) {
      showError('No active session')
      return
    }

    if (isRegenerating) return

    try {
      setIsRegenerating(true)

      const { api } = await import('../services/api')

      // Create new session (new sessionId + new secret)
      const durationMs = baseSession.duration || 2 * 60 * 60 * 1000
      const licenseId = baseSession.licenseId || null
      const response = await api.createSession(licenseId, durationMs)

      if (response.success && response.data) {
        const { sessionId, sessionSecret, expiresAt } = response.data
        const newCredentials = {
          id: sessionId,
          secret: sessionSecret,
          licenseId: baseSession.licenseId,
          duration: durationMs,
          expiresAt: new Date(expiresAt).toISOString(),
        }

        // Terminate old session(s) - no longer valid
        const oldSessionId = baseSession.id
        await api.terminateSession(oldSessionId).catch(() => {})

        setPendingCredentials(newCredentials)
        setTimeRemaining(180)
        setIsExpired(false)
        setIsSecretVisible(false)
        showSuccess('New credentials generated. Click Open Sandbox to confirm.')
      } else {
        throw new Error('Failed to regenerate credentials')
      }
    } catch (error) {
      handleError(error, showError)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleOpenSandbox = () => {
    try {
      const sessionToUse = pendingCredentials || currentSession
      if (!sessionToUse) {
        throw new SessionError('No active session')
      }

      if (isExpired) {
        throw new SessionError('Session credentials have expired. Please regenerate.')
      }

      // Confirm: persist credentials to context when user opens sandbox
      if (pendingCredentials) {
        setCurrentSession(pendingCredentials)
        setPendingCredentials(null)
      }

      navigate('/sandbox-terminal')
    } catch (error) {
      handleError(error, showError)
    }
  }

  if (!displaySession) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-md">
        {/* Modal Card */}
        <div className="bg-[#111827] rounded-xl border border-[#1f2937] shadow-2xl p-8 animate-scale-in">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white mb-2">
              Session Credentials
            </h1>
            <p className="text-gray-400 text-sm mb-2">
              Use these to connect your local agent
            </p>
            <p className="text-gray-500 text-xs">
              Install first: <code className="bg-[#0a0f1a] px-1 rounded">npm install -g trymint-agent</code>
            </p>
          </div>

          {pendingCredentials && (
            <div className="mb-4 p-3 rounded border border-[#00ff88]/30 bg-[#00ff88]/5 text-[#00ff88] text-sm">
              New credentials generated. Click Open Sandbox to confirm.
            </div>
          )}

          {/* Session ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Session ID
            </label>
            <div className="flex items-center gap-2 p-3 bg-[#0a0f1a] rounded border border-[#1f2937]">
              <code className="flex-1 text-sm text-[#00ff88] font-mono truncate">
                {displaySession.id}
              </code>
              <CopyButton text={displaySession.id} />
            </div>
          </div>

          {/* Session Secret */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Session Secret
            </label>
            <div className="flex items-center gap-2 p-3 bg-[#0a0f1a] rounded border border-[#1f2937]">
              <code className="flex-1 text-sm text-[#00ff88] font-mono truncate">
                {isSecretVisible ? displaySession.secret : '•'.repeat(32)}
              </code>
              <CopyButton text={displaySession.secret} title="Copy secret" />
              <button
                onClick={() => setIsSecretVisible(!isSecretVisible)}
                className="p-1.5 hover:bg-[#1f2937] rounded transition-colors"
                title={isSecretVisible ? 'Hide secret' : 'Show secret'}
              >
                {isSecretVisible ? (
                  <EyeOff className="w-4 h-4 text-gray-400 hover:text-[#00ff88]" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400 hover:text-[#00ff88]" />
                )}
              </button>
            </div>
          </div>

          {/* Timer Warning */}
          <div
            className={`mb-4 p-3 rounded border flex items-center gap-2 ${
              isExpired
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
            }`}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              {isExpired ? (
                <p className="text-sm font-medium">
                  Secret has expired. Please regenerate to continue.
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    This secret expires in {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CLI Command */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CLI Command
            </label>
            <div className="relative">
              <pre className="p-3 bg-[#0a0f1a] border border-[#1f2937] rounded text-xs text-gray-300 font-mono overflow-x-auto">
                {getCliCommand()}
              </pre>
              <div className="absolute top-2 right-2">
                <CopyButton text={getCliCommand()} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex-1 px-4 py-3 border border-[#1f2937] rounded-lg text-gray-300 hover:border-gray-600 hover:text-white transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRegenerating ? (
                <>
                  <Spinner size="sm" />
                  <span>Regenerating...</span>
                </>
              ) : (
                'Regenerate'
              )}
            </button>
            <button
              onClick={handleOpenSandbox}
              disabled={isExpired}
              className="flex-1 bg-[#00ff88] text-[#0a0f1a] px-4 py-3 rounded-lg font-semibold hover:bg-[#00e67a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              Open Sandbox
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
