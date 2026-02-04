import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { theme } from '../../../theme';
import { AppText } from '../../../components';

interface Props {
    isRecording: boolean;
}

export const LiveSpeechFeedback = ({ isRecording }: Props) => {
    const [transcript, setTranscript] = useState("");

    useSpeechRecognitionEvent("start", () => {
        setTranscript("");
    });

    useSpeechRecognitionEvent("result", (event) => {
        // Show the first result's transcript
        if (event.results && event.results.length > 0) {
            setTranscript(event.results[0]?.transcript || "");
        }
    });

    useSpeechRecognitionEvent("error", (event) => {
        // Silently handle errors for now to avoid disrupting the main flow
        console.warn("Speech recognition error:", event);
    });

    useEffect(() => {
        const handleRecording = async () => {
            if (isRecording) {
                setTranscript("");
                try {
                    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
                    if (!result.granted) {
                        console.warn("Speech recognition permissions not granted");
                        return;
                    }
                    // Start recognition with interim results for real-time feedback
                    ExpoSpeechRecognitionModule.start({
                        lang: "es-ES", // Assuming Spanish based on context "Prueba de Pronunciación"
                        interimResults: true,
                        continuous: true,
                    });
                } catch (e) {
                    console.error("Failed to start speech recognition:", e);
                }
            } else {
                // Stop recognition when recording logic stops
                try {
                    ExpoSpeechRecognitionModule.stop();
                } catch (e) {
                    // Ignore stop errors
                }
            }
        };

        handleRecording();

        // Cleanup on unmount or when isRecording changes
        return () => {
            // We don't necessarily want to eagerly stop here if it causes conflicts with re-renders,
            // but strictly speaking if isRecording goes false, we stop.
            if (isRecording) {
                ExpoSpeechRecognitionModule.stop();
            }
        };
    }, [isRecording]);

    if (!isRecording && !transcript) return null;

    return (
        <View style={styles.container}>
            <AppText variant="sm" color={theme.colors.textSecondary} style={styles.label}>
                {isRecording ? "Escuchando..." : "Dijiste:"}
            </AppText>
            <View style={styles.transcriptContainer}>
                <AppText variant="md" style={styles.transcript} numberOfLines={3}>
                    {transcript || "..."}
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
    }
});
