import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../theme/ThemeContext';
import { AppAds } from '../../../components';
import Animated, { FadeIn } from 'react-native-reanimated';

// Hook and modular components
import { useShop } from '../hooks/useShop';
import { BalanceHeader } from '../components/shop/BalanceHeader';
import { ShopItemCard } from '../components/shop/ShopItemCard';
import { PurchaseSuccessModal } from '../components/shop/PurchaseSuccessModal';

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
        clearError,
        closeModal,
    } = useShop();

    useFocusEffect(
        useCallback(() => {
            loadCurrencies();
            fetchStreak();
        }, [loadCurrencies, fetchStreak])
    );

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.text }}>{t('gamification.shop.loading')}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <BalanceHeader xp={currencies.xp} michiCoins={currencies.michi_coins} />

            <ScrollView contentContainerStyle={styles.container}>
                {purchaseError ? (
                    <Animated.Text entering={FadeIn} style={styles.errorText}>
                        {purchaseError}
                    </Animated.Text>
                ) : null}

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

                <Animated.View entering={FadeIn.delay(500)}>
                    <AppAds type="banner" containerStyle={{ marginTop: 20, marginBottom: 20 }} />
                </Animated.View>
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
});
