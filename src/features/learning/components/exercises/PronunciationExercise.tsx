import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PronunciationExercise as PronunciationExerciseType } from '../../types/exercise';
import { AppText, Spacer } from '../../../../components';
import { theme } from '../../../../theme';

interface Props {
    exercise: PronunciationExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string | null;
}

export const PronunciationExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [partialResult, setPartialResult] = useState('');
    const [error, setError] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <AppText variant="lg" weight="medium" align="center" style={styles.prompt}>
                {exercise.question}
            </AppText>

            <View style={styles.phraseContainer}>
                <Ionicons name="volume-medium" size={24} color={theme.colors.primary} style={styles.speakerIcon} />
                <AppText variant="xl" weight="bold" color={theme.colors.primary} align="center">
                    {exercise.phrase}
                </AppText>
            </View>

            <Spacer height={theme.spacing.xl} />

            <View style={styles.microphoneContainer}>
                <TouchableOpacity
                    style={[
                        styles.micButton,
                        isListening && styles.micButtonActive,
                    ]}
                    disabled={isProcessing}
                >
                    {isListening || isProcessing ? (
                        <ActivityIndicator color="#fff" size="large" />
                    ) : (
                        <Ionicons name="mic" size={40} color="#fff" />
                    )}
                </TouchableOpacity>
                <AppText variant="sm" color={theme.colors.textSecondary} style={styles.micLabel}>
                    {isListening ? 'Escuchando...' : isProcessing ? 'Analizando...' : 'Toca para hablar'}
                </AppText>
            </View>

            <Spacer height={theme.spacing.lg} />

            <View style={styles.resultContainer}>
                {/* Mostramos el resultado final o el parcial mientras habla */}
                <AppText variant="lg" align="center" style={styles.userText}>
                    {userAnswer || partialResult || (error ? '' : '...')}
                </AppText>

                {error && (
                    <AppText variant="xs" color={theme.colors.error} align="center" style={{ marginTop: 8 }}>
                        {error}
                    </AppText>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    prompt: {
        marginBottom: theme.spacing.xl,
        color: theme.colors.textSecondary,
    },
    phraseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    speakerIcon: {
        marginRight: theme.spacing.md,
    },
    microphoneContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    micButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    micButtonActive: {
        backgroundColor: theme.colors.error,
        transform: [{ scale: 1.1 }],
    },
    micLabel: {
        marginTop: theme.spacing.md,
    },
    waveformContainer: {
        // Placeholder for waveform animation if needed
    },
    resultContainer: {
        minHeight: 60,
        justifyContent: 'center',
        width: '100%',
    },
    userText: {
        color: theme.colors.text,
    },
});
