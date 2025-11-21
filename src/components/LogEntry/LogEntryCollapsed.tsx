import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { type LogLevel } from '../../types';

interface LogEntryCollapsedProps {
  message: string;
  level: LogLevel;
  expanded: boolean;
  onToggle: () => void;
}

const getLevelColor = (level: LogLevel): string => {
  switch (level) {
    case 'error':
      return '#FF3B30';
    case 'warn':
      return '#FF9500';
    case 'info':
      return '#007AFF';
    case 'debug':
      return '#8E8E93';
    default:
      return '#8E8E93';
  }
};

export const LogEntryCollapsed = memo<LogEntryCollapsedProps>(
  ({ message, level, expanded, onToggle }) => {
    const levelColor = getLevelColor(level);

    return (
      <TouchableOpacity
        style={styles.header}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View
            style={[styles.levelIndicator, { backgroundColor: levelColor }]}
          />
          <Text style={styles.message} numberOfLines={1}>
            {message}
          </Text>
        </View>
        <Text style={styles.caret}>{expanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>
    );
  }
);

LogEntryCollapsed.displayName = 'LogEntryCollapsed';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  levelIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  message: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  caret: {
    fontSize: 12,
    color: '#8E8E93',
  },
});
