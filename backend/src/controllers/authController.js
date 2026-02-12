// Minimal stubbed auth controller to keep flow consistent.
// In a real deployment this would perform the full Google OAuth dance.

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { authConfig } from '../config/index.js';

// Dummy credentials for development
const DUMMY_CREDENTIALS = {
  'developer@trymint.io': 'password123',
  'admin@trymint.io': 'admin123',
  'test@trymint.io': 'test123',
};

// Dummy user data
const DUMMY_USERS = {
  'developer@trymint.io': {
    id: 'user-dev-001',
    name: 'Alex Morrison',
    email: 'developer@trymint.io',
    role: 'Developer',
  },
  'admin@trymint.io': {
    id: 'user-admin-001',
    name: 'Admin User',
    email: 'admin@trymint.io',
    role: 'Administrator',
  },
  'test@trymint.io': {
    id: 'user-test-001',
    name: 'Test User',
    email: 'test@trymint.io',
    role: 'Developer',
  },
};

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email and password are required',
        },
      });
    }

    // Check if credentials match dummy data
    // For development: accept any email/password combination
    // In production, this would validate against a database
    const isValidPassword = DUMMY_CREDENTIALS[email] === password || password.length >= 6;

    if (!isValidPassword && !DUMMY_CREDENTIALS[email]) {
      // If email not in dummy list, accept any password >= 6 chars
      if (password.length < 6) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Invalid email or password',
          },
        });
      }
    }

    // Get user data (use dummy user or create from email)
    const userData = DUMMY_USERS[email] || {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email,
      role: 'Developer',
    };

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        name: userData.name,
      },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiry }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          ...userData,
          memberSince: new Date().toISOString(),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function initiateOAuth(req, res, next) {
  try {
    const { googleClientId, googleCallbackUrl } = authConfig;
    
    if (!googleClientId || googleClientId === 'stub-google-client-id') {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID in environment variables.'
        }
      });
    }

    // Generate state parameter for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');
    
    // Store state in session or return it to client (for stateless, return to client)
    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: googleCallbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: state
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    res.status(200).json({
      success: true,
      data: {
        authUrl,
        state // Return state to client for verification
      }
    });
  } catch (err) {
    next(err);
  }
}

function redirectToLoginWithError(res, errorMessage) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const redirectUrl = `${frontendUrl}/login?error=${encodeURIComponent(errorMessage)}`;
  res.redirect(redirectUrl);
}

export async function handleCallback(req, res, next) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  try {
    const { code, state } = req.query;
    const { googleClientId, googleClientSecret, googleCallbackUrl } = authConfig;

    if (!code) {
      redirectToLoginWithError(res, 'Authorization code is missing. Please try again.');
      return;
    }

    if (!googleClientId || googleClientId === 'stub-google-client-id' ||
        !googleClientSecret || googleClientSecret === 'stub-google-client-secret') {
      redirectToLoginWithError(res, 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env');
      return;
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: googleCallbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json().catch(() => ({}));

    if (!tokenResponse.ok) {
      const errMsg = tokenData?.error_description || tokenData?.error || 'Token exchange failed';
      redirectToLoginWithError(res, `Google auth failed: ${errMsg}`);
      return;
    }

    const access_token = tokenData?.access_token;
    if (!access_token) {
      redirectToLoginWithError(res, 'Google did not return an access token. Please try again.');
      return;
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      redirectToLoginWithError(res, 'Failed to fetch your profile from Google.');
      return;
    }

    const googleUser = await userInfoResponse.json();
    const email = googleUser?.email;
    if (!email) {
      redirectToLoginWithError(res, 'Google did not provide your email. Please grant email permission.');
      return;
    }

    const userData = {
      id: `user-${googleUser.id || Date.now()}`,
      name: googleUser.name || email.split('@')[0],
      email,
      picture: googleUser.picture,
      role: 'Developer',
    };

    const token = jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        name: userData.name,
      },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiry }
    );

    const redirectUrl = `${frontendUrl}/login?token=${encodeURIComponent(token)}&email=${encodeURIComponent(userData.email)}&name=${encodeURIComponent(userData.name)}`;
    res.redirect(redirectUrl);
  } catch (err) {
    redirectToLoginWithError(res, err.message || 'An unexpected error occurred');
  }
}

export async function logout(req, res, next) {
  try {
    // Actual session teardown handled through /session endpoint;
    // this endpoint mainly exists for symmetry with the documented API.
    res.json({
      success: true,
      data: {
        message: 'Logged out successfully'
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (err) {
    next(err);
  }
}

