import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrencies } from './useCurrencies';
import { useStreak } from './useStreak';
import { ShopService } from '../services/Shop.service';

/**
 * Hook to manage Shop logic, purchases, and modal states.
 */
export const useShop = () => {
    const { t } = useTranslation();
    const { currencies, loading: currencyLoading, loadCurrencies } = useCurrencies();
    const { streak, loading: streakLoading, fetchStreak } = useStreak();
    
    // UI states
    const [buying, setBuying] = useState(false);
    const [purchaseError, setPurchaseError] = useState('');

    // Success Modal
    const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
    const [purchasedItemName, setPurchasedItemName] = useState('');

    const clearError = useCallback(() => setPurchaseError(''), []);
    const closeModal = useCallback(() => setPurchaseModalVisible(false), []);

    const handleBuyItem = async (itemName: string, cost: number, action: () => Promise<boolean>) => {
        if (currencies.michi_coins < cost) {
            setPurchaseError(t('gamification.shop.notEnoughCoins', { cost }));
            return;
        }

        setBuying(true);
        try {
            const success = await action();
            
            if (success) {
                setPurchasedItemName(itemName);
                setPurchaseModalVisible(true);
                loadCurrencies();
                fetchStreak();
            } else {
                setPurchaseError(t('gamification.shop.purchaseError'));
            }
        } catch (error) {
            console.error('[Shop] Error during purchase:', error);
            setPurchaseError(t('gamification.shop.purchaseError'));
        } finally {
            setBuying(false);
        }
    };



    const handleBuyStreakProtector = async () => {
        if (streak.freezes_available >= 2) {
            setPurchaseError(t('gamification.shop.maxProtectors'));
            return;
        }
        await handleBuyItem(
            t('gamification.shop.items.protector.name'),
            60,
            ShopService.buyStreakProtector
        );
    };

    /**
     * Generic item purchase handler
     */
    const handleBuyGenericItem = async (itemId: string, itemName: string, cost: number, isStackable: boolean) => {
        await handleBuyItem(
            itemName,
            cost,
            () => ShopService.buyInventoryItem(itemId, cost, isStackable)
        );
    };

    const handleBuyXpBoost = () => handleBuyGenericItem('xp_boost', t('gamification.shop.items.doubleXp.name'), 90, false);
    const handleBuyCoinDoubler = () => handleBuyGenericItem('coin_doubler', t('gamification.shop.items.coinDoubler.name'), 300, false);
    const handleBuyRemoveAds = () => handleBuyGenericItem('remove_ads', t('gamification.shop.items.removeAds.name', { defaultValue: 'Quitar Anuncios' }), 1000, false);

    return {
        currencies,
        streak,
        loading: currencyLoading || streakLoading,
        buying,
        purchaseError,
        purchaseModalVisible,
        purchasedItemName,
        loadCurrencies,
        fetchStreak,
        handleBuyStreakProtector,
        handleBuyGenericItem,
        handleBuyXpBoost,
        handleBuyCoinDoubler,
        handleBuyRemoveAds,
        clearError,
        closeModal,
    };
};
