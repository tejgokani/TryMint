import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  User,
  Mail,
  Activity,
  CheckCircle,
  Shield,
  TrendingUp,
  Wifi,
  Clock,
  Monitor,
  X,
  RefreshCw,
  LogOut,
  Copy,
} from 'lucide-react'
import CopyButton from '../components/common/CopyButton'
import Spinner from '../components/common/Spinner'
import { handleError, LicenseError } from '../utils/errorHandler'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout, regenerateLicense, getAllSessions, terminateSession } = useAuth()
  const { showError, showSuccess, showWarning } = useToast()
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  // Mock data for usage stats
  const usageStats = {
    totalScans: 1247,
    approvedInstalls: 1189,
    blockedInstalls: 58,
    avgRiskScore: 12,
  }

  // Mock active sessions data
  const mockSessions = [
    {
      id: 'SESS-A1B2-C3D4',
      device: 'MacBook Pro',
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      duration: 7200000, // 2 hours
    },
    {
      id: 'SESS-E5F6-G7H8',
      device: 'Windows PC',
      startTime: new Date(Date.now() - 1800000), // 30 minutes ago
      duration: 7200000, // 2 hours
    },
    {
      id: 'SESS-I9J0-K1L2',
      device: 'Linux Server',
      startTime: new Date(Date.now() - 900000), // 15 minutes ago
      duration: 3600000, // 1 hour
    },
  ]

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTimeRemaining = (startTime, duration) => {
    const elapsed = Date.now() - startTime.getTime()
    const remaining = duration - elapsed
    if (remaining <= 0) return 'Expired'
    const hours = Math.floor(remaining / 3600000)
    const minutes = Math.floor((remaining % 3600000) / 60000)
    return `${hours}h ${minutes}m`
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleRegenerateLicense = async () => {
    try {
      if (showRegenerateConfirm) {
        setIsRegenerating(true)
        const newLicenseId = regenerateLicense()
        showSuccess('License regenerated successfully!')
        setShowRegenerateConfirm(false)
        setIsRegenerating(false)
      } else {
        setShowRegenerateConfirm(true)
      }
    } catch (error) {
      setIsRegenerating(false)
      handleError(error, showError)
    }
  }

  const handleTerminateSession = async (sessionId) => {
    try {
      await terminateSession(sessionId)
      showSuccess('Session terminated successfully')
    } catch (error) {
      handleError(error, showError)
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Top Navigation */}
      <nav className="bg-[#111827] border-b border-[#1f2937]" role="navigation" aria-label="Dashboard navigation">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center gap-4 md:gap-8 flex-1 min-w-0">
              <div
                onClick={() => navigate('/')}
                className="flex items-center cursor-pointer flex-shrink-0"
              >
                <span className="text-xl md:text-2xl font-bold">
                  <span className="text-[#00ff88]">TRY</span>
                  <span className="text-white">MINT</span>
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors text-sm min-h-[44px]"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-8" role="main">
        {/* 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Section 1: Profile Info */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 hover:border-[#00ff88]/30 transition-colors card-hover">
            <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-white font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Role</p>
                  <span className="px-2 py-1 bg-[#00ff88]/20 text-[#00ff88] text-xs font-medium rounded">
                    {user.role || 'Developer'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Member Since</p>
                <p className="text-white font-medium">
                  {formatDate(user.memberSince)}
                </p>
              </div>
              <button className="w-full bg-[#00ff88] text-[#0a0f1a] px-4 py-2 rounded-lg font-semibold hover:bg-[#00e67a] transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Section 2: License Information */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 hover:border-[#00ff88]/30 transition-colors card-hover">
            <h2 className="text-xl font-semibold mb-4">License Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  License ID
                </label>
                <div className="flex items-center gap-2 p-3 bg-[#0a0f1a] rounded border border-[#1f2937]">
                  <code className="flex-1 text-sm text-[#00ff88] font-mono truncate">
                    {user.licenseId || 'LIC-XXXX-XXXX-XXXX-XXXX-XXXX'}
                  </code>
                  <CopyButton
                    text={user.licenseId || 'LIC-XXXX-XXXX-XXXX-XXXX-XXXX'}
                  />
                </div>
              </div>
              <button
                onClick={handleRegenerateLicense}
                disabled={isRegenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#1f2937] rounded-lg hover:border-yellow-500/50 hover:text-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                {isRegenerating ? (
                  <>
                    <Spinner size="sm" />
                    <span>Regenerating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Regenerate License
                  </>
                )}
              </button>
              {showRegenerateConfirm && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-sm text-yellow-400">
                  This will invalidate your current license. Click again to confirm.
                </div>
              )}
              <p className="text-xs text-gray-500">
                This will invalidate your current license
              </p>
            </div>
          </div>

          {/* Section 3: Usage Overview */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 md:p-6 hover:border-[#00ff88]/30 transition-colors card-hover">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Usage Overview</h2>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {/* Total Scans */}
              <div className="bg-[#0a0f1a] border border-[#1f2937] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-[#00ff88]" />
                  <span className="text-xs text-gray-400">Total Scans</span>
                </div>
                <p className="text-2xl font-bold">{usageStats.totalScans.toLocaleString()}</p>
              </div>

              {/* Approved Installs */}
              <div className="bg-[#0a0f1a] border border-[#1f2937] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-400">Approved</span>
                </div>
                <p className="text-2xl font-bold">{usageStats.approvedInstalls.toLocaleString()}</p>
              </div>

              {/* Blocked Installs */}
              <div className="bg-[#0a0f1a] border border-[#1f2937] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-gray-400">Blocked</span>
                </div>
                <p className="text-2xl font-bold">{usageStats.blockedInstalls.toLocaleString()}</p>
              </div>

              {/* Avg Risk Score */}
              <div className="bg-[#0a0f1a] border border-[#1f2937] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#00ff88]" />
                  <span className="text-xs text-gray-400">Avg Risk</span>
                </div>
                <p className="text-2xl font-bold">{usageStats.avgRiskScore}/10</p>
              </div>
            </div>
          </div>

          {/* Section 4: Agent Status */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 hover:border-[#00ff88]/30 transition-colors card-hover">
            <h2 className="text-xl font-semibold mb-4">Agent Status</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#00ff88] animate-pulse"></div>
                <span className="text-[#00ff88] font-medium">Connected</span>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Agent Status</p>
                <p className="text-white font-medium">Active</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Last Heartbeat: 2 minutes ago</span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#1f2937] rounded-lg hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">
                <Wifi className="w-4 h-4" />
                Reconnect Agent
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Active Sessions */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 md:p-6 hover:border-[#00ff88]/30 transition-colors card-hover">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Active Sessions</h2>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#1f2937]">
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-400">
                    Session ID
                  </th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-400">
                    Device
                  </th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-400 hidden md:table-cell">
                    Start Time
                  </th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-400">
                    Time Remaining
                  </th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-[#1f2937] hover:bg-[#0a0f1a]/50 transition-colors"
                  >
                    <td className="py-2 md:py-3 px-2 md:px-4">
                      <code className="text-xs md:text-sm text-[#00ff88] font-mono">
                        {session.id}
                      </code>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        <span className="text-xs md:text-sm">{session.device}</span>
                      </div>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-gray-300 hidden md:table-cell">
                      {session.startTime.toLocaleTimeString()}
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-gray-300">
                      {formatTimeRemaining(session.startTime, session.duration)}
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4">
                      <button
                        onClick={() => handleTerminateSession(session.id)}
                        className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-xs md:text-sm min-h-[44px]"
                      >
                        <X className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Terminate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
