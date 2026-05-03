import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ProgressBar, Modal, Portal, Card, Text as PaperText, Button as PaperButton } from 'react-native-paper';
import { Screen, AppText, Spacer, LoadingScreen } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { useInfinityPairs, InfinityPairItem } from '../hooks/useInfinityPairs';
import { audioService } from '../../settings/services/audio.service';
import { infinityProgressRepository, streakRepository } from '../../../db_local/repositories';
import { TtsService } from '../../learning/services/Tts.service';
import { useAppRewardedAd } from '../../../hooks/useAppRewardedAd';
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
        reviveGame,
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


    // ── Ad Logic & Game Over Interception ───────────────────────────────────
    const { isLoaded: isAdLoaded, showAd } = useAppRewardedAd();
    const [showReviveModal, setShowReviveModal] = React.useState(false);
    const [actuallyGameOver, setActuallyGameOver] = React.useState(false);

    React.useEffect(() => {
        if (isGameOver && !actuallyGameOver) {
            if (isAdLoaded) {
                setShowReviveModal(true);
            } else {
                setActuallyGameOver(true);
            }
        }
    }, [isGameOver, isAdLoaded, actuallyGameOver]);

    const handleRevive = async () => {
        setShowReviveModal(false);
        const success = await showAd();
        if (success) {
            reviveGame();
        } else {
            setActuallyGameOver(true);
        }
    };

    const handleDeclineRevive = () => {
        setShowReviveModal(false);
        setActuallyGameOver(true);
    };

    const handleRestartWrap = () => {
        setActuallyGameOver(false);
        setShowReviveModal(false);
        restartGame();
    };

    React.useEffect(() => {
        if (actuallyGameOver) {
            if (score > 0) audioService.playSuccessSound();
            const targetId = lessonId?.trim() ? `Pairs: ${lessonId.trim()}` : 'General Pairs';
            infinityProgressRepository.saveInfinityScore(targetId, score).then(() => {
                streakRepository.updateStreak().catch(e => console.error('[Streak] Update error:', e));
            }).catch(e => {
                console.error('[InfinityPairs] Error saving score:', e);
            });
        }
    }, [actuallyGameOver, score, lessonId]);

    const handleExit = () => navigation.goBack();

    const handleItemPress = (item: InfinityPairItem) => {
        if (item.col === 'left') {
            TtsService.speak(item.text, { forceNative: true, language: 'en-US' });
        }
        handlePress(item);
    };

    // ── Loading ─────────────────────────────────────────────────────────────
    if (isInitialLoading) {
        return <LoadingScreen type="pairs" />;
    }

    // ── Game Over ───────────────────────────────────────────────────────────
    if (actuallyGameOver) {
        return (
            <Screen>
                <PairsGameOverView
                    lives={lives}
                    score={score}
                    roundNum={roundNum}
                    missedPairs={missedPairs}
                    onRestart={handleRestartWrap}
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
                            isMatched={item ? matchedIds.has(item.id) : false}
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
                            isMatched={item ? matchedIds.has(item.id) : false}
                            isSelected={item ? selectedId === item.id : false}
                            isError={item ? !!errorIds?.includes(item.id) : false}
                            onPress={handleItemPress}
                        />
                    ))}
                </View>

                {/* Combo overlay — centered on grid, doesn't block touches */}
                <PairsComboChip combo={combo} color={theme.colors.primary} />
            </View>

            <Portal>
                <Modal
                    visible={showReviveModal}
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
                        ¿Fin del juego?
                    </PaperText>
                    <Card style={{ marginBottom: 32 }}>
                        <Card.Content>
                            <PaperText style={{
                                textAlign: 'center',
                                color: theme.colors.text,
                                lineHeight: 22,
                            }}>
                                Mira un corto video para recuperar 1 vida, obtener 30 segundos y continuar.
                            </PaperText>
                        </Card.Content>
                    </Card>
                    <View style={{ marginTop: 24, gap: 12 }}>
                        <PaperButton
                            mode="contained"
                            onPress={handleRevive}
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
                            No gracias, terminar
                        </PaperButton>
                    </View>
                </Modal>
            </Portal>
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
