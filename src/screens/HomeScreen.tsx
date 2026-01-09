import React from 'react';
import { View, Button } from 'react-native';
import { useUserStore } from '../store/UserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
export const HomeScreen = ({ navigation }: any) => {
    const logout = useUserStore((state) => state.logout);

    return (
        <SafeAreaView>
            <Button
                title="Go to Lesson"
                onPress={() => navigation.navigate('Lesson')}
            />
            <View style={{ marginTop: 20 }}>
                <Button title="Logout" onPress={logout} />
            </View>
        </SafeAreaView>
    );
};

