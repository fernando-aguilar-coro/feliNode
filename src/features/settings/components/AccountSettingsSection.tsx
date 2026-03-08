import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Button } from 'react-native-paper';
import { useUserStore } from '../../../store/UserStore';
import { useAppTheme } from '../../../theme/ThemeContext';
import { DeleteAccountModal } from './DeleteAccountModal';

export const AccountSettingsSection = () => {
    const theme = useAppTheme();
    const logout = useUserStore((state) => state.logout);
    const deleteAccount = useUserStore((state) => state.deleteAccount);
    const isGuest = useUserStore((state) => state.isGuest);
    const signInWithGoogle = useUserStore((state) => state.signInWithGoogle);

    const [modalVisible, setModalVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            if (deleteAccount) {
                await deleteAccount();
            } else {
                console.warn("deleteAccount not defined in UserStore");
                await logout();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsDeleting(false);
            setModalVisible(false);
        }
    };

    return (
        <List.Section>
            <List.Subheader style={{ color: theme.colors.textSecondary }}>Cuenta</List.Subheader>
            <View style={styles.buttonContainer}>
                {isGuest ? (
                    <Button
                        mode="contained"
                        onPress={async () => {
                            try {
                                await signInWithGoogle();
                            } catch (error) {
                                console.error('Error linking Google account:', error);
                            }
                        }}
                        icon="google"
                    >
                        Vincular Cuenta con Google
                    </Button>
                ) : (
                    <>
                        <Button
                            mode="outlined"
                            onPress={logout}
                            textColor={theme.colors.error}
                            style={{ borderColor: theme.colors.error, marginBottom: 12 }}
                            icon="logout"
                        >
                            Cerrar Sesión
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() => setModalVisible(true)}
                            buttonColor={theme.colors.error}
                            icon="delete"
                        >
                            Eliminar Cuenta
                        </Button>
                    </>
                )}
            </View>

            <DeleteAccountModal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                onConfirm={handleDeleteAccount}
                loading={isDeleting}
            />
        </List.Section>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        padding: 16,
    }
});
