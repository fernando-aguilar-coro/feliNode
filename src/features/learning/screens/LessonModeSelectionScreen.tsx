import React, { useMemo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { lessonRepository } from '../../../db_local/repositories';

type LessonModeSelectionRouteProp = RouteProp<HomeStackParamList, 'Lesson'>; // Using 'Lesson' for now, assuming this screen takes over that route name
type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const LessonModeSelectionScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<LessonModeSelectionRouteProp>();
    const { t } = useTranslation();
    const { lessonId } = route.params || { lessonId: 'lesson_verbs_intro' }; // Default for testing
    const [lessonTitle, setLessonTitle] = useState<string>('');

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const lesson: any = await lessonRepository.getLessonById(lessonId);
                if (lesson && lesson.title) {
                    setLessonTitle(lesson.title);
                }
            } catch (error) {
                console.error('Failed to fetch lesson:', error);
            }
        };
        fetchLesson();
    }, [lessonId]);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: theme.spacing.lg,
        },
        buttonContainer: {
            width: '100%',
            gap: theme.spacing.md,
        },
    }), [theme]);

    const handleSelectMode = (mode: 'theory' | 'practice' | 'infinity') => {
        if (mode === 'infinity') {
            navigation.navigate('InfinityExercise', { lessonId });
        } else {
            // For theory and practice, we go to the standard LessonScreen (which we might rename or add a mode param to)
            // Assuming 'LessonSession' will be the route name for the actual lesson content
            navigation.navigate('LessonSession', { lessonId, mode });
        }
    };

    return (
        <Screen style={styles.container}>
            <AppText variant="xxl" weight="bold" align="center">
                {lessonTitle || t('learning.modeSelection.loading')}
            </AppText>
            <Spacer height={theme.spacing.sm} />
            <AppText variant="lg" align="center" style={{ opacity: 0.8 }}>
                {t('learning.modeSelection.chooseMode')}
            </AppText>
            <Spacer height={theme.spacing.xl} />

            <View style={styles.buttonContainer}>
                <AppButton
                    title={t('learning.modeSelection.theory')}
                    onPress={() => handleSelectMode(undefined as any)} // Theory implies standard start
                    variant="outline"
                />
                <AppButton
                    title={t('learning.modeSelection.infinityExercises')}
                    onPress={() => handleSelectMode('infinity')}
                    variant="outline"
                />
                <AppButton
                    title={t('learning.modeSelection.exam')}
                    onPress={() => handleSelectMode('practice')}
                    variant="outline"
                />
            </View>

            <Spacer height={theme.spacing.xl} />
            <AppButton
                title={t('learning.modeSelection.back')}
                onPress={() => navigation.goBack()}
                variant="ghost"
            />
        </Screen>
    );
};
