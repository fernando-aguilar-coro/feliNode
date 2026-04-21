import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useSettingsStore } from '../../../store/SettingsStore';

/**
 * UiLanguagePicker — Toggle opcional para el idioma de la interfaz de la app.
 *
 * - null  → la interfaz sigue el idioma nativo elegido en LanguagePicker
 * - 'en'  → override a inglés, sin importar el idioma nativo
 *
 * Es independiente del LanguagePicker (que elige el idioma nativo del usuario).
 */
export const UiLanguagePicker = () => {
    const { i18n, t } = useTranslation();
    const theme = useAppTheme();

    const uiLanguage  = useSettingsStore(state => state.uiLanguage);
    const nativeLang  = useSettingsStore(state => state.language);
    const setUiLanguage = useSettingsStore(state => state.setUiLanguage);

    // El valor efectivo para el toggle: 'native' | 'en'
    const toggleValue = uiLanguage === 'en' ? 'en' : 'native';

    const handleChange = (val: string) => {
        if (val === 'en') {
            setUiLanguage('en');
            i18n.changeLanguage('en');
        } else {
            // Volver al idioma nativo
            setUiLanguage(null);
            i18n.changeLanguage(nativeLang ?? 'es');
        }
    };

    return (
        <View style={styles.container}>
            <Text
                variant="labelSmall"
                style={[styles.label, { color: theme.colors.textSecondary }]}
            >
                {t('auth.uiLanguage', 'Idioma de la app')}
            </Text>
            <SegmentedButtons
                value={toggleValue}
                onValueChange={handleChange}
                buttons={[
                    {
                        value: 'native',
                        label: t('auth.uiLangNative', 'Nativo'),
                        icon: 'account-voice',
                    },
                    {
                        value: 'en',
                        label: 'English',
                        icon: 'translate',
                    },
                ]}
                style={styles.segmented}
                theme={{ colors: { secondaryContainer: theme.colors.primary + '30' } }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 6,
        gap: 8,
    },
    label: {
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    segmented: {
        width: '100%',
        maxWidth: 320,
    },
});
