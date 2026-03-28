import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, useTheme, Modal, Portal } from 'react-native-paper';
import { useSettingsStore } from '../../../store/SettingsStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeNavigation';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const FirstPracticeModal = () => {
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
            elevation: 5,
        },
        iconContainer: {
            alignSelf: 'center',
            marginBottom: 16,
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
            marginBottom: 12,
            color: theme.colors.onBackground,
            lineHeight: 22,
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

                <Text style={[styles.title, { fontSize: 24 }]}>
                    ¡Prueba tu Primera Práctica!
                </Text>

                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.description}>
                            ¿Te gustaría probar un ejercicio rápido de emparejar palabras en inglés con su traducción? Es una forma divertida de empezar a practicar.
                        </Text>
                        <Text style={styles.subtitle}>
                            Conecta pares de palabras en inglés y español contrarreloj. 🎯
                        </Text>
                    </Card.Content>
                </Card>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleGoToPractice}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        icon="play-circle"
                    >
                        ¡Vamos a practicar!
                    </Button>
                    <Button
                        mode="text"
                        onPress={handleDismiss}
                        labelStyle={styles.buttonLabel}
                        textColor={theme.colors.onSurfaceVariant}
                    >
                        Ahora no, gracias
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};
