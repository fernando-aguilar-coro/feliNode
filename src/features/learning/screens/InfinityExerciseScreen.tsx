import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useExercises } from '../hooks/useExercises';
import { ExerciseContainer } from '../components/exercises/ExerciseContainer';
import { InfinityService } from '../services/Infinity.service';
import { infinityProgressRepository } from '../../../db_local/repositories';
import { syncInfinityStats } from '../../../api/syncInfinityStats';
import { Exercise } from '../types/exercise';
import { audioService } from '../../settings/services/audio.service';

import { HomeStackParamList } from '../../home/navigation/HomeNavigation';

type InfinityExerciseRouteProp = RouteProp<HomeStackParamList, 'InfinityExercise'>;

export const InfinityExerciseScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation();
    const route = useRoute<InfinityExerciseRouteProp>();

    // Default to 'General English' if no lessonId is passed, or handle it in the service
    const { lessonId } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [generatingMore, setGeneratingMore] = useState(false);
    const [initialExercises, setInitialExercises] = useState<Exercise[]>([]);
    const [lives, setLives] = useState(7);
    const [gameOver, setGameOver] = useState(false);

    const {
        currentExercise,
        checkAnswer: originalCheckAnswer,
        nextExercise: originalNextExercise,
        lastResult,
        overrideResult,
        addExercises,
        currentIndex,
        totalExercises,
    } = useExercises(initialExercises);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
        },
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.lg,
        },
        header: {
            padding: theme.spacing.md,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        livesContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            borderRadius: 20,
        },
        gameOverTitle: {
            fontSize: 32,
            fontWeight: 'bold',
            color: theme.colors.error,
            marginBottom: theme.spacing.md,
        },
        gameOverText: {
            textAlign: 'center',
            marginBottom: theme.spacing.xl,
            color: theme.colors.textSecondary,
        }
    }), [theme]);

    // Initial Load
    useEffect(() => {
        loadInitialExercises();
        syncInfinityStats(); // Sync on mount
    }, []);

    const loadInitialExercises = async () => {
        setLoading(true);
        setLives(7);
        setGameOver(false);
        try {
            // Pass lessonId or fallback to 'General English'
            const topic = lessonId ? `Lesson: ${lessonId}` : 'General English';
            const exercises = await InfinityService.generateInfiniteExercises(topic, 5);
            setInitialExercises(exercises);
        } catch (error) {
            console.error('Failed to load initial exercises', error);
        } finally {
            setLoading(false);
        }
    };

    // Infinite Scroll Logic: Load more when we are near the end
    useEffect(() => {
        if (!generatingMore && !gameOver && totalExercises > 0 && (totalExercises - currentIndex) <= 2) {
            loadMoreExercises();
        }
    }, [currentIndex, totalExercises, generatingMore, gameOver]);

    const loadMoreExercises = async () => {
        setGeneratingMore(true);
        try {
            const topic = lessonId ? `Lesson: ${lessonId} ` : 'General English';
            const nextBatch = await InfinityService.generateInfiniteExercises(topic, 5);
            addExercises(nextBatch);
        } catch (error) {
            console.error('Failed to generate more exercises', error);
        } finally {
            setGeneratingMore(false);
        }
    };

    const handleCheckAnswer = (answer: string) => {
        if (gameOver) return false;

        const isCorrect = originalCheckAnswer(answer);

        if (!isCorrect) { // originalCheckAnswer returns boolean based on internal logic
            // But wait, useExercises' checkAnswer logic returns boolean?
            // Looking at useExercises.ts: returns isCorrect.
            // If incorrect, it re-adds the exercise to the end.
            // We want to decrement lives.
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setGameOver(true);
                    audioService.playSuccessSound();
                    const targetId = lessonId || 'General English';
                    infinityProgressRepository.saveInfinityScore(targetId, currentIndex).then(() => {

                        syncInfinityStats(); // Sync after saving new score
                    });
                }
                return newLives;
            });
        }
        return isCorrect;
    };

    const handleNextExercise = () => {
        if (!gameOver) {
            originalNextExercise();
        }
    };

    const handleExit = () => {
        navigation.goBack();
    };

    const handleRestart = () => {
        setInitialExercises([]); // Clear current exercises
        loadInitialExercises();
    };

    const handleOverrideResult = (isCorrect: boolean) => {
        overrideResult(isCorrect);
        if (isCorrect) {
            setLives(prev => Math.min(prev + 1, 7));
        }
    };

    if (loading) {
        return (
            <Screen style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Spacer height={theme.spacing.sm} />
                <AppText>Generando ejercicios infinitos...</AppText>
            </Screen>
        );
    }

    if (gameOver) {
        return (
            <Screen style={styles.centerContainer}>
                <AppText style={styles.gameOverTitle}>Game Over</AppText>
                <AppText style={styles.gameOverText}>
                    ¡Te has quedado sin vidas! Has completado {currentIndex} ejercicios.
                </AppText>
                <AppButton title="Intentar de nuevo" onPress={handleRestart} />
                <Spacer height={theme.spacing.md} />
                <AppButton title="Salir" onPress={handleExit} variant="outline" />
            </Screen>
        );
    }

    if (!currentExercise && !loading) {
        return (
            <Screen style={styles.centerContainer}>
                <AppText>No se pudieron generar ejercicios.</AppText>
                <Spacer height={theme.spacing.md} />
                <AppButton title="Reintentar" onPress={loadInitialExercises} />
                <Spacer height={theme.spacing.sm} />
                <AppButton title="Volver" onPress={handleExit} variant="outline" />
            </Screen>
        );
    }

    return (
        <Screen>
            <View style={styles.header}>
                <AppButton
                    title="Salir"
                    onPress={handleExit}
                    variant="ghost"
                />
                <View style={styles.livesContainer}>
                    <AppText variant="lg">❤️ x {lives}</AppText>
                </View>
            </View>

            <ExerciseContainer
                exercise={currentExercise}
                onCheck={handleCheckAnswer}
                onNext={handleNextExercise}
                lastResult={lastResult}
                lessonContext="Modo Infinito"
                onOverrideResult={handleOverrideResult}
            />
            {generatingMore && (
                <View style={{ alignItems: 'center', padding: 10 }}>
                    <AppText variant="sm">Cargando más...</AppText>
                </View>
            )}
        </Screen>
    );
};
