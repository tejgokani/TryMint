import { createContext, useContext, useState, useEffect } from 'react'

const SessionContext = createContext()

export function SessionProvider({ children }) {
  const [riskScore, setRiskScore] = useState(0)
  const [changedFiles, setChangedFiles] = useState([])
  const [warnings, setWarnings] = useState([])
  const [packageHistory, setPackageHistory] = useState([])

  // Load session state from localStorage on mount
  useEffect(() => {
    const storedRiskScore = localStorage.getItem('trymint_session_risk_score')
    if (storedRiskScore) {
      try {
        setRiskScore(parseInt(storedRiskScore, 10))
      } catch (error) {
        console.error('Error loading risk score:', error)
      }
    }

    const storedChangedFiles = localStorage.getItem('trymint_session_changed_files')
    if (storedChangedFiles) {
      try {
        setChangedFiles(JSON.parse(storedChangedFiles))
      } catch (error) {
        console.error('Error loading changed files:', error)
      }
    }

    const storedWarnings = localStorage.getItem('trymint_session_warnings')
    if (storedWarnings) {
      try {
        setWarnings(JSON.parse(storedWarnings))
      } catch (error) {
        console.error('Error loading warnings:', error)
      }
    }

    const storedHistory = localStorage.getItem('trymint_session_history')
    if (storedHistory) {
      try {
        setPackageHistory(JSON.parse(storedHistory))
      } catch (error) {
        console.error('Error loading package history:', error)
      }
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('trymint_session_risk_score', riskScore.toString())
  }, [riskScore])

  useEffect(() => {
    localStorage.setItem('trymint_session_changed_files', JSON.stringify(changedFiles))
  }, [changedFiles])

  useEffect(() => {
    localStorage.setItem('trymint_session_warnings', JSON.stringify(warnings))
  }, [warnings])

  useEffect(() => {
    localStorage.setItem('trymint_session_history', JSON.stringify(packageHistory))
  }, [packageHistory])

  const updateRiskScore = (score) => {
    setRiskScore(Math.max(0, Math.min(100, score)))
  }

  const addChangedFile = (file) => {
    setChangedFiles((prev) => {
      const exists = prev.find((f) => f.name === file.name)
      if (exists) {
        return prev.map((f) => (f.name === file.name ? file : f))
      }
      return [...prev, file]
    })
  }

  const addWarning = (warning) => {
    setWarnings((prev) => [...prev, warning])
  }

  const addPackageHistory = (pkg) => {
    setPackageHistory((prev) => [...prev, pkg])
  }

  const clearSession = () => {
    setRiskScore(0)
    setChangedFiles([])
    setWarnings([])
    setPackageHistory([])
    localStorage.removeItem('trymint_session_risk_score')
    localStorage.removeItem('trymint_session_changed_files')
    localStorage.removeItem('trymint_session_warnings')
    localStorage.removeItem('trymint_session_history')
  }

  return (
    <SessionContext.Provider
      value={{
        riskScore,
        changedFiles,
        warnings,
        packageHistory,
        updateRiskScore,
        addChangedFile,
        addWarning,
        addPackageHistory,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSessionContext() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider')
  }
  return context
}
