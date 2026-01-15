import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../../store/UserStore'; // Adjust path if needed
import { TreeNodeScreen } from '../../nodes/screens/TreeNodeScreen';

export const HomeScreen = () => {
    const logout = useUserStore((state) => state.logout);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {/* Botón para cerrar sesión */}
                <Button title="Cerrar Sesión" onPress={logout} color="#FF6347" />
            </View>
            <View style={styles.content}>
                <TreeNodeScreen />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 10,
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    content: {
        flex: 1,
    },
});
