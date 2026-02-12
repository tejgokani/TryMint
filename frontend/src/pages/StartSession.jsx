import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Shield, Clock, Info } from 'lucide-react'
import { generateSessionId, generateSecret, durationToMs } from '../utils/sessionUtils'
import { validateLicenseId } from '../utils/validators'
import { handleError, LicenseError } from '../utils/errorHandler'
import Spinner from '../components/common/Spinner'

export default function StartSession() {
  const navigate = useNavigate()
  const { user, setCurrentSession } = useAuth()
  const { showError, showSuccess } = useToast()
  const [licenseId, setLicenseId] = useState('')
  const [duration, setDuration] = useState('2 hours')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-fill license ID if user is authenticated
  useEffect(() => {
    if (user?.licenseId) {
      setLicenseId(user.licenseId)
    }
  }, [user])

  const durationOptions = [
    '1 hour',
    '2 hours',
    '4 hours',
    '8 hours',
    '24 hours',
  ]

  const handleCancel = () => {
    navigate('/')
  }

  const handleStartSandbox = async () => {
    if (isSubmitting) return
    
    setError('')
    
    // Validate license ID format
    const licenseValidation = validateLicenseId(licenseId.trim())
    if (!licenseValidation.valid) {
      setError(licenseValidation.message)
      return
    }

    setIsLoading(true)
    setIsSubmitting(true)

    try {
      const durationMs = durationToMs(duration)

      // Create session on backend
      const { api } = await import('../services/api')
      const response = await api.createSession(licenseId.trim(), durationMs)

      if (response.success && response.data) {
        const { sessionId, sessionSecret, expiresAt } = response.data
        const startTime = new Date()

        const sessionData = {
          id: sessionId,
          secret: sessionSecret,
          licenseId: licenseId.trim(),
          duration: durationMs,
          durationLabel: duration,
          startTime: startTime.toISOString(),
          expiresAt: new Date(expiresAt).toISOString(),
        }

        setCurrentSession(sessionData)
        showSuccess('Session created successfully!')
        navigate('/session-credentials')
      } else {
        throw new Error('Failed to create session')
      }
    } catch (err) {
      const message = handleError(err, showError)
      setError(message)
    } finally {
      setIsLoading(false)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-md">
        {/* Modal Card */}
        <div className="bg-[#111827] rounded-xl border border-[#1f2937] shadow-2xl p-8 animate-scale-in">
          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#00ff88]/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#00ff88]" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Start New Session</h1>
          </div>

          {/* License ID Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              License ID
            </label>
              <input
                type="text"
                value={licenseId}
                onChange={(e) => {
                  setLicenseId(e.target.value)
                  setError('')
                }}
                onBlur={() => {
                  if (licenseId.trim()) {
                    const validation = validateLicenseId(licenseId.trim())
                    if (!validation.valid) {
                      setError(validation.message)
                    }
                  }
                }}
                placeholder="Enter your license ID"
                className={`w-full bg-[#0a0f1a] border ${
                  error ? 'border-red-500 animate-shake' : 'border-[#1f2937]'
                } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors font-mono text-base min-h-[44px]`}
              />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Session Duration Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Session Duration
            </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors appearance-none cursor-pointer text-base min-h-[44px]"
              >
              {durationOptions.map((option) => (
                <option key={option} value={option} className="bg-[#111827]">
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Info Text */}
          <div className="flex items-start gap-2 mb-6 p-3 bg-[#0a0f1a] border border-[#1f2937] rounded-lg">
            <Info className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-400">
              Session auto-terminates when time expires
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-[#1f2937] rounded-lg text-gray-300 hover:border-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={handleStartSandbox}
              disabled={isLoading || isSubmitting || !licenseId.trim()}
              className="flex-1 bg-[#00ff88] text-[#0a0f1a] px-4 py-3 rounded-lg font-semibold hover:bg-[#00e67a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span>Starting...</span>
                </>
              ) : (
                'Start Sandbox'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
