import { NetworkError, AuthenticationError, SessionError } from '../utils/errorHandler'
import { isOnline } from '../utils/errorHandler'

// VITE_API_URL: set for production or when not using proxy. Dev: empty = use /v1 (Vite proxy)
const API_BASE_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? '/v1' : (typeof window !== 'undefined' ? `${window.location.origin}/v1` : '/v1'));
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('trymint_token');
};

// Create timeout promise
const createTimeoutPromise = (timeout) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new NetworkError('Request timeout')), timeout);
  });
};

// API request helper with error handling
const apiRequest = async (endpoint, options = {}) => {
  // Check if online
  if (!isOnline()) {
    throw new NetworkError('You are offline. Please check your internet connection.');
  }

  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await Promise.race([
      fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      }),
      createTimeoutPromise(REQUEST_TIMEOUT),
    ]);

    clearTimeout(timeoutId);

    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new NetworkError('Invalid response from server');
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Clear token on auth error
        localStorage.removeItem('trymint_token');
        throw new AuthenticationError(data.error?.message || 'Authentication failed');
      }
      if (response.status === 403) {
        throw new SessionError(data.error?.message || 'Session expired');
      }
      const msg = data?.error?.message || data?.message || `API request failed: ${response.statusText}`;
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new NetworkError('Request timeout. Please try again.');
    }
    if (error instanceof NetworkError || error instanceof AuthenticationError || error instanceof SessionError) {
      throw error;
    }
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Load failed')) {
      throw new NetworkError(
        'Cannot reach the backend. Ensure the backend is running (cd backend && npm run dev) and try again.'
      );
    }
    throw error;
  }
};

export const api = {
  // Health check (no auth)
  async checkHealth() {
    return apiRequest('/health');
  },

  // Auth endpoints
  async login(email, password) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async logout() {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  async getMe() {
    return apiRequest('/auth/me');
  },

  async initiateGoogleAuth() {
    return apiRequest('/auth/google', {
      method: 'POST',
    });
  },

  // Session endpoints
  async createSession(licenseId, ttlMs) {
    return apiRequest('/session', {
      method: 'POST',
      body: JSON.stringify({ licenseId, ttlMs }),
    });
  },

  async getSessionStatus(sessionId) {
    return apiRequest(`/session/${sessionId}`);
  },

  async terminateSession(sessionId) {
    return apiRequest(`/session/${sessionId}`, {
      method: 'DELETE',
    });
  },

  async refreshSession(sessionId) {
    return apiRequest('/session/refresh', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  },

  // Command endpoints
  async getCommandHistory(sessionId, { limit = 50, offset = 0 } = {}) {
    const params = new URLSearchParams({ sessionId, limit, offset })
    return apiRequest(`/command/history?${params}`)
  },

  // Package scan (public, no auth required)
  // aiSummary: when true, requests AI-generated TRYMINT Insight (requires OPENAI_API_KEY on backend)
  async scanPackage(packageSpec, { aiSummary = false } = {}) {
    return apiRequest('/scan/package', {
      method: 'POST',
      body: JSON.stringify({ package: packageSpec, aiSummary: !!aiSummary }),
    })
  },

  // Postmortem analysis (packageJson + optional files). deepScan=true fetches full tarball, parses every line.
  async runPostmortem({ packageJson, files = {}, packagePath = '/', deepScan = true }) {
    return apiRequest('/postmortem', {
      method: 'POST',
      body: JSON.stringify({ packageJson, files, packagePath, deepScan: !!deepScan }),
    })
  },
}
