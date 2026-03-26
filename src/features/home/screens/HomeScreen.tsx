import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TreeNodeScreen } from '../../nodes/screens/TreeNodeScreen';
import { ModuleProgressScreen } from '../../nodes/screens/ModuleProgressScreen';
import { useAppTheme } from '../../../theme/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { audioService } from '../../settings/services/audio.service';
import { syncInfinityStats } from '../../../api/syncInfinityStats';
import { StreakCloudService } from '../../gamification/services/StreakCloud.service';
import { CurrencyService } from '../../gamification/services/Currency.service';
import { useSettingsStore } from '../../../store/SettingsStore';
import { useCurrencyStore } from '../../../store/CurrencyStore';
import { KokoroDisclaimerModal } from '../components/KokoroDisclaimerModal';

export const HomeScreen = () => {
    const netInfo = useNetInfo();
    const theme = useAppTheme();
    const homeViewMode = useSettingsStore(state => state.homeViewMode);
    const setHomeViewMode = useSettingsStore(state => state.setHomeViewMode);

    const hasSyncedOnStart = useRef(false);
    useEffect(() => {
        if (netInfo.isConnected && !hasSyncedOnStart.current) {
            hasSyncedOnStart.current = true;


            // Sync asynchronously Without blocking
            Promise.all([
                StreakCloudService.syncWithLocal(),
                syncInfinityStats(),
                CurrencyService.syncCurrencies()
            ]).then(() => {
                useCurrencyStore.getState().loadCurrencies();
            }).catch(e => {
                console.error('[HomeScreen] Error in initial sync:', e);
            });
        }
    }, [netInfo.isConnected]);

    const toggleViewMode = () => {
        audioService.playClickSound();
        setHomeViewMode(homeViewMode === 'list' ? 'tree' : 'list');
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
                        name={homeViewMode === 'list' ? 'account-tree' : 'view-list'}
                        size={24}
                        color={theme.colors.white}
                    />
                    <Text style={styles.bannerText}>
                        {homeViewMode === 'list' ? 'Cambiar a Mapa de Nodos' : 'Cambiar a Vista de Lista'}
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={styles.content}>
                {homeViewMode === 'list' ? (
                    <ModuleProgressScreen />
                ) : (
                    <TreeNodeScreen />
                )}
            </View>

            <KokoroDisclaimerModal />
        </SafeAreaView>
    );
};

