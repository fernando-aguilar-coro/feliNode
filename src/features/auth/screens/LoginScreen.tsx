import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useUserStore } from '../../../store/UserStore';
import { Screen, Spacer, AppText, AppButton } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { LoginHeader, LoginForm, SocialLogin } from '../components';

export default function LoginScreen() {
    const theme = useAppTheme();
    const { sendOtp, verifyOtp, loading, loginAsGuest } = useUserStore();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState<'initial' | 'email' | 'code'>('initial');

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
        } catch (err: any) {
            setError(err.message || 'El código es incorrecto o ha expirado');
        }
    };

    return (
        <Screen style={{ backgroundColor: theme.colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, { paddingHorizontal: theme.spacing.lg }]}
                    showsVerticalScrollIndicator={false}
                >

                    <LoginHeader step={step} email={email} />
                    <Spacer height={theme.spacing.xxl} />

                    <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
                        {step === 'initial' && (
                            <View style={styles.initialContainer}>
                                <AppButton
                                    title='Iniciar sesión con Email'
                                    onPress={() => { setStep('email'); setError(''); }}
                                    style={styles.guestButton}
                                    disabled={loading}
                                />
                                <Spacer height={theme.spacing.md} />
                                <SocialLogin loading={loading} onError={setError} />
                                <Spacer height={theme.spacing.xl} />
                                <AppButton
                                    title="Modo Invitado"
                                    onPress={loginAsGuest}
                                    disabled={loading}
                                    variant="outline"
                                    style={styles.guestButton}
                                />
                            </View>
                        )}

                        {(step === 'email' || step === 'code') && (
                            <LoginForm
                                email={email}
                                code={code}
                                step={step as 'email' | 'code'}
                                loading={loading}
                                onEmailChange={setEmail}
                                onCodeChange={setCode}
                                onSubmit={step === 'email' ? handleSendOtp : handleVerifyOtp}
                                onBack={() => {
                                    if (step === 'code') {
                                        setStep('email');
                                        setCode('');
                                    } else {
                                        setStep('initial');
                                        setEmail('');
                                        setCode('');
                                    }
                                    setError('');
                                }}
                            />
                        )}

                        {error ? (
                            <AppText variant="sm" color={theme.colors.error} align="center" style={{ marginTop: 15 }}>
                                {error}
                            </AppText>
                        ) : null}
                    </View>

                    <Spacer height={theme.spacing.xl} />
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    googleButton: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderRadius: 25,
        borderWidth: 1,
    },
    card: {
        borderRadius: 24,
        padding: 24,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 10,
        width: '100%',
    },
    initialContainer: {
        width: '100%',
        alignItems: 'center',
    },
    guestButton: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
    },
    textButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    }
});
