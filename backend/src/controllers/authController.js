// Minimal stubbed auth controller to keep flow consistent.
// In a real deployment this would perform the full Google OAuth dance.

export async function initiateOAuth(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      data: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth?stubbed=true'
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function handleCallback(req, res, next) {
  try {
    // For now we just return a stubbed user; token issuance is handled elsewhere.
    res.status(200).json({
      success: true,
      data: {
        sessionToken: 'stub-session-token',
        user: {
          id: 'user-stub',
          email: 'stub@example.com',
          name: 'Stub User',
          picture: null
        }
      }
    });
  } catch (err) {
    next(err);
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

