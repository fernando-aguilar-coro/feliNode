import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';

interface LoginHeaderProps {
    step: 'email' | 'code';
    email?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ step, email }) => {
    const theme = useAppTheme();

    return (
        <View style={styles.container}>
            <AppText variant="xxl" weight="bold" align="center" style={{ color: theme.colors.text }}>
                {step === 'email' ? 'Bienvenido' : 'Verificación'}
            </AppText>
            <Spacer height={theme.spacing.xs} />
            <AppText align="center" color={theme.colors.textSecondary}>
                {step === 'email'
                    ? 'Inicia sesión para continuar aprendiendo'
                    : `Ingresa el código enviado a ${email}`}
            </AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 30,
    }
});
