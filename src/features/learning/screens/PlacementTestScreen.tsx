import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLessonSession } from '../hooks/useLessonSession';
import { useExercises } from '../hooks/useExercises';
import { ExerciseContainer } from '../components/exercises/ExerciseContainer';
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
                <AppText color={theme.colors.textSecondary}>Loading placement test...</AppText>
            </Screen>
        );
    }

    if (status === 'completed') {
        return (
            <Screen style={styles.centerContainer}>
                <AppText variant="xxl" weight="bold" color={theme.colors.success} align="center">
                    All set!
                </AppText>
                <Spacer height={theme.spacing.sm} />
                <AppText variant="lg" color={theme.colors.textSecondary} align="center">
                    We've determined your level. Let's get started!
                </AppText>

                <Spacer height={theme.spacing.xl} />
                <View style={styles.completionButtonContainer}>
                    <AppButton
                        title="Register to save progress"
                        onPress={() => navigation.navigate('Register')}
                        variant="primary"
                    />
                    <Spacer height={theme.spacing.md} />
                    <AppButton
                        title="Continue without registering"
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
                <AppText variant="lg" weight="bold" align="center">Placement Test</AppText>
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
                        <AppText align="center">No exercises found for the placement test.</AppText>
                        <Spacer height={theme.spacing.md} />
                        <AppButton
                            title="Go Back"
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
