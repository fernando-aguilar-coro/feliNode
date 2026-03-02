import { useState, useCallback, useEffect } from 'react';
import { CurrencyService } from '../services/Currency.service';

export const useCurrencies = () => {
    const [currencies, setCurrencies] = useState({ xp: 0, michi_coins: 300 });
    const [loading, setLoading] = useState(true);

    const loadCurrencies = useCallback(async () => {
        try {
            setLoading(true);
            const data = await CurrencyService.getCurrencies();
            setCurrencies(data);
        } catch (error) {
            console.error('[GAMIFICATION] Error loading currencies:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCurrencies();
    }, [loadCurrencies]);

    const addRewards = async (xp: number, coins: number) => {
        const newData = await CurrencyService.addRewards(xp, coins);
        setCurrencies(newData);
    };

    const spendCoins = async (amount: number) => {
        const success = await CurrencyService.spendCoins(amount);
        if (success) {
            setCurrencies(prev => ({ ...prev, michi_coins: prev.michi_coins - amount }));
        }
        return success;
    };

    return { currencies, loading, loadCurrencies, addRewards, spendCoins };
};
