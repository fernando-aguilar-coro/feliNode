import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeTabNavigator } from './HomeTabNavigator';
import { LessonScreen } from '../../learning/screens/LessonScreen';
import { LessonModeSelectionScreen } from '../../learning/screens/LessonModeSelectionScreen';
import { InfinityExerciseScreen } from '../../learning/screens/InfinityExerciseScreen';
import { InfinitySelectPairsScreen } from "../../learning/screens/InfinitySelectPairsScreen";

export type HomeStackParamList = {
    Main: undefined;
    Lesson: { lessonId: string };
    LessonSession: { lessonId: string; mode?: 'theory' | 'practice' };
    InfinityExercise: { lessonId: string };
    InfinitySelectPairs: { lessonId: string };
    PronunciationAssessment: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigation = () => {
    return (
        <Stack.Navigator id="home_stack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={HomeTabNavigator} />
            <Stack.Screen name="Lesson" component={LessonModeSelectionScreen} />
            <Stack.Screen name="LessonSession" component={LessonScreen} />
            <Stack.Screen name="InfinityExercise" component={InfinityExerciseScreen} />
            <Stack.Screen name="InfinitySelectPairs" component={InfinitySelectPairsScreen} />
        </Stack.Navigator>
    );
};
