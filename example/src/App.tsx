import { BugBubble } from '@lokal-dev/react-native-bugbubble';
import { ExampleScreen } from './ExampleScreen';

export default function App() {
  return (
    <>
      <ExampleScreen />
      <BugBubble
        // passing config is completely optional here.
        config={{
          maxLogs: 1000,
          floatingButtonPosition: {
            top: 200,
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
    </>
  );
}
