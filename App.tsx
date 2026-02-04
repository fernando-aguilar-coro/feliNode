import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoadingScreen } from './src/components/LoadingScreen';
import { Navigation } from './src/navigation/Navigation';
import { seedDatabase } from './src/db_local/seed/seed_db';
import { authService } from './src/features/auth/services/authService';

import { AppThemeProvider, useThemeControl, NavLightTheme, NavDarkTheme } from './src/theme/ThemeContext';

const AppContent = () => {
    const { isDark } = useThemeControl();

    return (
        <NavigationContainer theme={isDark ? NavDarkTheme : NavLightTheme}>
            <Navigation />
        </NavigationContainer>
    );
};

export const App = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                authService.configureGoogleSignin(); // Configure Google Sign-In
                await seedDatabase();
            } catch (e) {
                console.error("Error crítico:", e);
            } finally {
                setAppIsReady(true);
            }
        }
        prepare();
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