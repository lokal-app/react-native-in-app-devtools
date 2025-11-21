import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useInspectorStore } from '../hooks';
import { type LogType } from '../types';
import { LogList } from './LogList';
import { SearchBar } from './SearchBar';

const tabConfig = [
  { type: 'console' as LogType, label: 'Console' },
  { type: 'network' as LogType, label: 'Network' },
  { type: 'websocket' as LogType, label: 'WebSocket' },
  { type: 'analytics' as LogType, label: 'Analytics' },
];

export const DebuggerView: React.FC = () => {
  const {
    isVisible,
    setVisible,
    activeTab,
    setActiveTab,
    clearSearch,
    getEnabledTabs,
  } = useInspectorStore();

  const enabledTabs = useMemo(() => {
    return getEnabledTabs();
  }, [getEnabledTabs]);

  const visibleTabs = useMemo(
    () => tabConfig.filter((tab) => enabledTabs.includes(tab.type)),
    [enabledTabs]
  );

  useEffect(() => {
    if (isVisible && !activeTab && enabledTabs.length > 0) {
      const firstTab = enabledTabs[0];
      if (firstTab) {
        setActiveTab(firstTab);
      }
    }
  }, [isVisible, activeTab, enabledTabs, setActiveTab]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setActiveTab(null);
    clearSearch();
  }, [setVisible, setActiveTab, clearSearch]);

  const handleTabPress = useCallback(
    (type: LogType) => {
      setActiveTab(type);
      clearSearch();
    },
    [setActiveTab, clearSearch]
  );

  const renderTabButton = useCallback(
    (tabConfigItem: (typeof tabConfig)[0]) => {
      const isActive = activeTab === tabConfigItem.type;

      return (
        <TouchableOpacity
          key={tabConfigItem.type}
          style={[styles.tabButton, isActive && styles.activeTabButton]}
          onPress={() => handleTabPress(tabConfigItem.type)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
            {tabConfigItem.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [activeTab, handleTabPress]
  );

  const content = useMemo(() => {
    if (!activeTab) {
      return (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Inspector</Text>
          <Text style={styles.welcomeSubtitle}>
            Select a category to view logs
          </Text>
        </View>
      );
    }

    return <LogList type={activeTab} />;
  }, [activeTab]);

  // Calculate safe area insets manually
  const safeAreaTop = useMemo(() => {
    if (Platform.OS === 'ios') {
      // iOS devices with notch typically have ~44-50px top safe area
      // Older devices have ~20px for status bar
      // Using a conservative value that works for most devices
      return 44;
    }
    // Android: use StatusBar height
    return StatusBar.currentHeight || 0;
  }, []);

  const safeAreaBottom = useMemo(() => {
    return 34;
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            paddingTop: safeAreaTop,
            paddingBottom: safeAreaBottom,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Debug Inspector</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          {visibleTabs.map(renderTabButton)}
        </View>

        {activeTab && <SearchBar />}

        <View style={styles.content}>{content}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  closeButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 32,
    color: '#000000',
    lineHeight: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#E3F2FD',
  },
  tabLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
