import React, { useState, useEffect } from 'react';
import LoginScreen from '../features/auth/screens/LoginScreen';
import { TestScreen } from '../features/learning/components/TestScreen';
import { ChoseInitialTest } from '../features/learning/screens/ChoseInitialTest';

import { LoadingScreen } from '../components';
import { useNetInfo } from '@react-native-community/netinfo';
import { hasMinimumData } from '../db_local/seed/seed_db';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeNavigation } from '../features/home/navigation/HomeNavigation';

import { useUserStore } from '../store/UserStore';
import { useSettingsStore } from '../store/SettingsStore';
import { getUserCompletedLessons } from '../api/getUserCompletedLessons';
import { useAppSync } from '../features/home/hooks/useAppSync';

const Stack = createNativeStackNavigator();
const minCount = 1;

export const Navigation = () => {
    const { isAuthenticated, isGuest, checkSession } = useUserStore();
    const { hasDecidedPlacementTest, language } = useSettingsStore();
    const netInfo = useNetInfo();
    
    const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
    const [isCheckingData, setIsCheckingData] = useState(true);
    const [hasData, setHasData] = useState(false);

    // Start background sync
    useAppSync();

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    // Quick local data check
    useEffect(() => {
        if (!isAuthenticated) {
            setIsCheckingData(false);
            return;
        }

        const checkInitialData = async () => {
            setIsCheckingData(true);
            try {
                const [dataReady, count] = await Promise.all([
                    hasMinimumData(),
                    getUserCompletedLessons()
                ]);
                console.log(`[Navigation] checkInitialData: hasData=${dataReady}, completed=${count}`);
                setHasData(dataReady);
                setCompletedLessonsCount(count);
            } catch (error) {
                console.error('Error checking initial data:', error);
                setHasData(false);
            } finally {
                setIsCheckingData(false);
            }
        };

        checkInitialData();
    }, [isAuthenticated, language]);

    if (!isAuthenticated) {
        return (
            <Stack.Navigator id="login_stack" screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: 'Login' }}
                />
            </Stack.Navigator>
        );
    }

    if (isCheckingData) {
        return <LoadingScreen type='progress' />;
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

