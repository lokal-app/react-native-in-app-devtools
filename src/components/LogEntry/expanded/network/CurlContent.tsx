import { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { type NetworkLogEntry } from '../../../../types';
import { generateCurlCopy } from '../../../../utils';

interface CurlContentProps {
  log: NetworkLogEntry;
}

export const CurlContent = memo<CurlContentProps>(({ log }) => {
  const curlCommand = generateCurlCopy(log);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Curl Command</Text>
      </View>
      <ScrollView
        style={styles.curlContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.curlText}>{curlCommand}</Text>
      </ScrollView>
    </View>
  );
});

CurlContent.displayName = 'CurlContent';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  curlContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  curlText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#000000',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
});
