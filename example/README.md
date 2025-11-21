# Example App

This example app demonstrates all features of `@lokal-dev/react-native-bugbubble`. It showcases automatic interception of console logs, network requests, and WebSocket events, as well as explicit logging capabilities.

## Prerequisites

- Node.js (check `.nvmrc` in the root directory)
- Yarn package manager
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and Android SDK

## Installation

Install dependencies from the root directory:

```sh
cd ..
yarn
```

## Running the Example

### Start Metro Bundler

```sh
yarn example start
```

### Run on iOS

```sh
yarn example ios
```

This will start Metro bundler (if not already running), build and launch the iOS app in the simulator.

### Run on Android

```sh
yarn example android
```

This will start Metro bundler (if not already running), build and launch the Android app in an emulator or connected device.

## What the Example Demonstrates

The example app includes four demo sections:

- **💬 Console Logs**: Automatic console log interception and manual logging
- **🌐 Network Requests**: Automatic network request interception and manual logging
- **🔌 WebSocket Events**: Automatic WebSocket event interception and manual logging
- **📊 Analytics Events**: Explicit analytics logging (analytics requires explicit logging)

Each section has buttons to:
- Trigger automatic interception examples
- Demonstrate explicit logging using `BugBubbleLogger` API

Tap the **floating button** (top-right corner) to open the debugger modal. You can drag it to reposition it.

## Debugger Features

The debugger includes:
- **Tab Navigation**: Console, Network, WebSocket, and Analytics tabs
- **Search**: Filter logs by searching for specific text
- **Expandable Logs**: Tap any log entry to see full details
- **Network Details**: View request/response headers, body, duration, and cURL commands
- **Clear Functionality**: Clear all logs or logs for a specific tab

## Troubleshooting

- **Metro bundler not starting**: Ensure port 8081 is not in use
- **iOS build fails**: Run `cd ios && pod install` from the example directory
- **Android build fails**: Ensure Android SDK and emulator are properly configured
- **No logs appearing**: Make sure you've triggered some actions before opening the debugger
- **WebSocket not connecting**: Check your internet connection and firewall settings

For detailed documentation, API reference, and configuration options, see the [main README](../README.md).
