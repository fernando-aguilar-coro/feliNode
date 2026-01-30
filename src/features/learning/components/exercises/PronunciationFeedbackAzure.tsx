import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Spacer } from '../../../../components';
import { theme } from '../../../../theme';
import { PronunciationResult, PronunciationWordResult, PronunciationSyllableResult } from '../../services/PronunciationService';

interface Props {
    result: PronunciationResult | null;
    targetText: string;
}

const getScoreColor = (score: number) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 40) return '#F39C12'; // Orange
    return theme.colors.error;
};

export const PronunciationFeedbackAzure = ({ result, targetText }: Props) => {
    if (!result) {
        return (
            <View style={styles.emptyContainer}>
                <AppText variant="xl" style={{ color: theme.colors.text }} align="center">
                    {targetText}
                </AppText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Main Word Level Feedback - Readable Sentence */}
            <View style={styles.wordsContainer}>
                {result.words.map((w: PronunciationWordResult, i: number) => (
                    <AppText
                        key={i}
                        variant="xl"
                        weight="bold"
                        style={[styles.word, { color: getScoreColor(w.accuracyScore) }]}
                    >
                        {w.word}{' '}
                    </AppText>
                ))}
            </View>

            <Spacer height={theme.spacing.lg} />

            {/* Detailed View - Always Visible */}
            <View style={styles.detailsContainer}>
                <AppText variant="md" weight="bold" color={theme.colors.textSecondary} style={{ marginBottom: theme.spacing.sm }}>
                    Análisis Detallado
                </AppText>

                {/* Global Metrics */}
                <View style={styles.metricsRow}>
                    <MetricBadge label="Precisión" score={result.overallScore} />
                    {result.fluencyScore !== undefined && <MetricBadge label="Fluidez" score={result.fluencyScore} />}
                    {result.completenessScore !== undefined && <MetricBadge label="Completitud" score={result.completenessScore} />}
                    {result.pronScore !== undefined && <MetricBadge label="Pronunciación" score={result.pronScore} />}
                </View>

                <Spacer height={theme.spacing.md} />

                {/* Breakdown by Word -> Syllable (IPA) */}
                <View style={styles.breakdownContainer}>
                    {result.words.map((w: PronunciationWordResult, i: number) => (
                        <View key={i} style={styles.wordBreakdown}>
                            <View style={styles.wordHeader}>
                                <AppText weight="bold" style={{ color: getScoreColor(w.accuracyScore), fontSize: 16 }}>
                                    {w.word}
                                </AppText>
                                <AppText variant="sm" color={theme.colors.textSecondary}>
                                    {w.accuracyScore.toFixed(0)}%
                                </AppText>
                            </View>

                            <View style={styles.ipaContainer}>
                                {w.syllables.map((s: PronunciationSyllableResult, j: number) => (
                                    <View key={j} style={styles.syllableBadge}>
                                        <AppText variant="sm" style={{ color: getScoreColor(s.accuracyScore) }}>
                                            /{s.syllable}/
                                        </AppText>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const MetricBadge = ({ label, score }: { label: string, score: number }) => (
    <View style={styles.metricBadge}>
        <AppText variant="xs" color={theme.colors.textSecondary}>{label}</AppText>
        <AppText variant="lg" weight="bold" style={{ color: getScoreColor(score) }}>
            {score.toFixed(0)}
        </AppText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.md,
    },
    word: {
        marginHorizontal: 3,
        marginBottom: 4,
    },
    detailsContainer: {
        width: '100%',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap', // Allow wrapping on small screens
        marginBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xs,
    },
    metricBadge: {
        alignItems: 'center',
        padding: 8,
        minWidth: 70,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        margin: 4,
    },
    breakdownContainer: {
        width: '100%',
    },
    wordBreakdown: {
        marginBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: theme.spacing.sm,
    },
    wordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    ipaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    syllableBadge: {
        marginRight: 8,
        marginBottom: 4,
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    }
});
