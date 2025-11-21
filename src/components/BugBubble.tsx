import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { BugBubbleDebugger } from '../BugBubbleDebugger';
import { DebuggerView } from './DebuggerView';
import { ErrorBoundary } from './ErrorBoundary';
import { FloatingButton } from './FloatingButton';

import type { BugBubbleConfig } from '../types';

/**
 * BugBubble - Root component that renders debugger UI
 * This component should be added at the root level of your app
 */
export interface BugBubbleProps {
  config?: Partial<BugBubbleConfig>;
}

export const BugBubble: React.FC<BugBubbleProps> = ({ config }) => {
  useEffect(() => {
    try {
      BugBubbleDebugger.getInstance().init(config);
    } catch (error) {
      // Silently fail - don't crash the app if debugger initialization fails
    }
  }, [config]);

  return (
    <ErrorBoundary>
      <View style={styles.container} pointerEvents="box-none">
        <ErrorBoundary>
          <FloatingButton />
        </ErrorBoundary>
        <ErrorBoundary>
          <DebuggerView />
        </ErrorBoundary>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
});

