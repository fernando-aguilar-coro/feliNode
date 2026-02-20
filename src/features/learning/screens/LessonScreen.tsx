import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LearningSection } from '../components/LearningSection';

import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<HomeStackParamList, 'LessonSession'>;

export const LessonScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<Props['route']>();
    const { lessonId, mode } = route.params || { lessonId: 'lesson_verbs_intro' };

    return (
        <LearningSection
            lessonId={lessonId}
            mode={mode}
            loadingText="Cargando lección..."
            onExit={() => navigation.navigate('Main', { screen: 'Home' })}
        />
    );
}
