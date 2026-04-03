import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, Pressable } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrencies } from '../hooks/useCurrencies';
import { useStreak } from '../hooks/useStreak';
import { CurrencyService } from '../services/Currency.service';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../theme/ThemeContext';
import { AppAds } from '../../../components';
import Animated, { FadeIn, SlideInDown, BounceIn } from 'react-native-reanimated';

// ─────────────────────────────────────────────────────────────────────────────
// ShopScreen
// ─────────────────────────────────────────────────────────────────────────────
export const ShopScreen = () => {
    const { t } = useTranslation();
    const theme = useAppTheme();
    const { currencies, loading: currencyLoading, loadCurrencies } = useCurrencies();
    const { streak, loading: streakLoading, fetchStreak } = useStreak();
    const [buying, setBuying] = useState(false);

    // Modal states
    const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
    const [purchasedItemName, setPurchasedItemName] = useState('');
    const [purchaseError, setPurchaseError] = useState('');

    useFocusEffect(
        useCallback(() => {
            loadCurrencies();
            fetchStreak();
        }, [loadCurrencies, fetchStreak])
    );

    const handleBuyStreakProtector = async () => {
        if (streak.freezes_available >= 2) {
            setPurchaseError(t('gamification.shop.maxProtectors'));
            return;
        }

        if (currencies.michi_coins < 70) {
            setPurchaseError(t('gamification.shop.notEnoughCoins', { cost: 70 }));
            return;
        }

        Alert.alert(
            t('gamification.shop.confirmPurchase'),
            t('gamification.shop.buyProtectorConfirm'),
            [
                { text: t('gamification.shop.cancel'), style: "cancel" },
                {
                    text: t('gamification.shop.confirm'),
                    onPress: async () => {
                        setBuying(true);
                        const success = await CurrencyService.buyStreakProtector();
                        if (success) {
                            setPurchasedItemName(t('gamification.shop.items.protector.name'));
                            setPurchaseModalVisible(true);
                            loadCurrencies();
                            fetchStreak();
                        } else {
                            setPurchaseError(t('gamification.shop.purchaseError'));
                        }
                        setBuying(false);
                    }
                }
            ]
        );
    };

    const handleBuyDummyItem = (itemName: string, cost: number) => {
        if (currencies.michi_coins < cost) {
            setPurchaseError(t('gamification.shop.notEnoughCoins', { cost }));
            return;
        }
        Alert.alert(
            t('gamification.shop.confirmPurchase'),
            t('gamification.shop.buyItemConfirm', { name: itemName, cost }),
            [
                { text: t('gamification.shop.cancel'), style: "cancel" },
                {
                    text: t('gamification.shop.confirm'),
                    onPress: () => {
                        setPurchaseError(t('gamification.shop.itemDisabled'));
                    }
                }
            ]
        );
    }

    if (currencyLoading || streakLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.text }}>{t('gamification.shop.loading')}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            {/* Balance Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
                <View style={[styles.balancePill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <FontAwesome5 name="star" size={18} color="#FFD700" solid />
                    <Text style={[styles.balanceText, { color: theme.colors.text }]}>{currencies.xp} XP</Text>
                </View>
                <View style={[styles.balancePill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <FontAwesome5 name="coins" size={18} color="#FFBA08" />
                    <Text style={[styles.balanceText, { color: theme.colors.text }]}>{currencies.michi_coins}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* ── Error Text ──────────────────────────────────────────── */}
                {purchaseError ? (
                    <Animated.Text entering={FadeIn} style={styles.errorText}>
                        {purchaseError}
                    </Animated.Text>
                ) : null}

                {/* ── Items ───────────────────────────────────────────────── */}
                <Animated.View entering={SlideInDown.delay(100).springify()}>
                    <View style={[styles.itemCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <View style={styles.itemIconContainer}>
                            <FontAwesome5 name="snowflake" size={28} color="#00BFFF" />
                        </View>
                        <View style={styles.itemDetails}>
                            <Text style={[styles.itemName, { color: theme.colors.text }]}>{t('gamification.shop.items.protector.name')}</Text>
                            <Text style={[styles.itemDescription, { color: theme.colors.textSecondary || '#888' }]}>
                                {t('gamification.shop.items.protector.description')}
                            </Text>
                            <Text style={[styles.itemLimit, { color: theme.colors.primary }]}>
                                {t('gamification.shop.items.protector.equipped', { count: streak.freezes_available })}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.buyButton, (streak.freezes_available >= 2 || currencies.michi_coins < 70) && styles.buyButtonDisabled]}
                            onPress={handleBuyStreakProtector}
                            disabled={streak.freezes_available >= 2 || buying || currencies.michi_coins < 70}
                        >
                            <FontAwesome5 name="coins" size={12} color="#FFF" />
                            <Text style={styles.buyText}>70</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* ── Nuevo Item: Multiplicador XP ──────────────────────── */}
                <Animated.View entering={SlideInDown.delay(200).springify()}>
                    <View style={[styles.itemCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <View style={[styles.itemIconContainer, { backgroundColor: '#FFF0F5' }]}>
                            <MaterialCommunityIcons name="flash" size={32} color="#FF69B4" />
                        </View>
                        <View style={styles.itemDetails}>
                            <Text style={[styles.itemName, { color: theme.colors.text }]}>{t('gamification.shop.items.doubleXp.name')}</Text>
                            <Text style={[styles.itemDescription, { color: theme.colors.textSecondary || '#888' }]}>
                                {t('gamification.shop.items.doubleXp.description')}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.buyButton, (currencies.michi_coins < 150) && styles.buyButtonDisabled]}
                            onPress={() => handleBuyDummyItem(t('gamification.shop.items.doubleXp.name'), 150)}
                            disabled={buying || currencies.michi_coins < 150}
                        >
                            <FontAwesome5 name="coins" size={12} color="#FFF" />
                            <Text style={styles.buyText}>150</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* ── Nuevo Item: Marco Cosmético ────────────────────────── */}
                <Animated.View entering={SlideInDown.delay(300).springify()}>
                    <View style={[styles.itemCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <View style={[styles.itemIconContainer, { backgroundColor: '#F0FFF0' }]}>
                            <FontAwesome5 name="user-circle" size={28} color="#32CD32" />
                        </View>
                        <View style={styles.itemDetails}>
                            <Text style={[styles.itemName, { color: theme.colors.text }]}>{t('gamification.shop.items.goldAvatar.name')}</Text>
                            <Text style={[styles.itemDescription, { color: theme.colors.textSecondary || '#888' }]}>
                                {t('gamification.shop.items.goldAvatar.description')}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.buyButton, (currencies.michi_coins < 1000) && styles.buyButtonDisabled]}
                            onPress={() => handleBuyDummyItem(t('gamification.shop.items.goldAvatar.name'), 1000)}
                            disabled={buying || currencies.michi_coins < 1000}
                        >
                            <FontAwesome5 name="coins" size={12} color="#FFF" />
                            <Text style={styles.buyText}>1k</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeIn.delay(500)}>
                    <AppAds type="banner" containerStyle={{ marginTop: 20, marginBottom: 20 }} />
                </Animated.View>
            </ScrollView>

            {/* ── Success Modal ────────────────────────────────────────── */}
            <Modal
                visible={purchaseModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setPurchaseModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View entering={BounceIn} style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <FontAwesome5 name="check-circle" size={60} color="#32CD32" style={{ marginBottom: 16 }} />
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t('gamification.shop.successTitle')}</Text>
                        <Text style={[styles.modalDesc, { color: theme.colors.text }]}>{t('gamification.shop.successDesc', { name: purchasedItemName })}</Text>

                        <Pressable
                            style={styles.modalButton}
                            onPress={() => {
                                setPurchaseModalVisible(false);
                                setPurchaseError('');
                            }}
                        >
                            <Text style={styles.modalButtonText}>{t('gamification.shop.great')}</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </Modal>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    balancePill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        gap: 8,
        minWidth: 100,
        justifyContent: 'center',
    },
    balanceText: {
        fontSize: 16,
        fontFamily: 'Nunito-Bold',
    },
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Nunito-ExtraBold',
        marginBottom: 20,
        marginLeft: 4,
    },
    errorText: {
        color: '#FF6347',
        fontFamily: 'Nunito-Bold',
        marginBottom: 16,
        marginLeft: 4,
        fontSize: 14,
    },

    // ── Item Card ────────────────────────────────────────────────────────────
    itemCard: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 16,
        // Sombra suave para darle aspecto premium
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    itemIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E6F7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemDetails: {
        flex: 1,
        marginRight: 8,
    },
    itemName: {
        fontSize: 17,
        fontFamily: 'Nunito-Bold',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 13,
        fontFamily: 'Nunito-Regular',
        lineHeight: 18,
    },
    itemLimit: {
        fontSize: 12,
        fontFamily: 'Nunito-Bold',
        marginTop: 6,
    },
    buyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFBA08',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 6,
        shadowColor: '#FFBA08',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    buyButtonDisabled: {
        backgroundColor: '#CCC',
        shadowOpacity: 0,
        elevation: 0,
    },
    buyText: {
        color: '#FFF',
        fontFamily: 'Nunito-Bold',
        fontSize: 15,
    },

    // ── Modal ────────────────────────────────────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: 'Nunito-Bold',
        marginBottom: 8,
    },
    modalDesc: {
        fontSize: 16,
        fontFamily: 'Nunito-Regular',
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButton: {
        backgroundColor: '#32CD32',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    modalButtonText: {
        color: '#FFF',
        fontFamily: 'Nunito-Bold',
        fontSize: 16,
    }
});
