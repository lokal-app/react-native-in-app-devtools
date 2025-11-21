import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { HeadersTable } from './HeadersTable';

interface NetworkHeadersProps {
  headers?: Record<string, string>;
  title: string;
}

export const NetworkHeaders = memo<NetworkHeadersProps>(
  ({ headers, title }) => {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <HeadersTable headers={headers} />
      </View>
    );
  }
);

NetworkHeaders.displayName = 'NetworkHeaders';

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
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
});
