// Email validation
export function validateEmail(email) {
  if (!email) {
    return { valid: false, message: 'Email is required' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' }
  }
  return { valid: true }
}

// Password validation
export function validatePassword(password) {
  if (!password) {
    return { valid: false, message: 'Password is required' }
  }
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' }
  }
  if (password.length > 128) {
    return { valid: false, message: 'Password must be less than 128 characters' }
  }
  return { valid: true }
}

// License ID validation
export function validateLicenseId(licenseId) {
  if (!licenseId) {
    return { valid: false, message: 'License ID is required' }
  }
  const pattern = /^LIC-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
  if (!pattern.test(licenseId.trim())) {
    return {
      valid: false,
      message: 'Invalid license ID format. Expected: LIC-XXXX-XXXX-XXXX-XXXX-XXXX',
    }
  }
  return { valid: true }
}

// Session ID validation
export function validateSessionId(sessionId) {
  if (!sessionId) {
    return { valid: false, message: 'Session ID is required' }
  }
  const pattern = /^SESS-[A-Z0-9]{4}-[A-Z0-9]{4}$/
  if (!pattern.test(sessionId.trim())) {
    return {
      valid: false,
      message: 'Invalid session ID format. Expected: SESS-XXXX-XXXX',
    }
  }
  return { valid: true }
}

// Session secret validation
export function validateSessionSecret(secret) {
  if (!secret) {
    return { valid: false, message: 'Session secret is required' }
  }
  if (secret.length !== 32) {
    return { valid: false, message: 'Session secret must be 32 characters' }
  }
  return { valid: true }
}

// Duration validation
export function validateDuration(duration) {
  const validDurations = ['1 hour', '2 hours', '4 hours', '8 hours', '24 hours']
  if (!validDurations.includes(duration)) {
    return { valid: false, message: 'Invalid duration selected' }
  }
  return { valid: true }
}

// Generic required field validation
export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, message: `${fieldName} is required` }
  }
  return { valid: true }
}
