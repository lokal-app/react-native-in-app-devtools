import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useInspectorStore } from '../hooks';
import { type LogEntry, type LogType } from '../types';
import { EmptyState } from './EmptyState';
import { LogEntryComponent } from './LogEntry';

interface LogListProps {
  type: LogType;
}

export const LogList: React.FC<LogListProps> = React.memo(({ type }) => {
  const { getLogsByType, clearLogs, searchQuery } = useInspectorStore();
  const logs = useMemo(() => getLogsByType(type), [getLogsByType, type]);

  const handleClear = useCallback(() => {
    clearLogs(type);
  }, [clearLogs, type]);

  const renderLogItem = useCallback(
    ({ item }: { item: LogEntry }) => <LogEntryComponent log={item} />,
    []
  );

  const renderEmpty = useMemo(
    () => <EmptyState type={type} hasSearchQuery={!!searchQuery.trim()} />,
    [type, searchQuery]
  );

  const keyExtractor = useCallback((item: LogEntry) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {type && typeof type === 'string' 
            ? `${type.charAt(0).toUpperCase()}${type.slice(1)} Logs (${logs.length})`
            : `Logs (${logs.length})`}
        </Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          activeOpacity={0.7}
        >
          <Text style={styles.clearText}>🗑 Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
      />
    </View>
  );
});

LogList.displayName = 'LogList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#FF3B30',
    marginLeft: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
});
