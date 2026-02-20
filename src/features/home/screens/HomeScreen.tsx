import React, { useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TreeNodeScreen } from '../../nodes/screens/TreeNodeScreen';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeNavigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Main'>;

export const HomeScreen = () => {
    const netInfo = useNetInfo();
    const navigation = useNavigation<HomeScreenNavigationProp>();
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
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

