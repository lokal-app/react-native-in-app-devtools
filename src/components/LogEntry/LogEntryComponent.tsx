import { memo, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ErrorBoundary } from '../ErrorBoundary';
import { safeString } from '../../utils';
import { type LogEntry } from '../../types';
import { LogEntryCollapsed } from './LogEntryCollapsed';
import { LogEntryExpanded } from './LogEntryExpanded';

interface LogEntryComponentProps {
  log: LogEntry;
}

export const LogEntryComponent = memo<LogEntryComponentProps>(({ log }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    try {
      setExpanded((prev) => !prev);
    } catch (error) {
      // Silently fail - don't crash the app
    }
  }, []);

  // Safely extract message and level
  const message = safeString(log?.message || '');
  const level = log?.level || 'info';

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <ErrorBoundary>
          <LogEntryCollapsed
            message={message}
            level={level}
            expanded={expanded}
            onToggle={handleToggle}
          />
        </ErrorBoundary>
        {expanded && (
          <ErrorBoundary>
            <LogEntryExpanded log={log} />
          </ErrorBoundary>
        )}
      </View>
    </ErrorBoundary>
  );
});

LogEntryComponent.displayName = 'LogEntryComponent';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
});
