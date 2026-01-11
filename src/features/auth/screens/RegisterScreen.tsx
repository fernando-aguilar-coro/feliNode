import React from 'react';
import { Text, Button } from 'react-native';
import { useUserStore } from '../../../store/UserStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
    const login = useUserStore((state) => state.login);

    return (
        <SafeAreaView>
            <Button title="Register" onPress={login} />
        </SafeAreaView>
    );
}
