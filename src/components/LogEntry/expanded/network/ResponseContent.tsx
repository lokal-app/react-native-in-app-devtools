import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { type NetworkLogEntry } from '../../../../types';
import { NetworkHeaders } from './Headers';
import { NetworkPayload } from './Payload';

interface NetworkResponseContentProps {
  log: NetworkLogEntry;
}

export const NetworkResponseContent = memo<NetworkResponseContentProps>(
  ({ log }) => {
    return (
      <View style={styles.contentContainer}>
        <NetworkHeaders
          headers={log.responseHeaders}
          title="Response Headers"
        />
        <NetworkPayload payload={log.responseBody} title="Response Payload" />
      </View>
    );
  }
);

NetworkResponseContent.displayName = 'NetworkResponseContent';

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
