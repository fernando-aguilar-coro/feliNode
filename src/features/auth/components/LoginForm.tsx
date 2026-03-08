import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppTextInput, AppButton, Spacer, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';

interface LoginFormProps {
    email: string;
    code: string;
    step: 'email' | 'code';
    loading: boolean;
    onEmailChange: (text: string) => void;
    onCodeChange: (text: string) => void;
    onSubmit: () => void;
    onBack: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    email,
    code,
    step,
    loading,
    onEmailChange,
    onCodeChange,
    onSubmit,
    onBack,
}) => {
    const theme = useAppTheme();

    return (
        <View style={styles.container}>
            {step === 'email' ? (
                <View>
                    <AppTextInput
                        label="Correo electrónico"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChangeText={onEmailChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            ) : (
                <View>
                    <AppTextInput
                        label="Código de verificación"
                        placeholder="123456"
                        value={code}
                        onChangeText={onCodeChange}
                        keyboardType="number-pad"
                        maxLength={6}
                        style={{ letterSpacing: 8, fontSize: 24, textAlign: 'center' }}
                    />
                </View>
            )}

            <Spacer height={theme.spacing.lg} />

            <AppButton
                title={loading ? "Procesando..." : (step === 'email' ? "Continuar con Email" : "Verificar e Ingresar")}
                onPress={onSubmit}
                disabled={loading}
                variant="primary"
                style={styles.mainButton}
            />

            <Spacer height={theme.spacing.md} />
            <AppButton
                title={step === 'email' ? "Volver" : "Cambiar correo"}
                onPress={onBack}
                disabled={loading}
                variant="outline"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    mainButton: {
        width: '100%',
    }
});
