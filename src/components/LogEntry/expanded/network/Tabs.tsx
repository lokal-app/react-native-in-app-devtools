import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { type NetworkLogEntry } from '../../../../types';
import {
  generateCurlCopy,
  generateRequestCopy,
  generateResponseCopy,
} from '../../../../utils';
import { CopyButton } from './CopyButton';

interface NetworkTabsProps {
  activeTab: 'request' | 'response' | 'curl';
  onTabChange: (tab: 'request' | 'response' | 'curl') => void;
  log: NetworkLogEntry;
}

export const NetworkTabs = memo<NetworkTabsProps>(
  ({ activeTab, onTabChange, log }) => {
    const renderTabButton = (
      tab: 'request' | 'response' | 'curl',
      label: string
    ) => (
      <TouchableOpacity
        style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
        onPress={() => onTabChange(tab)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.tabText, activeTab === tab && styles.activeTabText]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );

    const renderShareButtons = () => {
      if (activeTab === 'request') {
        return <CopyButton label="Share" data={generateRequestCopy(log)} />;
      }

      if (activeTab === 'response') {
        return <CopyButton label="Share" data={generateResponseCopy(log)} />;
      }

      if (activeTab === 'curl') {
        return <CopyButton label="Share" data={generateCurlCopy(log)} />;
      }

      return null;
    };

    return (
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          {renderTabButton('request', 'Request')}
          {renderTabButton('response', 'Response')}
          {renderTabButton('curl', 'Curl')}
        </View>
        <View style={styles.shareContainer}>{renderShareButtons()}</View>
      </View>
    );
  }
);

NetworkTabs.displayName = 'NetworkTabs';

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 6,
    padding: 2,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  shareContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
