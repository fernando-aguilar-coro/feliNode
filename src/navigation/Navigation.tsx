import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUserStore } from '../store/UserStore';
import LoginScreen from '../features/auth/screens/LoginScreen';
import { WelcomeScreen } from '../features/auth/screens/WelcomeScreen';
import { PlacementTestScreen } from '../features/learning/screens/PlacementTestScreen';
import { HomeNavigation } from '../features/home/navigation/HomeNavigation';

const Stack = createNativeStackNavigator();

export const Navigation = () => {
    const isAuthenticated = useUserStore((state) => state.isAuthenticated);

    return (
        <Stack.Navigator id="main_stack" screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                // App Stack
                <Stack.Screen name="Home" component={HomeNavigation} />
            ) : (
                <Stack.Group>
                    <Stack.Screen
                        name="Welcome"
                        component={WelcomeScreen}
                    />
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                    />
                    <Stack.Screen
                        name="PlacementEvaluation"
                        component={PlacementTestScreen}
                        options={{ title: 'Placement Test' }}
                    />
                </Stack.Group>
            )}
        </Stack.Navigator>
    );
}
