import React, { useMemo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getLessonById } from '../../../db_local/api_local';

type LessonModeSelectionRouteProp = RouteProp<HomeStackParamList, 'Lesson'>; // Using 'Lesson' for now, assuming this screen takes over that route name
type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const LessonModeSelectionScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<LessonModeSelectionRouteProp>();
    const { lessonId } = route.params || { lessonId: 'lesson_verbs_intro' }; // Default for testing
    const [lessonTitle, setLessonTitle] = useState<string>('');

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const lesson: any = await getLessonById(lessonId);
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
                {lessonTitle || 'Cargando...'}
            </AppText>
            <Spacer height={theme.spacing.sm} />
            <AppText variant="lg" align="center" style={{ opacity: 0.8 }}>
                Elige tu modo
            </AppText>
            <Spacer height={theme.spacing.xl} />

            <View style={styles.buttonContainer}>
                <AppButton
                    title="Teoría"
                    onPress={() => handleSelectMode(undefined as any)} // Theory implies standard start
                    variant="outline"
                />
                <AppButton
                    title="Examen"
                    onPress={() => handleSelectMode('practice')}
                    variant="outline"
                />
                <AppButton
                    title="Ejercicios Infinitos"
                    onPress={() => handleSelectMode('infinity')}
                    variant="outline"
                />
            </View>

            <Spacer height={theme.spacing.xl} />
            <AppButton
                title="Volver"
                onPress={() => navigation.goBack()}
                variant="ghost"
            />
        </Screen>
    );
};
