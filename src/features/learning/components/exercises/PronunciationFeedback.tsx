import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppText, Spacer } from '../../../../components';
import { theme } from '../../../../theme';
import { PronunciationResult } from '../../services/PronunciationService';

interface Props {
    result: PronunciationResult | null;
    targetText: string;
}

const getScoreColor = (score: number) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 40) return '#F39C12'; // Orange
    return theme.colors.error;
};

export const PronunciationFeedback = ({ result, targetText }: Props) => {
    const [showDebug, setShowDebug] = useState(false);

    if (!result) {
        return (
            <AppText variant="xl" style={{ color: theme.colors.text }} align="center">
                {targetText}
            </AppText>
        );
    }

    return (
        <View style={styles.container}>
            {/* Main Word Level Feedback - Readable Sentence */}
            <View style={styles.wordsContainer}>
                {result.words.map((w, i) => (
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

            <Spacer height={theme.spacing.md} />

            {/* Toggle Details */}
            <TouchableOpacity onPress={() => setShowDebug(!showDebug)}>
                <AppText variant="sm" color={theme.colors.primary} style={{ textDecorationLine: 'underline' }}>
                    {showDebug ? "Hide Details" : "Show Details"}
                </AppText>
            </TouchableOpacity>

            {/* Detailed View */}
            {showDebug && (
                <View style={styles.detailsContainer}>
                    {/* Global Metrics */}
                    <View style={styles.metricsRow}>
                        <MetricBadge label="Accuracy" score={result.overallScore} />
                        {result.fluencyScore !== undefined && <MetricBadge label="Fluency" score={result.fluencyScore} />}
                        {result.completenessScore !== undefined && <MetricBadge label="Completeness" score={result.completenessScore} />}
                        {result.pronScore !== undefined && <MetricBadge label="Pronunciation" score={result.pronScore} />}
                    </View>

                    <Spacer height={theme.spacing.sm} />

                    {/* Breakdown by Word -> Syllable (IPA) */}
                    <ScrollView style={styles.breakdownScroll} nestedScrollEnabled>
                        {result.words.map((w, i) => (
                            <View key={i} style={styles.wordBreakdown}>
                                <AppText weight="bold" style={{ color: getScoreColor(w.accuracyScore) }}>
                                    {w.word} ({w.accuracyScore.toFixed(0)})
                                </AppText>

                                <View style={styles.ipaContainer}>
                                    {w.syllables.map((s, j) => (
                                        <View key={j} style={styles.syllableBadge}>
                                            <AppText variant="sm" style={{ color: getScoreColor(s.accuracyScore) }}>
                                                /{s.syllable}/
                                            </AppText>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const MetricBadge = ({ label, score }: { label: string, score: number }) => (
    <View style={styles.metricBadge}>
        <AppText variant="xs" color={theme.colors.textSecondary}>{label}</AppText>
        <AppText variant="md" weight="bold" style={{ color: getScoreColor(score) }}>
            {score.toFixed(0)}
        </AppText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    wordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    word: {
        marginHorizontal: 2,
    },
    detailsContainer: {
        marginTop: theme.spacing.sm,
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: theme.spacing.sm,
        borderWidth: 1,
        borderColor: '#eee',
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginBottom: theme.spacing.sm,
    },
    metricBadge: {
        alignItems: 'center',
        padding: 4,
    },
    breakdownScroll: {
        maxHeight: 200,
    },
    wordBreakdown: {
        marginBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 4,
    },
    ipaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 2,
    },
    syllableBadge: {
        marginRight: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#eee',
    }
});
