import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useUserStore } from '../../../store/UserStore';
import { Screen, AppText, AppTextInput, AppButton, Spacer } from '../../../components';
import { theme } from '../../../theme';

export default function RegisterScreen() {
    const login = useUserStore((state) => state.login);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Screen>
            <Spacer height={theme.spacing.xl} />
            <AppText variant="xxl" weight="bold" align="center">
                Create Account
            </AppText>
            <Spacer height={theme.spacing.xl} />

            <View style={styles.form}>
                <AppTextInput
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <AppTextInput
                    label="Password"
                    placeholder="Create a password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Spacer height={theme.spacing.lg} />

                <AppButton title="Register" onPress={login} />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    form: {
        width: '100%',
    },
});
