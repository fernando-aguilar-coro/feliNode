import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, AppButton, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { MissedExercise } from '../hooks/useExercises';

interface LessonEndViewProps {
    /** True if the lesson was completed (all exercises done), false if game over. */
    success: boolean;
    /** Lives remaining at the end. */
    lives: number;
    /** Total exercises answered correctly. */
    completedCount: number;
    /** Total exercises in the original set. */
    totalExercises: number;
    /** Highest combo streak achieved. */
    maxCombo: number;
    /** Exercises the user got wrong. */
    missedExercises: MissedExercise[];
    /** Action to go back / continue. */
    onContinue: () => void;
    /** Action to navigate to Infinity mode. */
    onInfinity?: () => void;
    /** Information about the rewards earned. */
    rewardsInfo?: { xpGained: number, wasBoosted: boolean, coinsGained: number, wasCoinsBoosted?: boolean } | null;
}

export const LessonEndView: React.FC<LessonEndViewProps> = ({
    success,
    lives,
    completedCount,
    totalExercises,
    maxCombo,
    missedExercises,
    onContinue,
    onInfinity,
    rewardsInfo
}) => {
    const theme = useAppTheme();

    const icon = success ? 'trophy' : 'skull-outline';
    const iconColor = success ? theme.colors.warning : theme.colors.error;
    const title = success ? '¡Lección Completada!' : '¡Juego Terminado!';
    const subtitle = success
        ? '¡Buen trabajo! Has dominado esta lección.'
        : 'Te quedaste sin vidas. ¡Inténtalo de nuevo!';

    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <Ionicons name={icon as any} size={72} color={iconColor} />
            <Spacer height={16} />
            <AppText variant="xl" weight="bold" style={{ color: success ? theme.colors.success : theme.colors.error }}>
                {title}
            </AppText>
            <AppText style={{ color: theme.colors.secondary, marginTop: 4, textAlign: 'center' }}>
                {subtitle}
            </AppText>

            <Spacer height={20} />

            {/* Score summary row */}
            <View style={[styles.summaryRow, { backgroundColor: theme.colors.surface }]}>
                <SummaryColumn
                    icon="checkmark-circle"
                    value={completedCount}
                    label={`/ ${totalExercises}`}
                    color={theme.colors.success}
                />
                <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />
                <SummaryColumn
                    icon="heart"
                    value={lives}
                    label="Vidas"
                    color={theme.colors.error}
                />
                <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />
                <SummaryColumn
                    icon="flame"
                    value={maxCombo}
                    label="Max Combo"
                    color={theme.colors.primary}
                />
            </View>

            {/* XP and Coins row */}
            {success && rewardsInfo && (
                <View style={[styles.summaryRow, { backgroundColor: theme.colors.surface, marginTop: 12 }]}>
                    <SummaryColumn
                        icon={rewardsInfo.wasBoosted ? "flash" : "star"}
                        value={rewardsInfo.xpGained}
                        label={rewardsInfo.wasBoosted ? "¡Doble XP!" : "XP"}
                        color={rewardsInfo.wasBoosted ? "#FF69B4" : "#FFD700"}
                    />
                    <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />
                    <SummaryColumn
                        icon="logo-usd"
                        value={rewardsInfo.coinsGained}
                        label={rewardsInfo.wasCoinsBoosted ? "¡Monedas x2!" : "Monedas"}
                        color={rewardsInfo.wasCoinsBoosted ? "#00CED1" : "#FFA500"}
                    />
                </View>
            )}

            {/* Missed exercises review */}
            {missedExercises.length > 0 && (
                <>
                    <Spacer height={24} />
                    <View style={styles.errorHeader}>
                        <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                        <AppText weight="bold" style={{ color: theme.colors.error, marginLeft: 6, fontSize: 13 }}>
                            Revisa tus errores ({missedExercises.length})
                        </AppText>
                    </View>
                    <View style={[styles.errorBox, { borderColor: theme.colors.error + '40', backgroundColor: theme.colors.error + '0A' }]}>
                        {missedExercises.map((item, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.errorRow,
                                    i < missedExercises.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
                                ]}
                            >
                                <View style={{ flex: 1 }}>
                                    <AppText style={{ color: theme.colors.text, fontSize: 12 }} numberOfLines={2}>
                                        {item.question}
                                    </AppText>
                                    <View style={styles.answerRow}>
                                        <Ionicons name="close-circle" size={12} color={theme.colors.error} />
                                        <AppText style={{ color: theme.colors.error, fontSize: 11, marginLeft: 4 }} numberOfLines={1}>
                                            {item.userAnswer || '—'}
                                        </AppText>
                                    </View>
                                </View>
                                <Ionicons name="arrow-forward" size={14} color={theme.colors.secondary} style={{ marginHorizontal: 8 }} />
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <View style={styles.answerRow}>
                                        <Ionicons name="checkmark-circle" size={12} color={theme.colors.success} />
                                        <AppText style={{ color: theme.colors.success, fontSize: 11, marginLeft: 4 }} numberOfLines={2}>
                                            {item.correctAnswer}
                                        </AppText>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </>
            )}

            <Spacer height={28} />
            <AppButton title="Continuar" onPress={onContinue} style={{ width: '85%', marginBottom: 10 }} />
            {onInfinity && (
                <AppButton title="Más ejercicios (Infinito)" variant="outline" onPress={onInfinity} style={{ width: '85%' }} />
            )}
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
    answerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
});
