import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUserStore } from '../store/UserStore';
import LoginScreen from '../features/auth/screens/OTP Screen';

import { PlacementTestScreen } from '../features/learning/components/PlacementTestScreen';
import { ChoseInitialTest } from '../features/learning/screens/ChoseInitialTest';
import { HomeNavigation } from '../features/home/navigation/HomeNavigation';

const Stack = createNativeStackNavigator();
const minCount = 1;
export const Navigation = () => {
    const { isAuthenticated, checkSession, completedLessonsCount } = useUserStore();

    React.useEffect(() => {
        checkSession();
    }, [checkSession]);

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
