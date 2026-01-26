import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { Navigation } from './src/navigation/Navigation';
import { seedDatabase } from './src/db_local/seed/seed_db';

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
            {appIsReady ? (
                <NavigationContainer>
                    <Navigation />
                </NavigationContainer>
            ) : (
                <LoadingScreen />
            )}
        </GestureHandlerRootView>
    );
}