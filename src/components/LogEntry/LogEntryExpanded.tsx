import { memo } from 'react';

import {
  type AnalyticsLogEntry,
  type ConsoleLogEntry,
  type LogEntry,
  type NetworkLogEntry,
  type WebSocketLogEntry,
} from '../../types';
import { ErrorBoundary } from '../ErrorBoundary';
import {
  AnalyticsExpanded,
  ConsoleExpanded,
  DefaultExpanded,
  NetworkExpanded,
  WebSocketExpanded,
} from './expanded';

interface LogEntryExpandedProps {
  log: LogEntry;
}

export const LogEntryExpanded = memo<LogEntryExpandedProps>(({ log }) => {
  const renderContent = () => {
    try {
      switch (log.type) {
        case 'network':
          return <NetworkExpanded log={log as NetworkLogEntry} />;
        case 'analytics':
          return <AnalyticsExpanded log={log as AnalyticsLogEntry} />;
        case 'console':
          return <ConsoleExpanded log={log as ConsoleLogEntry} />;
        case 'websocket':
          return <WebSocketExpanded log={log as WebSocketLogEntry} />;
        default:
          return <DefaultExpanded log={log} />;
      }
    } catch (error) {
      // Fallback if switch fails
      return <DefaultExpanded log={log} />;
    }
  };

  return <ErrorBoundary>{renderContent()}</ErrorBoundary>;
});

LogEntryExpanded.displayName = 'LogEntryExpanded';
