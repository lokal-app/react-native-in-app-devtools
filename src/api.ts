/**
 * Public API for explicit logging methods
 * Use these methods when you want to manually log events
 * instead of relying on automatic interception
 */

import { BugBubbleDebugger } from './BugBubbleDebugger';
import type { LogLevel } from './types';

/**
 * Explicit logging API
 * These methods allow you to manually log events even if automatic interception is enabled
 */
export const BugBubbleLogger = {
  /**
   * Log an analytics event explicitly
   * @param eventName - Name of the analytics event
   * @param properties - Optional properties/parameters for the event
   *
   * @example
   * ```tsx
   * import { BugBubbleLogger } from '@lokal-dev/react-native-bugbubble';
   *
   * BugBubbleLogger.logAnalytics('user_login', { userId: '123', method: 'email' });
   * ```
   */
  logAnalytics: (eventName: string, properties?: Record<string, any>): void => {
    BugBubbleDebugger.getInstance().logAnalytics(eventName, properties);
  },

  /**
   * Log a network request explicitly
   * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param url - Request URL
   * @param statusCode - HTTP status code (optional)
   * @param requestHeaders - Request headers (optional)
   * @param responseHeaders - Response headers (optional)
   * @param requestBody - Request body (optional)
   * @param responseBody - Response body (optional)
   * @param duration - Request duration in milliseconds (optional)
   *
   * @example
   * ```tsx
   * import { BugBubbleLogger } from '@lokal-dev/react-native-bugbubble';
   *
   * BugBubbleLogger.logNetwork(
   *   'POST',
   *   'https://api.example.com/users',
   *   201,
   *   { 'Content-Type': 'application/json' },
   *   { 'Content-Type': 'application/json' },
   *   { name: 'John' },
   *   { id: 1, name: 'John' },
   *   150
   * );
   * ```
   */
  logNetwork: (
    method: string,
    url: string,
    statusCode?: number,
    requestHeaders?: Record<string, string>,
    responseHeaders?: Record<string, string>,
    requestBody?: any,
    responseBody?: any,
    duration?: number
  ): void => {
    BugBubbleDebugger.getInstance().logNetwork(
      method,
      url,
      statusCode,
      requestHeaders,
      responseHeaders,
      requestBody,
      responseBody,
      duration
    );
  },

  /**
   * Log a WebSocket event explicitly
   * @param event - WebSocket event type ('open', 'message', 'close', 'error')
   * @param url - WebSocket URL (optional)
   * @param data - Event data (optional)
   *
   * @example
   * ```tsx
   * import { BugBubbleLogger } from '@lokal-dev/react-native-bugbubble';
   *
   * BugBubbleLogger.logWebSocket('message', 'wss://api.example.com/ws', { type: 'ping' });
   * ```
   */
  logWebSocket: (
    event: 'open' | 'message' | 'close' | 'error',
    url?: string,
    data?: any
  ): void => {
    BugBubbleDebugger.getInstance().logWebSocket(event, url, data);
  },

  /**
   * Log a console message explicitly
   * @param level - Log level ('debug', 'info', 'warn', 'error')
   * @param args - Arguments to log (same as console.log)
   *
   * @example
   * ```tsx
   * import { BugBubbleLogger } from '@lokal-dev/react-native-bugbubble';
   *
   * BugBubbleLogger.logConsole('info', 'User logged in', { userId: '123' });
   * InAppDevToolsLogger.logConsole('error', 'Failed to fetch data', error);
   * ```
   */
  logConsole: (level: LogLevel, ...args: any[]): void => {
    BugBubbleDebugger.getInstance().logConsole(level, ...args);
  },
};
