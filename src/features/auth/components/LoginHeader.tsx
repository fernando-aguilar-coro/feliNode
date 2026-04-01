import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { AppText, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';

interface LoginHeaderProps {
    step: 'initial' | 'email' | 'code';
    email?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ step, email }) => {
    const theme = useAppTheme();
    const { t } = useTranslation();

    const getTitle = () => {
        if (step === 'initial') return t('auth.login.titleInitial');
        if (step === 'email') return t('auth.login.titleEmail');
        return t('auth.login.titleVerify');
    };

    const getSubtitle = () => {
        if (step === 'initial') return t('auth.login.subtitleInitial');
        if (step === 'email') return t('auth.login.subtitleEmail');
        return t('auth.login.subtitleVerify', { email });
    };

    return (
        <View style={styles.container}>
            <View >
                <Image
                    source={require('../../../../assets/icon.png')}
                    style={{ width: 160, height: 160, borderRadius: 40 }}
                    resizeMode="contain"
                />
            </View>
            <AppText variant="xxl" align="center" style={{ color: theme.colors.primary, marginBottom: 8, fontSize: 40 }}>
                {getTitle()}
            </AppText>
            <AppText align="center" color={theme.colors.textSecondary} variant="md">
                {getSubtitle()}
            </AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    }
});
