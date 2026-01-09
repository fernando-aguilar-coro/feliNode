import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SplashScreen } from './src/screens/SplashScreen';
import { Navigation } from './src/navigation/Navigation';
import { init } from './src/db_local/api_local';
import { seedDatabase } from './src/db_local/seed_db';

export const App = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Initialize the DB singleton and then seed data
                await init();
                await seedDatabase();
                // Opcional: añade un pequeño delay artificial para que el Splash sea visible
                // await new Promise(resolve => setTimeout(resolve, 2000)); 
            } catch (e) {
                console.error("Error crítico:", e);
            } finally {
                setAppIsReady(true);
            }
        }
        prepare();
    }, []);

    // El Provider envuelve a AMBOS estados
    return (
        appIsReady ? (
            <NavigationContainer>
                <Navigation />
            </NavigationContainer>
        ) : (
            <SplashScreen />
        )
    );
}