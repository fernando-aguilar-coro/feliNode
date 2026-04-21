import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Button, Surface, List, Divider, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useSettingsStore } from '../../../store/SettingsStore';

const LANGUAGES = [
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'pt', label: 'Português' },
    { code: 'it', label: 'Italiano' },
    { code: 'zh', label: '中文' },
    { code: 'hi', label: 'हिन्दी' },
];

export const LanguagePicker = () => {
    const { i18n, t } = useTranslation();
    const theme = useAppTheme();
    const [visible, setVisible] = useState(false);
    const setLanguage = useSettingsStore(state => state.setLanguage);
    const uiLanguage = useSettingsStore(state => state.uiLanguage);

    const openModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    const handleSelect = (langCode: string) => {
        setLanguage(langCode);
        // Solo cambia el idioma de la interfaz si no hay override a 'en'
        if (uiLanguage !== 'en') {
            i18n.changeLanguage(langCode);
        }
        closeModal();
    };

    const currentLang = LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

    return (
        <View style={styles.container}>
            <Button
                onPress={openModal}
                icon="account-voice"
                mode="outlined"
                textColor={theme.colors.textSecondary}
                style={[styles.button, { borderColor: theme.colors.primary }]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
            >
                {currentLang.label}
            </Button>

            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={closeModal}
                >
                    <Surface style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <View style={styles.modalHeader}>
                            <Text variant="titleMedium" style={{ color: theme.colors.text, fontWeight: 'bold' }}>
                                {t('auth.nativeLanguage', 'Tu idioma nativo')}
                            </Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.textSecondary, marginTop: 4 }}>
                                {t('auth.nativeLanguageHint', 'El idioma que hablas actualmente')}
                            </Text>
                        </View>
                        <Divider />
                        <View style={{ paddingVertical: 10 }}>
                            {LANGUAGES.map((lang, index) => (
                                <React.Fragment key={lang.code}>
                                    <List.Item
                                        title={lang.label}
                                        onPress={() => handleSelect(lang.code)}
                                        left={props => <List.Icon {...props} icon="account-voice" color={i18n.language.startsWith(lang.code) ? theme.colors.primary : theme.colors.textSecondary} />}
                                        titleStyle={{
                                            fontSize: 18,
                                            color: i18n.language.startsWith(lang.code) ? theme.colors.primary : theme.colors.text
                                        }}
                                        style={styles.listItem}
                                    />
                                    {index < LANGUAGES.length - 1 && <Divider style={{ marginHorizontal: 15 }} />}
                                </React.Fragment>
                            ))}
                        </View>
                    </Surface>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
    },
    button: {
        borderRadius: 25,
        borderWidth: 1.5,
    },
    buttonContent: {
        height: 50,
        paddingHorizontal: 20,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        borderRadius: 20,
        elevation: 10,
        padding: 10,
    },
    modalHeader: {
        padding: 20,
        alignItems: 'center',
    },
    listItem: {
        paddingVertical: 10,
    },
    closeButton: {
        marginTop: 10,
    }
});
