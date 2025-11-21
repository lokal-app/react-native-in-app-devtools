import { useEffect, useState } from 'react';

import { BugBubbleDebugger } from './BugBubbleDebugger';
import type { InspectorStore, LogEntry, LogType } from './types';

/**
 * React hook to subscribe to BugBubbleDebugger state changes
 * Uses the singleton BugBubbleDebugger instance for state management
 */
export function useInspectorStore(): InspectorStore & {
  addLog: (log: LogEntry) => void;
  clearLogs: (type?: LogType) => void;
  setVisible: (visible: boolean) => void;
  setActiveTab: (tab: LogType | null) => void;
  getLogsByType: (type: LogType) => LogEntry[];
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  getEnabledTabs: () => LogType[];
} {
  const instance = BugBubbleDebugger.getInstance();
  const [state, setState] = useState(() => instance.getState());

  useEffect(() => {
    const unsubscribe = instance.subscribe(() => {
      setState(instance.getState());
    });

    return unsubscribe;
  }, [instance]);

  return {
    ...state,
    addLog: (log: LogEntry) => instance.addLog(log),
    clearLogs: (type?: LogType) => instance.clearLogs(type),
    setVisible: (visible: boolean) => instance.setVisible(visible),
    setActiveTab: (tab: LogType | null) => instance.setActiveTab(tab),
    getLogsByType: (type: LogType) => instance.getLogsByType(type),
    setSearchQuery: (query: string) => instance.setSearchQuery(query),
    clearSearch: () => instance.clearSearch(),
    getEnabledTabs: () => instance.getEnabledTabs(),
  };
}
