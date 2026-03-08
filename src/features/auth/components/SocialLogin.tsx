import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
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
            <View style={styles.buttonWrapper}>
                <GoogleSigninButton
                    style={{ width: '100%', height: 50 }}
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
    buttonWrapper: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 25,
        overflow: 'hidden'
    }
});
