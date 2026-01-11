import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useLessonSession } from '../hooks/useLessonSession';
import { TheoryViewer } from '../components/TheoryViewer';
import { ExerciseContainer } from '../components/exercises/ExerciseContainer';
import { useExercises } from '../hooks/useExercises';
import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { theme } from '../../../theme';

type RootStackParamList = {
    Lesson: { lessonId: string };
};

type LessonScreenRouteProp = RouteProp<RootStackParamList, 'Lesson'>;

export const LessonScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<LessonScreenRouteProp>();
    const { lessonId } = route.params || { lessonId: 'lesson_verbs_intro' }; // Fallback for dev/testing without nav params

    const {
        status,
        theoryContent,
        exercises,
        startExercises,
        completeLesson
    } = useLessonSession(lessonId);

    // Inner hook for exercises (only active when we have exercises)
    const {
        currentExercise,
        isFinished,
        checkAnswer,
        nextExercise,
        lastResult,
    } = useExercises(exercises);

    // Effect to bridge the "finished exercises" state to "completeLesson"
    React.useEffect(() => {
        if (isFinished && status === 'exercises') {
            completeLesson();
        }
    }, [isFinished, status, completeLesson]);


    if (status === 'loading') {
        return (
            <Screen style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Spacer height={theme.spacing.sm} />
                <AppText>Loading Lesson...</AppText>
            </Screen>
        );
    }

    if (status === 'completed') {
        return (
            <Screen style={styles.centerContainer}>
                <AppText variant="xxl" weight="bold" color={theme.colors.success} align="center">
                    Lesson Complete!
                </AppText>
                <Spacer height={theme.spacing.md} />
                <AppText variant="lg" align="center">
                    Great job! You've mastered this lesson.
                </AppText>
                <Spacer height={theme.spacing.xl} />
                <AppButton
                    title="Continue"
                    onPress={() => navigation.goBack()}
                    style={styles.button}
                />
            </Screen>
        );
    }

    return (
        <Screen>
            {status === 'theory' && (
                <TheoryViewer content={theoryContent} onContinue={startExercises} />
            )}

            {status === 'exercises' && (
                <View style={styles.exercisesContainer}>
                    <View style={styles.header}>
                        <AppText variant="xl" weight="bold">Exercises</AppText>
                    </View>
                    {currentExercise ? (
                        <ExerciseContainer
                            exercise={currentExercise}
                            onCheck={checkAnswer}
                            onNext={nextExercise}
                            lastResult={lastResult}
                        />
                    ) : (
                        <AppText align="center">No exercises found.</AppText>
                    )}
                </View>
            )}
        </Screen>
    );
};

const styles = StyleSheet.create({
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '100%',
    },
    exercisesContainer: {
        flex: 1,
    },
    header: {
        paddingVertical: theme.spacing.md,
    },
});
