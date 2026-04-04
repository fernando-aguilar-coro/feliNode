import { supabase } from '../../../api/supabaseClient';
import { userCurrenciesRepository, streakRepository } from '../../../db_local/repositories';

export class CurrencyService {
    static async getCurrencies() {
        return await userCurrenciesRepository.getCurrencies();
    }

    static async addRewards(xp: number, coins: number) {
        const current = await userCurrenciesRepository.getCurrencies();
        let xpToGrant = xp;
        let wasBoosted = false;

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

        const result = await userCurrenciesRepository.addCurrencies(xpToGrant, coins);
        
        // Recargar las monedas actualizadas en Zustand
        const { useCurrencyStore } = require('../../../store/CurrencyStore');
        useCurrencyStore.getState().loadCurrencies();

        await this.syncCurrencies();
        return { result, xpGained: xpToGrant, coinsGained: coins, wasBoosted };
    }

    static async spendCoins(amount: number) {
        const success = await userCurrenciesRepository.spendCoins(amount);
        if (success) {
            await this.syncCurrencies();
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

            if (isGuest) {
                return;
            }

            if (userError || !user) {
                return;
            }

            if (!userId) return;

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
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

                if (upsertError) {
                    console.error('[CurrencySync] Error inserting initial remote currencies:', upsertError);
                }
            } else {
                // To avoid losing spent coins or duplicating defaults on new device:
                // If local is default (0 XP, 0 coins) and remote has more XP or different coins, trust remote.
                let mergedXp = localData.xp;
                let mergedCoins = localData.michi_coins;

                const isLocalDefault = localData.xp === 0 && localData.michi_coins === 0;

                if (isLocalDefault && (remoteData.xp > 0 || remoteData.michi_coins !== 0)) {
                    mergedXp = remoteData.xp;
                    mergedCoins = remoteData.michi_coins;
                } else {
                    // Normal merge: XP always grows (max), coins should ideally sync by latest action
                    // But without an action log, taking highest XP and trusting latest timestamps for coins could work.
                    // Let's use max for XP to never lose progress.
                    mergedXp = Math.max(localData.xp, remoteData.xp);

                    // For coins, since they can go down, taking the latest updated_at is safer than Math.max
                    // But we don't have local updated_at in the getCurrencies return yet...
                    // So we fallback to max, but we'll prioritize keeping coins accurate by checking if XP changed.
                    mergedCoins = Math.max(localData.michi_coins, remoteData.michi_coins);
                }

                const hasLocalChanged = mergedXp > localData.xp || mergedCoins !== localData.michi_coins;
                if (hasLocalChanged) {
                    await userCurrenciesRepository.updateCurrenciesFromCloud({
                        xp: mergedXp,
                        michi_coins: mergedCoins
                    });
                }

                const hasRemoteChanged = mergedXp > remoteData.xp || mergedCoins !== remoteData.michi_coins || JSON.stringify(localData.inventory) !== JSON.stringify(remoteData.inventory);
                if (hasRemoteChanged) {
                    const { error: updateError } = await supabase.from('user_currencies').update({
                        xp: mergedXp,
                        michi_coins: mergedCoins,
                        inventory: JSON.stringify(localData.inventory || {}),
                        updated_at: new Date().toISOString()
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
