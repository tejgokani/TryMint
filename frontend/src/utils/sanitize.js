// XSS prevention - sanitize user inputs
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}

// Sanitize HTML content
export function sanitizeHTML(html) {
  const div = document.createElement('div')
  div.textContent = html
  return div.textContent || div.innerText || ''
}

// Validate and sanitize license ID
export function sanitizeLicenseId(input) {
  const sanitized = input.trim().toUpperCase()
  // Only allow alphanumeric and hyphens
  return sanitized.replace(/[^A-Z0-9-]/g, '')
}

// Validate and sanitize session ID
export function sanitizeSessionId(input) {
  const sanitized = input.trim().toUpperCase()
  return sanitized.replace(/[^A-Z0-9-]/g, '')
}

// Sanitize email
export function sanitizeEmail(email) {
  return email.trim().toLowerCase()
}
