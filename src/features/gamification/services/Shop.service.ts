import { supabase } from '../../../api/supabaseClient';
import { userCurrenciesRepository, streakRepository } from '../../../db_local/repositories';
import { CurrencyService } from './Currency.service';
import { useCurrencyStore } from '../../../store/CurrencyStore';

export class ShopService {
    /**
     * Streak Protector
     */
    static async buyStreakProtector(): Promise<boolean> {
        const streakData = await streakRepository.getStreak();
        if (streakData.freezes_available >= 2) return false;

        const price = 60;
        const success = await CurrencyService.spendCoins(price);

        if (success) {
            const newValue = streakData.freezes_available + 1;
            await streakRepository.updateStreakFromCloud({ freezes_available: newValue });

            try {
                const { isGuest } = (require('../../../store/UserStore')).useUserStore.getState();
                if (!isGuest) {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user?.id) {
                        await supabase.from('user_streaks').update({
                            freezes_available: newValue,
                            updated_at: new Date().toISOString()
                        }).eq('user_id', user.id);
                    }
                }
            } catch (error) {
                console.error('[ShopService] Error syncing streak protector purchase:', error);
            }
            return true;
        }
        return false;
    }

    /**
     * Generic Inventory Item Purchase
     */
    static async buyInventoryItem(itemId: string, price: number, isStackable: boolean = false): Promise<boolean> {
        const current = await userCurrenciesRepository.getCurrencies();

        // Ensure inventory exists
        const inventory = current.inventory || {};

        let newValue: any = true;
        if (isStackable) {
            newValue = (inventory[itemId] || 0) + 1;
        } else {
            // If already purchased and not stackable, buying fails
            if (inventory[itemId]) return false;
        }

        const success = await CurrencyService.spendCoins(price);

        if (success) {
            const newInventoryState = { [itemId]: newValue };
            await userCurrenciesRepository.updateInventory(newInventoryState);
            useCurrencyStore.getState().updateInventory(newInventoryState);
            await CurrencyService.syncCurrencies();
            return true;
        }
        return false;
    }
}
