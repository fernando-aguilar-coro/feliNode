import { supabase } from '../../../api/supabaseClient';
import { userCurrenciesRepository, streakRepository } from '../../../db_local/repositories';

export class CurrencyService {
    static async getCurrencies() {
        return await userCurrenciesRepository.getCurrencies();
    }

    static async addRewards(xp: number, coins: number) {
        const current = await userCurrenciesRepository.getCurrencies();
        let xpToGrant = xp;
        let coinsToGrant = coins;
        let wasBoosted = false;
        let wasCoinsBoosted = false;

        const inventory = current.inventory || {};

        if (xp > 0 && inventory.xp_boost) {
            xpToGrant = xp * 2;
            wasBoosted = true;
            console.log('[CurrencyService] XP Boost active! Doubling XP:', xp, '->', xpToGrant);
            // Consumir el boost
            await userCurrenciesRepository.updateInventory({ xp_boost: false });

            // Actualizamos la store
            const { useCurrencyStore } = require('../../../store/CurrencyStore');
            useCurrencyStore.getState().updateInventory({ xp_boost: false });
        }

        if (coins > 0 && inventory.coin_doubler) {
            coinsToGrant = coins * 2;
            wasCoinsBoosted = true;
            console.log('[CurrencyService] Coin doubler active! Doubling Coins:', coins, '->', coinsToGrant);
        }

        const result = await userCurrenciesRepository.addCurrencies(xpToGrant, coinsToGrant);

        // Registrar log de XP para el ranking seguro
        if (xpToGrant > 0) {
            await userCurrenciesRepository.addXpLog(xpToGrant);
        }

        // Recargar las monedas actualizadas en Zustand
        const { useCurrencyStore } = require('../../../store/CurrencyStore');
        useCurrencyStore.getState().loadCurrencies();

        this.syncCurrencies().catch(err => console.error('[CurrencySync] background sync failed:', err));
        return { result, xpGained: xpToGrant, coinsGained: coinsToGrant, wasBoosted, wasCoinsBoosted };
    }

    static async spendCoins(amount: number) {
        const success = await userCurrenciesRepository.spendCoins(amount);
        if (success) {
            this.syncCurrencies().catch(err => console.error('[CurrencySync] background sync failed:', err));
        }
        return success;
    }

    static async buyStreakProtector(): Promise<boolean> {
        // Find existing streak count
        const streakData = await streakRepository.getStreak();
        if (streakData.freezes_available >= 2) {
            return false; // Already maxed out
        }

        const price = 60;
        const success = await this.spendCoins(price);

        if (success) {
            // Update streak repository local
            await streakRepository.updateStreakFromCloud({
                freezes_available: streakData.freezes_available + 1
            });
            // Also we need to sync streak if there's a sync function, but typically streak is synced somewhere else?
            // Wait, we can just update the cloud directly for the streak or let the normal streak sync handle it.
            const { useUserStore } = require('../../../store/UserStore');
            const { isGuest } = useUserStore.getState();
            if (isGuest) {
                return true; // Pretend it succeeded locally for guest
            }

            const { data: { user } } = await supabase.auth.getUser();
            let userId = user?.id;

            if (userId) {
                await supabase.from('user_streaks').update({
                    freezes_available: streakData.freezes_available + 1,
                    updated_at: new Date().toISOString()
                }).eq('user_id', userId);
            }
            return true;
        }
        return false;
    }

    static async syncCurrencies() {
        try {
            const { useUserStore } = require('../../../store/UserStore');
            const { isGuest } = useUserStore.getState();
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            let userId = user?.id;

            if (isGuest || userError || !user || !userId) {
                return;
            }

            // --- 1. Sincronizar Historial de XP (Seguridad) ---
            const unsyncedLogs = await userCurrenciesRepository.getUnsyncedXpLogs();
            if (unsyncedLogs.length > 0) {
                const logsToUpload = unsyncedLogs.map(log => ({
                    user_id: userId,
                    xp_amount: log.xp_amount,
                    earned_at: log.earned_at
                }));

                const { error: historyError } = await supabase
                    .from('xp_history')
                    .insert(logsToUpload);

                if (!historyError) {
                    await userCurrenciesRepository.markXpLogsAsSynced(unsyncedLogs.map(l => l.id));
                } else {
                    console.error('[CurrencySync] Error syncing XP history:', historyError);
                }
            }

            // --- 2. Sincronizar Totales (Monedas e Inventario) ---
            const localData = await userCurrenciesRepository.getCurrencies();

            const { data: remoteData, error: remoteError } = await supabase
                .from('user_currencies')
                .select('xp, michi_coins, inventory, updated_at')
                .eq('user_id', userId)
                .maybeSingle();

            if (remoteError) {
                console.error('[CurrencySync] Error fetching remote currencies:', remoteError);
                return;
            }

            if (!remoteData) {
                // Insert local into remote via upsert to be safe
                const { error: upsertError } = await supabase.from('user_currencies').upsert({
                    user_id: userId,
                    xp: localData.xp,
                    michi_coins: localData.michi_coins,
                    inventory: JSON.stringify(localData.inventory || {}),
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

                if (upsertError) {
                    console.error('[CurrencySync] Error inserting initial remote currencies:', upsertError);
                }
            } else {
                // Determine latest version for coins and inventory
                let mergedXp = Math.max(localData.xp, remoteData.xp);
                let mergedCoins = localData.michi_coins;
                let mergedInventory = localData.inventory || {};

                const localTime = localData.updated_at ? new Date(localData.updated_at).getTime() : 0;
                const remoteTime = remoteData.updated_at ? new Date(remoteData.updated_at).getTime() : 0;

                // For XP, we always take the maximum to avoid losing progress.
                // For coins and inventory, we trust the side with the latest timestamp.
                if (remoteTime > localTime) {
                    // Remote is newer, trust remote coins and inventory
                    mergedCoins = remoteData.michi_coins;
                    mergedInventory = remoteData.inventory ? (typeof remoteData.inventory === 'string' ? JSON.parse(remoteData.inventory) : remoteData.inventory) : {};
                    // Update local reference to avoid double update in state
                    localData.inventory = mergedInventory;
                } else if (localTime === remoteTime && remoteData.michi_coins > localData.michi_coins) {
                    // Tie-breaker: If timestamps are equal (unlikely but possible), prefer more coins (safer for rewards)
                    mergedCoins = remoteData.michi_coins;
                }

                const hasLocalChanged = mergedXp > localData.xp || mergedCoins !== localData.michi_coins || JSON.stringify(localData.inventory) !== JSON.stringify(mergedInventory);
                if (hasLocalChanged) {
                    await userCurrenciesRepository.updateCurrenciesFromCloud({
                        xp: mergedXp,
                        michi_coins: mergedCoins,
                        inventory: mergedInventory
                    });
                }

                const hasRemoteChanged = mergedXp > remoteData.xp || mergedCoins !== remoteData.michi_coins || JSON.stringify(localData.inventory) !== JSON.stringify(remoteData.inventory);
                if (hasRemoteChanged) {
                    const { error: updateError } = await supabase.from('user_currencies').update({
                        xp: mergedXp,
                        michi_coins: mergedCoins,
                        inventory: JSON.stringify(localData.inventory || {}),
                        updated_at: localTime > remoteTime ? localData.updated_at : new Date().toISOString()
                    }).eq('user_id', userId);

                    if (updateError) {
                        console.error('[CurrencySync] Error updating external currencies:', updateError);
                    }
                }
            }
        } catch (error) {
            console.error('[CurrencySync] Critical error during sync:', error);
        }
    }
}
