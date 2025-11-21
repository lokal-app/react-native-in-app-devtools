import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { type WebSocketLogEntry } from '../../../types';
import { formatDataForCopy } from '../../../utils';

interface WebSocketExpandedProps {
  log: WebSocketLogEntry;
}

const getEventColor = (event: string): string => {
  switch (event) {
    case 'open':
      return '#34C759';
    case 'message':
      return '#007AFF';
    case 'close':
      return '#8E8E93';
    case 'error':
      return '#FF3B30';
    default:
      return '#8E8E93';
  }
};

export const WebSocketExpanded = memo<WebSocketExpandedProps>(({ log }) => {
  const eventColor = getEventColor(log.event || 'unknown');
  const eventText = log.event && typeof log.event === 'string' 
    ? log.event.toUpperCase() 
    : 'UNKNOWN';

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Event</Text>
        </View>
        <View style={[styles.eventBadge, { backgroundColor: eventColor }]}>
          <Text style={styles.eventText}>{eventText}</Text>
        </View>
      </View>

      {log.url && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>URL</Text>
          </View>
          <Text style={styles.urlText}>{log.url}</Text>
        </View>
      )}

      {log.data && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Data</Text>
          </View>
          <Text style={styles.codeText}>{formatDataForCopy(log.data)}</Text>
        </View>
      )}
    </View>
  );
});

WebSocketExpanded.displayName = 'WebSocketExpanded';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  eventBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  eventText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  urlText: {
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'monospace',
    backgroundColor: '#F2F2F7',
    padding: 8,
    borderRadius: 4,
  },
  codeText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#000000',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 6,
    lineHeight: 20,
    letterSpacing: 0.2,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
});
