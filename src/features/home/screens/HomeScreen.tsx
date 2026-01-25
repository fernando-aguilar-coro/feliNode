import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../../store/UserStore';
import { TreeNodeScreen } from '../../nodes/screens/TreeNodeScreen';
import { AppButton } from '../../../components';
import { theme } from '../../../theme';

export const HomeScreen = () => {
    // Obtenemos la función de logout store
    const logout = useUserStore((state) => state.logout);
    const netInfo = useNetInfo();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AppButton
                    title="Cerrar Sesión"
                    onPress={logout}
                    variant="outline"
                    style={[
                        styles.authButton,
                        { borderColor: theme.colors.error }
                    ]}
                    textColor={theme.colors.error}
                />
            </View>
            {netInfo.isConnected === false && (
                <View style={styles.offlineContainer}>
                    <Text style={styles.offlineText}>
                        Conexión a internet no disponible, algunas funciones no estarán disponibles
                    </Text>
                </View>
            )}
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
    authButton: {
        height: 40, // Un poco más compacto para el header
        paddingHorizontal: 15,
    },
    content: {
        flex: 1,
    },
    offlineContainer: {
        backgroundColor: theme.colors.error,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    offlineText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

