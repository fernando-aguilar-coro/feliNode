import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { useInfinityPairs, InfinityPairItem } from '../hooks/useInfinityPairs';
import { audioService } from '../../settings/services/audioService';

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
        isInitialLoading,
        handlePress,
        restartGame
    } = useInfinityPairs({
        lessonId,
        visibleCount: 8,
        batchSize: 20,
        fillBatchSize: 3,
        initialLives: 7,
        initialTime: 90
    });

    React.useEffect(() => {
        if (score > 0) audioService.playCorrectSound();
    }, [score]);

    React.useEffect(() => {
        if (lives < 7 && !isGameOver) audioService.playIncorrectSound();
    }, [lives]);

    React.useEffect(() => {
        if (roundNum > 1) audioService.playSuccessSound();
    }, [roundNum]);

    React.useEffect(() => {
        if (isGameOver && score > 0) audioService.playSuccessSound();
    }, [isGameOver]);

    const handleExit = () => {
        navigation.goBack();
    };

    if (isInitialLoading) {
        return (
            <Screen style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Spacer height={16} />
                <AppText>Preparando pares infinitos...</AppText>
            </Screen>
        );
    }

    if (isGameOver) {
        return (
            <Screen style={styles.gameOverContainer}>
                <Ionicons name={lives <= 0 ? "skull-outline" : "time-outline"} size={80} color={theme.colors.error} />
                <Spacer height={24} />
                <AppText variant="xl" weight="bold">¡Juego Terminado!</AppText>
                <Spacer height={8} />
                <AppText>{lives <= 0 ? "Te quedaste sin vidas." : "Se agotó el tiempo."}</AppText>
                <Spacer height={16} />
                <AppText>Puntuación Final: {score}</AppText>
                <Spacer height={4} />
                <AppText>Rondas superadas: {roundNum - 1}</AppText>
                <Spacer height={32} />
                <AppButton title="Volver a Jugar" onPress={restartGame} style={{ width: '80%', marginBottom: 12 }} />
                <AppButton title="Salir" variant="secondary" onPress={handleExit} style={{ width: '80%' }} />
            </Screen>
        );
    }

    const renderItem = (item: InfinityPairItem | null) => {
        if (!item) {
            return <View style={[styles.itemEmpty, { borderColor: theme.colors.border }]} key={Math.random()} />;
        }

        const isMatched = matchedIds.has(item.pairId);
        const isSelected = selectedId === item.id;
        const isError = errorIds?.includes(item.id);

        let backgroundColor = theme.colors.surface;
        let borderColor = theme.colors.border;
        let opacity = 1;

        if (isMatched) {
            backgroundColor = theme.colors.success + '40';
            borderColor = theme.colors.success;
            opacity = 0.5;
        } else if (isError) {
            backgroundColor = theme.colors.error + '40';
            borderColor = theme.colors.error;
        } else if (isSelected) {
            backgroundColor = theme.colors.primary + '40';
            borderColor = theme.colors.primary;
        }

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.item,
                    { backgroundColor, borderColor, opacity }
                ]}
                onPress={() => handlePress(item)}
                disabled={isMatched}
            >
                <AppText style={{ color: theme.colors.text, textAlign: 'center' }}>
                    {item.text}
                </AppText>
            </TouchableOpacity>
        );
    };

    return (
        <Screen style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleExit} style={styles.backButton}>
                    <Ionicons name="close" size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <View style={styles.statsContainer}>
                    <View style={[styles.badge, { backgroundColor: theme.colors.error + '20' }]}>
                        <Ionicons name="heart" size={16} color={theme.colors.error} />
                        <Spacer width={theme.spacing.xs} />
                        <AppText weight="bold" color={theme.colors.error}>{lives}</AppText>
                    </View>
                    <Spacer width={8} />
                    <View style={[styles.badge, { backgroundColor: theme.colors.warning + '20' }]}>
                        <Ionicons name="time" size={16} color={theme.colors.warning} />
                        <Spacer width={theme.spacing.xs} />
                        <AppText weight="bold" color={theme.colors.warning}>{timeLeft}s</AppText>
                    </View>
                    <Spacer width={8} />
                    <View style={[styles.badge, { backgroundColor: theme.colors.primary + '20' }]}>
                        <Ionicons name="flag" size={16} color={theme.colors.primary} />
                        <Spacer width={theme.spacing.xs} />
                        <AppText weight="bold" color={theme.colors.primary}>{roundScore}/{roundGoal}</AppText>
                    </View>
                </View>
            </View>

            <AppText style={[styles.question, { color: theme.colors.text }]}>
                Ronda {roundNum} - Puntuación: {score}
            </AppText>

            <View style={styles.columnsContainer}>
                <View style={styles.column}>
                    {leftItems.map(renderItem)}
                </View>
                <View style={styles.column}>
                    {rightItems.map(renderItem)}
                </View>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameOverContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        padding: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    columnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        flex: 1,
    },
    column: {
        flex: 1,
        gap: 16,
        marginHorizontal: 8,
    },
    item: {
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 2,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 60,
    },
    itemEmpty: {
        paddingVertical: 18,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        width: '100%',
        minHeight: 60,
        opacity: 0.3,
    },
});
