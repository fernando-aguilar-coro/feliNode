import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SpeakScreen } from '../screens/SpeakScreen';
import { ShopScreen } from '../components/ShopScreen';

export type GamificationStackParamList = {
    SpeakMain: undefined;
    Shop: undefined;
};

const Stack = createNativeStackNavigator<GamificationStackParamList>();

export const GamificationNavigator = () => {
    return (
        <Stack.Navigator
            id="gamification_stack"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="SpeakMain" component={SpeakScreen} />
            <Stack.Screen name="Shop" component={ShopScreen} />
        </Stack.Navigator>
    );
};
