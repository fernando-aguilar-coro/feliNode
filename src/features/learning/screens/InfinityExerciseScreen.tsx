import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Screen, AppText, AppButton, Spacer, LoadingScreen } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useExercises } from '../hooks/useExercises';
import { ExerciseContainer } from '../components/exercises/ExerciseContainer';
import { InfinityService } from '../services/Infinity.service';
import { infinityProgressRepository, streakRepository } from '../../../db_local/repositories';
import { syncInfinityStats } from '../../../api/syncInfinityStats';
import { Exercise } from '../types/exercise';
import { audioService } from '../../settings/services/audio.service';

import { HomeStackParamList } from '../../home/navigation/HomeNavigation';

type InfinityExerciseRouteProp = RouteProp<HomeStackParamList, 'InfinityExercise'>;

export const InfinityExerciseScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation();
    const route = useRoute<InfinityExerciseRouteProp>();
    const { t } = useTranslation();

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
        completedCount,
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
            const nextBatch = await InfinityService.generateInfiniteExercises(topic, 5, completedCount);
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
                    infinityProgressRepository.saveInfinityScore(targetId, completedCount).then(() => {
                        streakRepository.updateStreak().catch(e => console.error('[Streak] Update error:', e));
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
        return <LoadingScreen type="generating" />;
    }

    if (gameOver) {
        return (
            <Screen style={styles.centerContainer}>
                <AppText style={styles.gameOverTitle}>{t('learning.infinity.gameOver')}</AppText>
                <AppText style={styles.gameOverText}>
                    {t('learning.infinity.livesLost', { count: completedCount })}
                </AppText>
                <AppButton title={t('learning.infinity.tryAgain')} onPress={handleRestart} />
                <Spacer height={theme.spacing.md} />
                <AppButton title={t('learning.infinity.exit')} onPress={handleExit} variant="outline" />
            </Screen>
        );
    }

    if (!currentExercise && !loading) {
        return (
            <Screen style={styles.centerContainer}>
                <AppText>{t('learning.infinity.errorGenerating')}</AppText>
                <Spacer height={theme.spacing.md} />
                <AppButton title={t('learning.infinity.retry')} onPress={loadInitialExercises} />
                <Spacer height={theme.spacing.sm} />
                <AppButton title={t('learning.infinity.back')} onPress={handleExit} variant="outline" />
            </Screen>
        );
    }

    return (
        <Screen>
            <View style={styles.header}>
                <AppButton
                    title={t('learning.infinity.exit')}
                    onPress={handleExit}
                    variant="ghost"
                />
                <View style={styles.livesContainer}>
                    <AppText variant="lg">{t('learning.infinity.lives', { lives })}</AppText>
                </View>
            </View>

            <ExerciseContainer
                exercise={currentExercise}
                onCheck={handleCheckAnswer}
                onNext={handleNextExercise}
                lastResult={lastResult}
                lessonContext={t('learning.infinity.modeName')}
                onOverrideResult={handleOverrideResult}
            />
            {generatingMore && (
                <View style={{ alignItems: 'center', padding: 10 }}>
                    <AppText variant="sm">{t('learning.infinity.loadingMore')}</AppText>
                </View>
            )}
        </Screen>
    );
};
