import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Modal, Portal, Card, Text as PaperText, Button as PaperButton } from 'react-native-paper';
import { Screen, AppText, AppButton, Spacer, LoadingScreen } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useExercises } from '../hooks/useExercises';
import { ExerciseContainer } from '../components/exercises/ExerciseContainer';
import { InfinityService } from '../services/Infinity.service';
import { infinityProgressRepository, streakRepository } from '../../../db_local/repositories';
import { syncInfinityStats } from '../../../api/syncInfinityStats';
import { Exercise } from '../types/exercise';
import { audioService } from '../../settings/services/audio.service';
import { useAppRewardedAd } from '../../../hooks/useAppRewardedAd';

import { HomeStackParamList } from '../../home/navigation/HomeNavigation';

type InfinityExerciseRouteProp = RouteProp<HomeStackParamList, 'InfinityExercise'>;

export const InfinityExerciseScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation();
    const route = useRoute<InfinityExerciseRouteProp>();
    const { t } = useTranslation();

    const { isLoaded: isAdLoaded, showAd } = useAppRewardedAd();
    const [isReviveModalVisible, setReviveModalVisible] = useState(false);

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

    const triggerGameOver = () => {
        setGameOver(true);
        audioService.playIncorrectSound(); // Better to play incorrect sound on death instead of success
        const targetId = lessonId || 'General English';
        infinityProgressRepository.saveInfinityScore(targetId, completedCount).then(() => {
            streakRepository.updateStreak().catch(e => console.error('[Streak] Update error:', e));
            syncInfinityStats(); // Sync after saving new score
        });
    };

    const handleCheckAnswer = (answer: string) => {
        if (gameOver) return false;

        const isCorrect = originalCheckAnswer(answer);

        if (!isCorrect) { 
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    if (isAdLoaded) {
                        setReviveModalVisible(true);
                    } else {
                        triggerGameOver();
                    }
                }
                return newLives;
            });
        }
        return isCorrect;
    };

    const handleReviveWithAd = async () => {
        setReviveModalVisible(false);
        const success = await showAd();
        if (success) {
            setLives(1); // Revive with 1 life
        } else {
            triggerGameOver();
        }
    };

    const handleDeclineRevive = () => {
        setReviveModalVisible(false);
        triggerGameOver();
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

            <Portal>
                <Modal
                    visible={isReviveModalVisible}
                    onDismiss={handleDeclineRevive}
                    contentContainerStyle={{
                        backgroundColor: theme.colors.background,
                        padding: 24,
                        margin: 20,
                        borderRadius: 16,
                    }}
                >
                    <PaperText style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginBottom: 24,
                        fontSize: 24,
                        color: theme.colors.text,
                    }}>
                        ¿Te quedaste sin vidas?
                    </PaperText>
                    <Card style={{ marginBottom: 32 }}>
                        <Card.Content>
                            <PaperText style={{
                                textAlign: 'center',
                                color: theme.colors.text,
                                lineHeight: 22,
                            }}>
                                Mira un corto video para recuperar 1 vida y continuar tu racha de práctica.
                            </PaperText>
                        </Card.Content>
                    </Card>
                    <View style={{ marginTop: 24, gap: 12 }}>
                        <PaperButton
                            mode="contained"
                            onPress={handleReviveWithAd}
                            style={{ paddingVertical: 6 }}
                            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                        >
                            Ver Video 🎥
                        </PaperButton>
                        <PaperButton
                            mode="text"
                            onPress={handleDeclineRevive}
                            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                        >
                            No gracias, terminar práctica
                        </PaperButton>
                    </View>
                </Modal>
            </Portal>
        </Screen>
    );
};
