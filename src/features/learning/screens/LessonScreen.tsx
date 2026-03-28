import React, { useEffect, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLessonSession } from '../hooks/useLessonSession';
import { useExercises } from '../hooks/useExercises';
import { TheoryViewer } from '../components/TheoryViewer';
import { ExerciseContainer } from '../components/exercises/ExerciseContainer';
import { ProgressBar } from '../components/ProgressBar';
import { Screen, AppText, Spacer, AppButton } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { audioService } from '../../settings/services/audio.service';

type Props = NativeStackScreenProps<HomeStackParamList, 'LessonSession'>;

export const LessonScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    const route = useRoute<Props['route']>();
    const { lessonId, mode } = route.params || { lessonId: 'lesson_verbs_intro' };
    
    const loadingText = 'Cargando lección...';
    const onExit = () => navigation.navigate('Main');

    const {
        status,
        theoryContent,
        exercises,
        startExercises,
        completeLesson,
        lesson
    } = useLessonSession(lessonId);

    const isExam = lessonId?.includes('placement_test') || false;

    // Inner hook for exercises (only active when we have exercises)
    const {
        currentExercise,
        isFinished,
        checkAnswer,
        nextExercise,
        lastResult,
        completedCount,
        initialTotal,
        overrideResult
    } = useExercises(exercises, isExam);

    // Effect to bridge the "finished exercises" state to "completeLesson"
    useEffect(() => {
        if (isFinished && status === 'exercises') {
            audioService.playSuccessSound();
            completeLesson();
        }
    }, [isFinished, status, completeLesson]);

    // Effect to handle mode-specific logic
    useEffect(() => {
        if (status === 'theory' && mode === 'practice') {
            startExercises();
        }
    }, [status, mode, startExercises]);

    const styles = useMemo(() => StyleSheet.create({
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        exercisesContainer: {
            flex: 1,
        },
        header: {
            paddingVertical: theme.spacing.md,
        },
    }), [theme]);

    if (status === 'loading') {
        return (
            <Screen style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Spacer height={theme.spacing.sm} />
                <AppText color={theme.colors.textSecondary}>{loadingText}</AppText>
            </Screen>
        );
    }

    if (status === 'completed') {
        return (
            <Screen style={styles.centerContainer}>
                <AppText variant="xxl" weight="bold" color={theme.colors.success} align="center">
                    ¡Lección Completada!
                </AppText>
                <Spacer height={theme.spacing.md} />
                <AppText variant="lg" align="center">
                    ¡Buen trabajo! Has dominado esta lección.
                </AppText>
                <Spacer height={theme.spacing.xl} />
                <View style={{ width: '100%', gap: theme.spacing.md }}>
                    <AppButton
                        title="Continuar"
                        onPress={onExit}
                        variant="outline"
                    />
                    <AppButton
                        title="Más ejercicios (Infinito)"
                        onPress={() => navigation.navigate('InfinityExercise', { lessonId })}
                        variant="outline"
                    />
                </View>
            </Screen>
        );
    }

    return (
        <Screen>
            {status === 'theory' && mode !== 'practice' && (
                <TheoryViewer
                    content={theoryContent}
                    onContinue={startExercises}
                />
            )}

            {status === 'exercises' && (
                <View style={styles.exercisesContainer}>
                    <View style={styles.header}>
                        {initialTotal > 0 && (
                            <ProgressBar current={completedCount} total={initialTotal} />
                        )}
                    </View>

                    {currentExercise ? (
                        <ExerciseContainer
                            exercise={currentExercise}
                            onCheck={checkAnswer}
                            onNext={nextExercise}
                            lastResult={lastResult}
                            lessonContext={lesson?.title}
                            onOverrideResult={overrideResult}
                        />
                    ) : (
                        <View style={styles.centerContainer}>
                            <AppText align="center">No se encontraron ejercicios.</AppText>
                            <Spacer height={theme.spacing.md} />
                            <AppButton
                                title="Volver"
                                onPress={onExit}
                                variant="primary"
                            />
                        </View>
                    )}
                </View>
            )}
        </Screen>
    );
};
