import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLessonSession } from '../hooks/useLessonSession';
import { useExercises } from '../hooks/useExercises';
import { ExerciseContainer } from '../components/exercises/ExerciseContainer';
import { ProgressBar } from '../components/ProgressBar';
import { useUserStore } from '../../../store/UserStore';
import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { theme } from '../../../theme';

export const PlacementTestScreen = () => {
    const navigation = useNavigation<any>();

    // Placement test is a special "lesson" in our DB
    const {
        status,
        exercises,
        completeLesson
    } = useLessonSession('placement_test');

    const {
        currentExercise,
        isFinished,
        checkAnswer,
        nextExercise,
        lastResult,
    } = useExercises(exercises);

    // When exercises are finished, mark lesson as completed
    useEffect(() => {
        if (isFinished && status === 'exercises') {
            completeLesson();
        }
    }, [isFinished, status, completeLesson]);

    // When status becomes completed, we show options instead of auto-navigating
    const completeOnboarding = useUserStore((state) => state.completeOnboarding);

    if (status === 'loading') {
        return (
            <Screen style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Spacer height={theme.spacing.sm} />
                {/* Mensaje de carga de la prueba de nivel */}
                <AppText color={theme.colors.textSecondary}>Cargando prueba de nivel...</AppText>
            </Screen>
        );
    }

    if (status === 'completed') {
        return (
            <Screen style={styles.centerContainer}>
                <AppText variant="xxl" weight="bold" color={theme.colors.success} align="center">
                    ¡Todo listo!
                </AppText>
                <Spacer height={theme.spacing.sm} />
                <AppText variant="lg" color={theme.colors.textSecondary} align="center">
                    Hemos determinado tu nivel. ¡Empecemos!
                </AppText>

                <Spacer height={theme.spacing.xl} />
                <View style={styles.completionButtonContainer}>
                    <AppButton
                        title="Identifícate para guardar tu progreso"
                        onPress={() => navigation.navigate('Login')}
                        variant="primary"
                    />
                    <Spacer height={theme.spacing.md} />
                    {/* Opción para continuar sin cuenta */}
                    <AppButton
                        title="Continuar sin registrarse"
                        onPress={() => completeOnboarding()}
                        variant="secondary"
                    />
                </View>
            </Screen>
        );
    }

    return (
        <Screen>
            <View style={styles.header}>
                {/* Título de la pantalla de prueba de nivel */}
                <AppText variant="lg" weight="bold" align="center">Prueba de Nivel</AppText>
                {exercises.length > 0 && (
                    <ProgressBar current={isFinished ? exercises.length : exercises.indexOf(currentExercise)} total={exercises.length} />
                )}
            </View>

            <View style={styles.content}>
                {currentExercise ? (
                    <ExerciseContainer
                        exercise={currentExercise}
                        onCheck={checkAnswer}
                        onNext={nextExercise}
                        lastResult={lastResult}
                    />
                ) : (
                    <View style={styles.centerContainer}>
                        {/* Mensaje de error si no hay ejercicios para el test */}
                        <AppText align="center">No se encontraron ejercicios para la prueba de nivel.</AppText>
                        <Spacer height={theme.spacing.md} />
                        <AppButton
                            title="Volver"
                            onPress={() => navigation.navigate('Welcome')}
                            variant="primary"
                        />
                    </View>
                )}
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        marginBottom: theme.spacing.md,
    },
    content: {
        flex: 1,
    },
    completionButtonContainer: {
        width: '100%',
    },
});
