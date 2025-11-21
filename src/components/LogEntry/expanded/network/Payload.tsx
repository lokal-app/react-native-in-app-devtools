import { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { formatDataForCopy, safeString } from '../../../../utils';

interface NetworkPayloadProps {
  payload?: any;
  title: string;
}

export const NetworkPayload = memo<NetworkPayloadProps>(
  ({ payload, title }) => {
    if (payload === null || payload === undefined) return null;

    let formattedPayload: string;
    try {
      formattedPayload = formatDataForCopy(payload);
    } catch (error) {
      // Fallback to safe string conversion if formatting fails
      formattedPayload = safeString(payload);
    }

    if (!formattedPayload) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{safeString(title)}</Text>
        </View>
        <ScrollView
          style={styles.payloadContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.codeText}>{formattedPayload}</Text>
        </ScrollView>
      </View>
    );
  }
);

NetworkPayload.displayName = 'NetworkPayload';

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
  payloadContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  codeText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#000000',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
});
