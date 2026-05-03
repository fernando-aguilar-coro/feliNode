import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../theme/ThemeContext';

// Hook and modular components
import { useShop } from '../hooks/useShop';
import { BalanceHeader } from '../components/shop/BalanceHeader';
import { ShopItemCard } from '../components/shop/ShopItemCard';
import { PurchaseSuccessModal } from '../components/shop/PurchaseSuccessModal';
import { IapService, IAP_SKUS } from '../services/Iap.service';
import type { Product } from 'react-native-iap';
import { useAppRewardedAd } from '../../../hooks/useAppRewardedAd';

// Remove MemoizedAppAds
export const ShopScreen = () => {
    const { t } = useTranslation();
    const theme = useAppTheme();
    const {
        currencies,
        streak,
        loading,
        buying,
        purchaseError,
        purchaseModalVisible,
        purchasedItemName,
        loadCurrencies,
        fetchStreak,
        handleBuyStreakProtector,
        handleBuyXpBoost,
        handleBuyCoinDoubler,
        handleGetFreeCoins,
        clearError,
        closeModal,
    } = useShop();

    const [iapProducts, setIapProducts] = useState<Product[]>([]);
    const [iapReady, setIapReady] = useState<boolean | null>(null); // null: loading, true: connected, false: failed
    
    const { isLoaded: isAdLoaded, showAd } = useAppRewardedAd();

    // 1. Persist IAP interaction (Once per component mount)
    useEffect(() => {
        const initIap = async () => {
            const connected = await IapService.init();
            if (connected) {
                const products = await IapService.getProducts();
                setIapProducts(products);
                setIapReady(true);
            } else {
                setIapReady(false);
            }
        };
        initIap();

        return () => {
            IapService.end();
        };
    }, []);

    // 2. Refresh dynamic data on focus (Currencies can change in other screens)
    useFocusEffect(
        useCallback(() => {
            loadCurrencies();
            fetchStreak();
        }, [loadCurrencies, fetchStreak])
    );

    const handleBuyIap = async (sku: string) => {
        await IapService.buyItem(sku);
    };

    const handleRestorePurchases = async () => {
        await IapService.restorePurchases();
        loadCurrencies();
    };

    const getIapPrice = (sku: string) => {
        if (iapReady === false) return t('gamification.shop.errorConnection');
        if (iapReady === null) return '...';
        const product = iapProducts.find((p) => p.id === sku);
        return product ? product.displayPrice : t('gamification.shop.errorConnection');
    };

    const handleWatchAdForCoins = async () => {
        const success = await showAd();
        if (success) {
            handleGetFreeCoins(50);
        }
    };

    // Removed complex loading guards

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <BalanceHeader xp={currencies.xp} michiCoins={currencies.michi_coins} />

            <ScrollView contentContainerStyle={styles.container}>
                {purchaseError ? (
                    <Text style={styles.errorText}>
                        {purchaseError}
                    </Text>
                ) : null}

                {/* 0. Free Coins */}
                {isAdLoaded && (
                    <ShopItemCard
                        name={t('gamification.shop.items.freeCoins.name', { defaultValue: 'Monedas Gratis' })}
                        description={t('gamification.shop.items.freeCoins.description', { defaultValue: 'Mira un anuncio corto para obtener 50 MichiCoins.' })}
                        costText="Gratis 🎥"
                        icon={<FontAwesome5 name="play-circle" size={28} color="#FF4500" />}
                        onPress={handleWatchAdForCoins}
                        michiCoins={currencies.michi_coins}
                        buying={buying}
                        delay={50}
                    />
                )}

                {/* 1. Streak Protector */}
                <ShopItemCard
                    name={t('gamification.shop.items.protector.name')}
                    description={t('gamification.shop.items.protector.description')}
                    cost={60}
                    icon={<FontAwesome5 name="snowflake" size={28} color="#00BFFF" />}
                    onPress={handleBuyStreakProtector}
                    disabled={streak.freezes_available >= 2}
                    statusText={t('gamification.shop.items.protector.equipped', { count: streak.freezes_available })}
                    michiCoins={currencies.michi_coins}
                    buying={buying}
                    delay={100}
                />

                {/* 2. Double XP */}
                <ShopItemCard
                    name={t('gamification.shop.items.doubleXp.name')}
                    description={t('gamification.shop.items.doubleXp.description')}
                    cost={90}
                    icon={<MaterialCommunityIcons name="flash" size={32} color="#FF69B4" />}
                    onPress={handleBuyXpBoost}
                    disabled={currencies.inventory?.xp_boost}
                    statusText={currencies.inventory?.xp_boost ? t('gamification.shop.items.doubleXp.active', { defaultValue: 'Active' }) : undefined}
                    michiCoins={currencies.michi_coins}
                    buying={buying}
                    delay={200}
                />

                {/* 3. Coin Doubler */}
                <ShopItemCard
                    name={t('gamification.shop.items.coinDoubler.name')}
                    description={t('gamification.shop.items.coinDoubler.description')}
                    cost={300}
                    icon={<FontAwesome5 name="coins" size={28} color="#FFD700" />}
                    onPress={handleBuyCoinDoubler}
                    disabled={currencies.inventory?.coin_doubler}
                    statusText={currencies.inventory?.coin_doubler ? t('gamification.shop.items.coinDoubler.equipped', { defaultValue: 'Comprado' }) : undefined}
                    michiCoins={currencies.michi_coins}
                    buying={buying}
                    delay={300}
                />

                {/* 4. Remove Ads (Premium) */}
                <ShopItemCard
                    name={t('gamification.shop.items.removeAds.name')}
                    description={t('gamification.shop.items.removeAds.description')}
                    costText={getIapPrice(IAP_SKUS.REMOVE_ADS)}
                    icon={<MaterialCommunityIcons name="advertisements-off" size={32} color="#FF4500" />}
                    onPress={() => handleBuyIap(IAP_SKUS.REMOVE_ADS)}
                    disabled={currencies.inventory?.remove_ads}
                    statusText={currencies.inventory?.remove_ads ? t('gamification.shop.items.removeAds.purchased') : undefined}
                    michiCoins={currencies.michi_coins}
                    buying={buying}
                    delay={400}
                />

                {/* 5. Sardina para Neko (Consumible) */}
                <ShopItemCard
                    name={t('gamification.shop.items.sardineForNeko.name')}
                    description={t('gamification.shop.items.sardineForNeko.description')}
                    costText={getIapPrice(IAP_SKUS.SARDINE_FOR_NEKO)}
                    icon={<MaterialCommunityIcons name="fish" size={32} color="#4FC3F7" />}
                    onPress={() => handleBuyIap(IAP_SKUS.SARDINE_FOR_NEKO)}
                    michiCoins={currencies.michi_coins}
                    buying={buying}
                    delay={500}
                />

                {/* Botón de Restaurar Compras */}
                <TouchableOpacity style={styles.restoreButton} onPress={handleRestorePurchases}>
                    <Text style={styles.restoreButtonText}>{t('gamification.shop.restorePurchases', 'Restaurar Compras')}</Text>
                </TouchableOpacity>
            </ScrollView>

            <PurchaseSuccessModal
                visible={purchaseModalVisible}
                itemName={purchasedItemName}
                onClose={() => {
                    closeModal();
                    clearError();
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    errorText: {
        color: '#FF6347',
        fontFamily: 'Nunito-Bold',
        marginBottom: 16,
        marginLeft: 4,
        fontSize: 14,
    },
    restoreButton: {
        marginTop: 24,
        padding: 16,
        alignItems: 'center',
    },
    restoreButtonText: {
        color: '#00BFFF',
        fontFamily: 'Nunito-Bold',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
