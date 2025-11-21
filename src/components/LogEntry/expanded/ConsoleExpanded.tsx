import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { type ConsoleLogEntry } from '../../../types';
import { formatData } from '../../../utils';

interface ConsoleExpandedProps {
  log: ConsoleLogEntry;
}

export const ConsoleExpanded = memo<ConsoleExpandedProps>(({ log }) => {
  const renderData = () => {
    if (!log.args || log.args.length === 0) {
      return <Text style={styles.noDataText}>No additional data</Text>;
    }

    return log.args.map((arg, index) => {
      const { text, isCode } = formatData(arg);

      return (
        <Text key={index} style={isCode ? styles.codeText : styles.dataText}>
          {text}
        </Text>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Data</Text>
        </View>
        <View style={styles.dataContainer}>{renderData()}</View>
      </View>
    </View>
  );
});

ConsoleExpanded.displayName = 'ConsoleExpanded';

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
  dataContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dataText: {
    fontSize: 13,
    color: '#000000',
    fontFamily: 'monospace',
    marginBottom: 6,
    lineHeight: 18,
  },
  codeText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#000000',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 4,
    lineHeight: 20,
    letterSpacing: 0.2,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  noDataText: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
});
