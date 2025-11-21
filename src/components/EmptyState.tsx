import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { type LogType } from '../types';

interface EmptyStateProps {
  type: LogType;
  hasSearchQuery?: boolean;
}

const getEmptyStateConfig = (type: LogType, hasSearchQuery: boolean) => {
  const configs = {
    analytics: {
      title: hasSearchQuery
        ? 'No matching analytics events'
        : 'No analytics events yet',
      description: hasSearchQuery
        ? 'Try adjusting your search terms'
        : 'Analytics events will appear here when tracked',
    },
    network: {
      title: hasSearchQuery
        ? 'No matching network requests'
        : 'No network requests yet',
      description: hasSearchQuery
        ? 'Try adjusting your search terms'
        : 'Network requests will appear here when made',
    },
    websocket: {
      title: hasSearchQuery
        ? 'No matching WebSocket events'
        : 'No WebSocket events yet',
      description: hasSearchQuery
        ? 'Try adjusting your search terms'
        : 'WebSocket events will appear here when connected',
    },
    console: {
      title: hasSearchQuery
        ? 'No matching console logs'
        : 'No console logs yet',
      description: hasSearchQuery
        ? 'Try adjusting your search terms'
        : 'Console logs will appear here when logged',
    },
  };

  return configs[type];
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  hasSearchQuery = false,
}) => {
  const config = getEmptyStateConfig(type, hasSearchQuery);

  // Safety check - should never happen, but prevents crashes
  if (!config) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No logs available</Text>
        <Text style={styles.description}>Please try again later</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.description}>{config.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});
