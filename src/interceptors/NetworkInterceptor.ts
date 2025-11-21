/**
 * NetworkInterceptor - Intercepts all network requests (fetch + XMLHttpRequest)
 * and logs them to the debugger
 */
export class NetworkInterceptor {
  private static instance: NetworkInterceptor | null = null;
  private originalFetch: typeof global.fetch | null = null;
  private originalXMLHttpRequest: typeof global.XMLHttpRequest | null = null;
  private isIntercepting: boolean = false;
  private logCallback:
    | ((
        method: string,
        url: string,
        statusCode?: number,
        requestHeaders?: Record<string, string>,
        responseHeaders?: Record<string, string>,
        requestBody?: any,
        responseBody?: any,
        duration?: number
      ) => void)
    | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): NetworkInterceptor {
    if (!NetworkInterceptor.instance) {
      NetworkInterceptor.instance = new NetworkInterceptor();
    }
    return NetworkInterceptor.instance;
  }

  /**
   * Register callback for logging network events
   * Called by BugBubbleDebugger to avoid circular dependency
   * @internal
   */
  public setLogCallback(
    callback: (
      method: string,
      url: string,
      statusCode?: number,
      requestHeaders?: Record<string, string>,
      responseHeaders?: Record<string, string>,
      requestBody?: any,
      responseBody?: any,
      duration?: number
    ) => void
  ): void {
    this.logCallback = callback;
  }

  /**
   * Start intercepting network requests
   */
  public start(): void {
    if (this.isIntercepting) {
      return;
    }

    try {
      // Store original functions
      this.originalFetch = global.fetch;
      this.originalXMLHttpRequest = global.XMLHttpRequest;

      // Set up interceptors
      global.fetch = this.createFetchInterceptor(this.originalFetch);
      global.XMLHttpRequest = this.createXMLHttpRequestInterceptor(
        this.originalXMLHttpRequest
      );

      this.isIntercepting = true;
    } catch (e) {
      // Error handled silently
    }
  }

  /**
   * Stop intercepting network requests
   */
  public stop(): void {
    try {
      if (!this.isIntercepting) {
        return;
      }

      try {
        if (this.originalFetch) {
          global.fetch = this.originalFetch;
          this.originalFetch = null;
        }
      } catch (error) {
        // Continue cleanup
      }

      try {
        if (this.originalXMLHttpRequest) {
          global.XMLHttpRequest = this.originalXMLHttpRequest;
          this.originalXMLHttpRequest = null;
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

  /**
   * Safely extract headers from a Headers object
   * Handles React Native's Headers structure which may differ from web
   */
  private extractHeaders(headers: Headers): Record<string, string> {
    try {
      const result: Record<string, any> = {};

      // Try standard approach first
      if (headers.entries) {
        for (const [key, value] of headers.entries()) {
          result[key] = value;
        }
        return result as Record<string, string>;
      }

      // Fallback: try to access headers as object (React Native specific)
      if (typeof headers === 'object' && headers !== null) {
        // Check if it has a map property (React Native Headers structure)
        const headersObj = headers as any;
        if (headersObj.map && typeof headersObj.map === 'object') {
          for (const key in headersObj.map) {
            const value = headersObj.map[key];
            // Ensure value is a string
            result[key] = typeof value === 'string' ? value : String(value);
          }
          return result as Record<string, string>;
        }

        // Try direct iteration
        for (const key in headersObj) {
          if (key !== 'map' && key !== 'entries' && key !== 'forEach') {
            const value = headersObj[key];
            result[key] = typeof value === 'string' ? value : String(value);
          }
        }
      }

      return result as Record<string, string>;
    } catch (error) {
      // If all else fails, return empty object
      return {};
    }
  }

  /**
   * Log network request to debugger
   */

  private logNetworkRequest(
    method: string,
    url: string,
    status: number | undefined,
    requestHeaders: Record<string, string>,
    responseHeaders: Record<string, string>,
    requestBody: any,
    responseBody: any,
    duration: number
  ): void {
    if (this.logCallback) {
      this.logCallback(
        method,
        url,
        status,
        requestHeaders,
        responseHeaders,
        requestBody,
        responseBody,
        duration
      );
    }
  }

  /**
   * Create fetch interceptor
   */
  private createFetchInterceptor(
    originalFetch: typeof global.fetch
  ): typeof global.fetch {
    return async (input: RequestInfo | URL, init?: RequestInit) => {
      const startTime = performance.now();
      const url = typeof input === 'string' ? input : input.toString();
      const method = (init?.method || 'GET').toUpperCase();

      try {
        const response = await originalFetch(input, init);
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        // Clone response to read body without consuming it
        const responseClone = response.clone();
        let responseBody;
        try {
          responseBody = await responseClone.json();
        } catch {
          try {
            responseBody = await responseClone.text();
          } catch {
            responseBody = 'Unable to read response body';
          }
        }

        setTimeout(() => {
          // Extract request headers - handle both Headers object and plain object
          let requestHeaders: Record<string, string> = {};
          if (init?.headers) {
            if (init.headers instanceof Headers) {
              requestHeaders = this.extractHeaders(init.headers);
            } else if (typeof init.headers === 'object') {
              requestHeaders = init.headers as Record<string, string>;
            }
          }

          this.logNetworkRequest(
            method,
            url,
            response.status,
            requestHeaders,
            this.extractHeaders(response.headers),
            init?.body,
            responseBody,
            duration
          );
        }, 0);

        return response;
      } catch (error: any) {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        setTimeout(() => {
          // Extract request headers - handle both Headers object and plain object
          let requestHeaders: Record<string, string> = {};
          if (init?.headers) {
            if (init.headers instanceof Headers) {
              requestHeaders = this.extractHeaders(init.headers);
            } else if (typeof init.headers === 'object') {
              requestHeaders = init.headers as Record<string, string>;
            }
          }

          this.logNetworkRequest(
            method,
            url,
            undefined,
            requestHeaders,
            {},
            init?.body,
            error.message,
            duration
          );
        }, 0);

        throw error;
      }
    };
  }

  /**
   * Create XMLHttpRequest interceptor
   */
  private createXMLHttpRequestInterceptor(
    originalXMLHttpRequest: typeof global.XMLHttpRequest
  ): typeof global.XMLHttpRequest {
    return class extends originalXMLHttpRequest {
      private _startTime: number = 0;
      private _method: string = 'GET';
      private _url: string = '';
      private _requestHeaders: Record<string, string> = {};
      private _requestBody: any = null;

      open(method: string, url: string | URL, ...args: any[]) {
        this._startTime = performance.now();
        this._method = method.toUpperCase();
        this._url = url.toString();
        return super.open(method, url.toString(), ...args);
      }

      setRequestHeader(name: string, value: string) {
        this._requestHeaders[name] = value;
        return super.setRequestHeader(name, value);
      }

      send(
        body?:
          | Document
          | Blob
          | ArrayBufferView
          | ArrayBuffer
          | FormData
          | URLSearchParams
          | string
          | null
      ) {
        this._requestBody = body;

        const originalOnload = this.onload;
        this.onload = (event) => {
          const endTime = performance.now();
          const duration = Math.round(endTime - this._startTime);

          let responseBody;
          try {
            responseBody = this.responseText;
          } catch {
            responseBody = 'Unable to read response body';
          }

          setTimeout(() => {
            try {
              const interceptor = NetworkInterceptor.getInstance();
              let responseHeaders: Record<string, string> = {};
              try {
                const headersString = this.getAllResponseHeaders();
                if (headersString && typeof headersString === 'string') {
                  responseHeaders = headersString
                    .split('\r\n')
                    .reduce((headers: Record<string, string>, header) => {
                      const [name, value] = header.split(': ');
                      if (name && value) {
                        headers[name] = value;
                      }
                      return headers;
                    }, {});
                }
              } catch {
                // If header parsing fails, use empty object
                responseHeaders = {};
              }

              interceptor.logNetworkRequest(
                this._method,
                this._url,
                this.status,
                this._requestHeaders,
                responseHeaders,
                this._requestBody,
                responseBody,
                duration
              );
            } catch {
              // Silently fail - don't crash the app
            }
          }, 0);

          if (originalOnload) {
            originalOnload.call(this, event);
          }
        };

        const originalOnerror = this.onerror;
        this.onerror = (event) => {
          const endTime = performance.now();
          const duration = Math.round(endTime - this._startTime);

          setTimeout(() => {
            try {
              const interceptor = NetworkInterceptor.getInstance();
              interceptor.logNetworkRequest(
                this._method,
                this._url,
                undefined,
                this._requestHeaders,
                {},
                this._requestBody,
                'Network Error',
                duration
              );
            } catch {
              // Silently fail - don't crash the app
            }
          }, 0);

          if (originalOnerror) {
            try {
              originalOnerror.call(this, event);
            } catch {
              // Silently fail - don't crash the app
            }
          }
        };

        return super.send(body);
      }
    };
  }
}
