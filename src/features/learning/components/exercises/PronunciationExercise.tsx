import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AppText, Spacer } from '../../../../components';
import { theme } from '../../../../theme';
import { Microphone } from '../Microphone';
import { PronunciationService, PronunciationResult } from '../../services/PronunciationService';
import { PronunciationExercise as PronunciationExerciseType } from '../../types/exercise';

interface Props {
    exercise: PronunciationExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

/**
 * Component for handling pronunciation exercises.
 * 1. Shows target text.
 * 2. Records audio.
 * 3. Sends to API for assessment.
 * 4. Displays detailed feedback (colored words/score).
 */
export const PronunciationExercise = ({ exercise, onAnswer }: Props) => {
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<PronunciationResult | null>(null);

    // Use the correct property from the interface
    const targetText = exercise.phrase;

    const handleRecordingComplete = async (uri: string | null) => {
        if (!uri) return;

        setProcessing(true);
        setResult(null); // Clear previous results

        try {
            console.log('Analyzing pronunciation...');
            const comparisonData = await PronunciationService.assessPronunciation(uri, targetText);
            setResult(comparisonData);

            // Determine if passed based on overall score (e.g., > 60)
            // We pass the score as the "answer" so the container can validate it if needed.
            onAnswer(comparisonData.overallScore.toString());

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo analizar la pronunciación. Verifique su conexión e inténtelo de nuevo.");
            onAnswer(""); // Reset answer
        } finally {
            setProcessing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return theme.colors.success;
        if (score >= 40) return '#F39C12'; // Darker orange/gold for better readability than theme.colors.warning
        return theme.colors.error;
    };

    return (
        <View style={styles.container}>
            <AppText variant="lg" style={styles.question}>
                Lee esta frase:
            </AppText>

            <View style={styles.sentenceContainer}>
                {/* If we have a detailed result, render words with colors. Otherwise render the plain target text. */}
                {result ? (
                    <View style={styles.wordsContainer}>
                        {result.words.map((word, index) => (
                            <AppText
                                key={index}
                                style={[styles.word, { color: getScoreColor(word.accuracyScore) }]}
                                variant="xl"
                                weight="bold"
                            >
                                {word.word}{' '}
                            </AppText>
                        ))}
                    </View>
                ) : (
                    <AppText variant="xl" style={styles.targetText} align="center">
                        {targetText}
                    </AppText>
                )}
            </View>

            <Spacer height={theme.spacing.lg} />

            {/* Show Overall Score if available */}
            {result && (
                <View style={styles.scoreContainer}>
                    <AppText variant="sm" color={theme.colors.textSecondary}>Precisión General:</AppText>
                    <AppText
                        variant="xxl"
                        style={{ color: getScoreColor(result.overallScore) }}
                        weight="bold"
                    >
                        {result.overallScore.toFixed(0)}%
                    </AppText>
                </View>
            )}

            <Spacer height={theme.spacing.md} />

            {processing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Spacer height={theme.spacing.sm} />
                    <AppText variant="sm" color={theme.colors.textLight}>Analizando tu pronunciación...</AppText>
                </View>
            ) : (
                <Microphone
                    maxTimeSeconds={15} // Increased slightly for comfort
                    onRecordingComplete={handleRecordingComplete}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    question: {
        marginBottom: theme.spacing.md,
        color: theme.colors.textSecondary,
    },
    sentenceContainer: {
        minHeight: 80, // Avoid layout jump
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
    },
    targetText: {
        color: theme.colors.text,
    },
    wordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
    },
    word: {
        marginHorizontal: 3,
    },
    scoreContainer: {
        alignItems: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
    }
});
