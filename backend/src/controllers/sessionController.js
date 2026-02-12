import { sessionService } from '../services/index.js';

// REST handlers for session lifecycle operations.

export async function create(req, res, next) {
  try {
    const { licenseId = null, ttlMs } = req.body || {};
    const { session, sessionSecret } = sessionService.createSession({
      userId: req.user.id,
      licenseId,
      ttlMs
    });

    res.status(201).json({
      success: true,
      data: {
        sessionId: session.id,
        sessionSecret,
        status: session.status,
        licenseId: session.licenseId,
        expiresAt: session.expiresAt.getTime()
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getStatus(req, res, next) {
  try {
    // Support both path param and query param
    const sessionId = req.params.sessionId || req.query.sessionId;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Session ID is required'
        }
      });
    }

    const session = sessionService.getSession(sessionId);

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        status: session.status,
        agentConnected: session.agentConnected,
        licenseId: session.licenseId,
        expiresAt: session.expiresAt.getTime()
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const { sessionId } = req.body || {};
    const { session, sessionSecret } = sessionService.refreshSessionSecret(sessionId);
    res.json({
      success: true,
      data: {
        sessionId: session.id,
        sessionSecret,
        expiresAt: session.expiresAt.getTime()
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function terminate(req, res, next) {
  try {
    // Support both path param and body
    const sessionId = req.params.sessionId || req.body?.sessionId;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Session ID is required'
        }
      });
    }

    sessionService.terminateSession(sessionId);
    res.json({
      success: true,
      data: {
        message: 'Session terminated'
      }
    });
  } catch (err) {
    next(err);
  }
}

