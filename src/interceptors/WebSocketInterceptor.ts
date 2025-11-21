/**
 * WebSocketInterceptor - Intercepts WebSocket connections and logs events
 */
export class WebSocketInterceptor {
  private static instance: WebSocketInterceptor | null = null;
  private originalWebSocket: typeof global.WebSocket | null = null;
  private isIntercepting: boolean = false;
  private logCallback:
    | ((
        event: 'open' | 'message' | 'close' | 'error',
        url?: string,
        data?: any
      ) => void)
    | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): WebSocketInterceptor {
    if (!WebSocketInterceptor.instance) {
      WebSocketInterceptor.instance = new WebSocketInterceptor();
    }
    return WebSocketInterceptor.instance;
  }

  /**
   * Register callback for logging WebSocket events
   * Called by BugBubbleDebugger to avoid circular dependency
   * @internal
   */
  public setLogCallback(
    callback: (
      event: 'open' | 'message' | 'close' | 'error',
      url?: string,
      data?: any
    ) => void
  ): void {
    this.logCallback = callback;
  }

  /**
   * Start intercepting WebSocket connections
   */
  public start(): void {
    if (this.isIntercepting) {
      return;
    }

    if (!global.WebSocket) {
      return;
    }

    try {
      // Store original WebSocket
      this.originalWebSocket = global.WebSocket;

      // Create interceptor class
      const self = this;
      global.WebSocket = class extends this.originalWebSocket {
        private _url: string;

        constructor(url: string | URL, protocols?: string | string[]) {
          const urlString = typeof url === 'string' ? url : url.toString();
          super(urlString, protocols);
          this._url = urlString;

          this.addEventListener('open', () => {
            self.logCallback?.('open', this._url);
          });

          this.addEventListener('message', (event) => {
            let data: any;
            try {
              data = JSON.parse(event.data);
            } catch {
              data = event.data;
            }
            self.logCallback?.('message', this._url, data);
          });

          this.addEventListener('close', (event) => {
            self.logCallback?.('close', this._url, {
              code: event.code,
              reason: event.reason,
              wasClean: 'wasClean' in event ? event.wasClean : false,
            });
          });

          this.addEventListener('error', (event) => {
            self.logCallback?.('error', this._url, event);
          });
        }
      } as any;

      this.isIntercepting = true;
    } catch (e) {
      // Error handled silently
    }
  }

  /**
   * Stop intercepting WebSocket connections
   */
  public stop(): void {
    try {
      if (!this.isIntercepting) {
        return;
      }

      try {
        if (this.originalWebSocket) {
          global.WebSocket = this.originalWebSocket;
          this.originalWebSocket = null;
        }
      } catch (error) {
        // Continue cleanup
      }

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
