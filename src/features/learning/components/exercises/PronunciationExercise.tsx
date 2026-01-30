
import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { AppText, Spacer, AppButton } from '../../../../components';
import { theme } from '../../../../theme';
import { Microphone } from '../Microphone';
import { AudioPlayer } from '../AudioPlayer';
import { PronunciationService, PronunciationResult } from '../../services/PronunciationService';
import { PronunciationExercise as PronunciationExerciseType } from '../../types/exercise';
import { PronunciationFeedbackAzure } from './PronunciationFeedbackAzure';
import { PronunciationFeedbackGemini } from './PronunciationFeedbackGemini';


interface Props {
    exercise: PronunciationExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

const getScoreColor = (score: number) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 60) return '#F39C12';
    if (score >= 40) return '#f31212ff';
    return theme.colors.error;
};


export const PronunciationExercise = ({ exercise, onAnswer }: Props) => {
    const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'result'>('idle');
    const [result, setResult] = useState<PronunciationResult | null>(null);
    const [recordedUri, setRecordedUri] = useState<string | null>(null);

    const handleSend = async () => {
        if (!recordedUri) return;
        setStatus('processing');
        setResult(null);

        try {
            const data = await PronunciationService.assessPronunciation(recordedUri, exercise.phrase);
            setResult(data);
            onAnswer(data.overallScore.toString());
            setStatus('result');
        } catch (error) {
            Alert.alert("Error", "No se pudo analizar la pronunciación.");
            onAnswer("");
            setStatus('idle');
        }
    };

    const handleRetry = () => {
        setRecordedUri(null);
        setResult(null);
        setStatus('idle');
    };

    const handleRecordingStart = React.useCallback(() => {
        setStatus('recording');
    }, []);

    const handleRecordingComplete = React.useCallback((uri: string | null) => {
        if (uri) {
            setRecordedUri(uri);
            setStatus('idle');
        } else {
            setStatus('idle');
        }
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <AppText variant="lg" style={styles.question}>Lee esta frase:</AppText>

            {result && (
                <View style={styles.scoreContainer}>
                    <AppText variant="sm" color={theme.colors.textSecondary}>Precisión General:</AppText>
                    <AppText variant="xxl" style={{ color: getScoreColor(result.overallScore) }} weight="bold">
                        {result.overallScore.toFixed(0)}%
                    </AppText>
                </View>
            )}
            <Spacer height={theme.spacing.md} />
            <PronunciationFeedbackAzure result={result} targetText={exercise.phrase} />
            <PronunciationFeedbackGemini feedback={result?.geminiFeedback} />
            <Spacer height={theme.spacing.lg} />

            {status === 'processing' && !result ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Spacer height={theme.spacing.sm} />
                    <AppText variant="sm" color={theme.colors.textLight}>Analizando...</AppText>
                </View>
            ) : null}

            {recordedUri && !result && status !== 'processing' ? (
                <View style={styles.reviewContainer}>
                    <View style={styles.reviewButtons}>
                        <AppButton title="Reintentar" onPress={handleRetry} variant="outline" style={{ marginRight: 10 }} />
                        <AppButton title="Enviar" onPress={handleSend} variant="primary" />
                    </View>
                </View>
            ) : status !== 'result' && status !== 'processing' ? (
                <Microphone
                    onRecordingStart={handleRecordingStart}
                    onRecordingComplete={handleRecordingComplete}
                />
            ) : null}

            {/* Allow re-recording even if result is shown? Or maybe just status !== 'processing' */}
            {status === 'result' && (
                <View style={styles.reviewContainer}>
                    <AppButton title="Intentar de nuevo" onPress={handleRetry} variant="outline" />
                </View>
            )}

            {recordedUri && <AudioPlayer uri={recordedUri} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    question: {
        marginBottom: theme.spacing.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    scoreContainer: {
        alignItems: 'center',
        marginVertical: theme.spacing.md,
    },
    loadingContainer: {
        alignItems: 'center',
        marginVertical: theme.spacing.md,
    },
    reviewContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: theme.spacing.md,
    },
    reviewButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.md, // Use gap for better spacing
    }
});
