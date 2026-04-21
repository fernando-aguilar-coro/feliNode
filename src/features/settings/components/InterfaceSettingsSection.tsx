import React, { useState } from 'react';
import { List, Surface, Divider, SegmentedButtons, Text as PaperText } from 'react-native-paper';
import { Text, View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme, useThemeControl } from '../../../theme/ThemeContext';
import { useSettingsStore } from '../../../store/SettingsStore';
import { useTranslation } from 'react-i18next';

/**
 * Idiomas disponibles como idioma NATIVO del usuario.
 * Estos son los idiomas desde los que el usuario aprende inglés.
 */
const NATIVE_LANGUAGES = [
    { code: 'es', label: 'Español' },
    { code: 'zh', label: '中文' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'fr', label: 'Français' },
    { code: 'pt', label: 'Português' },
    { code: 'it', label: 'Italiano' },
];

export const InterfaceSettingsSection = () => {
    const theme = useAppTheme();
    const { isDark, toggleTheme } = useThemeControl();
    const { t, i18n } = useTranslation();

    const nativeLang   = useSettingsStore(state => state.language);
    const setLanguage  = useSettingsStore(state => state.setLanguage);
    const uiLanguage   = useSettingsStore(state => state.uiLanguage);
    const setUiLanguage = useSettingsStore(state => state.setUiLanguage);

    const [visible, setVisible] = useState(false);

    // ─── Native language modal ────────────────────────────────────────────────
    const openModal  = () => setVisible(true);
    const closeModal = () => setVisible(false);

    const handleNativeSelect = (langCode: string) => {
        setLanguage(langCode);
        // Solo actualiza i18n si no hay override de interfaz a 'en'
        if (uiLanguage !== 'en') {
            i18n.changeLanguage(langCode);
        }
        closeModal();
    };

    const currentNative = NATIVE_LANGUAGES.find(l => l.code === nativeLang)
        ?? NATIVE_LANGUAGES[0];

    // ─── UI language toggle ───────────────────────────────────────────────────
    const toggleValue = uiLanguage === 'en' ? 'en' : 'native';

    const handleUiLangChange = (val: string) => {
        if (val === 'en') {
            setUiLanguage('en');
            i18n.changeLanguage('en');
        } else {
            setUiLanguage(null);
            i18n.changeLanguage(nativeLang ?? 'es');
        }
    };

    return (
        <List.Section>
            <List.Subheader style={{ color: theme.colors.textSecondary }}>
                {t('settings.interface.title')}
            </List.Subheader>

            {/* ── Tema oscuro / claro ─────────────────────────── */}
            <List.Item
                title={isDark ? t('settings.interface.darkMode') : t('settings.interface.lightMode')}
                titleStyle={{ color: theme.colors.text }}
                description={t('settings.interface.tapToChangeTheme')}
                descriptionStyle={{ color: theme.colors.textSecondary }}
                left={props => (
                    <List.Icon
                        {...props}
                        icon={isDark ? 'weather-night' : 'weather-sunny'}
                        color={isDark ? theme.colors.primary : theme.colors.text}
                    />
                )}
                right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.primary} />}
                onPress={toggleTheme}
            />

            {/* ── Idioma nativo ───────────────────────────────── */}
            <List.Item
                title={t('settings.interface.nativeLanguage')}
                titleStyle={{ color: theme.colors.text }}
                description={t('settings.interface.tapToChangeNativeLanguage')}
                descriptionStyle={{ color: theme.colors.textSecondary }}
                left={props => <List.Icon {...props} icon="account-voice" color={theme.colors.text} />}
                right={() => (
                    <Text style={{ alignSelf: 'center', color: theme.colors.primary, marginRight: 16, fontWeight: 'bold' }}>
                        {currentNative.label.toUpperCase()}
                    </Text>
                )}
                onPress={openModal}
            />

            {/* ── Idioma de la interfaz (toggle nativo / en) ──── */}
            <View style={styles.uiLangContainer}>
                <PaperText variant="labelSmall" style={[styles.uiLangLabel, { color: theme.colors.textSecondary }]}>
                    {t('settings.interface.appLanguage')}
                </PaperText>
                <SegmentedButtons
                    value={toggleValue}
                    onValueChange={handleUiLangChange}
                    buttons={[
                        {
                            value: 'native',
                            label: t('settings.interface.appLangNative'),
                            icon: 'account-voice',
                        },
                        {
                            value: 'en',
                            label: t('settings.interface.appLangEn'),
                            icon: 'translate',
                        },
                    ]}
                    style={styles.segmented}
                    theme={{ colors: { secondaryContainer: theme.colors.primary + '30' } }}
                />
            </View>

            {/* ── Modal: selección de idioma nativo ───────────── */}
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
                            <PaperText variant="titleMedium" style={{ color: theme.colors.text, fontWeight: 'bold' }}>
                                {t('settings.interface.nativeLanguage')}
                            </PaperText>
                            <PaperText variant="bodySmall" style={{ color: theme.colors.textSecondary, marginTop: 4 }}>
                                {t('settings.interface.tapToChangeNativeLanguage')}
                            </PaperText>
                        </View>
                        <Divider />
                        <View style={{ paddingVertical: 10 }}>
                            {NATIVE_LANGUAGES.map((lang, index) => (
                                <React.Fragment key={lang.code}>
                                    <List.Item
                                        title={lang.label}
                                        onPress={() => handleNativeSelect(lang.code)}
                                        left={props => (
                                            <List.Icon
                                                {...props}
                                                icon="account-voice"
                                                color={nativeLang === lang.code ? theme.colors.primary : theme.colors.textSecondary}
                                            />
                                        )}
                                        titleStyle={{
                                            fontSize: 18,
                                            color: nativeLang === lang.code ? theme.colors.primary : theme.colors.text,
                                        }}
                                        style={styles.listItem}
                                    />
                                    {index < NATIVE_LANGUAGES.length - 1 && <Divider style={{ marginHorizontal: 15 }} />}
                                </React.Fragment>
                            ))}
                        </View>
                    </Surface>
                </TouchableOpacity>
            </Modal>
        </List.Section>
    );
};

const styles = StyleSheet.create({
    uiLangContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    uiLangLabel: {
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    segmented: {
        alignSelf: 'flex-start',
        minWidth: 260,
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
});
