import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BugBubbleLogger } from '@lokal-dev/react-native-bugbubble';

export function ExampleScreen() {
  const [ws, setWs] = useState<WebSocket | null>(null);

  // ========== Analytics Examples ==========
  const handleAnalyticsEvents = () => {
    // Manual analytics logging
    BugBubbleLogger.logAnalytics('button_clicked', {
      buttonId: 'demo_button',
      timestamp: Date.now(),
      userId: 'user_123',
    });

    BugBubbleLogger.logAnalytics('screen_view', {
      screenName: 'Demo Screen',
      screenClass: 'Demo',
    });
  };

  // ========== Network Examples ==========
  const handleFetchRequest = async () => {
    try {
      // This will be automatically intercepted
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'demo-value',
          },
        }
      );
      const data = await response.json();
      console.log('Fetch response:', data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handlePostRequest = async () => {
    try {
      // POST request - automatically intercepted
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Demo Post',
            body: 'This is a demo post',
            userId: 1,
          }),
        }
      );
      const data = await response.json();
      console.log('POST response:', data);
    } catch (error) {
      console.error('POST error:', error);
    }
  };

  const handleManualNetworkLog = () => {
    // Manual network logging
    BugBubbleLogger.logNetwork(
      'PUT',
      'https://api.example.com/users/123',
      200,
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123',
      },
      { 'Content-Type': 'application/json', 'X-Rate-Limit': '100' },
      { name: 'John Doe', email: 'john@example.com' },
      { id: 123, name: 'John Doe', email: 'john@example.com', updated: true },
      245
    );
  };

  // ========== WebSocket Examples ==========
  const handleWebSocketConnect = () => {
    if (ws) {
      return;
    }

    try {
      // WebSocket connection - automatically intercepted
      const websocket = new WebSocket('wss://echo.websocket.org');
      setWs(websocket);

      websocket.onopen = () => {
        console.log('WebSocket connected');
      };

      websocket.onmessage = (event) => {
        console.log('WebSocket message:', event.data);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      websocket.onclose = () => {
        console.log('WebSocket closed');
        setWs(null);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  };

  const handleWebSocketSend = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = JSON.stringify({
      type: 'ping',
      timestamp: Date.now(),
      data: 'Hello from demo app!',
    });
    ws.send(message);
  };

  const handleManualWebSocketLog = () => {
    // Manual WebSocket logging
    BugBubbleLogger.logWebSocket('message', 'wss://api.example.com/ws', {
      type: 'user_action',
      action: 'button_click',
      userId: 'user_123',
    });
  };

  // ========== Console Examples ==========
  const handleConsoleLogs = () => {
    // All console methods are automatically intercepted
    console.log('This is a log message');
    console.debug('This is a debug message');
    console.info('This is an info message');
    console.warn('This is a warning message');
    console.error('This is an error message');

    // Log with objects
    console.log('User object:', {
      id: 1,
      name: 'John',
      email: 'john@example.com',
    });
  };

  const handleManualConsoleLog = () => {
    // Manual console logging
    BugBubbleLogger.logConsole(
      'info',
      'Manual log',
      'with',
      'multiple',
      'arguments'
    );
    BugBubbleLogger.logConsole('warn', 'Warning: This is a manual warning');
    BugBubbleLogger.logConsole('error', 'Error: This is a manual error', {
      errorCode: 'ERR_001',
      message: 'Something went wrong',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>BugBubble</Text>
        <Text style={styles.subtitle}>Comprehensive Feature Demo</Text>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            <Text style={styles.infoBannerBold}>Automatic Interception:</Text>{' '}
            Just add the{' '}
            <Text style={styles.infoBannerCode}>BugBubble</Text>{' '}
            component, and everything should automatically start working for
            you. Your console logs, network requests, and WebSocket events will
            be automatically intercepted and logged. But if you still need to
            explicitly log events, you can use the methods exposed by{' '}
            <Text style={styles.infoBannerCode}>BugBubbleLogger</Text>.
          </Text>
        </View>

        {/* Console Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Console Logs</Text>
          <Text style={styles.sectionDescription}>
            All console methods (log, debug, info, warn, error) are
            automatically intercepted. Use explicit logging for custom
            scenarios.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleConsoleLogs}>
            <Text style={styles.buttonText}>Create Console Logs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleManualConsoleLog}
          >
            <Text style={styles.buttonText}>Manual Console Log</Text>
          </TouchableOpacity>
          <Text style={styles.methodText}>
            Explicit Method:{' '}
            <Text style={styles.codeText}>
              BugBubbleLogger.logConsole(level, ...args)
            </Text>
          </Text>
        </View>

        {/* Network Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 Network Requests</Text>
          <Text style={styles.sectionDescription}>
            Network requests are automatically intercepted. Use explicit logging
            for custom scenarios.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleFetchRequest}>
            <Text style={styles.buttonText}>GET Request (fetch)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePostRequest}>
            <Text style={styles.buttonText}>POST Request (fetch)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleManualNetworkLog}
          >
            <Text style={styles.buttonText}>Manual Network Log</Text>
          </TouchableOpacity>
          <Text style={styles.methodText}>
            Explicit Method:{' '}
            <Text style={styles.codeText}>
              BugBubbleLogger.logNetwork(method, url, statusCode?,
              requestHeaders?, responseHeaders?, requestBody?, responseBody?,
              duration?)
            </Text>
          </Text>
        </View>

        {/* WebSocket Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔌 WebSocket Events</Text>
          <Text style={styles.sectionDescription}>
            WebSocket connections and events are automatically intercepted. Use
            explicit logging for custom scenarios.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleWebSocketConnect}
          >
            <Text style={styles.buttonText}>
              {ws ? 'WebSocket Connected' : 'Connect WebSocket'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleWebSocketSend}
            disabled={!ws}
          >
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleManualWebSocketLog}
          >
            <Text style={styles.buttonText}>Manual WebSocket Log</Text>
          </TouchableOpacity>
          <Text style={styles.methodText}>
            Explicit Method:{' '}
            <Text style={styles.codeText}>
              BugBubbleLogger.logWebSocket(event, url?, data?)
            </Text>
          </Text>
        </View>

        {/* Analytics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Analytics Events</Text>
          <Text style={styles.sectionDescription}>
            Analytics events must be logged explicitly using{' '}
            <Text style={styles.codeText}>
              BugBubbleLogger.logAnalytics()
            </Text>
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleAnalyticsEvents}
          >
            <Text style={styles.buttonText}>Log Analytics Events</Text>
          </TouchableOpacity>
          <Text style={styles.methodText}>
            Method:{' '}
            <Text style={styles.codeText}>
              BugBubbleLogger.logAnalytics(eventName, properties?)
            </Text>
          </Text>
        </View>

        <Text style={styles.footer}>
          Tap the floating button (top-right) to open the debugger and view all
          logs!
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoBanner: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoBannerText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
  },
  infoBannerBold: {
    fontWeight: '600',
  },
  infoBannerCode: {
    fontFamily: 'monospace',
    backgroundColor: '#BBDEFB',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#5856D6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  methodText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  codeText: {
    fontFamily: 'monospace',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    color: '#D32F2F',
  },
  footer: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
