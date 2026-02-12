// Custom error classes
export class AppError extends Error {
  constructor(message, code, statusCode = 400) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
    this.field = field
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class SessionError extends AppError {
  constructor(message = 'Session error') {
    super(message, 'SESSION_ERROR', 403)
    this.name = 'SessionError'
  }
}

export class LicenseError extends AppError {
  constructor(message = 'License error') {
    super(message, 'LICENSE_ERROR', 403)
    this.name = 'LicenseError'
  }
}

// Error handler utility
export function handleError(error, showToast) {
  console.error('Error:', error)

  let userMessage = 'An unexpected error occurred'
  let errorType = 'error'

  if (error instanceof NetworkError) {
    userMessage = 'Network connection failed. Please check your internet connection and try again.'
    errorType = 'error'
  } else if (error instanceof ValidationError) {
    userMessage = error.message || 'Please check your input and try again.'
    errorType = 'warning'
  } else if (error instanceof AuthenticationError) {
    userMessage = 'Authentication failed. Please log in again.'
    errorType = 'error'
  } else if (error instanceof SessionError) {
    userMessage = 'Session expired or invalid. Please start a new session.'
    errorType = 'warning'
  } else if (error instanceof LicenseError) {
    userMessage = 'License error. Please check your license ID or contact support.'
    errorType = 'error'
  } else if (error.response) {
    // API error response
    const status = error.response.status
    const data = error.response.data

    if (status === 401) {
      userMessage = 'Session expired. Please log in again.'
      errorType = 'error'
    } else if (status === 403) {
      userMessage = 'You do not have permission to perform this action.'
      errorType = 'error'
    } else if (status === 404) {
      userMessage = 'Resource not found.'
      errorType = 'warning'
    } else if (status === 429) {
      userMessage = 'Too many requests. Please wait a moment and try again.'
      errorType = 'warning'
    } else if (status >= 500) {
      userMessage = 'Server error. Please try again later or contact support.'
      errorType = 'error'
    } else {
      userMessage = data?.error?.message || data?.message || 'Request failed. Please try again.'
      errorType = 'error'
    }
  } else if (error.message) {
    userMessage = error.message
  }

  if (showToast) {
    showToast(userMessage, errorType, 5000)
  }

  return userMessage
}

// Check if online
export function isOnline() {
  return navigator.onLine
}

// Retry mechanism
export async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
    }
  }
}
