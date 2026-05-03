import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { TtsManager } from '../../learning/helpers/tts/ttsKokoro';
import { useSettingsStore } from '../../../store/SettingsStore';
import { useNetInfo } from '@react-native-community/netinfo';
import { Modal, Portal, Card, Text as PaperText, Button as PaperButton, useTheme } from 'react-native-paper';

export const KokoroDisclaimerModal = () => {
    const { t } = useTranslation();
    const netInfo = useNetInfo();
    const theme = useTheme();

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
        },
        title: {
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 24,
            fontSize: 24,
            color: theme.colors.onBackground,
        },
        card: {
            marginBottom: 32,
        },
        description: {
            textAlign: 'center',
            color: theme.colors.onBackground,
            lineHeight: 22,
            marginBottom: 12,
        },
        subtitle: {
            textAlign: 'center',
            fontStyle: 'italic',
            color: theme.colors.onSurfaceVariant,
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
                <PaperText style={styles.title}>
                    {t('home.modals.kokoro.title')}
                </PaperText>

                <Card style={styles.card}>
                    <Card.Content>
                        <PaperText style={styles.description}>
                            {t('home.modals.kokoro.description')}
                        </PaperText>
                        <PaperText style={styles.subtitle}>
                            {t('home.modals.kokoro.subtitle')}
                        </PaperText>
                    </Card.Content>
                </Card>

                <View style={styles.buttonContainer}>
                    <PaperButton
                        mode="contained"
                        onPress={handleAccept}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                    >
                        {t('home.modals.kokoro.accept')}
                    </PaperButton>
                    <PaperButton
                        mode="text"
                        onPress={handleDecline}
                        labelStyle={styles.buttonLabel}
                        textColor={theme.colors.onSurfaceVariant}
                    >
                        {t('home.modals.kokoro.decline')}
                    </PaperButton>
                </View>
            </Modal>
        </Portal>
    );
};
