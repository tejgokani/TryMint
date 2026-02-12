import { useState, useEffect } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowBanner(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showBanner && isOnline) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-yellow-500/20 border-b border-yellow-500/30 text-yellow-400 px-4 py-2 flex items-center justify-center gap-2 transition-all duration-300 ${
        showBanner ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Connection restored</span>
          <button
            onClick={() => setShowBanner(false)}
            className="ml-2 hover:opacity-70"
          >
            ×
          </button>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">You are offline. Some features may be unavailable.</span>
        </>
      )}
    </div>
  )
}
