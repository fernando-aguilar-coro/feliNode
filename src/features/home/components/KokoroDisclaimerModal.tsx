import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, ProgressBar, useTheme, Modal, Portal } from 'react-native-paper';
import { TtsManager } from '../../learning/helpers/tts/ttsKokoro';
import { useSettingsStore } from '../../../store/SettingsStore';
import { useNetInfo } from '@react-native-community/netinfo';

export const KokoroDisclaimerModal = () => {
    const theme = useTheme();
    const netInfo = useNetInfo();

    const hasDecidedKokoroDownload = useSettingsStore(state => state.hasDecidedKokoroDownload);
    const setHasDecidedKokoroDownload = useSettingsStore(state => state.setHasDecidedKokoroDownload);
    const setWantsKokoro = useSettingsStore(state => state.setWantsKokoro);

    const handleAccept = () => {
        setHasDecidedKokoroDownload(true);
        setWantsKokoro(true);
        // Start background download automatically since state is now updated
        TtsManager.initialize().catch((error) => {
            console.error('Error in background download:', error);
        });
    };

    const handleDecline = () => {
        setHasDecidedKokoroDownload(true);
        setWantsKokoro(false);
    };

    const styles = useMemo(() => StyleSheet.create({
        modalContainer: {
            backgroundColor: theme.colors.background,
            padding: 24,
            margin: 20,
            borderRadius: 16,
            elevation: 5,
        },
        icon: {
            alignSelf: 'center',
            marginBottom: 24,
        },
        title: {
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 24,
            color: theme.colors.onBackground,
        },
        card: {
            marginBottom: 32,
            elevation: 2,
        },
        description: {
            textAlign: 'center',
            marginBottom: 16,
            color: theme.colors.onBackground,
        },
        subtitle: {
            textAlign: 'center',
            fontStyle: 'italic',
            color: theme.colors.onSurfaceVariant,
        },
        progressContainer: {
            marginTop: 16,
            paddingHorizontal: 20,
        },
        buttonContainer: {
            marginTop: 24,
            gap: 12,
        },
        button: {
            paddingVertical: 6,
        },
        buttonLabel: {
            fontSize: 16,
            fontWeight: 'bold',
        },
    }), [theme]);

    return (
        <Portal>
            <Modal
                visible={!hasDecidedKokoroDownload && netInfo.isConnected !== false}
                dismissable={false}
                contentContainerStyle={styles.modalContainer}
            >
                <Text style={[styles.title, { fontSize: 24 }]}>
                    Mejorar Pronunciación
                </Text>

                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.description}>
                            nekoEnglish puede usar un modelo de voz avanzado (Kokoro TTS) para ofrecer una pronunciación más natural en inglés, sin necesidad de internet.
                        </Text>
                        <Text style={styles.subtitle}>
                            Requiere descargar un modelo de voz (aprox. 300MB) por única vez.
                        </Text>
                    </Card.Content>
                </Card>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleAccept}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                    >
                        Descargar y mejorar audio
                    </Button>
                    <Button
                        mode="text"
                        onPress={handleDecline}
                        labelStyle={styles.buttonLabel}
                        textColor={theme.colors.onSurfaceVariant}
                    >
                        Usar voz Nativa (No descargar)
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};
