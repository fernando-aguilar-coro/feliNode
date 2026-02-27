import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Card, ProgressBar, useTheme } from 'react-native-paper';
import { TtsManager } from '../helpers/tts/ttsKokoro';
import { useSettingsStore } from '../../../store/SettingsStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const KokoroDisclaimerScreen = () => {
    const theme = useTheme();
    const setHasDecidedKokoroDownload = useSettingsStore((state) => state.setHasDecidedKokoroDownload);
    const setKokoroDownloaded = useSettingsStore((state) => state.setKokoroDownloaded);

    const [isDownloading, setIsDownloading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleAccept = async () => {
        setIsDownloading(true);
        try {
            await TtsManager.initialize((prog) => {
                setProgress(prog);
            });
            setKokoroDownloaded(true);
        } catch (error) {
            console.error('Error downloading Kokoro TTS model:', error);
            // Even if it fails, maybe we let them continue normally, or try again?
            // For now, if it fails, we assume they didn't download it.
        } finally {
            setHasDecidedKokoroDownload(true);
            setIsDownloading(false);
        }
    };

    const handleDecline = () => {
        setHasDecidedKokoroDownload(true);
        setKokoroDownloaded(false);
    };

    const handleDownloadBackground = () => {
        setHasDecidedKokoroDownload(true);
        // Iniciar en segundo plano sin esperar
        TtsManager.initialize().then(() => {
            setKokoroDownloaded(true);
        }).catch((error) => {
            console.error('Error in background download:', error);
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <MaterialCommunityIcons name="volume-high" size={80} color={theme.colors.primary} style={styles.icon} />

                <Text variant="headlineMedium" style={styles.title}>
                    Mejorar Pronunciación
                </Text>

                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="bodyLarge" style={styles.description}>
                            FeliNode puede usar un modelo de voz avanzado (Kokoro TTS) para ofrecer una pronunciación más natural en inglés, sin necesidad de internet.
                        </Text>
                        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                            Requiere descargar un modelo de voz (aprox. 300MB) por única vez.
                        </Text>
                    </Card.Content>
                </Card>

                {isDownloading ? (
                    <View style={styles.progressContainer}>
                        <Text variant="bodyMedium" style={styles.progressText}>
                            Descargando modelo... {Math.round(progress * 100)}%
                        </Text>
                        <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
                    </View>
                ) : (
                    <View style={styles.buttonContainer}>
                        <Button
                            mode="contained"
                            onPress={handleAccept}
                            style={styles.button}
                            labelStyle={styles.buttonLabel}
                        >
                            Descargar Ahora
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={handleDownloadBackground}
                            style={styles.button}
                            labelStyle={styles.buttonLabel}
                        >
                            Descargar en segundo plano
                        </Button>
                        <Button
                            mode="text"
                            onPress={handleDecline}
                            style={styles.cancelButton}
                        >
                            Usar voz básica
                        </Button>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    icon: {
        alignSelf: 'center',
        marginBottom: 24,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 24,
    },
    card: {
        marginBottom: 32,
        elevation: 2,
    },
    description: {
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        textAlign: 'center',
        fontStyle: 'italic',
    },
    progressContainer: {
        marginTop: 16,
        paddingHorizontal: 20,
    },
    progressText: {
        textAlign: 'center',
        marginBottom: 12,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
    },
    buttonContainer: {
        marginTop: 16,
    },
    button: {
        marginBottom: 12,
        paddingVertical: 6,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
    },
});
