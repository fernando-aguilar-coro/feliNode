import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Modal, Portal, Card, Text as PaperText, Button as PaperButton, useTheme } from 'react-native-paper';
import { useSettingsStore } from '../../../store/SettingsStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeNavigation';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const FirstPracticeModal = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp>();

    const hasDecidedKokoroDownload = useSettingsStore(state => state.hasDecidedKokoroDownload);
    const hasSeenFirstPracticeModal = useSettingsStore(state => state.hasSeenFirstPracticeModal);
    const setHasSeenFirstPracticeModal = useSettingsStore(state => state.setHasSeenFirstPracticeModal);

    // Show only after Kokoro modal has been decided AND this modal hasn't been seen yet
    const visible = hasDecidedKokoroDownload && !hasSeenFirstPracticeModal;

    const handleGoToPractice = () => {
        setHasSeenFirstPracticeModal(true);
        navigation.navigate('InfinitySelectPairs', { lessonId: '' });
    };

    const handleDismiss = () => {
        setHasSeenFirstPracticeModal(true);
    };

    const styles = useMemo(() => StyleSheet.create({
        modalContainer: {
            backgroundColor: theme.colors.background,
            padding: 24,
            margin: 20,
            borderRadius: 16,
        },
        iconContainer: {
            alignSelf: 'center',
            marginBottom: 16,
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
                visible={visible}
                dismissable={false}
                contentContainerStyle={styles.modalContainer}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="game-controller" size={56} color={theme.colors.primary} />
                </View>

                <PaperText style={styles.title}>
                    {t('home.modals.firstPractice.title')}
                </PaperText>

                <Card style={styles.card}>
                    <Card.Content>
                        <PaperText style={styles.description}>
                            {t('home.modals.firstPractice.description')}
                        </PaperText>
                        <PaperText style={styles.subtitle}>
                            {t('home.modals.firstPractice.subtitle')}
                        </PaperText>
                    </Card.Content>
                </Card>

                <View style={styles.buttonContainer}>
                    <PaperButton
                        mode="contained"
                        onPress={handleGoToPractice}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        icon="play-circle"
                    >
                        {t('home.modals.firstPractice.accept')}
                    </PaperButton>
                    <PaperButton
                        mode="text"
                        onPress={handleDismiss}
                        labelStyle={styles.buttonLabel}
                        textColor={theme.colors.onSurfaceVariant}
                    >
                        {t('home.modals.firstPractice.decline')}
                    </PaperButton>
                </View>
            </Modal>
        </Portal>
    );
};
