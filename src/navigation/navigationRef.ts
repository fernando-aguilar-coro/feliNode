import { createNavigationContainerRef } from '@react-navigation/native';
import { HomeStackParamList } from '../features/home/navigation/HomeNavigation';

type RootStackParamList = {
    Home: { screen: keyof HomeStackParamList; params?: any };
    // Add other root routes here if necessary
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    } else {
        // Option 1: Store the navigation action until ref is ready
        console.log('[navigationRef] not ready, queued navigation to:', name);
        // We can just rely on getInitialNotification instead for the killed state
    }
}
