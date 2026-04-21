import React, { useState, useEffect } from 'react';
import LoginScreen from '../features/auth/screens/LoginScreen';
import { TestScreen } from '../features/learning/components/TestScreen';
import { ChoseInitialTest } from '../features/learning/screens/ChoseInitialTest';

import { LoadingScreen } from '../components';
import { syncUserProgress } from '../api/syncUserProgress';
import { useNetInfo } from '@react-native-community/netinfo';
import { seedDatabase } from '../db_local/seed/seed_db';


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeNavigation } from '../features/home/navigation/HomeNavigation';

import { useUserStore } from '../store/UserStore';
import { useSettingsStore } from '../store/SettingsStore';
import { getUserCompletedLessons } from '../api/getUserCompletedLessons';

const Stack = createNativeStackNavigator();
const minCount = 1;


export const Navigation = () => {
    const { isAuthenticated, isGuest, checkSession } = useUserStore();
    const { hasDecidedPlacementTest, language } = useSettingsStore();
    const netInfo = useNetInfo();
    const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
    const [isLoadingLessons, setIsLoadingLessons] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hasSync, setHasSync] = useState(false);
    const [prevLanguage, setPrevLanguage] = useState(language);

    useEffect(() => {
        // Al cambiar isGuest de true a false, forzamos que se vuelva a sincronizar
        setHasSync(false);
    }, [isGuest]);

    // Forzar resincronización si el idioma cambia
    useEffect(() => {
        if (language !== prevLanguage) {
            setHasSync(false);
            setPrevLanguage(language);
        }
    }, [language, prevLanguage]);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    // Sync progress
    useEffect(() => {
        if (!isAuthenticated) {
            setHasSync(false);
            setCompletedLessonsCount(0);
            return;
        }

        const syncData = async () => {
            if (netInfo.isConnected && !isSyncing && !hasSync) {
                try {
                    setIsSyncing(true);
                    setHasSync(true);
                    await syncUserProgress();
                    await seedDatabase();
                    const count = await getUserCompletedLessons();
                    setCompletedLessonsCount(count);
                } catch (error) {
                    console.error('Error syncing progress in HomeScreen:', error);
                    setHasSync(false); // Permite reintentar si falla
                } finally {
                    setIsSyncing(false);
                    setIsLoadingLessons(false);
                }
            }
        };
        syncData();
    }, [netInfo.isConnected, isAuthenticated, isSyncing, hasSync]);
    if (!isAuthenticated) {
        return (<Stack.Navigator id="login_stack" screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Login' }}
            />
        </Stack.Navigator>)
    }

    if (isSyncing || (isAuthenticated && isLoadingLessons)) {
        return <LoadingScreen type={isSyncing ? 'syncing' : 'progress'} />;
    }
    if (!netInfo.isConnected) {
        return (
            <Stack.Navigator id="main_stack" key={isGuest ? 'guest' : 'user'} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeNavigation} />
            </Stack.Navigator>
        );
    }
    return (
        <Stack.Navigator id="main_stack" key={isGuest ? 'guest' : 'user'} screenOptions={{ headerShown: false }}>
            <Stack.Group>
                {completedLessonsCount <= minCount && !hasDecidedPlacementTest ? (
                    <>
                        <Stack.Screen
                            name="PlacementSelection"
                            component={ChoseInitialTest}
                            options={{ title: 'Select Level' }}
                        />
                        <Stack.Screen
                            name="PlacementEvaluation"
                            component={TestScreen}
                            options={{ title: 'Placement Test' }}
                        />
                    </>
                ) : null}

                <Stack.Screen name="Home" component={HomeNavigation} />
            </Stack.Group>
        </Stack.Navigator>
    );
}
