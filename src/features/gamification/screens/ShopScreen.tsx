import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useCurrencies } from '../hooks/useCurrencies';
import { useStreak } from '../hooks/useStreak';
import { CurrencyService } from '../services/Currency.service';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../theme/ThemeContext';
import { AdView, AdFormat, AdInfo, AdLoadFailedInfo } from 'react-native-applovin-max';

// ⚠️  Reemplaza estos IDs con los de tu cuenta AppLovin MAX Dashboard
const BANNER_AD_UNIT_ID = Platform.select({
    android: 'REEMPLAZA_CON_TU_ANDROID_BANNER_AD_UNIT_ID',
    ios: 'REEMPLAZA_CON_TU_IOS_BANNER_AD_UNIT_ID',
}) as string;

export const ShopScreen = () => {
    const theme = useAppTheme();
    const { currencies, loading: currencyLoading, loadCurrencies } = useCurrencies();
    const { streak, loading: streakLoading, fetchStreak } = useStreak();
    const [buying, setBuying] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadCurrencies();
            fetchStreak();
        }, [loadCurrencies, fetchStreak])
    );

    const handleBuyStreakProtector = async () => {
        if (streak.freezes_available >= 2) {
            Alert.alert("Maximum Reached", "You already have the maximum amount of streak protectors.");
            return;
        }

        if (currencies.michi_coins < 70) {
            Alert.alert("Not enough coins", "You need 70 Michi-Coins to buy a streak protector.");
            return;
        }

        Alert.alert(
            "Buy Protector",
            "Are you sure you want to buy 1 Streak Protector for 70 Michi-Coins?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Buy",
                    onPress: async () => {
                        setBuying(true);
                        const success = await CurrencyService.buyStreakProtector();
                        if (success) {
                            Alert.alert("Success!", "You bought a Streak Protector.");
                            loadCurrencies();
                            fetchStreak();
                        } else {
                            Alert.alert("Error", "Could not complete the purchase.");
                        }
                        setBuying(false);
                    }
                }
            ]
        );
    };

    if (currencyLoading || streakLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.text }}>Loading shop...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
                <View style={styles.balanceContainer}>
                    <FontAwesome5 name="star" size={24} color="#FFD700" solid />
                    <Text style={[styles.balanceText, { color: theme.colors.text }]}>{currencies.xp} XP</Text>
                </View>
                <View style={styles.balanceContainer}>
                    <FontAwesome5 name="coins" size={24} color="#FFBA08" />
                    <Text style={[styles.balanceText, { color: theme.colors.text }]}>{currencies.michi_coins}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Shop</Text>

                <View style={[styles.itemCard, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.itemIconContainer}>
                        <FontAwesome5 name="snowflake" size={32} color="#00BFFF" />
                    </View>
                    <View style={styles.itemDetails}>
                        <Text style={[styles.itemName, { color: theme.colors.text }]}>Streak Protector</Text>
                        <Text style={[styles.itemDescription, { color: theme.colors.textSecondary || '#666' }]}>
                            Protects your streak if you miss a day.
                            (You have {streak.freezes_available} / 2)
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

                {/* Espaciado inferior para que el banner no tape contenido */}
                <View style={styles.bannerSpacer} />
            </ScrollView>

            {/* AppLovin MAX Banner Ad */}
            <AdView
                adUnitId={BANNER_AD_UNIT_ID}
                adFormat={AdFormat.BANNER}
                style={styles.banner}
                onAdLoaded={(adInfo: AdInfo) => {
                    console.log('[AppLovin] Banner loaded from:', adInfo.networkName);
                }}
                onAdLoadFailed={(errorInfo: AdLoadFailedInfo) => {
                    console.warn('[AppLovin] Banner failed to load:', errorInfo.code, errorInfo.message);
                }}
                onAdClicked={(adInfo: AdInfo) => {
                    console.log('[AppLovin] Banner clicked, network:', adInfo.networkName);
                }}
                onAdRevenuePaid={(adInfo: AdInfo) => {
                    console.log('[AppLovin] Banner revenue paid:', adInfo.revenue);
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        borderBottomWidth: 1,
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    balanceText: {
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
    },
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Nunito-Bold',
        marginBottom: 16,
    },
    itemCard: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 12,
    },
    itemIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E6F7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
    },
    itemDescription: {
        fontSize: 14,
        fontFamily: 'Nunito-Regular',
        color: '#666',
        marginTop: 4,
    },
    buyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFBA08',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 4,
    },
    buyButtonDisabled: {
        backgroundColor: '#CCC',
    },
    buyText: {
        color: '#FFF',
        fontFamily: 'Nunito-Bold',
        fontSize: 16,
    },
    // Banner AppLovin MAX - anclado al fondo de la pantalla
    banner: {
        backgroundColor: '#000000', // requerido por AppLovin MAX
        position: 'absolute',
        width: '100%',
        height: 'auto',
        bottom: Platform.select({ ios: 36, android: 0 }),
    },
    // Espacio al final del ScrollView para que el contenido
    // no quede tapado por el banner (50dp es la altura estándar de un banner)
    bannerSpacer: {
        height: 60,
    },
});

