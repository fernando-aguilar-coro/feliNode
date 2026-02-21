import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TreeNodeScreen } from '../../nodes/screens/TreeNodeScreen';
import { ModuleProgressScreen } from '../../nodes/screens/ModuleProgressScreen';
import { useAppTheme } from '../../../theme/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { audioService } from '../../settings/services/audioService';


export const HomeScreen = () => {
    const netInfo = useNetInfo();
    const theme = useAppTheme();
    const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');

    const toggleViewMode = () => {
        audioService.playClickSound();
        setViewMode(prev => prev === 'tree' ? 'list' : 'tree');
    };

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        banner: {
            backgroundColor: theme.colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 16,
            marginTop: 10,
            marginBottom: 10,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
        },
        bannerContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        bannerText: {
            color: theme.colors.white,
            fontSize: 16,
            fontWeight: 'bold',
            marginLeft: 8,
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
            <TouchableOpacity onPress={toggleViewMode} style={styles.banner} activeOpacity={0.8}>
                <View style={styles.bannerContent}>
                    <MaterialIcons
                        name={viewMode === 'tree' ? 'view-list' : 'account-tree'}
                        size={24}
                        color={theme.colors.white}
                    />
                    <Text style={styles.bannerText}>
                        {viewMode === 'tree' ? 'Cambiar a Vista de Lista' : 'Cambiar a Mapa de Nodos'}
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={styles.content}>
                {viewMode === 'tree' ? <TreeNodeScreen /> : <ModuleProgressScreen />}
            </View>
        </SafeAreaView>
    );
};

