import React from 'react';
import { Text, Button } from 'react-native';
import { useUserStore } from '../../../store/UserStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const login = useUserStore((state) => state.login);

    return (
        <SafeAreaView>
            <Text >Login</Text>
            <Button title="Login" onPress={login} />
        </SafeAreaView>
    );
}
