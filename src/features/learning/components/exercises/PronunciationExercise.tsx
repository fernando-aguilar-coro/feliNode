import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AppText, Spacer } from '../../../../components';
import { theme } from '../../../../theme';
import { Microphone } from '../Microphone';
import { PronunciationService, PronunciationResult } from '../../services/PronunciationService';
// Assuming the types are defined in types/exercise.ts. If not, I'll use 'any' or define interface here for now to avoid errors.
// But mostly the container imports Exercise from types.
import { Exercise } from '../../types/exercise';

interface Props {
    exercise: Exercise;
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

    // Cast exercise to specific type if needed, or access properties safely (assuming 'targetSentence' exists on pronunciation exercise type)
    // Using 'any' cast for safety if type definition isn't fully visible to me right now, but standard access is preferable.
    const targetText = (exercise as any).targetSentence || (exercise as any).question || "Read the text";

    const handleRecordingComplete = async (uri: string | null) => {
        if (!uri) return;

        setProcessing(true);
        setResult(null); // Clear previous results

        try {
            console.log('Analyzing pronunciation...');
            const comparisonData = await PronunciationService.assessPronunciation(uri, targetText);
            setResult(comparisonData);

            // Determine if passed based on overall score (e.g., > 60)
            // We pass the score as the "answer" so the container can validate it if needed,
            // or simply pass "correct" if logic is here.
            // For now, let's pass the score as a string so it's non-empty.
            onAnswer(comparisonData.overallScore.toString());

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo analizar la pronunciación. Inténtalo de nuevo.");
            onAnswer(""); // Reset answer so user can't submit empty
        } finally {
            setProcessing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return theme.colors.success;
        if (score >= 40) return theme.colors.warning; // Assuming warning color exists, else orange
        return theme.colors.error;
    };

    return (
        <View style={styles.container}>
            <AppText variant="h3" style={styles.question}>
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
                                variant="body1"
                                weight="bold"
                            >
                                {word.word}{' '}
                            </AppText>
                        ))}
                    </View>
                ) : (
                    <AppText variant="h2" style={styles.targetText} align="center">
                        {targetText}
                    </AppText>
                )}
            </View>

            <Spacer height={theme.spacing.lg} />

            {/* Show Overall Score if available */}
            {result && (
                <View style={styles.scoreContainer}>
                    <AppText variant="label">Precisión General:</AppText>
                    <AppText
                        variant="h2"
                        style={{ color: getScoreColor(result.overallScore) }}
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
                    <AppText variant="caption">Analizando tu pronunciación...</AppText>
                </View>
            ) : (
                <Microphone
                    maxTimeSeconds={10} // Short sentences usually
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
        minHeight: 60, // Avoid layout jump
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
    },
    word: {
        marginHorizontal: 2,
    },
    scoreContainer: {
        alignItems: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
    }
});
