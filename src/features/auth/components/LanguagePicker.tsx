import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Button, Surface, Appbar, List, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'zh', label: '中文' },
    { code: 'hi', label: 'हिन्दी' },
];

export const LanguagePicker = () => {
    const { i18n, t } = useTranslation();
    const theme = useAppTheme();
    const [visible, setVisible] = useState(false);

    const openModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    const handleSelect = (langCode: string) => {
        i18n.changeLanguage(langCode);
        closeModal();
    };

    const currentLang = LANGUAGES.find((lang) => i18n.language.startsWith(lang.code)) || LANGUAGES[0];

    return (
        <View style={styles.container}>
            <Button 
                onPress={openModal} 
                icon="translate" 
                mode="outlined" 
                textColor={theme.colors.textSecondary}
                style={[styles.button, { borderColor: theme.colors.outline }]}
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
                        <View style={{ paddingVertical: 10 }}>
                            {LANGUAGES.map((lang, index) => (
                                <React.Fragment key={lang.code}>
                                    <List.Item
                                        title={lang.label}
                                        onPress={() => handleSelect(lang.code)}
                                        left={props => <List.Icon {...props} icon="translate" color={i18n.language.startsWith(lang.code) ? theme.colors.primary : theme.colors.textSecondary} />}
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
