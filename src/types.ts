/**
 * Public type definitions for Inspector
 * These are exported for type safety and potential extension
 */

export interface LogEntry {
  id: string;
  timestamp: number;
  type: LogType;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
  args?: any[];
}

export type LogType = 'analytics' | 'network' | 'websocket' | 'console';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface NetworkLogEntry extends LogEntry {
  type: 'network';
  method?: string;
  url?: string;
  statusCode?: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: any;
  responseBody?: any;
  duration?: number;
}

export interface WebSocketLogEntry extends LogEntry {
  type: 'websocket';
  event: 'open' | 'message' | 'close' | 'error';
  url?: string;
  data?: any;
}

export interface AnalyticsLogEntry extends LogEntry {
  type: 'analytics';
  eventName: string;
  properties?: Record<string, any>;
}

export interface ConsoleLogEntry extends LogEntry {
  type: 'console';
  level: LogLevel;
  args: any[];
}

export interface BugBubbleConfig {
  maxLogs: number;
  floatingButtonPosition: {
    top: number;
    right: number;
  };
  trackingOptions?: {
    enabled: boolean;
    options?: {
      analytics?: boolean;
      network?: boolean;
      websocket?: boolean;
      console?: boolean;
    };
  };
}

export interface InspectorStore {
  logs: LogEntry[];
  config: BugBubbleConfig;
  isVisible: boolean;
  activeTab: LogType | null;
  searchQuery: string;
}
