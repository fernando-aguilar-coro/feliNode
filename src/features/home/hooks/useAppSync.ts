import { useState, useEffect, useRef } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import { syncUserProgress } from '../../../api/syncUserProgress';
import { seedDatabase } from '../../../db_local/seed/seed_db';
import { StreakCloudService } from '../../gamification/services/StreakCloud.service';
import { syncInfinityStats } from '../../../api/syncInfinityStats';
import { CurrencyService } from '../../gamification/services/Currency.service';
import { useCurrencyStore } from '../../../store/CurrencyStore';
import { useSettingsStore } from '../../../store/SettingsStore';

export const useAppSync = () => {
    const netInfo = useNetInfo();
    const [isSyncing, setIsSyncing] = useState(false);
    const hasSyncedOnStart = useRef(false);
    const language = useSettingsStore(state => state.language);
    const prevLanguage = useRef(language);

    useEffect(() => {
        if (language !== prevLanguage.current) {
            hasSyncedOnStart.current = false;
            prevLanguage.current = language;
        }
    }, [language]);

    useEffect(() => {
        if (!netInfo.isConnected || hasSyncedOnStart.current || isSyncing) {
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
            } catch (error) {
                console.error('[useAppSync] Background sync failed:', error);
                // Allow retry if it failed completely
                hasSyncedOnStart.current = false;
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
