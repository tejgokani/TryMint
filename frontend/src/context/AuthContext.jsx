import { createContext, useContext, useState, useEffect } from 'react'
import { generateLicenseId, validateLicenseFormat } from '../utils/licenseGenerator'
import { generateSessionId, generateSecret, calculateExpiry, durationToMs } from '../utils/sessionUtils'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [currentSession, setCurrentSession] = useState(null)
  const [sessions, setSessions] = useState([])

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('trymint_auth')
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth)
        setIsAuthenticated(true)
        setUser(authData.user)
      } catch (error) {
        console.error('Error loading auth state:', error)
      }
    }

    const storedSessions = localStorage.getItem('trymint_sessions')
    if (storedSessions) {
      try {
        const parsedSessions = JSON.parse(storedSessions)
        setSessions(parsedSessions)
      } catch (error) {
        console.error('Error loading sessions:', error)
      }
    }

    const storedCurrentSession = localStorage.getItem('trymint_current_session')
    if (storedCurrentSession) {
      try {
        const parsedSession = JSON.parse(storedCurrentSession)
        // Check if session is still valid
        const expiresAt = new Date(parsedSession.expiresAt)
        if (expiresAt > new Date()) {
          setCurrentSession(parsedSession)
        } else {
          localStorage.removeItem('trymint_current_session')
        }
      } catch (error) {
        console.error('Error loading current session:', error)
      }
    }
  }, [])

  // Save currentSession to localStorage whenever it changes
  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('trymint_current_session', JSON.stringify(currentSession))
    } else {
      localStorage.removeItem('trymint_current_session')
    }
  }, [currentSession])

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('trymint_sessions', JSON.stringify(sessions))
    } else {
      localStorage.removeItem('trymint_sessions')
    }
  }, [sessions])

  const login = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem('trymint_auth', JSON.stringify({ user: userData }))
  }

  const logout = async () => {
    try {
      // Call backend logout endpoint if API is available
      const { api } = await import('../services/api')
      await api.logout().catch(() => {
        // Ignore errors on logout
      })
    } catch (error) {
      // Ignore errors if API service is not available
    }
    
    setIsAuthenticated(false)
    setUser(null)
    setCurrentSession(null)
    setSessions([])
    localStorage.removeItem('trymint_auth')
    localStorage.removeItem('trymint_sessions')
    localStorage.removeItem('trymint_token')
  }

  const createSession = (durationMs, licenseId) => {
    if (!validateLicenseFormat(licenseId)) {
      throw new Error('Invalid license ID format')
    }

    const sessionId = generateSessionId()
    const secret = generateSecret()
    const startTime = new Date()
    const expiresAt = calculateExpiry(startTime, durationMs)

    const session = {
      id: sessionId,
      secret: secret,
      licenseId: licenseId,
      duration: durationMs,
      startTime: startTime.toISOString(),
      expiresAt: expiresAt.toISOString(),
    }

    // Add to sessions list
    const updatedSessions = [...sessions, session]
    setSessions(updatedSessions)
    
    // Set as current session
    setCurrentSession(session)

    return session
  }

  const terminateSession = async (sessionId) => {
    try {
      // Call backend API to terminate session
      const { api } = await import('../services/api')
      await api.terminateSession(sessionId).catch(() => {
        // Continue with local cleanup even if backend fails
      })
    } catch (error) {
      // Ignore errors if API service is not available
    }
    
    // Update local state
    const updatedSessions = sessions.filter((s) => s.id !== sessionId)
    setSessions(updatedSessions)
    
    if (currentSession && currentSession.id === sessionId) {
      setCurrentSession(null)
    }
  }

  const getAllSessions = () => {
    return sessions
  }

  const generateLicense = () => {
    const newLicenseId = generateLicenseId()
    if (user) {
      const updatedUser = { ...user, licenseId: newLicenseId }
      setUser(updatedUser)
      localStorage.setItem('trymint_auth', JSON.stringify({ user: updatedUser }))
    }
    return newLicenseId
  }

  const regenerateLicense = () => {
    const newLicenseId = generateLicenseId()
    if (user) {
      const updatedUser = { ...user, licenseId: newLicenseId }
      setUser(updatedUser)
      localStorage.setItem('trymint_auth', JSON.stringify({ user: updatedUser }))
    }
    return newLicenseId
  }

  const validateLicense = (licenseId) => {
    return validateLicenseFormat(licenseId)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        currentSession,
        sessions,
        login,
        logout,
        createSession,
        terminateSession,
        getAllSessions,
        generateLicense,
        regenerateLicense,
        validateLicense,
        setCurrentSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
