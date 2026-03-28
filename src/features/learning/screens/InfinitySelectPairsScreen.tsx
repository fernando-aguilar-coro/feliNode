import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import { Screen, AppText, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { useInfinityPairs, InfinityPairItem } from '../hooks/useInfinityPairs';
import { audioService } from '../../settings/services/audio.service';
import { infinityProgressRepository } from '../../../db_local/repositories';
import { TtsService } from '../../learning/services/Tts.service';
import * as Haptics from 'expo-haptics';

// Extracted sub-components
import { PairsGameHeader } from '../components/PairsGameHeader';
import { PairsGameOverView } from '../components/PairsGameOverView';
import { PairsLevelUpBanner } from '../components/PairsLevelUpBanner';
import { PairsComboChip } from '../components/PairsComboChip';
import { PairCard } from '../components/PairCard';

type InfinitySelectPairsNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'InfinitySelectPairs'>;
type InfinitySelectPairsRouteProp = RouteProp<HomeStackParamList, 'InfinitySelectPairs'>;

export const InfinitySelectPairsScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<InfinitySelectPairsNavigationProp>();
    const route = useRoute<InfinitySelectPairsRouteProp>();
    const { lessonId } = route.params;

    const {
        leftItems,
        rightItems,
        matchedIds,
        selectedId,
        errorIds,
        score,
        lives,
        timeLeft,
        roundNum,
        roundGoal,
        roundScore,
        isGameOver,
        isLevelUp,
        isInitialLoading,
        combo,
        missedPairs,
        triggerErrorHaptic,
        handlePress,
        restartGame,
    } = useInfinityPairs({
        lessonId,
        visibleCount: 7,
        fillBatchSize: 3,
        initialLives: 7,
        initialTime: 90,
    });

    const isTimeLow = timeLeft <= 10 && !isGameOver;

    // ── Sound & haptic effects ──────────────────────────────────────────────
    React.useEffect(() => {
        if (errorIds) {
            audioService.playIncorrectSound();
            if (triggerErrorHaptic.current) {
                triggerErrorHaptic.current = false;
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        }
    }, [errorIds]);


    React.useEffect(() => {
        if (timeLeft === 10 && !isGameOver) audioService.playTimerSound();
    }, [timeLeft, isGameOver]);

    React.useEffect(() => {
        if (isGameOver) {
            if (score > 0) audioService.playSuccessSound();
            const targetId = lessonId?.trim() ? `Pairs: ${lessonId.trim()}` : 'General Pairs';
            infinityProgressRepository.saveInfinityScore(targetId, score).catch(e => {
                console.error('[InfinityPairs] Error saving score:', e);
            });
        }
    }, [isGameOver, score, lessonId]);

    const handleExit = () => navigation.goBack();

    const handleItemPress = (item: InfinityPairItem) => {
        if (item.col === 'left') {
            TtsService.speak(item.text, { forceNative: true, language: 'en-US' });
        }
        handlePress(item);
    };

    // ── Loading ─────────────────────────────────────────────────────────────
    if (isInitialLoading) {
        return (
            <Screen style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Spacer height={16} />
                <AppText>Preparando pares infinitos...</AppText>
            </Screen>
        );
    }

    // ── Game Over ───────────────────────────────────────────────────────────
    if (isGameOver) {
        return (
            <Screen>
                <PairsGameOverView
                    lives={lives}
                    score={score}
                    roundNum={roundNum}
                    missedPairs={missedPairs}
                    onRestart={restartGame}
                    onExit={handleExit}
                />
            </Screen>
        );
    }

    // ── Play ────────────────────────────────────────────────────────────────
    const progressValue = Math.min(roundScore / roundGoal, 1);

    return (
        <Screen style={styles.container}>
            {isLevelUp && <PairsLevelUpBanner roundNum={roundNum} color={theme.colors.primary} />}

            <PairsGameHeader
                lives={lives}
                timeLeft={timeLeft}
                isTimeLow={isTimeLow}
                onExit={handleExit}
            />

            {/* Round info + Score */}
            <View style={styles.roundRow}>
                <AppText style={{ color: theme.colors.secondary, fontSize: 12 }}>
                    RONDA {roundNum}
                </AppText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="star" size={13} color={theme.colors.warning} />
                    <AppText weight="bold" style={{ fontSize: 14, color: theme.colors.text }}>
                        {score}
                    </AppText>
                </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
                <ProgressBar
                    progress={progressValue}
                    color={theme.colors.primary}
                    style={[styles.progressBar, { backgroundColor: theme.colors.primary + '20' }]}
                />
                <AppText style={{ fontSize: 10, color: theme.colors.secondary, marginTop: 3, textAlign: 'right' }}>
                    {roundScore}/{roundGoal}
                </AppText>
            </View>

            {/* Grid */}
            <View style={styles.columnsContainer}>
                <View style={styles.column}>
                    {leftItems.map((item, idx) => (
                        <PairCard
                            key={item?.id ?? `empty-l-${idx}`}
                            item={item}
                            isMatched={item ? matchedIds.has(item.pairId) : false}
                            isSelected={item ? selectedId === item.id : false}
                            isError={item ? !!errorIds?.includes(item.id) : false}
                            onPress={handleItemPress}
                        />
                    ))}
                </View>
                <View style={styles.column}>
                    {rightItems.map((item, idx) => (
                        <PairCard
                            key={item?.id ?? `empty-r-${idx}`}
                            item={item}
                            isMatched={item ? matchedIds.has(item.pairId) : false}
                            isSelected={item ? selectedId === item.id : false}
                            isError={item ? !!errorIds?.includes(item.id) : false}
                            onPress={handleItemPress}
                        />
                    ))}
                </View>

                {/* Combo overlay — centered on grid, doesn't block touches */}
                <PairsComboChip combo={combo} color={theme.colors.primary} />
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roundRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    progressContainer: {
        marginBottom: 4,
    },
    progressBar: {
        height: 7,
        borderRadius: 4,
    },
    columnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        flex: 1,
        marginTop: 6,
    },
    column: {
        flex: 1,
        gap: 10,
        marginHorizontal: 5,
    },
});
