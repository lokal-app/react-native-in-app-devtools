import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { type LogEntry } from '../../../types';

interface DefaultExpandedProps {
  log: LogEntry;
}

export const DefaultExpanded = memo<DefaultExpandedProps>(({ log }) => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Raw Data</Text>
        </View>
        <Text style={styles.codeText}>{JSON.stringify(log, null, 2)}</Text>
      </View>
    </View>
  );
});

DefaultExpanded.displayName = 'DefaultExpanded';

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
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#000000',
    backgroundColor: '#F2F2F7',
    padding: 8,
    borderRadius: 4,
    lineHeight: 16,
  },
});
