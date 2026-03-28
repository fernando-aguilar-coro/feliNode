import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, AppButton, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { MissedPair } from '../hooks/useInfinityPairs';

interface PairsGameOverViewProps {
    lives: number;
    score: number;
    roundNum: number;
    missedPairs: MissedPair[];
    onRestart: () => void;
    onExit: () => void;
}

export const PairsGameOverView: React.FC<PairsGameOverViewProps> = ({
    lives,
    score,
    roundNum,
    missedPairs,
    onRestart,
    onExit,
}) => {
    const theme = useAppTheme();
    const failedByTime = lives > 0;

    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <Ionicons
                name={failedByTime ? 'time-outline' : 'skull-outline'}
                size={72}
                color={theme.colors.error}
            />
            <Spacer height={16} />
            <AppText variant="xl" weight="bold">¡Juego Terminado!</AppText>
            <AppText style={{ color: theme.colors.secondary, marginTop: 4 }}>
                {failedByTime ? 'Se agotó el tiempo.' : 'Te quedaste sin vidas.'}
            </AppText>

            <Spacer height={20} />

            {/* Score summary row */}
            <View style={[styles.summaryRow, { backgroundColor: theme.colors.surface }]}>
                <SummaryColumn icon="star" value={score} label="Puntos" color={theme.colors.warning} />
                <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />
                <SummaryColumn icon="flag" value={roundNum - 1} label="Rondas" color={theme.colors.primary} />
                <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />
                <SummaryColumn icon="heart" value={lives} label="Vidas" color={theme.colors.error} />
            </View>

            {/* Missed pairs summary */}
            {missedPairs.length > 0 && (
                <>
                    <Spacer height={24} />
                    <View style={styles.errorHeader}>
                        <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                        <AppText weight="bold" style={{ color: theme.colors.error, marginLeft: 6, fontSize: 13 }}>
                            Pares que fallaste ({missedPairs.length})
                        </AppText>
                    </View>
                    <View style={[styles.errorBox, { borderColor: theme.colors.error + '40', backgroundColor: theme.colors.error + '0A' }]}>
                        {missedPairs.map((pair, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.errorRow,
                                    i < missedPairs.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
                                ]}
                            >
                                <AppText style={[styles.errorCol, { color: theme.colors.text }]} numberOfLines={2}>
                                    {pair.left}
                                </AppText>
                                <Ionicons name="arrow-forward" size={14} color={theme.colors.secondary} style={{ marginHorizontal: 8 }} />
                                <AppText style={[styles.errorCol, { color: theme.colors.secondary }]} numberOfLines={2}>
                                    {pair.right}
                                </AppText>
                            </View>
                        ))}
                    </View>
                </>
            )}

            <Spacer height={28} />
            <AppButton title="Volver a Jugar" onPress={onRestart} style={{ width: '85%', marginBottom: 10 }} />
            <AppButton title="Salir" variant="secondary" onPress={onExit} style={{ width: '85%' }} />
            <Spacer height={16} />
        </ScrollView>
    );
};

// ── Internal helper ──────────────────────────────────────────────────────────
const SummaryColumn = ({ icon, value, label, color }: { icon: string; value: number; label: string; color: string }) => (
    <View style={styles.summaryItem}>
        <Ionicons name={icon as any} size={20} color={color} />
        <AppText weight="bold" style={{ fontSize: 18 }}>{value}</AppText>
        <AppText style={{ fontSize: 11, color }}>{label}</AppText>
    </View>
);

const styles = StyleSheet.create({
    scroll: {
        alignItems: 'center',
        padding: 24,
        paddingBottom: 40,
    },
    summaryRow: {
        flexDirection: 'row',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 8,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    summaryItem: {
        alignItems: 'center',
        gap: 2,
        flex: 1,
    },
    summaryDivider: {
        width: 1,
        height: 36,
    },
    errorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    errorBox: {
        width: '100%',
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    errorCol: {
        flex: 1,
        fontSize: 12,
    },
});
