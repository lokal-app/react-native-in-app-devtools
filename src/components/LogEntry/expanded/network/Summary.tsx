import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { type NetworkLogEntry } from '../../../../types';
import { safeString } from '../../../../utils';

interface NetworkSummaryProps {
  log: NetworkLogEntry;
}

const formatDuration = (duration?: number): string => {
  if (duration === undefined || duration === null) return 'N/A';
  try {
    return `${duration.toFixed(2)}ms`;
  } catch {
    return 'N/A';
  }
};

export const NetworkSummary = memo<NetworkSummaryProps>(({ log }) => {
  const renderStatusBadge = () => {
    if (log.statusCode === undefined || log.statusCode === null) return null;

    const statusCode =
      typeof log.statusCode === 'number'
        ? log.statusCode
        : Number(log.statusCode);
    if (isNaN(statusCode)) return null;

    const isSuccess = statusCode >= 200 && statusCode < 300;
    const isError = statusCode >= 400;

    return (
      <View
        style={[
          styles.statusBadge,
          isSuccess && styles.successBadge,
          isError && styles.errorBadge,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            isSuccess && styles.successText,
            isError && styles.errorText,
          ]}
        >
          {statusCode}
        </Text>
      </View>
    );
  };

  const method = safeString(log.method || 'N/A');

  return (
    <View style={styles.summaryContainer}>
      <View style={styles.methodContainer}>
        <Text style={styles.methodText}>{method}</Text>
      </View>
      {renderStatusBadge()}
      <View style={styles.durationContainer}>
        <Text style={styles.durationText}>{formatDuration(log.duration)}</Text>
      </View>
    </View>
  );
});

NetworkSummary.displayName = 'NetworkSummary';

const styles = StyleSheet.create({
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  methodContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  methodText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#F2F2F7',
  },
  successBadge: {
    backgroundColor: '#D4F7D4',
  },
  errorBadge: {
    backgroundColor: '#FFE5E5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  successText: {
    color: '#34C759',
  },
  errorText: {
    color: '#FF3B30',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});
