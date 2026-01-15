import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useLessonSession } from '../hooks/useLessonSession';
import { TheoryViewer } from '../components/TheoryViewer';
import { ExerciseContainer } from '../components/exercises/ExerciseContainer';
import { useExercises } from '../hooks/useExercises';
import { ProgressBar } from '../components/ProgressBar';
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
                {/* Mensaje de carga de la lección */}
                <AppText>Cargando lección...</AppText>
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
                {/* Botón para continuar tras completar la lección */}
                <AppButton
                    title="Continuar"
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
                        {/* Título de la sección de ejercicios */}
                        <AppText variant="xl" weight="bold">Ejercicios</AppText>
                        <ProgressBar current={isFinished ? exercises.length : exercises.indexOf(currentExercise)} total={exercises.length} />
                    </View>
                    {currentExercise ? (
                        <ExerciseContainer
                            exercise={currentExercise}
                            onCheck={checkAnswer}
                            onNext={nextExercise}
                            lastResult={lastResult}
                        />
                    ) : (
                        /* Mensaje si no se encuentran ejercicios */
                        <AppText align="center">No se encontraron ejercicios.</AppText>
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
