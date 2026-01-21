import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AppText, Spacer, AppButton } from '../../../../components';
import { theme } from '../../../../theme';
import { Microphone } from '../Microphone';
import { AudioPlayer } from '../AudioPlayer';
import { PronunciationService, PronunciationResult } from '../../services/PronunciationService';
import { PronunciationExercise as PronunciationExerciseType } from '../../types/exercise';

interface Props {
    exercise: PronunciationExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

const getScoreColor = (score: number) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 40) return '#F39C12';
    return theme.colors.error;
};

const FeedbackView = ({ result, targetText }: { result: PronunciationResult | null, targetText: string }) => {
    if (!result) return <AppText variant="xl" style={{ color: theme.colors.text }} align="center">{targetText}</AppText>;

    return (
        <View style={styles.wordsContainer}>
            {result.words.map((w, i) => (
                <AppText key={i} style={[styles.word, { color: getScoreColor(w.accuracyScore) }]} variant="xl" weight="bold">
                    {w.word}{' '}
                </AppText>
            ))}
        </View>
    );
};

export const PronunciationExercise = ({ exercise, onAnswer }: Props) => {
    const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'result'>('idle');
    const [result, setResult] = useState<PronunciationResult | null>(null);
    const [recordedUri, setRecordedUri] = useState<string | null>(null);

    const handleSend = async () => {
        if (!recordedUri) return;
        setStatus('processing');
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

    return (
        <View style={styles.container}>
            <AppText variant="lg" style={styles.question}>Lee esta frase:</AppText>

            <View style={styles.sentenceContainer}>
                <FeedbackView result={result} targetText={exercise.phrase} />
            </View>

            <Spacer height={theme.spacing.lg} />

            {result && (
                <View style={styles.scoreContainer}>
                    <AppText variant="sm" color={theme.colors.textSecondary}>Precisión General:</AppText>
                    <AppText variant="xxl" style={{ color: getScoreColor(result.overallScore) }} weight="bold">
                        {result.overallScore.toFixed(0)}%
                    </AppText>
                </View>
            )}

            <Spacer height={theme.spacing.md} />

            {status === 'processing' ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Spacer height={theme.spacing.sm} />
                    <AppText variant="sm" color={theme.colors.textLight}>Analizando...</AppText>
                </View>
            ) : status === 'result' || recordedUri ? (
                <View style={styles.reviewContainer}>
                    <View style={styles.reviewButtons}>
                        <AppButton title="Reintentar" onPress={handleRetry} variant="outline" style={{ marginRight: 10 }} />
                        {!result && <AppButton title="Enviar" onPress={handleSend} variant="primary" />}
                    </View>
                </View>
            ) : (
                <Microphone
                    maxTimeSeconds={15}
                    onRecordingComplete={React.useCallback((uri: string | null) => {
                        if (uri) setRecordedUri(uri);
                    }, [])}
                />
            )}

            {recordedUri && <AudioPlayer uri={recordedUri} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: 'center', width: '100%' },
    question: { marginBottom: theme.spacing.md, color: theme.colors.textSecondary },
    sentenceContainer: { minHeight: 80, justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.md },
    wordsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: theme.spacing.sm },
    word: { marginHorizontal: 3 },
    scoreContainer: { alignItems: 'center' },
    loadingContainer: { alignItems: 'center' },
    reviewContainer: { width: '100%', alignItems: 'center' },
    reviewButtons: { flexDirection: 'row', justifyContent: 'center' }
});
