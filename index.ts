import { registerRootComponent } from 'expo';

import { App } from './App';

import notifee, { EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    // Actions are handled when the app comes to foreground via getInitialNotification
    console.log('[BackgroundEvent] Notification background tapped', detail.notification);
  }
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
