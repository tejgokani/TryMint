# Backend-Frontend Integration Summary

## Changes Made

### Backend Changes

1. **Session Routes (`backend/src/routes/session.js`)**
   - Updated to support both path parameters and query/body parameters for sessionId
   - Routes now match frontend API calls:
     - `GET /session/:sessionId` - Get session status
     - `DELETE /session/:sessionId` - Terminate session

2. **Session Controller (`backend/src/controllers/sessionController.js`)**
   - Updated `getStatus` to support both path param (`req.params.sessionId`) and query param (`req.query.sessionId`)
   - Updated `terminate` to support both path param and body param for sessionId
   - Added proper error handling for missing sessionId

3. **Auth Routes (`backend/src/routes/auth.js`)**
   - Added `authenticate` middleware to `/auth/me` endpoint
   - Added `authenticate` middleware to `/auth/logout` endpoint

4. **CORS Configuration (`backend/src/config/app.js`)**
   - Updated to allow frontend origin (`http://localhost:5173`) in development mode
   - Falls back to `*` in production if `TRYMINT_CORS_ORIGIN` is not 

### Frontend Changes

1. **StartSession Component (`frontend/src/pages/StartSession.jsx`)**
   - Updated to use backend API response instead of generating session locally
   - Properly maps backend response to frontend session format
   - Handles errors correctly

2. **SessionCredentials Component (`frontend/src/pages/SessionCredentials.jsx`)**
   - Updated `handleRegenerate` to call backend `/session/refresh` endpoint
   - Uses backend response to update session secret and expiration time

3. **AuthContext (`frontend/src/context/AuthContext.jsx`)**
   - Updated `terminateSession` to call backend API before local cleanup
   - Made function async to support API calls

4. **API Service (`frontend/src/services/api.js`)**
   - Added `refreshSession` method to call `/session/refresh` endpoint

5. **Dashboard Component (`frontend/src/pages/Dashboard.jsx`)**
   - Updated `handleTerminateSession` to be async

6. **SandboxTerminal Component (`frontend/src/pages/SandboxTerminal.jsx`)**
   - Updated `handleEndSession` to call backend API before local cleanup

7. **useSession Hook (`frontend/src/hooks/useSession.js`)**
   - Updated `terminate` function to be async

## API Endpoints

### Authentication
- `POST /v1/auth/login` - Login with email/password
- `POST /v1/auth/logout` - Logout (requires auth)
- `GET /v1/auth/me` - Get current user (requires auth)

### Sessions
- `POST /v1/session` - Create new session (requires auth)
  - Body: `{ licenseId, ttlMs }`
  - Response: `{ success: true, data: { sessionId, sessionSecret, status, licenseId, expiresAt } }`

- `GET /v1/session/:sessionId` - Get session status (requires auth)
  - Response: `{ success: true, data: { sessionId, status, agentConnected, licenseId, expiresAt } }`

- `POST /v1/session/refresh` - Refresh session secret (requires auth)
  - Body: `{ sessionId }`
  - Response: `{ success: true, data: { sessionId, sessionSecret, expiresAt } }`

- `DELETE /v1/session/:sessionId` - Terminate session (requires auth)
  - Response: `{ success: true, data: { message: 'Session terminated' } }`

## Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "error": {
    "message": "Error message here",
    "details": {} // optional
  }
}
```

## Success Response Format

All successful responses follow this format:
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

## Testing Checklist

- [x] Backend routes match frontend API calls
- [x] Authentication middleware added to protected routes
- [x] CORS configured for frontend origin
- [x] Error response format matches frontend expectations
- [x] Frontend uses backend API for session creation
- [x] Frontend uses backend API for session termination
- [x] Frontend uses backend API for session refresh
- [x] All async functions properly handled

## Environment Variables

### Backend
- `TRYMINT_PORT` - Backend port (default: 3000)
- `TRYMINT_CORS_ORIGIN` - CORS origin (default: `http://localhost:5173` in dev, `*` in prod)
- `JWT_SECRET` - JWT secret key (default: 'change-me-in-production')
- `JWT_EXPIRY` - JWT expiration (default: '2h')

### Frontend
- `VITE_API_URL` - Backend API URL (default: `http://localhost:3000/v1`)

## Notes

- Backend runs on port 3000
- Frontend runs on port 5173 (Vite default)
- All API calls are prefixed with `/v1`
- Authentication uses JWT tokens stored in `localStorage` as `trymint_token`
- Sessions are managed both on backend (source of truth) and frontend (for UI state)
