import React from 'react';
import { StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import { useAppTheme } from '../../../theme/ThemeContext';

interface DeleteAccountModalProps {
    visible: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export const DeleteAccountModal = ({ visible, onDismiss, onConfirm, loading }: DeleteAccountModalProps) => {
    const theme = useAppTheme();

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                <Text variant="titleLarge" style={{ color: theme.colors.error, marginBottom: 16 }}>
                    ¿Eliminar cuenta?
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.textSecondary, marginBottom: 24 }}>
                    Esta acción es irreversible. Se borrará todo tu progreso de forma permanente y no podrás recuperarlo.
                </Text>
                <Button
                    mode="contained"
                    buttonColor={theme.colors.error}
                    onPress={onConfirm}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    Eliminar permanentemente
                </Button>
                <Button
                    mode="text"
                    textColor={theme.colors.textSecondary}
                    onPress={onDismiss}
                    disabled={loading}
                    style={styles.button}
                >
                    Cancelar
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
