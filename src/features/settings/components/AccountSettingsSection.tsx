import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Button, Avatar } from 'react-native-paper';
import { useUserStore } from '../../../store/UserStore';
import { useAppTheme } from '../../../theme/ThemeContext';

export const AccountSettingsSection = () => {
    const theme = useAppTheme();
    const logout = useUserStore((state) => state.logout);

    return (
        <List.Section>
            <List.Subheader style={{ color: theme.colors.textSecondary }}>Cuenta</List.Subheader>
            <View style={styles.buttonContainer}>
                <Button
                    mode="outlined"
                    onPress={logout}
                    textColor={theme.colors.error}
                    style={{ borderColor: theme.colors.error }}
                    icon="logout"
                >
                    Cerrar Sesión
                </Button>
            </View>
        </List.Section>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        padding: 16,
    }
});
