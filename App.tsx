import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { LoadingScreen } from './src/components/LoadingScreen';
import { Navigation } from './src/navigation/Navigation';
import { seedDatabase } from './src/db_local/seed/seed_db';
import { theme as appTheme } from './src/theme';

const paperTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: appTheme.colors.primary,
        secondary: appTheme.colors.secondary,
        background: appTheme.colors.background,
        surface: appTheme.colors.surface,
        error: appTheme.colors.error,
    },
};

export const App = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
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
            <PaperProvider theme={paperTheme}>
                {appIsReady ? (
                    <NavigationContainer>
                        <Navigation />
                    </NavigationContainer>
                ) : (
                    <LoadingScreen />
                )}
            </PaperProvider>
        </GestureHandlerRootView>
    );
}