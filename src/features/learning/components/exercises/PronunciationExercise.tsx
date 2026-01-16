import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
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

    // 1. Handlers con useCallback para estabilidad
    const onSpeechStart = useCallback(() => {
        setIsListening(true);
        setError(null);
    }, []);

    const onSpeechEnd = useCallback(() => {
        setIsListening(false);
        setIsProcessing(true); // El usuario dejó de hablar, ahora el motor procesa
    }, []);

    const onSpeechResults = useCallback((e: SpeechResultsEvent) => {
        if (e.value && e.value[0]) {
            const finalResult = e.value[0];
            onAnswer(finalResult);
            setPartialResult(''); // Limpiamos el texto temporal
        }
        setIsProcessing(false);
    }, [onAnswer]);

    const onSpeechPartialResults = useCallback((e: SpeechResultsEvent) => {
        if (e.value && e.value[0]) {
            setPartialResult(e.value[0]); // feedback en tiempo real
        }
    }, []);

    const onSpeechError = useCallback((e: SpeechErrorEvent) => {
        setIsListening(false);
        setIsProcessing(false);

        // Mapeo de errores amigables
        const errorCode = e.error?.message || '';
        if (errorCode.includes('7')) setError('No te escuché bien, ¿puedes repetir?');
        else if (errorCode.includes('9')) setError('Permiso de micrófono denegado');
        else setError('Hubo un problema con el micrófono');
    }, []);

    // 2. Setup y Cleanup
    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechError = onSpeechError;

        return () => {
            // Cleanup total
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, [onSpeechStart, onSpeechEnd, onSpeechResults, onSpeechPartialResults, onSpeechError]);

    const requestMicrophonePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true; // iOS maneja permisos automáticamente al solicitar uso, o via Info.plist
    };

    const toggleListening = async () => {
        try {
            if (isListening) {
                await Voice.stop();
            } else {
                setError(null);

                const hasPermission = await requestMicrophonePermission();
                if (!hasPermission) {
                    setError('Se requiere permiso de micrófono');
                    return;
                }

                setPartialResult('');
                await Voice.start('en-US');
            }
        } catch (e) {
            console.error(e);
            setError('No se pudo iniciar el micrófono');
        }
    };

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
                    onPress={toggleListening}
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
