import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../../theme';
import { AppText } from '../../../components';

/**
 * Pure display component.
 * Receives `transcript` and `isRecording` as props — it does NOT
 * instantiate ExpoSpeechRecognitionModule itself.
 * The single instance is managed by `useMicrophone`.
 */
interface Props {
    isRecording: boolean;
    transcript: string;
}

export const LiveSpeechFeedback = ({ isRecording, transcript }: Props) => {
    if (!isRecording && !transcript) return null;

    return (
        <View style={styles.container}>
            <AppText variant="sm" color={theme.colors.textSecondary} style={styles.label}>
                {isRecording ? 'Escuchando...' : 'Dijiste:'}
            </AppText>
            <View style={styles.transcriptContainer}>
                <AppText variant="md" style={styles.transcript} numberOfLines={3}>
                    {transcript || '...'}
                </AppText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: theme.spacing.md,
        alignItems: 'center',
        marginVertical: theme.spacing.sm,
    },
    label: {
        marginBottom: 4,
    },
    transcriptContainer: {
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transcript: {
        textAlign: 'center',
        color: theme.colors.primary,
        fontStyle: 'italic',
    },
});
