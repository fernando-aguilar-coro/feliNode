import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoadingScreen } from '../../../components';
import { useRoute } from '@react-navigation/native';
import { useLessonSession } from '../hooks/useLessonSession';
import { useExercises } from '../hooks/useExercises';
import { ExerciseContainer } from './exercises/ExerciseContainer';
import { ProgressBar } from './ProgressBar';
import { Screen, AppText, Spacer, AppButton } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { audioService } from '../../settings/services/audio.service';
import { useSettingsStore } from '../../../store/SettingsStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const TestScreen: React.FC = () => {
    const theme = useAppTheme();
    const route = useRoute<any>();
    const { lessonId } = route.params || {};
    const { setHasDecidedPlacementTest } = useSettingsStore();

    const onExit = () => setHasDecidedPlacementTest(true);

    const {
        status,
        exercises,
        completeLesson,
        lesson
    } = useLessonSession(lessonId);

    const isExam = true;

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

    useEffect(() => {
        if (isFinished && status === 'exercises') {
            audioService.playSuccessSound();
            completeLesson();
        }
    }, [isFinished, status, completeLesson]);

    const styles = useMemo(() => StyleSheet.create({
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.lg,
        },
        exercisesContainer: {
            flex: 1,
        },
        header: {
            paddingVertical: theme.spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
            marginBottom: theme.spacing.sm,
        },
        badge: {
            backgroundColor: theme.colors.surface,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: 4,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            borderWidth: 1,
            borderColor: theme.colors.primary,
        },
        completedCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: theme.spacing.xl,
            width: '100%',
            alignItems: 'center',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
        }
    }), [theme]);

    if (status === 'loading') {
        return <LoadingScreen type="placement" />;
    }

    if (status === 'completed') {
        return (
            <Screen style={styles.centerContainer}>
                <View style={styles.completedCard}>
                    <MaterialCommunityIcons
                        name="certificate"
                        size={80}
                        color={theme.colors.success}
                    />
                    <Spacer height={theme.spacing.md} />
                    <AppText variant="xxl" weight="bold" color={theme.colors.success} align="center">
                        ¡Evaluación Terminada!
                    </AppText>
                    <Spacer height={theme.spacing.md} />
                    <AppText variant="lg" align="center" color={theme.colors.textSecondary}>
                        Hemos analizado tu desempeño y estamos listos para comenzar tu viaje.
                    </AppText>
                    <Spacer height={theme.spacing.xl} />
                    <AppButton
                        title="Empezar a aprender"
                        onPress={onExit}
                        variant="primary"
                        style={{ width: '100%' }}
                    />
                </View>
            </Screen>
        );
    }

    return (
        <Screen>
            {status === 'exercises' && (
                <View style={styles.exercisesContainer}>
                    <View style={styles.header}>
                        <View style={styles.badge}>
                            <MaterialCommunityIcons name="file-document-edit-outline" size={16} color={theme.colors.primary} />
                            <AppText variant="sm" weight="bold" color={theme.colors.primary}>EVALUACIÓN</AppText>
                        </View>
                        {initialTotal > 0 && (
                            <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
                                <ProgressBar current={completedCount} total={initialTotal} />
                            </View>
                        )}
                    </View>

                    {currentExercise ? (
                        <ExerciseContainer
                            exercise={currentExercise}
                            onCheck={checkAnswer}
                            onNext={nextExercise}
                            lastResult={lastResult}
                            lessonContext={lesson?.title || "Examen"}
                            onOverrideResult={overrideResult}
                        />
                    ) : (
                        <View style={styles.centerContainer}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={48} color={theme.colors.error} />
                            <Spacer height={theme.spacing.md} />
                            <AppText align="center">No se encontraron ejercicios en este examen.</AppText>
                            <Spacer height={theme.spacing.md} />
                            <AppButton
                                title="Volver"
                                onPress={onExit}
                                variant="outline"
                            />
                        </View>
                    )}
                </View>
            )}
        </Screen>
    );
};