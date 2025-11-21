import { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface HeadersTableProps {
  headers?: Record<string, any>;
}

/**
 * Converts a header value to a string representation
 * Handles objects, arrays, null, undefined, and other types
 */
const formatHeaderValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object') {
    // Handle arrays
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    // Handle objects - try to stringify
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
};

export const HeadersTable = memo<HeadersTableProps>(({ headers }) => {
  if (!headers || Object.keys(headers).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No headers</Text>
      </View>
    );
  }

  const headerEntries = Object.entries(headers);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Headers</Text>
      </View>
      <ScrollView
        style={styles.tableContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderKey}>Key</Text>
          <Text style={styles.tableHeaderValue}>Value</Text>
        </View>
        {headerEntries.map(([key, value], index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableKey}>{key}</Text>
            <Text style={styles.tableValue}>{formatHeaderValue(value)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
});

HeadersTable.displayName = 'HeadersTable';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  tableContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
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
    fontFamily: 'monospace',
    marginRight: 2,
  },
  tableValue: {
    fontSize: 12,
    color: '#000000',
    flex: 2,
    fontFamily: 'monospace',
  },
  emptyContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
});
