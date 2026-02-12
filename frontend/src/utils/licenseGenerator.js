// Generate a unique license ID in format: LIC-XXXX-XXXX-XXXX-XXXX-XXXX
export function generateLicenseId() {
  const segments = []
  for (let i = 0; i < 5; i++) {
    const segment = Math.random().toString(36).substring(2, 6).toUpperCase()
    segments.push(segment)
  }
  return `LIC-${segments.join('-')}`
}

export function validateLicenseFormat(licenseId) {
  const pattern = /^LIC-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
  return pattern.test(licenseId)
}
