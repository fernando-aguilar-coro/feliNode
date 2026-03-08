import { useEffect } from 'react';
import { useCurrencyStore } from '../../../store/CurrencyStore';

export const useCurrencies = () => {
    const currencies = useCurrencyStore((state) => state.currencies);
    const loading = useCurrencyStore((state) => state.loading);
    const loadCurrencies = useCurrencyStore((state) => state.loadCurrencies);
    const addRewards = useCurrencyStore((state) => state.addRewards);
    const spendCoins = useCurrencyStore((state) => state.spendCoins);

    useEffect(() => {
        loadCurrencies();
    }, [loadCurrencies]);

    return { currencies, loading, loadCurrencies, addRewards, spendCoins };
};
