import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LessonScreen } from '../../learning/screens/LessonScreen';
import { PronunciationAssessmentScreen } from '../../learning/screens/PronunciationAssessmentScreen';
import { SettingsScreen } from '../../settings/screens/SettingsScreen';

export type HomeStackParamList = {
    Main: undefined;
    Lesson: { lessonId: string };
    PronunciationAssessment: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigation = () => {
    return (
        <Stack.Navigator id="home_stack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={HomeScreen} />
            <Stack.Screen name="Lesson" component={LessonScreen} />
            <Stack.Screen name="PronunciationAssessment" component={PronunciationAssessmentScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
    );
};
