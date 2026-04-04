import { create } from 'zustand';
import { CurrencyService } from '../features/gamification/services/Currency.service';


// 1. Definimos la estructura del estado
interface CurrencyState {
    currencies: {
        xp: number;
        michi_coins: number;
        inventory: Record<string, any>; // Lo que analizamos antes
    };
    loading: boolean;
    loadCurrencies: () => Promise<void>;
    addRewards: (xp: number, coins: number) => Promise<void>;
    spendCoins: (amount: number) => Promise<boolean>;
    updateInventory: (newInventory: Record<string, any>) => void; // El método nuevo
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
    currencies: {
        xp: 0,
        michi_coins: 0,
        inventory: {}
    },
    loading: false,

    loadCurrencies: async () => {
        try {
            set({ loading: true });
            const data = await CurrencyService.getCurrencies();
            // Asumimos que data trae el objeto currencies completo
            set({ currencies: data, loading: false });
        } catch (error) {
            console.error('[GAMIFICATION] Error loading currencies:', error);
            set({ loading: false });
        }
    },

    addRewards: async (xp: number, coins: number) => {
        try {
            const response = await CurrencyService.addRewards(xp, coins);
            set({ currencies: response.result });
        } catch (error) {
            console.error('[GAMIFICATION] Error adding rewards:', error);
        }
    },

    spendCoins: async (amount: number) => {
        try {
            const success = await CurrencyService.spendCoins(amount);
            if (success) {
                set((state) => ({
                    currencies: {
                        ...state.currencies,
                        michi_coins: state.currencies.michi_coins - amount
                    }
                }));
            }
            return success;
        } catch (error) {
            console.error('[GAMIFICATION] Error spending coins:', error);
            return false;
        }
    },

    // 2. Implementación de updateInventory
    updateInventory: (newInventory: Record<string, any>) => {
        set((state) => ({
            currencies: {
                ...state.currencies,
                inventory: {
                    ...state.currencies.inventory,
                    ...newInventory
                }
            }
        }));
    }
}));