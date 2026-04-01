import React from 'react';
import { StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';

interface DeleteAccountModalProps {
    visible: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export const DeleteAccountModal = ({ visible, onDismiss, onConfirm, loading }: DeleteAccountModalProps) => {
    const theme = useAppTheme();
    const { t } = useTranslation();

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                <Text variant="titleLarge" style={{ color: theme.colors.error, marginBottom: 16 }}>
                    {t('settings.deleteAccount.title')}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.textSecondary, marginBottom: 24 }}>
                    {t('settings.deleteAccount.description')}
                </Text>
                <Button
                    mode="contained"
                    buttonColor={theme.colors.error}
                    onPress={onConfirm}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    {t('settings.deleteAccount.confirm')}
                </Button>
                <Button
                    mode="text"
                    textColor={theme.colors.textSecondary}
                    onPress={onDismiss}
                    disabled={loading}
                    style={styles.button}
                >
                    {t('settings.deleteAccount.cancel')}
                </Button>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        padding: 24,
        margin: 20,
        borderRadius: 12,
    },
    button: {
        marginTop: 8,
    }
});
