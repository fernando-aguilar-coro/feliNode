import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useUserStore } from '../../../store/UserStore';
import { Screen, Spacer, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { LoginHeader, LoginForm, SocialLogin } from '../components';

export default function LoginScreen() {
    const theme = useAppTheme();
    const { sendOtp, verifyOtp, loading } = useUserStore();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState<'email' | 'code'>('email');

    useEffect(() => {
        const checkGoogleSignIn = async () => {
            if (useUserStore.getState().hasLoggedOut) {
                return;
            }
            try {
                await useUserStore.getState().signInWithGoogle()
            } catch (error) {

            }
        };
        checkGoogleSignIn();
    }, []);

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
                    <Spacer height={theme.spacing.xl * 2} />

                    <LoginHeader step={step} email={email} />

                    <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
                        <LoginForm
                            email={email}
                            code={code}
                            step={step}
                            loading={loading}
                            onEmailChange={setEmail}
                            onCodeChange={setCode}
                            onSubmit={step === 'email' ? handleSendOtp : handleVerifyOtp}
                            onBack={() => {
                                setStep('email');
                                setCode('');
                                setError('');
                            }}
                        />

                        {error ? (
                            <AppText variant="sm" color={theme.colors.error} align="center" style={{ marginTop: 15 }}>
                                {error}
                            </AppText>
                        ) : null}

                        {step === 'email' && (
                            <SocialLogin loading={loading} onError={setError} />
                        )}
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
    card: {
        borderRadius: 20,
        padding: 24,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        width: '100%',
    }
});
