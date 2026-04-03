import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import SpInAppUpdates, { IAUUpdateKind, StartUpdateOptions } from 'sp-react-native-in-app-updates';
import mobileAds from 'react-native-google-mobile-ads';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoadingScreen } from './src/components/LoadingScreen';
import { Navigation } from './src/navigation/Navigation';
import { authService } from './src/features/auth/services/authService';
import { AppThemeProvider, useThemeControl, NavLightTheme, NavDarkTheme } from './src/theme/ThemeContext';
import { navigationRef } from './src/navigation/navigationRef';
import notifee, { EventType } from '@notifee/react-native';

const AppContent = () => {
    const { isDark } = useThemeControl();

    return (
        <NavigationContainer ref={navigationRef} theme={isDark ? NavDarkTheme : NavLightTheme}>
            <Navigation />
        </NavigationContainer>
    );
};

export const App = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function init() {
            try {
                authService.configureGoogleSignin(); // Configure Google Sign-In
                await mobileAds().initialize(); // Initialize Google Mobile Ads

                // In-App Updates check (Flexible)
                const inAppUpdates = new SpInAppUpdates(false);
                inAppUpdates.checkNeedsUpdate().then((result) => {
                    if (result.shouldUpdate) {
                        let updateOptions: StartUpdateOptions = {};
                        if (Platform.OS === 'android') {
                            updateOptions = {
                                updateType: IAUUpdateKind.FLEXIBLE,
                            };
                        }
                        inAppUpdates.startUpdate(updateOptions);
                    }
                }).catch(err => console.log('Error checking for updates:', err));
            } catch (e) {
                console.error("Error crítico:", e);
            } finally {
                setAppIsReady(true);
            }
        }
        init();

        const handleNotificationPress = () => {
            if (navigationRef.isReady()) {
                const randomValue = Math.random();
                // 50% chance to go directly to InfinitySelectPairs
                if (randomValue < 0.3) {
                    navigationRef.navigate('Home', {
                        screen: 'InfinitySelectPairs',
                        params: { lessonId: 'General Pairs' }
                    });
                } else {
                    // Otherwise go to the landing page
                    navigationRef.navigate('Home', { screen: 'Main', params: { screen: 'InfinityLanding' } });
                }
            }
        };

        // Handle foreground notifications
        const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS) {
                handleNotificationPress();
            }
        });

        // Handle app opened from background/killed state by tapping notification
        notifee.getInitialNotification().then((initialNotification) => {
            if (initialNotification) {
                setTimeout(() => {
                    handleNotificationPress();
                }, 1000); // 1s delay to let navigation tree mount fully
            }
        });

        return unsubscribe;
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppThemeProvider>
                {appIsReady ? (
                    <AppContent />
                ) : (
                    <LoadingScreen />
                )}
            </AppThemeProvider>
        </GestureHandlerRootView>
    );
}