import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { type AnalyticsLogEntry } from '../../../types';
import { formatDataForCopy, safeString } from '../../../utils';

interface AnalyticsExpandedProps {
  log: AnalyticsLogEntry;
}

export const AnalyticsExpanded = memo<AnalyticsExpandedProps>(({ log }) => {
  const eventName = safeString(log.eventName || 'N/A');

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Event Name</Text>
        </View>
        <Text style={styles.eventName}>{eventName}</Text>
      </View>

      {log.properties && Object.keys(log.properties).length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Properties</Text>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderKey}>Key</Text>
              <Text style={styles.tableHeaderValue}>Value</Text>
            </View>
            {Object.entries(log.properties).map(([key, value]) => (
              <View key={key} style={styles.tableRow}>
                <Text style={styles.tableKey}>{key}</Text>
                <Text style={styles.tableValue}>
                  {formatDataForCopy(value)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
});

AnalyticsExpanded.displayName = 'AnalyticsExpanded';

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
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    backgroundColor: '#F2F2F7',
    padding: 8,
    borderRadius: 4,
  },
  tableContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeaderKey: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  tableHeaderValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    flex: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tableKey: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    flex: 1,
    marginRight: 2,
  },
  tableValue: {
    fontSize: 12,
    color: '#000000',
    flex: 2,
    fontFamily: 'monospace',
  },
});
