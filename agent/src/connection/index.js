/**
 * Connection Manager - WebSocket client for backend connection
 */

import WebSocket from 'ws';
import { EventEmitter } from 'events';

const HEARTBEAT_INTERVAL_MS = 30000;

export class ConnectionManager extends EventEmitter {
  constructor({ sessionId, sessionSecret }) {
    super();
    this.sessionId = sessionId;
    this.sessionSecret = sessionSecret;
    this._ws = null;
    this._connected = false;
    this._lastHeartbeat = null;
    this._heartbeatTimer = null;
    this._reconnectAttempts = 0;
  }

  getWsUrl() {
    const baseUrl = process.env.TRYMINT_WS_URL || 'ws://localhost:3000';
    const base = baseUrl.replace(/^http/, 'ws');
    const path = '/ws/agent';
    const params = new URLSearchParams({
      sessionId: this.sessionId,
      sessionSecret: this.sessionSecret,
    });
    return `${base}${path}?${params.toString()}`;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const url = this.getWsUrl();
      this._ws = new WebSocket(url);

      this._ws.on('open', () => {
        this._connected = true;
        this._lastHeartbeat = new Date();
        this._startHeartbeat();
        this.emit('connected');
        resolve();
      });

      this._ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          this._handleMessage(msg);
        } catch {
          // Ignore parse errors
        }
      });

      this._ws.on('close', (code, reason) => {
        this._connected = false;
        this._stopHeartbeat();
        this.emit('disconnected', { code, reason: reason?.toString() });
      });

      this._ws.on('error', (err) => {
        this.emit('error', err);
        reject(err);
      });
    });
  }

  _handleMessage(msg) {
    const { type, payload } = msg;
    if (type === 'agent:connected') {
      this._lastHeartbeat = new Date();
    }
    this.emit('message', msg);
    this.emit(`message:${type}`, payload);
  }

  _startHeartbeat() {
    this._stopHeartbeat();
    this._heartbeatTimer = setInterval(() => {
      if (this._connected && this._ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'agent:heartbeat', payload: { status: 'online', timestamp: Date.now() } });
        this._lastHeartbeat = new Date();
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  _stopHeartbeat() {
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = null;
    }
  }

  send(msg) {
    if (this._ws?.readyState === WebSocket.OPEN) {
      this._ws.send(JSON.stringify(msg));
    }
  }

  async disconnect() {
    this._stopHeartbeat();
    if (this._ws) {
      this._ws.close(1000, 'Agent disconnecting');
      this._ws = null;
    }
    this._connected = false;
    this.emit('disconnected');
  }

  isConnected() {
    return this._connected && this._ws?.readyState === WebSocket.OPEN;
  }

  getLastHeartbeat() {
    return this._lastHeartbeat;
  }
}
