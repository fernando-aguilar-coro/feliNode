import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useUserStore } from '../../../store/UserStore';
import { Screen, AppText, AppTextInput, AppButton, Spacer } from '../../../components';
import { theme } from '../../../theme';

export default function LoginScreen() {
    const { sendOtp, verifyOtp, loading } = useUserStore();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState<'email' | 'code'>('email');

    const handleSendOtp = async () => {
        if (!email) {
            setError('Por favor ingresa tu correo');
            return;
        }
        setError('');
        try {
            await sendOtp(email);
            setStep('code');
        } catch (err: any) {
            setError(err.message || 'Error al enviar el código');
        }
    };

    const handleVerifyOtp = async () => {
        if (!code || code.length < 6) {
            setError('Por favor ingresa el código de 6 dígitos');
            return;
        }
        setError('');
        try {
            await verifyOtp(email, code);
            // On success, the store's isAuthenticated changes and Navigation handles the rest
        } catch (err: any) {
            setError(err.message || 'El código es incorrecto o ha expirado');
        }
    };

    return (
        <Screen>
            <Spacer height={theme.spacing.xl} />
            <AppText variant="xxl" weight="bold" align="center">
                {step === 'email' ? 'Iniciar Sesión' : 'Verificar Código'}
            </AppText>
            <AppText align="center" color={theme.colors.textSecondary}>
                {step === 'email'
                    ? 'Ingresa tu correo para recibir un código de acceso'
                    : `Ingresa el código que enviamos a ${email}`}
            </AppText>
            <Spacer height={theme.spacing.xl} />

            <View style={styles.form}>
                {step === 'email' ? (
                    <AppTextInput
                        label="Correo electrónico"
                        placeholder="tucorreo@ejemplo.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                ) : (
                    <AppTextInput
                        label="Código de verificación"
                        placeholder="123456"
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        maxLength={6}
                    />
                )}

                {error ? (
                    <AppText variant="sm" color={theme.colors.error} style={{ marginTop: 10 }}>
                        {error}
                    </AppText>
                ) : null}

                <Spacer height={theme.spacing.lg} />

                <AppButton
                    title={loading ? "Procesando..." : (step === 'email' ? "Enviar código" : "Verificar código")}
                    onPress={step === 'email' ? handleSendOtp : handleVerifyOtp}
                    disabled={loading}
                />

                <Spacer height={theme.spacing.md} />

                {step === 'email' && (
                    <AppButton
                        title="Iniciar con Google"
                        onPress={async () => {
                            try {
                                await useUserStore.getState().signInWithGoogle();
                            } catch (e: any) {
                                setError(e.message || 'Error con Google Sign In');
                            }
                        }}
                        disabled={loading}
                        variant="outline"
                    />
                )}

                {step === 'code' && (
                    <>
                        <Spacer height={theme.spacing.md} />
                        <AppButton
                            title="Volver a ingresar correo"
                            onPress={() => {
                                setStep('email');
                                setCode('');
                            }}
                            variant="outline"
                            disabled={loading}
                        />
                    </>
                )}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    form: {
        width: '100%',
    },
});
