import React, { useState, useEffect } from 'react';
import LoginScreen from '../features/auth/screens/LoginScreen';
import { PlacementTestScreen } from '../features/learning/components/PlacementTestScreen';
import { ChoseInitialTest } from '../features/learning/screens/ChoseInitialTest';

import { LoadingScreen } from '../components';
import { syncUserProgress } from '../api/syncUserProgress';
import { useNetInfo } from '@react-native-community/netinfo';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeNavigation } from '../features/home/navigation/HomeNavigation';

import { useUserStore } from '../store/UserStore';
import { useSettingsStore } from '../store/SettingsStore';
import { getUserCompletedLessons } from '../api/getUserCompletedLessons';
import { KokoroDisclaimerScreen } from '../features/learning/screens/KokoroDisclaimerScreen';

const Stack = createNativeStackNavigator();
const minCount = 1;


export const Navigation = () => {
    const { isAuthenticated, checkSession } = useUserStore();
    const { hasDecidedKokoroDownload } = useSettingsStore();
    const netInfo = useNetInfo();
    const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
    const [isLoadingLessons, setIsLoadingLessons] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hasSync, setHasSync] = useState(false);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    // Sync progress
    useEffect(() => {
        const syncData = async () => {
            if (netInfo.isConnected && !isSyncing && isAuthenticated && !hasSync) {
                try {
                    setIsSyncing(true);
                    setHasSync(true);
                    await syncUserProgress();
                    const count = await getUserCompletedLessons();
                    setCompletedLessonsCount(count);
                } catch (error) {
                    console.error('Error syncing progress in HomeScreen:', error);
                } finally {
                    setIsSyncing(false);
                    setIsLoadingLessons(false);
                }
            }
        };
        syncData();
    }, [netInfo.isConnected, isAuthenticated, isSyncing, hasSync]);

    if (isSyncing || (isAuthenticated && isLoadingLessons)) {
        return <LoadingScreen message={isSyncing ? "Sincronizando progreso..." : "Cargando progreso..."} />;
    }
    if (!netInfo.isConnected) {
        return (
            <Stack.Navigator id="main_stack" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeNavigation} />
            </Stack.Navigator>
        );
    }
    return (
        <Stack.Navigator id="main_stack" screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <Stack.Group>
                    {completedLessonsCount <= minCount ? (
                        <>
                            <Stack.Screen
                                name="PlacementSelection"
                                component={ChoseInitialTest}
                                options={{ title: 'Select Level' }}
                            />
                            <Stack.Screen
                                name="PlacementEvaluation"
                                component={PlacementTestScreen}
                                options={{ title: 'Placement Test' }}
                            />
                        </>
                    ) : null}

                    {!hasDecidedKokoroDownload && netInfo.isConnected ? (
                        <Stack.Screen
                            name="KokoroDisclaimer"
                            component={KokoroDisclaimerScreen}
                            options={{ headerShown: false }}
                        />
                    ) : (
                        <Stack.Screen name="Home" component={HomeNavigation} />
                    )}
                </Stack.Group>
            ) : (
                <Stack.Group>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ title: 'Login' }}
                    />
                </Stack.Group>
            )}
        </Stack.Navigator>
    );
}
