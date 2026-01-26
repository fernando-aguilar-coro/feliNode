import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LessonScreen } from '../../learning/screens/LessonScreen';


export type HomeStackParamList = {
    Main: undefined;
    Lesson: { lessonId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigation = () => {
    return (
        <Stack.Navigator id="home_stack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={HomeScreen} />
            <Stack.Screen name="Lesson" component={LessonScreen} />
        </Stack.Navigator>
    );
};
