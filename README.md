# BugBubble - React Native In-App DevTools

An in-app debugging tool for React Native development. Monitor network requests, WebSocket events, console logs, and analytics events in real-time with a draggable UI

## Supported Log Types

This library currently supports logging for the following:

- ✅ **Network Requests**: Automatically intercepts all network calls.
- ✅ **Console Logs**: Automatically intercepts all console methods (`log`, `debug`, `info`, `warn`, `error`)
- ✅ **WebSocket Events**: Automatically intercepts WebSocket connections and events (`open`, `message`, `close`, `error`)
- ✅ **Analytics Events**: Requires explicit logging using `BugBubbleLogger.logAnalytics()`

## Features

- ✅ **Automatic Interception**: Network requests, WebSocket events, and console logs are automatically captured without any additional code
- ✅ **Explicit Logging API**: Manual logging methods available for all log types (useful for custom scenarios or analytics)
- ✅ **Real-Time Monitoring**: View logs as they happen in UI
- ✅ **Draggable Floating Button**: Drag the floating button anywhere on the screen for easy access
- ✅ **Search & Filter**: Powerful search functionality across all log types
- ✅ **TypeScript Support**: Full TypeScript definitions included
- ✅ **Selective Tracking**: Disable specific log types to reduce overhead and customize your debugging experience

## Demo

<table>
  <tr>
    <td align="center">
      <strong>Android Demo</strong><br/>
      <img src="docs/android.gif" width="300"/>
    </td>
    <td align="center">
      <strong>iOS Demo</strong><br/>
      <img src="docs/ios.gif" width="300"/>
    </td>
  </tr>
</table>

## Installation

```bash
npm install @lokal-dev/react-native-bugbubble
# or
yarn add @lokal-dev/react-native-bugbubble
# or
pnpm add @lokal-dev/react-native-bugbubble
```

**No peer dependencies required!** This library is pure JavaScript/TypeScript and only requires React Native.

## Quick Start

Add the `BugBubble` component to your app's root component:

```tsx
import { BugBubble } from '@lokal-dev/react-native-bugbubble';

export default function App() {
  return (
    <>
      <YourAppContent />
      <BugBubble />
    </>
  );
}
```

That's it! A floating button will appear on your screen. **Tap it to open the debugger, or drag it to reposition it**.

For configuration options, see the [Configuration](#configuration) section.

## Usage

### Explicit Logging API

Use the `BugBubbleLogger` API for manual event logging:

```tsx
import { BugBubbleLogger } from '@lokal-dev/react-native-bugbubble';
```

#### Log Analytics Events

```tsx
// Log an analytics event
BugBubbleLogger.logAnalytics('user_login', {
  userId: '123',
  method: 'email',
  timestamp: Date.now(),
});
```

#### Log Network Requests Manually

```tsx
// Log a network request explicitly
BugBubbleLogger.logNetwork(
  'POST',
  'https://api.example.com/users',
  201, // status code
  { 'Content-Type': 'application/json' }, // request headers
  { 'Content-Type': 'application/json' }, // response headers
  { name: 'John Doe' }, // request body
  { id: 1, name: 'John Doe' }, // response body
  150 // duration in milliseconds
);
```

#### Log WebSocket Events Manually

```tsx
// Log a WebSocket event
BugBubbleLogger.logWebSocket('message', 'wss://api.example.com/ws', {
  type: 'ping',
  data: 'hello',
});
```

#### Log Console Messages Manually

```tsx
// Log console messages explicitly
BugBubbleLogger.logConsole('info', 'User logged in', { userId: '123' });
BugBubbleLogger.logConsole('error', 'Failed to fetch data', error);
BugBubbleLogger.logConsole('warn', 'Deprecated API used');
```

### Configuration

**All configuration options are completely optional**. The library works with sensible defaults out of the box. See the [API Reference](#api-reference) section for all available options and their defaults.

```tsx
import { BugBubble } from '@lokal-dev/react-native-bugbubble';

// Minimal setup
<BugBubble />

// Customize with config
<BugBubble
  config={{
    maxLogs: 1000,
    floatingButtonPosition: {
      top: 100,
      right: 20,
    },
    trackingOptions: {
      enabled: true,
      options: {
        analytics: true,
        network: true,
        websocket: true,
        console: true,
      },
    },
  }}
/>
```

**Note**: Configuration is set once when the component mounts and cannot be changed at runtime. To change configuration, remount the component with new props.

##### Disabling Tracking

You can disable tracking for specific log types or disable all tracking:

```tsx
// Disable network tracking only
<BugBubble
  config={{
    trackingOptions: {
      enabled: true,
      options: {
        network: false,
      },
    },
  }}
/>

// Disable all tracking (button will also be hidden)
<BugBubble
  config={{
    trackingOptions: {
      enabled: false,
    },
  }}
/>
```

When tracking is disabled:
- If `trackingOptions.enabled` is `false`: All tracking is disabled and the floating button is hidden
- If a specific log type is disabled: The corresponding tab is hidden, the interceptor won't start, and no logs will be collected for that type



## API Reference

### `BugBubble`

Root component that renders the debugger UI. Should be added at the root level of your app.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `Partial<BugBubbleConfig>` | `undefined` | Optional configuration object. See config options below. |

#### Config Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxLogs` | `number` | `1000` | Maximum number of logs to store in memory. |
| `floatingButtonPosition` | `{ top: number, right: number }` | `{ top: 100, right: 20 }` | Initial position of the floating button. `top` and `right` are distances from top and right edges in pixels. |
| `trackingOptions` | `object` | `undefined` | Options to control tracking behavior. See nested options below. |

##### `trackingOptions` Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Master switch for all tracking and button visibility. |
| `options` | `object` | `undefined` | Options to enable/disable specific log types. See nested options below. |

##### `trackingOptions.options` Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `analytics` | `boolean` | `true` | Enable/disable analytics tracking. |
| `network` | `boolean` | `true` | Enable/disable network tracking. |
| `websocket` | `boolean` | `true` | Enable/disable WebSocket tracking. |
| `console` | `boolean` | `true` | Enable/disable console tracking. |

### `BugBubbleLogger`

Explicit logging API for manual event logging.

#### `logAnalytics(eventName, properties?)`

Log an analytics event.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventName` | `string` | Yes | Name of the analytics event. |
| `properties` | `object` | No | Event properties as key-value pairs. |

#### `logNetwork(method, url, statusCode?, requestHeaders?, responseHeaders?, requestBody?, responseBody?, duration?)`

Log a network request manually.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `method` | `string` | Yes | HTTP method (GET, POST, PUT, DELETE, etc.). |
| `url` | `string` | Yes | Request URL. |
| `statusCode` | `number` | No | Response status code. |
| `requestHeaders` | `object` | No | Request headers as key-value pairs. |
| `responseHeaders` | `object` | No | Response headers as key-value pairs. |
| `requestBody` | `any` | No | Request body. |
| `responseBody` | `any` | No | Response body. |
| `duration` | `number` | No | Request duration in milliseconds. |

#### `logWebSocket(event, url?, data?)`

Log a WebSocket event manually.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event` | `string` | Yes | Event type: `'open'`, `'message'`, `'close'`, or `'error'`. |
| `url` | `string` | No | WebSocket URL. |
| `data` | `any` | No | Event data. |

#### `logConsole(level, ...args)`

Log a console message manually.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `level` | `string` | Yes | Log level: `'debug'`, `'info'`, `'warn'`, or `'error'`. |
| `...args` | `any[]` | Yes | Arguments to log (same as console methods). |

## Troubleshooting

### Debugger Not Appearing

- Ensure you've added `<BugBubble />` component to root level of your app
- Verify that `trackingOptions.enabled` is set to `true` in config (see [API Reference](#api-reference))

### Logs Not Appearing

- Ensure the debugger component is mounted before making network requests
- Check that interceptors are started (they start automatically when component mounts)
- Check if the log type is disabled in `trackingOptions` configuration (see [Configuration](#configuration))


## Example

Check out the [example](./example) directory for a comprehensive demo of all features.

## Author

-  [Shivangi](shivangi.gupta@getlokalapp.com)

## License

MIT

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.
