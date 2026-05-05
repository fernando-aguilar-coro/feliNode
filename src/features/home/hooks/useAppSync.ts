import { useState, useEffect, useRef } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import { syncUserProgress } from '../../../api/syncUserProgress';
import { seedDatabase } from '../../../db_local/seed/seed_db';
import { StreakCloudService } from '../../gamification/services/StreakCloud.service';
import { syncInfinityStats } from '../../../api/syncInfinityStats';
import { CurrencyService } from '../../gamification/services/Currency.service';
import { useCurrencyStore } from '../../../store/CurrencyStore';
import { useSettingsStore } from '../../../store/SettingsStore';
import { useUserStore } from '../../../store/UserStore';
import { useNodesStore } from '../../../store/NodesStore';

export const useAppSync = () => {
    const netInfo = useNetInfo();
    const isSyncingRef = useRef(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const hasSyncedOnStart = useRef(false);
    const language = useSettingsStore(state => state.language);
    const isAuthenticated = useUserStore(state => state.isAuthenticated);
    const prevLanguage = useRef(language);

    // When language changes, allow a fresh sync
    useEffect(() => {
        if (language !== prevLanguage.current) {
            console.log(`[useAppSync] Language changed: ${prevLanguage.current} -> ${language}, resetting sync flag`);
            hasSyncedOnStart.current = false;
            prevLanguage.current = language;
        }
    }, [language]);

    useEffect(() => {
        if (!netInfo.isConnected || hasSyncedOnStart.current || isSyncingRef.current || !isAuthenticated) {
            return;
        }

        let isMounted = true;

        const runBackgroundSync = async () => {
            if (!isMounted) return;
            
            isSyncingRef.current = true;
            setIsSyncing(true);
            hasSyncedOnStart.current = true;
            console.log(`[useAppSync] Starting sync for language=${language}`);

            try {
                // Run background tasks concurrently where possible
                await Promise.allSettled([
                    syncUserProgress(),
                    seedDatabase(),
                    StreakCloudService.syncWithLocal(),
                    syncInfinityStats(),
                    CurrencyService.syncCurrencies()
                ]);

                // Update stores after sync
                useCurrencyStore.getState().loadCurrencies();
                await useNodesStore.getState().fetchModules(true);
                console.log('[useAppSync] Background sync completed successfully');
            } catch (error) {
                console.error('[useAppSync] Background sync failed:', error);
            } finally {
                isSyncingRef.current = false;
                if (isMounted) {
                    setIsSyncing(false);
                }
            }
        };

        runBackgroundSync();

        return () => {
            isMounted = false;
        };
    }, [netInfo.isConnected, language, isAuthenticated]);

    return {
        isSyncing,
    };
};
