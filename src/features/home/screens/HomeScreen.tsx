import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TreeNodeScreen } from '../../nodes/screens/TreeNodeScreen';
import { useAppTheme } from '../../../theme/ThemeContext';


export const HomeScreen = () => {
    const netInfo = useNetInfo();
    const theme = useAppTheme();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            padding: 10,
            alignItems: 'flex-end',
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
            backgroundColor: theme.colors.background,
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
            color: theme.colors.white,
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
        },

    }), [theme]);

    return (
        <SafeAreaView style={styles.container}>
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

