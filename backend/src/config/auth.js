// Authentication / JWT / OAuth configuration
// NOTE: For now we only stub Google OAuth integration. No tokens are persisted.

export const authConfig = {
  googleClientId: process.env.GOOGLE_CLIENT_ID || 'stub-google-client-id',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || 'stub-google-client-secret',
  googleCallbackUrl:
    process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/v1/auth/callback',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiry: process.env.JWT_EXPIRY || '2h'
};

