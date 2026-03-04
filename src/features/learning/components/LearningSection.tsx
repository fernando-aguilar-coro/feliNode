import React, { useEffect, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLessonSession } from '../hooks/useLessonSession';
import { useExercises } from '../hooks/useExercises';
import { TheoryViewer } from './TheoryViewer';
import { ExerciseContainer } from './exercises/ExerciseContainer';
import { ProgressBar } from './ProgressBar';
import { Screen, AppText, Spacer, AppButton } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { audioService } from '../../settings/services/audio.service';

interface LearningSectionProps {
    lessonId: string;
    loadingText?: string;
    /**
     * Callback for when the user wants to exit the flow (e.g. from an error screen or back button)
     */
    onExit?: () => void;
    /**
     * Optional mode for the lesson.
     * - 'theory': Only show theory, then finish.
     * - 'practice': Skip theory, go straight to exercises.
     * - undefined (default): Show theory then exercises.
     */
    mode?: 'theory' | 'practice';
}

export const LearningSection: React.FC<LearningSectionProps> = ({
    lessonId,
    loadingText = 'Cargando...',
    onExit,
    mode,
}) => {
    const theme = useAppTheme();
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
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
            flex: 1, // Ensure it takes full height to center properly
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

    // Handle case where status is 'theory' or 'exercises' but data might be missing/empty
    // Although useLessonSession should handle 'completed' if empty, let's overlap just in case.

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
                            {onExit && (
                                <>
                                    <Spacer height={theme.spacing.md} />
                                    <AppButton
                                        title="Volver"
                                        onPress={onExit}
                                        variant="primary"
                                    />
                                </>
                            )}
                        </View>
                    )}
                </View>
            )}
        </Screen>
    );
};

