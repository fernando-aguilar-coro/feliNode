import { create } from 'zustand';
import { CurrencyService } from '../features/gamification/services/Currency.service';

interface CurrencyState {
    currencies: { xp: number; michi_coins: number };
    loading: boolean;
    loadCurrencies: () => Promise<void>;
    addRewards: (xp: number, coins: number) => Promise<void>;
    spendCoins: (amount: number) => Promise<boolean>;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
    currencies: { xp: 0, michi_coins: 0 },
    loading: true,
    loadCurrencies: async () => {
        try {
            set({ loading: true });
            const data = await CurrencyService.getCurrencies();
            set({ currencies: data, loading: false });
        } catch (error) {
            console.error('[GAMIFICATION] Error loading currencies:', error);
            set({ loading: false });
        }
    },
    addRewards: async (xp: number, coins: number) => {
        const newData = await CurrencyService.addRewards(xp, coins);
        set({ currencies: newData });
    },
    spendCoins: async (amount: number) => {
        const success = await CurrencyService.spendCoins(amount);
        if (success) {
            set((state) => ({
                currencies: { ...state.currencies, michi_coins: state.currencies.michi_coins - amount }
            }));
        }
        return success;
    }
}));
