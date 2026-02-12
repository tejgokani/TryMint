import { useState } from 'react'
import { AlertTriangle, X, Info } from 'lucide-react'

export default function AlertBanner({ message, type = 'error', onDismiss, persistent = false }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    if (onDismiss) {
      setTimeout(onDismiss, 300)
    }
  }

  if (!isVisible) return null

  const styles = {
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
  }

  const icons = {
    error: AlertTriangle,
    warning: AlertTriangle,
    info: Info,
    success: Info,
  }

  const Icon = icons[type]

  return (
    <div
      className={`${styles[type]} border rounded-lg p-4 mb-4 flex items-start gap-3 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {!persistent && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
