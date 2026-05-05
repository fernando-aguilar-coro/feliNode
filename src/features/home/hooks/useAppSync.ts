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
    const [isSyncing, setIsSyncing] = useState(false);
    const hasSyncedOnStart = useRef(false);
    const language = useSettingsStore(state => state.language);
    const isAuthenticated = useUserStore(state => state.isAuthenticated);
    const prevLanguage = useRef(language);

    useEffect(() => {
        if (language !== prevLanguage.current) {
            hasSyncedOnStart.current = false;
            prevLanguage.current = language;
        }
    }, [language]);

    useEffect(() => {
        if (!netInfo.isConnected || hasSyncedOnStart.current || isSyncing || !isAuthenticated) {
            return;
        }

        let isMounted = true;

        const runBackgroundSync = async () => {
            if (!isMounted) return;
            
            setIsSyncing(true);
            hasSyncedOnStart.current = true;

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
                useNodesStore.getState().triggerRefresh();
                console.log('[useAppSync] Background sync completed successfully');
            } catch (error) {
                console.error('[useAppSync] Background sync failed:', error);
                // Do not reset hasSyncedOnStart here to avoid infinite loops.
                // We'll only retry on network reconnect or language change.
            } finally {
                if (isMounted) {
                    setIsSyncing(false);
                }
            }
        };

        runBackgroundSync();

        return () => {
            isMounted = false;
        };
    }, [netInfo.isConnected, language, isSyncing]);

    return {
        isSyncing,
    };
};
