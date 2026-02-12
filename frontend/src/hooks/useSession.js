import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatTimeRemaining } from '../utils/sessionUtils'

export default function useSession() {
  const { currentSession, terminateSession, setCurrentSession } = useAuth()
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!currentSession) {
      setTimeRemaining(0)
      setIsExpired(true)
      return
    }

    const updateTimer = () => {
      const now = new Date()
      const startTime = new Date(currentSession.startTime)
      const duration = currentSession.duration
      const elapsed = now.getTime() - startTime.getTime()
      const remaining = Math.max(0, duration - elapsed)
      const remainingSeconds = Math.floor(remaining / 1000)

      setTimeRemaining(remainingSeconds)
      setIsExpired(remainingSeconds <= 0)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [currentSession])

  const terminate = async () => {
    if (currentSession) {
      await terminateSession(currentSession.id)
    }
  }

  const extend = (additionalDurationMs) => {
    if (!currentSession) return

    const updatedSession = {
      ...currentSession,
      duration: currentSession.duration + additionalDurationMs,
      expiresAt: new Date(
        new Date(currentSession.expiresAt).getTime() + additionalDurationMs
      ).toISOString(),
    }

    setCurrentSession(updatedSession)
  }

  return {
    session: currentSession,
    timeRemaining: timeRemaining,
    timeRemainingFormatted: formatTimeRemaining(timeRemaining),
    isExpired: isExpired,
    terminate: terminate,
    extend: extend,
  }
}
