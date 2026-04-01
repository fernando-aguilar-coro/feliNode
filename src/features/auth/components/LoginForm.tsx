import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppTextInput, AppButton, Spacer, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            {step === 'email' ? (
                <View>
                    <AppTextInput
                        label={t('auth.login.emailLabel')}
                        placeholder={t('auth.login.emailPlaceholder')}
                        value={email}
                        onChangeText={onEmailChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            ) : (
                <View>
                    <AppTextInput
                        label={t('auth.login.codeLabel')}
                        placeholder={t('auth.login.codePlaceholder')}
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
                title={loading ? t('auth.login.processing') : (step === 'email' ? t('auth.login.continueWithEmail') : t('auth.login.verifyAndLogin'))}
                onPress={onSubmit}
                disabled={loading}
                variant="primary"
                style={styles.mainButton}
            />

            <Spacer height={theme.spacing.md} />
            <AppButton
                title={step === 'email' ? t('auth.login.goBack') : t('auth.login.changeEmail')}
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
