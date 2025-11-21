/**
 * ConsoleInterceptor - Intercepts console logs and forwards them to debugger
 */
export class ConsoleInterceptor {
  private static instance: ConsoleInterceptor | null = null;
  private originalConsole: {
    log?: typeof console.log;
    debug?: typeof console.debug;
    info?: typeof console.info;
    warn?: typeof console.warn;
    error?: typeof console.error;
  } = {};
  private isIntercepting: boolean = false;
  private logCallback:
    | ((level: 'info' | 'debug' | 'warn' | 'error', ...args: any[]) => void)
    | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ConsoleInterceptor {
    if (!ConsoleInterceptor.instance) {
      ConsoleInterceptor.instance = new ConsoleInterceptor();
    }
    return ConsoleInterceptor.instance;
  }

  /**
   * Register callback for logging console events
   * Called by BugBubbleDebugger to avoid circular dependency
   * @internal
   */
  public setLogCallback(
    callback: (
      level: 'info' | 'debug' | 'warn' | 'error',
      ...args: any[]
    ) => void
  ): void {
    this.logCallback = callback;
  }

  /**
   * Start intercepting console logs
   */
  public start(): void {
    if (this.isIntercepting) {
      return;
    }

    try {
      // Store original console methods
      this.originalConsole.log = console.log;
      this.originalConsole.debug = console.debug;
      this.originalConsole.info = console.info;
      this.originalConsole.warn = console.warn;
      this.originalConsole.error = console.error;

      // Override console methods
      const self = this;
      console.log = function (...args: any[]) {
        self.originalConsole.log?.apply(console, args);
        self.logCallback?.('info', ...args);
      };

      console.debug = function (...args: any[]) {
        self.originalConsole.debug?.apply(console, args);
        self.logCallback?.('debug', ...args);
      };

      console.info = function (...args: any[]) {
        self.originalConsole.info?.apply(console, args);
        self.logCallback?.('info', ...args);
      };

      console.warn = function (...args: any[]) {
        self.originalConsole.warn?.apply(console, args);
        self.logCallback?.('warn', ...args);
      };

      console.error = function (...args: any[]) {
        self.originalConsole.error?.apply(console, args);
        self.logCallback?.('error', ...args);
      };

      this.isIntercepting = true;
    } catch (e) {
      // Error handled silently
    }
  }

  /**
   * Stop intercepting console logs
   */
  public stop(): void {
    try {
      if (!this.isIntercepting) {
        return;
      }

      try {
        if (this.originalConsole.log) {
          console.log = this.originalConsole.log;
        }
      } catch (error) {
        // Continue cleanup
      }

      try {
        if (this.originalConsole.debug) {
          console.debug = this.originalConsole.debug;
        }
      } catch (error) {
        // Continue cleanup
      }

      try {
        if (this.originalConsole.info) {
          console.info = this.originalConsole.info;
        }
      } catch (error) {
        // Continue cleanup
      }

      try {
        if (this.originalConsole.warn) {
          console.warn = this.originalConsole.warn;
        }
      } catch (error) {
        // Continue cleanup
      }

      try {
        if (this.originalConsole.error) {
          console.error = this.originalConsole.error;
        }
      } catch (error) {
        // Continue cleanup
      }

      this.originalConsole = {};
      this.isIntercepting = false;
    } catch (error) {
      this.isIntercepting = false;
    }
  }

  /**
   * Check if currently intercepting
   */
  public getIsIntercepting(): boolean {
    return this.isIntercepting;
  }
}
