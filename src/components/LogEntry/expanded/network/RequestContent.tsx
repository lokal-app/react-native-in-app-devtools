import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { type NetworkLogEntry } from '../../../../types';
import { NetworkHeaders } from './Headers';
import { NetworkPayload } from './Payload';
import { NetworkUrl } from './Url';

interface NetworkRequestContentProps {
  log: NetworkLogEntry;
}

export const NetworkRequestContent = memo<NetworkRequestContentProps>(
  ({ log }) => {
    return (
      <View style={styles.contentContainer}>
        <NetworkUrl url={log.url} />
        <NetworkHeaders headers={log.requestHeaders} title="Request Headers" />
        <NetworkPayload payload={log.requestBody} title="Request Payload" />
      </View>
    );
  }
);

NetworkRequestContent.displayName = 'NetworkRequestContent';

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
