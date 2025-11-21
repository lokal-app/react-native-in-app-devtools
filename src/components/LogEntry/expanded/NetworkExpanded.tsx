import { memo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { type NetworkLogEntry } from '../../../types';
import {
  CurlContent,
  NetworkRequestContent,
  NetworkResponseContent,
  NetworkSummary,
  NetworkTabs,
} from './network';

interface NetworkExpandedProps {
  log: NetworkLogEntry;
}

export const NetworkExpanded = memo<NetworkExpandedProps>(({ log }) => {
  const [activeTab, setActiveTab] = useState<'request' | 'response' | 'curl'>(
    'request'
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'request':
        return <NetworkRequestContent log={log} />;
      case 'response':
        return <NetworkResponseContent log={log} />;
      case 'curl':
        return <CurlContent log={log} />;
      default:
        return <NetworkRequestContent log={log} />;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <NetworkSummary log={log} />
      <NetworkTabs activeTab={activeTab} onTabChange={setActiveTab} log={log} />
      {renderContent()}
    </ScrollView>
  );
});

NetworkExpanded.displayName = 'NetworkExpanded';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
