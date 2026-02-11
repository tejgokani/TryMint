// OAuth / authentication helpers (stubbed for now).
// This service is intentionally minimal and frontend-agnostic.

import { authConfig } from '../config/index.js';

export const authService = {
  generateOAuthUrl(redirectUri) {
    // In a real implementation, build the Google OAuth URL.
    return (
      'https://accounts.google.com/o/oauth2/v2/auth' +
      `?client_id=${encodeURIComponent(authConfig.googleClientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri || authConfig.googleCallbackUrl)}` +
      '&response_type=code&scope=openid%20email%20profile'
    );
  }
};

