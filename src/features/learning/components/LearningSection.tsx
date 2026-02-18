import React, { useEffect, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLessonSession } from '../hooks/useLessonSession';
import { useExercises } from '../hooks/useExercises';
import { TheoryViewer } from './TheoryViewer';
import { ExerciseContainer } from './exercises/ExerciseContainer';
import { ProgressBar } from './ProgressBar';
import { Screen, AppText, Spacer, AppButton } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';

interface LearningSectionProps {
    lessonId: string;
    loadingText?: string;
    /**
     * Optional title for the exercises header. Defaults to "Ejercicios".
     */
    headerTitle?: string;
    /**
     * Callback for when the user wants to exit the flow (e.g. from an error screen or back button)
     */
    onExit?: () => void;
    /**
     * Render prop for the content to show when the lesson/test is completed.
     */
    renderCompleted: () => React.ReactNode;
}

export const LearningSection: React.FC<LearningSectionProps> = ({
    lessonId,
    loadingText = 'Cargando...',
    headerTitle = 'Ejercicios',
    onExit,
    renderCompleted,
}) => {
    const theme = useAppTheme();
    const {
        status,
        theoryContent,
        exercises,
        startExercises,
        completeLesson,
        lesson
    } = useLessonSession(lessonId);

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
    } = useExercises(exercises);

    // Effect to bridge the "finished exercises" state to "completeLesson"
    useEffect(() => {
        if (isFinished && status === 'exercises') {
            completeLesson();
        }
    }, [isFinished, status, completeLesson]);

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
        return <>{renderCompleted()}</>;
    }

    // Handle case where status is 'theory' or 'exercises' but data might be missing/empty
    // Although useLessonSession should handle 'completed' if empty, let's overlap just in case.

    return (
        <Screen>
            {status === 'theory' && (
                <TheoryViewer content={theoryContent} onContinue={startExercises} />
            )}

            {status === 'exercises' && (
                <View style={styles.exercisesContainer}>
                    <View style={styles.header}>
                        <AppText variant="xl" weight="bold">{headerTitle}</AppText>
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

