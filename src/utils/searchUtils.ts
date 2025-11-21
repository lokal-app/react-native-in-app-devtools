import { type LogEntry, type LogType } from '../types';

/**
 * Filters logs based on search query
 * @param logs - Array of logs to filter
 * @param type - Log type to filter by
 * @param searchQuery - Search query string
 * @returns Filtered array of logs
 */
export const filterLogsBySearch = (
  logs: LogEntry[],
  type: LogType,
  searchQuery: string
): LogEntry[] => {
  // First filter by type
  let filteredLogs = logs.filter((log) => log.type === type);

  // Apply search filter if query exists
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredLogs = filteredLogs.filter((log) => matchesSearchQuery(log, query));
  }

  return filteredLogs;
};

/**
 * Checks if a log entry matches the search query
 * @param log - Log entry to check
 * @param query - Search query (lowercase)
 * @returns True if log matches the query
 */
const matchesSearchQuery = (log: LogEntry, query: string): boolean => {
  // Search in message
  if (log.message && typeof log.message === 'string' && log.message.toLowerCase().includes(query)) {
    return true;
  }

  // Search in additional data (for console logs)
  if (log.type === 'console') {
    const consoleLog = log as any;
    if (consoleLog.args && Array.isArray(consoleLog.args)) {
      try {
        return consoleLog.args.some((arg: any) => {
          try {
            if (typeof arg === 'string') {
              return arg.toLowerCase().includes(query);
            }
            if (typeof arg === 'object' && arg !== null) {
              return JSON.stringify(arg).toLowerCase().includes(query);
            }
            return false;
          } catch {
            return false;
          }
        });
      } catch {
        return false;
      }
    }
  }

  // Search in network logs
  if (log.type === 'network') {
    const networkLog = log as any;
    try {
      return (
        networkLog.url?.toLowerCase().includes(query) ||
        networkLog.method?.toLowerCase().includes(query) ||
        (() => {
          try {
            return JSON.stringify(networkLog.requestBody || {})
              .toLowerCase()
              .includes(query);
          } catch {
            return false;
          }
        })() ||
        (() => {
          try {
            return JSON.stringify(networkLog.responseBody || {})
              .toLowerCase()
              .includes(query);
          } catch {
            return false;
          }
        })()
      );
    } catch {
      return false;
    }
  }

  // Search in analytics logs
  if (log.type === 'analytics') {
    const analyticsLog = log as any;
    try {
      return (
        analyticsLog.eventName?.toLowerCase().includes(query) ||
        (() => {
          try {
            return JSON.stringify(analyticsLog.properties || {})
              .toLowerCase()
              .includes(query);
          } catch {
            return false;
          }
        })()
      );
    } catch {
      return false;
    }
  }

  // Search in websocket logs
  if (log.type === 'websocket') {
    const websocketLog = log as any;
    try {
      return (
        websocketLog.url?.toLowerCase().includes(query) ||
        websocketLog.event?.toLowerCase().includes(query) ||
        (() => {
          try {
            return JSON.stringify(websocketLog.data || {})
              .toLowerCase()
              .includes(query);
          } catch {
            return false;
          }
        })()
      );
    } catch {
      return false;
    }
  }

  return false;
};
