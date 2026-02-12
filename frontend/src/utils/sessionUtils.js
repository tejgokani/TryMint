// Generate a unique session ID in format: SESS-XXXX-XXXX
export function generateSessionId() {
  const segments = []
  for (let i = 0; i < 2; i++) {
    const segment = Math.random().toString(36).substring(2, 6).toUpperCase()
    segments.push(segment)
  }
  return `SESS-${segments.join('-')}`
}

// Generate a random 32-character secret
export function generateSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let secret = ''
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}

// Format time remaining in HH:MM:SS format
export function formatTimeRemaining(seconds) {
  if (seconds <= 0) return '00:00:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// Calculate expiry time from start time and duration
export function calculateExpiry(startTime, durationMs) {
  return new Date(startTime.getTime() + durationMs)
}

// Convert duration string to milliseconds
export function durationToMs(duration) {
  const durationMap = {
    '1 hour': 3600000,
    '2 hours': 7200000,
    '4 hours': 14400000,
    '8 hours': 28800000,
    '24 hours': 86400000,
  }
  return durationMap[duration] || 7200000 // Default to 2 hours
}
