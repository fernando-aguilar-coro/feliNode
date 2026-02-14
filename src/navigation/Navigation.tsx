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


const Stack = createNativeStackNavigator();
const minCount = 1;
export const Navigation = () => {
    const { isAuthenticated, checkSession, completedLessonsCount } = useUserStore();
    const netInfo = useNetInfo();

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const [isSyncing, setIsSyncing] = useState(false);
    const [hasSync, setHasSync] = useState(false);

    const syncData = async () => {
        if (netInfo.isConnected && !isSyncing && isAuthenticated && !hasSync) {
            try {
                setIsSyncing(true);
                setHasSync(true);
                await syncUserProgress();
            } catch (error) {
                console.error('Error syncing progress in HomeScreen:', error);
            } finally {
                setIsSyncing(false);
            }
        }
    };
    useEffect(() => {
        syncData();
    }, [netInfo.isConnected]);

    if (isAuthenticated && !hasSync) {
        syncData();
        setHasSync(true);
    }

    if (isSyncing) {
        return <LoadingScreen message="Sincronizando progreso..." />;
    }
    return (
        <Stack.Navigator id="main_stack" screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (

                // App Stack
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
                    <Stack.Screen name="Home" component={HomeNavigation} />
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
