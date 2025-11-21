import {
  AnalyticsInterceptor,
  ConsoleInterceptor,
  NetworkInterceptor,
  WebSocketInterceptor,
} from './interceptors';
import {
  type AnalyticsLogEntry,
  type ConsoleLogEntry,
  type BugBubbleConfig,
  type InspectorStore,
  type LogEntry,
  type LogLevel,
  type LogType,
  type NetworkLogEntry,
  type WebSocketLogEntry,
} from './types';
import { filterLogsBySearch } from './utils';

type StoreListener = () => void;

/**
 * BugBubbleDebugger - Main class for managing the in-app debugger
 * Follows singleton pattern - only one instance can exist
 * Contains all state management (logs, config, UI state) and listener pattern for React components
 */
export class BugBubbleDebugger {
  private static instance: BugBubbleDebugger | null = null;
  private networkInterceptor!: NetworkInterceptor;
  private webSocketInterceptor!: WebSocketInterceptor;
  private consoleInterceptor!: ConsoleInterceptor;
  private analyticsInterceptor!: AnalyticsInterceptor;
  private isInitialized: boolean = false;
  private config!: BugBubbleConfig;

  // State management (previously in separate store)
  private logs: LogEntry[] = [];
  private isVisible: boolean = false;
  private activeTab: LogType | null = null;
  private searchQuery: string = '';
  private listeners: Set<StoreListener> = new Set();

  private constructor() {
    // Private constructor for singleton pattern
    try {
      this.networkInterceptor = NetworkInterceptor.getInstance();
      this.webSocketInterceptor = WebSocketInterceptor.getInstance();
      this.consoleInterceptor = ConsoleInterceptor.getInstance();
      this.analyticsInterceptor = AnalyticsInterceptor.getInstance();

      // Register callbacks to avoid circular dependency
      this.networkInterceptor.setLogCallback(
        (
          method,
          url,
          statusCode,
          requestHeaders,
          responseHeaders,
          requestBody,
          responseBody,
          duration
        ) => {
          BugBubbleDebugger.safeExecute(() => {
            this.logNetwork(
              method,
              url,
              statusCode,
              requestHeaders,
              responseHeaders,
              requestBody,
              responseBody,
              duration
            );
          });
        }
      );

      this.webSocketInterceptor.setLogCallback((event, url, data) => {
        BugBubbleDebugger.safeExecute(() => {
          this.logWebSocket(event, url, data);
        });
      });

      this.consoleInterceptor.setLogCallback((level, ...args) => {
        BugBubbleDebugger.safeExecute(() => {
          this.logConsole(level, ...args);
        });
      });

      this.analyticsInterceptor.setLogCallback((eventName, properties) => {
        BugBubbleDebugger.safeExecute(() => {
          this.logAnalytics(eventName, properties);
        });
      });

      this.config = BugBubbleDebugger.getDefaultConfig();
    } catch (error) {
      this.config = BugBubbleDebugger.getDefaultConfig();
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): BugBubbleDebugger {
    if (!BugBubbleDebugger.instance) {
      BugBubbleDebugger.instance = new BugBubbleDebugger();
    }
    return BugBubbleDebugger.instance;
  }

  /**
   * Get default configuration
   */
  private static getDefaultConfig(): BugBubbleConfig {
    return {
      maxLogs: 1000,
      floatingButtonPosition: {
        top: 100,
        right: 20,
      },
      trackingOptions: {
        enabled: true,
        options: {
          analytics: true,
          network: true,
          websocket: true,
          console: true,
        },
      },
    };
  }

  /**
   * Safely execute a function with error handling
   */
  private static safeExecute<T>(fn: () => T, fallback?: T): T | undefined {
    try {
      return fn();
    } catch (error) {
      return fallback;
    }
  }

  /**
   * Log analytics event
   */
  public logAnalytics(
    eventName: string,
    properties?: Record<string, any>
  ): void {
    try {
      if (!eventName || typeof eventName !== 'string') {
        return;
      }

      // Skip logging if analytics tab is disabled
      if (!this.isTabEnabled('analytics')) {
        return;
      }

      const log: AnalyticsLogEntry = {
        id: this.generateId(),
        timestamp: Date.now(),
        type: 'analytics',
        level: 'info',
        message: eventName,
        eventName,
        properties,
        source: 'analytics',
      };
      this.addLog(log);
    } catch (error) {
      // Error handled silently
    }
  }

  /**
   * Log console message
   */
  public logConsole(level: LogLevel, ...args: any[]): void {
    try {
      if (!level || !args || args.length === 0) {
        return;
      }

      if (!this.isTabEnabled('console')) {
        return;
      }

      const log: ConsoleLogEntry = {
        id: this.generateId(),
        timestamp: Date.now(),
        type: 'console',
        level,
        message: args
          .map((arg) => {
            try {
              return typeof arg === 'object' && arg !== null
                ? JSON.stringify(arg, null, 2)
                : String(arg);
            } catch {
              return String(arg);
            }
          })
          .join(' '),
        args,
        source: 'console',
      };
      this.addLog(log);
    } catch (error) {
      // Error handled silently
    }
  }

  /**
   * Log network request
   */

  public logNetwork(
    method: string,
    url: string,
    statusCode?: number,
    requestHeaders?: Record<string, string>,
    responseHeaders?: Record<string, string>,
    requestBody?: any,
    responseBody?: any,
    duration?: number
  ): void {
    try {
      if (!method || !url) {
        return;
      }

      if (!this.isTabEnabled('network')) {
        return;
      }

      const log: NetworkLogEntry = {
        id: this.generateId(),
        timestamp: Date.now(),
        type: 'network',
        level: statusCode && statusCode >= 400 ? 'error' : 'info',
        message: `${method} ${url} ${statusCode ? `(${statusCode})` : ''}`,
        method,
        url,
        statusCode,
        requestHeaders,
        responseHeaders,
        requestBody,
        responseBody,
        duration,
        source: 'network',
      };
      this.addLog(log);
    } catch (error) {
      // Error handled silently
    }
  }

  /**
   * Log WebSocket event
   */
  public logWebSocket(
    event: 'open' | 'message' | 'close' | 'error',
    url?: string,
    data?: any
  ): void {
    try {
      if (!event) {
        return;
      }

      // Skip logging if websocket tab is disabled
      if (!this.isTabEnabled('websocket')) {
        return;
      }

      const log: WebSocketLogEntry = {
        id: this.generateId(),
        timestamp: Date.now(),
        type: 'websocket',
        level: event === 'error' ? 'error' : 'info',
        message: `${event}${url ? ` (${url})` : ''}`,
        event,
        url,
        data,
        source: 'websocket',
      };
      this.addLog(log);
    } catch (error) {
      // Silent fail - don't crash the app
    }
  }

  /**
   * Check if a log type is enabled
   */
  private isTabEnabled(tab: LogType): boolean {
    const trackingOptions = this.config.trackingOptions;

    if (!trackingOptions) {
      return true;
    }

    if (trackingOptions.enabled === false) {
      return false;
    }

    const options = trackingOptions.options || {};
    const optionKey = tab as keyof typeof options;

    return options[optionKey] !== false;
  }

  /**
   * Initialize the debugger instance
   * Called internally by static init() method
   *
   * @param config - Optional configuration
   */
  /**
   * Initialize the debugger - Internal use only, called by BugBubble component
   * @internal
   */
  public init(config?: Partial<BugBubbleConfig>): void {
    try {
      if (this.isInitialized) {
        return;
      }

      if (config) {
        // Merge config with proper handling of nested objects
        const mergedConfig = { ...this.config, ...config };

        if (config.trackingOptions) {
          mergedConfig.trackingOptions = {
            enabled:
              config.trackingOptions.enabled !== undefined
                ? config.trackingOptions.enabled
                : this.config.trackingOptions?.enabled ?? true,
            options: {
              ...this.config.trackingOptions?.options,
              ...(config.trackingOptions.options || {}),
            },
          };
        }

        this.config = mergedConfig;
      }

      const interceptors: { start: () => void; tab: LogType }[] = [
        { start: () => this.networkInterceptor.start(), tab: 'network' },
        { start: () => this.webSocketInterceptor.start(), tab: 'websocket' },
        { start: () => this.consoleInterceptor.start(), tab: 'console' },
        { start: () => this.analyticsInterceptor.start(), tab: 'analytics' },
      ];

      interceptors.forEach(({ start, tab }) => {
        if (this.isTabEnabled(tab)) {
          BugBubbleDebugger.safeExecute(start);
        }
      });

      this.isInitialized = true;
    } catch (error) {
      // Error handled silently
    }
  }

  /**
   * Generate unique log ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * Add log to store
   */
  public addLog(log: LogEntry): void {
    try {
      if (!this.isInitialized || !log) {
        return;
      }
      const newLogs = [log, ...this.logs].slice(0, this.config.maxLogs);
      this.logs = newLogs;
      this.notify();
    } catch (error) {
      // Error handled silently
    }
  }

  /**
   * Subscribe to state changes (for React components)
   */
  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state changes
   */
  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        // Error handled silently
      }
    });
  }

  /**
   * Get current state (for React components)
   */
  public getState(): InspectorStore {
    return {
      logs: this.logs,
      config: this.config,
      isVisible: this.isVisible,
      activeTab: this.activeTab,
      searchQuery: this.searchQuery,
    };
  }

  /**
   * Get enabled tabs (public method for UI components)
   */
  public getEnabledTabs(): LogType[] {
    const tabs: LogType[] = ['console', 'network', 'websocket', 'analytics'];
    return tabs.filter((tab) => this.isTabEnabled(tab));
  }

  /**
   * Clear logs by type or all logs
   */
  public clearLogs(type?: LogType): void {
    try {
      if (type) {
        this.logs = this.logs.filter((log) => log.type !== type);
      } else {
        this.logs = [];
      }
      this.notify();
    } catch (error) {
      // Error handled silently
    }
  }

  /**
   * Set modal visibility
   */
  public setVisible(visible: boolean): void {
    try {
      this.isVisible = visible;
      this.notify();
    } catch (error) {
      // Error handled silently
    }
  }

  /**
   * Set active tab
   */
  public setActiveTab(tab: LogType | null): void {
    try {
      this.activeTab = tab;
      this.notify();
    } catch (error) {
      // Error handled silently
    }
  }

  /**
   * Get logs by type with search filtering
   */
  public getLogsByType(type: LogType): LogEntry[] {
    try {
      return filterLogsBySearch(this.logs, type, this.searchQuery);
    } catch (error) {
      return [];
    }
  }

  /**
   * Set search query
   */
  public setSearchQuery(query: string): void {
    try {
      this.searchQuery = query;
      this.notify();
    } catch (error) {
      // Error handled silently
    }
  }

  /**
   * Clear search query
   */
  public clearSearch(): void {
    try {
      this.searchQuery = '';
      this.notify();
    } catch (error) {
      // Error handled silently
    }
  }
}
