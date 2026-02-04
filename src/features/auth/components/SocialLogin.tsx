import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { AppText, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useUserStore } from '../../../store/UserStore';

interface SocialLoginProps {
    loading: boolean;
    onError: (msg: string) => void;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({ loading, onError }) => {
    const theme = useAppTheme();

    const handleGoogleSignIn = async () => {
        try {
            await useUserStore.getState().signInWithGoogle();
        } catch (e: any) {
            onError(e.message || 'Error con Google Sign In');
        }
    };

    return (
        <View style={styles.container}>
            <Spacer height={theme.spacing.md} />
            <View style={styles.dividerContainer}>
                <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
                <AppText color={theme.colors.textSecondary} style={styles.orText}>
                    O continúa con
                </AppText>
                <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
            </View>
            <Spacer height={theme.spacing.md} />

            <View style={styles.buttonWrapper}>
                <GoogleSigninButton
                    size={GoogleSigninButton.Size.Wide}
                    color={theme.dark ? GoogleSigninButton.Color.Dark : GoogleSigninButton.Color.Light}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    line: {
        flex: 1,
        height: 1,
    },
    orText: {
        marginHorizontal: 10,
        fontSize: 14,
    },
    buttonWrapper: {
        width: '100%',
        alignItems: 'center'
    }
});
