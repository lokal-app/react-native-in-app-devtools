/**
 * AnalyticsInterceptor - Intercepts analytics events and forwards them to debugger
 * This is a wrapper that can be used to intercept analytics calls
 */
export class AnalyticsInterceptor {
  private static instance: AnalyticsInterceptor | null = null;
  private isIntercepting: boolean = false;
  private logCallback:
    | ((eventName: string, properties?: Record<string, any>) => void)
    | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AnalyticsInterceptor {
    if (!AnalyticsInterceptor.instance) {
      AnalyticsInterceptor.instance = new AnalyticsInterceptor();
    }
    return AnalyticsInterceptor.instance;
  }

  /**
   * Register callback for logging analytics events
   * Called by BugBubbleDebugger to avoid circular dependency
   * @internal
   */
  public setLogCallback(
    callback: (eventName: string, properties?: Record<string, any>) => void
  ): void {
    this.logCallback = callback;
  }

  /**
   * Start intercepting analytics events
   * Analytics events are logged via logAnalytics() method calls
   */
  public start(): void {
    if (this.isIntercepting) {
      return;
    }
    this.isIntercepting = true;
  }

  /**
   * Stop intercepting analytics events
   */
  public stop(): void {
    this.isIntercepting = false;
  }

  /**
   * Check if currently intercepting
   */
  public getIsIntercepting(): boolean {
    return this.isIntercepting;
  }

  /**
   * Log analytics event directly (for manual logging)
   */
  public logAnalytics(
    eventName: string,
    properties?: Record<string, any>
  ): void {
    if (this.logCallback) {
      this.logCallback(eventName, properties);
    }
  }
}
