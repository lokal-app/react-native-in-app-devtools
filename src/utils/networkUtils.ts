import { type NetworkLogEntry } from '../types';
import { safeString } from './formatUtils';

/**
 * Generates a formatted request string for copying
 */
export const generateRequestCopy = (log: NetworkLogEntry): string => {
  const lines: string[] = [];

  const method = safeString(log.method || 'GET');
  const url = safeString(log.url || '');
  lines.push(`${method} ${url} HTTP/1.1`);

  if (log.requestHeaders && Object.keys(log.requestHeaders).length > 0) {
    Object.entries(log.requestHeaders).forEach(([key, value]) => {
      const headerValue = safeString(value);
      lines.push(`${safeString(key)}: ${headerValue}`);
    });
  }

  lines.push('');

  if (log.requestBody) {
    if (typeof log.requestBody === 'string') {
      lines.push(log.requestBody);
    } else {
      try {
        lines.push(JSON.stringify(log.requestBody, null, 2));
      } catch (error) {
        lines.push('[Unable to serialize request body]');
      }
    }
  }
  return lines.join('\n');
};

/**
 * Generates a formatted response string for copying
 */
export const generateResponseCopy = (log: NetworkLogEntry): string => {
  const lines: string[] = [];

  // Status line
  const statusText = getStatusText(log.statusCode);
  lines.push(`HTTP/1.1 ${log.statusCode} ${statusText}`);

  // Headers
  if (log.responseHeaders && Object.keys(log.responseHeaders).length > 0) {
    Object.entries(log.responseHeaders).forEach(([key, value]) => {
      const headerValue = safeString(value);
      lines.push(`${safeString(key)}: ${headerValue}`);
    });
  }

  // Empty line before body
  lines.push('');

  // Response body
  if (log.responseBody) {
    if (typeof log.responseBody === 'string') {
      lines.push(log.responseBody);
    } else {
      try {
        lines.push(JSON.stringify(log.responseBody, null, 2));
      } catch (error) {
        lines.push('[Unable to serialize response body]');
      }
    }
  }

  return lines.join('\n');
};

/**
 * Generates a curl command string for copying
 */
export const generateCurlCopy = (log: NetworkLogEntry): string => {
  const parts: string[] = ['curl'];

  // Method
  if (log.method && log.method.toUpperCase() !== 'GET') {
    parts.push(`-X ${log.method.toUpperCase()}`);
  }

  // Headers
  if (log.requestHeaders && Object.keys(log.requestHeaders).length > 0) {
    Object.entries(log.requestHeaders).forEach(([key, value]) => {
      try {
        const headerValue = safeString(value);
        const escapedValue = headerValue.replace(/"/g, '\\"');
        parts.push(`-H "${safeString(key)}: ${escapedValue}"`);
      } catch {
        // Skip header if it can't be converted
      }
    });
  }

  // Request body
  if (log.requestBody) {
    try {
      let bodyData: string;
      if (typeof log.requestBody === 'string') {
        bodyData = log.requestBody;
      } else {
        bodyData = JSON.stringify(log.requestBody);
      }
      const escapedBody = bodyData.replace(/'/g, "'\\''");
      parts.push(`-d '${escapedBody}'`);
    } catch {
      // Skip body if it can't be serialized
    }
  }

  // URL (always last)
  if (log.url) {
    try {
      const urlString = safeString(log.url);
      const escapedUrl = urlString.replace(/"/g, '\\"');
      parts.push(`"${escapedUrl}"`);
    } catch {
      // Skip URL if it can't be converted
    }
  }

  return parts.join(' \\\n  ');
};

/**
 * Gets HTTP status text for a given status code
 */
const getStatusText = (statusCode?: number): string => {
  if (!statusCode) return 'Unknown';

  const statusTexts: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  };

  return statusTexts[statusCode] || 'Unknown';
};
