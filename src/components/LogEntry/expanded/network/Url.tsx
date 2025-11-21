import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { safeString } from '../../../../utils';

interface NetworkUrlProps {
  url?: string | any;
}

export const NetworkUrl = memo<NetworkUrlProps>(({ url }) => {
  if (!url) return null;

  const urlString = safeString(url);
  if (!urlString) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>URL</Text>
      </View>
      <Text style={styles.urlText}>{urlString}</Text>
    </View>
  );
});

NetworkUrl.displayName = 'NetworkUrl';

const styles = StyleSheet.create({
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
  urlText: {
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'monospace',
    backgroundColor: '#F2F2F7',
    padding: 8,
    borderRadius: 4,
  },
});
